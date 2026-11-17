from browser_support import browser_options
"""Derive four offline speaker parts from the same deck and browser slide captures."""
import asyncio,base64,html,json,os,re,shutil,zipfile
from pathlib import Path
from pdf_support import page_texts
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parents[1]
EDITION=os.environ.get('DECK_EDITION','V9')
OUT=ROOT/'output'/'speakers'
esc=lambda s:html.escape(str(s))
def paragraphs(s):return ''.join('<p>'+esc(x)+'</p>' for x in s.split('\n\n'))
def duration(n):return f'{n//60}:{n%60:02}'
def normal(s):return re.sub(r'\s+',' ',s).strip()

async def main():
    OUT.mkdir(parents=True,exist_ok=True)
    deck=json.loads((ROOT/'deck.json').read_text(encoding='utf-8'))
    refs=json.loads((ROOT/'references.json').read_text(encoding='utf-8'))['entries']
    font=base64.b64encode((ROOT/'web/assets/Inter.ttf').read_bytes()).decode()
    css='''@font-face{font-family:Inter;src:url(data:font/ttf;base64,FONT)}@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;font:11.4pt/1.38 Inter,Arial,sans-serif;color:#111E38}.page{width:210mm;height:297mm;padding:13mm 16mm 14mm;position:relative;break-after:page;overflow:hidden}.page:last-child{break-after:auto}header{display:flex;justify-content:space-between;font-size:9pt;color:#64728B;border-bottom:.3mm solid #D8E0EF;padding-bottom:3mm;margin-bottom:4mm}h1{font-size:18pt;line-height:1.2;letter-spacing:-.4pt;margin:0 0 3mm}h2{font-size:9pt;letter-spacing:1pt;color:#275DFF;margin:4mm 0 2mm}h3{font-size:12pt;margin:5mm 0 2mm}.timing{font-size:9pt;color:#64728B;margin-bottom:4mm}.slide{width:178mm;aspect-ratio:16/9;display:block;border:.2mm solid #D8E0EF;border-radius:1mm}p{margin:0 0 2.5mm}footer{position:absolute;bottom:7mm;left:16mm;right:16mm;font-size:8pt;color:#64728B;display:flex;justify-content:space-between}.reference{padding-left:5mm;text-indent:-5mm;margin-bottom:5mm;font-size:10.2pt;line-height:1.5;overflow-wrap:anywhere}.reference a{color:#275DFF;text-decoration:none}.round{border-bottom:.2mm solid #D8E0EF;padding-bottom:1mm}.small{font-size:9.5pt;color:#64728B}.page-content{max-height:266mm}'''.replace('FONT',font)
    files=[];report=[]
    async with async_playwright() as p:
        browser=await p.chromium.launch(**browser_options())
        page=await browser.new_page(viewport={'width':794,'height':1123})
        for speaker in range(1,5):
            ids=[i for i,s in enumerate(deck[:12]) if s['speaker']==speaker]
            pages=[]
            def section(body,label):return '<section class="page"><div class="page-content"><header><b>SINGULARITY / SPEAKER '+str(speaker)+'</b><span>OFFLINE SPEAKING NOTES</span></header>'+body+'</div><footer><span>'+esc(label)+'</span><span>'+EDITION+' · '+str(speaker)+'/4 speakers</span></footer></section>'
            for i in ids:
                s=deck[i];png=ROOT/'output'/'slides'/f'powerpoint_{i+1:02}.png'
                image='data:image/png;base64,'+base64.b64encode(png.read_bytes()).decode()
                start='<h1>'+esc(s['title'])+'</h1><div class="timing">Slide '+str(i+1)+' · '+('Activity' if i in [8,9] else 'Talk')+' · '+duration(s['seconds'])+'</div><img class="slide" src="'+image+'"><h2>SAY</h2>'
                actions='<h2>DO / ASK THE MODERATOR</h2>'+paragraphs(s['delivery'])+'<h2>NEXT</h2>'+paragraphs(s['transition'])
                body=start+paragraphs(s['script'])+actions
                await page.set_content('<style>'+css+'</style>'+section(body,''));await page.evaluate('document.fonts.ready')
                too_long=await page.locator('.page-content').evaluate('(x)=>x.scrollHeight+x.getBoundingClientRect().top>1083')
                if too_long:
                    spoken=s['script'].split('\n\n');split=max(1,len(spoken)//2)
                    pages.append(section(start+paragraphs('\n\n'.join(spoken[:split])),'Presentation slide '+str(i+1)+' / continued on next page'))
                    pages.append(section('<h1>'+esc(s['title'])+'</h1><div class="timing">Slide '+str(i+1)+' · continued</div><h2>SAY / CONTINUED</h2>'+paragraphs('\n\n'.join(spoken[split:]))+actions,'Presentation slide '+str(i+1)+' / continued'))
                else:pages.append(section(body,'Presentation slide '+str(i+1)))
                if s.get('facilitation'):
                    for start_round in [0,2]:
                        body='<h1>Round introductions and results</h1><p class="small">Read the introduction when voting opens. After each reveal, use the result guide.</p>'
                        for r in s['facilitation'][start_round:start_round+2]:
                            body+='<div class="round"><h3>'+esc(r['round'])+'</h3><p><b>SAY:</b> '+esc(r['say'])+'</p><p><b>DO:</b> '+esc(r['action'])+'</p><p><b>AFTER REVEAL:</b> '+esc(r['result'])+'</p><p><b>DO:</b> '+esc(r['result_action'])+'</p><p><b>NEXT:</b> '+esc(r['next'])+'</p></div>'
                        pages.append(section(body,'Activity / round cues'))
                    body='<h1>What the round result means</h1><p>After each reveal, including round 4: show the actual points and control change, then say ONE matching explanation.</p><p class="small">Choices below: OpenBrain / DeepCent.</p>'
                    for key,meaning in s['result_meanings'].items():
                        label=' / '.join('Cooperate' if move=='C' else 'Race' for move in key)
                        body+='<h3>'+esc(label)+'</h3>'+paragraphs(meaning)
                    pages.append(section(body,'Activity / result guide'))
                    d=s['debrief']
                    body='<h1>Final result and handover</h1><h2>SAY</h2>'+paragraphs(d['script'])+'<h2>DO</h2>'+paragraphs(d['delivery'])+'<h2>NEXT / Speaker 4</h2>'+paragraphs(d['transition'])
                    pages.append(section(body,'Activity / discuss the actual final result'))
                    body='<h1>If the network fails</h1><p>Take only Cooperate or Race votes on paper. Count each side separately. Government breaks a tie; without its deciding vote, use Race. Reveal together. Use the same points every round: CC 3/3, CR 0/5, RC 5/0, RR 1/1. Cooperate means safety checks and human oversight; Race puts faster development first. Control starts at 50: both cooperate +15; each racing side minus 10. Keep control between 0 and 100. Target: 65. Paper votes do not create online responses.</p><p>After round 4, discuss the totals and control. Do not open another poll. Hand over to Speaker 4.</p>'
                    pages.append(section(body,'Activity / offline fallback'))
            relevant={x['reference_id'] for i in ids for x in deck[i]['sources']}
            body='<h1>References</h1>'
            for r in refs:
                if r['id'] in relevant:body+='<p class="reference">'+esc(r['lead'])+('<i>'+esc(r['title'])+'</i>' if r.get('italic',True) else esc(r['title']))+esc(r['tail'])+' <a href="'+esc(r['url'])+'">'+esc(r['url'])+'</a></p>'
            pages.append(section(body,'APA 7 references for this speaker’s part'))
            document='<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Speaker '+str(speaker)+' — Singularity</title><style>'+css+'</style></head><body>'+''.join(pages)+'</body></html>'
            (OUT/f'Speaker_{speaker}_{EDITION}.html').write_text(document,encoding='utf-8')
            await page.set_content(document,wait_until='networkidle');await page.evaluate('document.fonts.ready')
            overflow=await page.locator('.page-content').evaluate_all('(a)=>a.map((x,i)=>({page:i+1,bottom:x.scrollHeight+x.getBoundingClientRect().top-x.parentElement.getBoundingClientRect().top})).filter(x=>x.bottom>1083)')
            assert not overflow,(speaker,overflow)
            file=OUT/f'Speaker_{speaker}_{EDITION}.pdf'
            await page.pdf(path=str(file),print_background=True,prefer_css_page_size=True,display_header_footer=False)
            texts=page_texts(file);assert len(texts)==len(pages)
            text=normal(' '.join(texts))
            for i in ids:
                for paragraph in deck[i]['script'].split('\n\n'):
                    assert normal(paragraph) in text,(speaker,i,'spoken paragraph missing')
                assert normal(deck[i]['delivery']) in text,(speaker,i,'action missing')
                assert normal(deck[i]['transition']) in text,(speaker,i,'handover missing')
            if speaker==3:
                for cue in deck[9]['facilitation']:
                    assert normal(cue['say']) in text
                for meaning in deck[9]['result_meanings'].values():assert normal(meaning) in text
                for key in ['script','delivery','transition']:assert normal(deck[9]['debrief'][key]) in text
            assert 'References' in text
            sections=page.locator('section.page')
            assert await sections.count()==len(texts)
            for n in [0,len(texts)-1]:
                await sections.nth(n).screenshot(path=str(OUT/f'speaker_{speaker}_page_{n+1}.png'))
            report.append(dict(speaker=speaker,slides=[i+1 for i in ids],pages=len(texts),say_and_actions_verified=True))
            shutil.copy2(file,ROOT/'web/assets'/file.name)
            files.append(file)
        await browser.close()
    (OUT/'verification.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
    print('PASS: four separate speaker PDFs; own slides, exact spoken text, actions, handovers and APA sources; no clipping; current PDFs in web/assets.')

asyncio.run(main())
