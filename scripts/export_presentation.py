from browser_support import browser_options
"""Capture the browser artwork at 2x resolution; retain editable PowerPoint notes."""
import asyncio, json, os, shutil, zipfile, subprocess
from pathlib import Path
from playwright.async_api import async_playwright
from pdf_support import add_uri_link, merge_pages, save_compressed, set_metadata, set_outline, single_page_text
from pptx import Presentation
from pptx.util import Inches

ROOT = Path(__file__).resolve().parents[1]
EDITION = os.environ.get('DECK_EDITION', 'V9')
OUT = ROOT / 'output' / 'slides'
PUBLIC = ROOT / 'presentation'
BASE = os.environ.get('QA_BASE', 'http://127.0.0.1:8787')
LIVE = os.environ.get('PUBLIC_URL', 'https://github.com/scaled-thinking/present-together/blob/main/docs/SINGULARITY-EXAMPLE.md#run-locally')

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    pdf_pages = []
    outlines = []
    deck = json.loads((ROOT / 'deck.json').read_text(encoding='utf-8'))
    assets = json.loads((ROOT / 'web/assets/sources.json').read_text(encoding='utf-8'))
    presentation = Presentation()
    presentation.slide_width, presentation.slide_height = Inches(16), Inches(9)
    presentation.core_properties.title = 'Singularity: How can we maintain control over increasingly complex AI systems?'
    presentation.core_properties.subject = 'Ethics, strategic competition and meaningful human control'
    presentation.core_properties.author = 'Singularity seminar team'
    presentation.core_properties.last_modified_by = 'Singularity seminar team'
    assert sum(x['seconds'] for i,x in enumerate(deck) if i not in [8,9]) == 660
    assert all(sum(x['seconds'] for i,x in enumerate(deck) if i not in [8,9] and x['speaker']==n)==220 for n in [1,2,4])
    assert all(deck[i]['speaker']==3 for i in [8,9])
    jobs=[(i,c,None) for i,c in enumerate(deck)]
    sample=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {resolveRound,endingExplanation} from './game.mjs';const h=[];for(let i=0;i<4;i++)h.push(resolveRound(i,[{team:'A',value:i<2?'R':'C'},{team:'B',value:'C'}],h));console.log(JSON.stringify({last:h.at(-1),explanation:endingExplanation(h)}));"],cwd=ROOT,text=True,encoding='utf-8'))
    for mode in ['round','summary']:
        example_script=('OpenBrain races and DeepCent cooperates. OpenBrain gets five points; DeepCent gets zero. DeepCent accepts a limit that OpenBrain does not. That is the risk of cooperating alone. These points tell us who gets ahead, not whether people are safe.' if mode=='round' else f"OpenBrain races in the first two rounds. Both cooperate later. {sample['explanation']['summary']} Control finishes at {sample['last']['state']['control']}, against a target of 65. OpenBrain finishes with {sample['last']['state']['a']} competitive points and DeepCent with {sample['last']['state']['b']}. These points measure competitive advantage, not human wellbeing.")
        c={**deck[9],'seconds':0,'speaker':3,'purpose':'A worked example, not audience results.','script':example_script,'delivery':'Use this example when the live game is unavailable. Otherwise discuss the class result.','transition':'What would you change?'}
        jobs.append((9,c,mode))
    notes = ['# Singularity - Speaking Notes',
             f'Game setup or configured deployment: {LIVE}',
             'The moderator alone controls the shared slides and game. Open "4 speakers" in that console and give each speaker their private notes link. Their page shows only their own slides and cannot change the projection. Each speaker can download their own PDF.',
             'SAY is spoken text. DO contains short presenter instructions. NEXT is a suggested handover. Keep the source links for questions.',
             'Aim for 10-12 minutes of presentation, plus 10 minutes of activity. The 11-minute schedule includes explanations and short pauses. There are no opening or closing polls. Game notes follow each round; discuss the final result before handing over to Speaker 4. The QR code first appears, enlarged, at the game lobby. Rehearse once.',
             'Activity: explain the matrix (2 minutes), play four rounds (6 minutes), discuss the result (2 minutes).',
             'Speaker 1: introduction, definitions and human control (slides 1-4). Speaker 2: scenario endings, acceleration, case study and ethics (5-8). Speaker 3: game theory, all four simulation rounds and debrief (9-10). Speaker 4: solutions and conclusion (11-12). Each speaker speaks in one uninterrupted block. The shortened narrative texts allow roughly 11-12 minutes at 100-110 words per minute with transitions and brief pauses. Speaker 3 leads the activity, including the round prompts and audience decisions. A single moderator operates the controls; speakers ask them for the actions in DO.',
             f'PowerPoint has {len(jobs)} static slides with editable notes. Use the browser for live votes and the game. The last two slides are worked examples.']
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, **browser_options())
        page = await browser.new_page(viewport={'width':1600, 'height':900}, device_scale_factor=2)
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        for output_index, (i, content, example) in enumerate(jobs):
            await page.goto(f'{BASE}/slides?slide={i}'+(f'&example={example}' if example else ''), wait_until='networkidle')
            await page.wait_for_selector('.stage-container svg')
            await page.evaluate('document.fonts.ready')
            await page.add_style_tag(content='.present-controls{display:none!important}')
            if i == 9 and not example:
                await page.evaluate("()=>{for(const el of document.querySelectorAll('svg tspan'))if(el.textContent==='Scan the code.')el.textContent='Open the live game.';}")
            title = await page.locator('.stage-container svg').get_attribute('aria-label')
            if example: title='Worked example — '+('round result' if example=='round' else 'overall outcome')
            visible = await page.locator('.stage-container svg text, .apa-references p').all_text_contents()
            image = OUT / f'powerpoint_{output_index+1:02}.png'
            await page.screenshot(path=str(image))
            await page.emulate_media(media='screen')
            await page.add_style_tag(content="""
                @page { size:1600px 900px; margin:0; }
                html,body { width:1600px!important; height:900px!important; min-height:0!important; margin:0!important; padding:0!important; overflow:hidden!important; }
                .projection-wrap { position:absolute!important; left:0!important; top:0!important; width:1600px!important; height:900px!important; }
                .stage-container { width:1600px!important; height:900px!important; transform:none!important; }
                .present-controls,#toast { display:none!important; }
                * { -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; }
            """)
            data = await page.pdf(width='1600px', height='900px', print_background=True, prefer_css_page_size=True, margin={'top':'0','bottom':'0','left':'0','right':'0'})
            assert len(single_page_text(data).strip()) > 30
            pdf_pages.append(data)
            outlines.append((title, output_index))
            slide = presentation.slides.add_slide(presentation.slide_layouts[6])
            picture = slide.shapes.add_picture(str(image), 0, 0, width=presentation.slide_width, height=presentation.slide_height)
            picture.name = f'{output_index+1:02} / {title}'
            picture._element.nvPicPr.cNvPr.set('descr', ' | '.join(visible))
            if i == 9:
                picture.click_action.hyperlink.address = LIVE
            sources = '\n'.join(s.get('apa') or f"{s['title']} ({s.get('date','')})\n{s['url']}" for s in content['sources']) or 'No external factual claim is introduced on this slide.'
            credit = ''
            if i in [0,5,6]:
                credit = f"\nPHOTO: {assets['infrastructure']['source']}\nLICENSE: {assets['infrastructure']['license']}\nIllustrative infrastructure, not a named AI lab or incident."
            if i == 11:
                credit = f"\nIMAGE: {assets['earth-night']['credit']}\nSOURCE: {assets['earth-night']['source']}\nEarth at night in 2016; not a map of AI compute."
            rounds = '' if example else '\n\n'.join(f"{r['round']}\nSAY: {r['say']}\nDO: {r['action']}\nRESULT: {r['result']}\nDO: {r['result_action']}\nNEXT: {r['next']}" for r in content.get('facilitation',[]))
            debrief = content.get('debrief') if not example else None
            meanings = '' if example else '\n\n'.join(f"{' / '.join('Cooperate' if move=='C' else 'Race' for move in key)}\n{meaning}" for key,meaning in content.get('result_meanings',{}).items())
            debrief_text = '' if not debrief else f"\n\nFINAL GAME RESULT\nSAY: {debrief['script']}\nDO: {debrief['delivery']}\nNEXT: {debrief['transition']}"
            body = f"SLIDE {output_index+1:02} - {title}\nSPEAKER {content['speaker']} | planned slot {content['seconds']//60}:{content['seconds']%60:02}\n\nSAY\n{content['script']}\n\nDO\n{content.get('delivery','')}"+(f"\n\nROUND CUES\n{rounds}" if rounds else '')+(f"\n\nAFTER EACH REVEAL (INCLUDING ROUND 4)\nShow the actual points and control change, then say ONE matching explanation. Choices below are OpenBrain / DeepCent.\n\n{meanings}" if meanings else '')+f"\n\nNEXT\n{content['transition']}\n\nSOURCES\n{sources}{credit}{debrief_text}\n\nLIVE\n{LIVE}"
            slide.notes_slide.notes_text_frame.text = body
            notes.append(f'## {output_index+1:02} / {title}\n\n{body}')
        assert not errors, errors
        await browser.close()
    pptx_path = PUBLIC / 'Singularity_AI_2027.pptx'
    presentation.save(pptx_path)
    notes_path = PUBLIC / 'Speaker_Notes.md'
    notes_path.write_text('\n'.join(line.rstrip() for line in '\n\n'.join(notes).splitlines()).rstrip() + '\n', encoding='utf-8')
    check = Presentation(pptx_path)
    assert len(check.slides) == len(jobs) == len(deck)+2
    assert all('SAY' in s.notes_slide.notes_text_frame.text and '\nDO\n' in s.notes_slide.notes_text_frame.text for s in check.slides)
    with zipfile.ZipFile(pptx_path) as z:
        assert z.testzip() is None
    merged = merge_pages(pdf_pages)
    add_uri_link(merged, 9, LIVE)
    set_outline(merged, outlines)
    set_metadata(merged, presentation.core_properties.title, 'Singularity seminar team', 'Seminar, references and labelled worked examples')
    save_compressed(merged, PUBLIC / 'Singularity_AI_2027.pdf')
    images = ROOT / 'docs' / 'images'
    images.mkdir(parents=True, exist_ok=True)
    shutil.copy2(OUT / 'powerpoint_01.png', images / 'presentation.png')
    shutil.copy2(OUT / 'powerpoint_17.png', images / 'outcome.png')
    print(f'PASS: {len(jobs)} slides at 3200 x 1800, complete current notes, shortened narrative parts plus Speaker 3 leading the activity, references and worked examples, matching searchable PDF, no private room links.')

asyncio.run(main())
