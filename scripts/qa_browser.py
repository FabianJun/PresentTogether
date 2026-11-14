from browser_support import browser_options
import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'output'/'qa-browser';OUT.mkdir(parents=True,exist_ok=True)
BASE=os.environ.get('QA_BASE','http://127.0.0.1:8787')
DECK=json.loads((ROOT/'deck.json').read_text(encoding='utf-8'))

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(**browser_options())
  host=await browser.new_page(viewport={'width':1600,'height':1000});errors=[];host.on('pageerror',lambda e:errors.append(str(e)))
  await host.goto(BASE);await host.get_by_role('button',name='Start a presentation').click();await host.wait_for_url('**/host?room=*');await host.wait_for_selector('#current-title');await host.locator('#guide-skip').click()
  code=host.url.split('room=')[1];token=await host.evaluate('(c)=>localStorage.getItem("control-host-"+c)',code)
  seats=await host.evaluate('(c)=>JSON.parse(localStorage.getItem("control-team-"+c))',code)
  async def api(path,data=None,key=None):
   r=await host.request.fetch(BASE+path+'?room='+code,method='GET' if data is None else 'POST',data=data,headers={'authorization':'Bearer '+key} if key else {})
   assert r.ok,(r.status,await r.text());return await r.json()
  async def control(**body):return await api('/api/control',body,token)
  try:
   assert (await api('/api/state'))['module'] is None
   projection=await browser.new_page(viewport={'width':1600,'height':900});await projection.goto(BASE+'/present?room='+code);await projection.wait_for_selector('svg')
   assert await projection.locator('.stage-join, image[href^="/qr"]').count()==0
   speakers=[]
   for seat in seats:
    ctx=await browser.new_context(viewport={'width':1440,'height':1000});page=await ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
    await page.goto(BASE+'/speaker?room='+code+'&seat='+str(seat['slot'])+'#speaker='+seat['token']);await page.wait_for_selector('#speaker-title')
    assert '#speaker=' not in page.url
    ids=[i for i,s in enumerate(DECK[:12]) if s['speaker']==seat['slot']]
    assert ids==list(range(ids[0],ids[-1]+1)),('Speaker block is interrupted',seat['slot'],ids)
    if seat['slot']==3:assert ids==[8,9],('Simulation must belong to speaker 3',ids)
    if seat['slot']==4:assert ids==[10,11],('Conclusion must belong to speaker 4',ids)
    actual=await page.locator('[data-own-slide]').evaluate_all('(a)=>a.map(x=>Number(x.dataset.ownSlide))');assert actual==ids
    assert await page.locator('#resolve, #start, #open-reset, #next').count()==0
    for own_id in ids:
     await page.locator('[data-own-slide="'+str(own_id)+'"]').click()
     assert await page.locator('#speaker-say').inner_text()==DECK[own_id]['script'],('Wrong speaking text',seat['slot'],own_id)
     assert await page.locator('#speaker-do').inner_text()==DECK[own_id]['delivery'],('Wrong actions',seat['slot'],own_id)
     assert await page.locator('#speaker-handover').inner_text()==DECK[own_id]['transition'],('Wrong handover',seat['slot'],own_id)
     assert await page.locator('.speaker-round').count()==0
    await page.locator('[data-own-slide="'+str(ids[0])+'"]').click()
    assert await page.locator('#speaker-say').inner_text()==DECK[ids[0]]['script']
    if len(ids)>1:
     await page.locator('#speaker-next').click();assert await page.locator('[data-own-slide].active').get_attribute('data-own-slide')==str(ids[1])
     assert (await api('/api/state'))['slide']==0
    denied=await page.request.post(BASE+'/api/control?room='+code,data={'action':'slide','slide':5},headers={'authorization':'Bearer '+seat['token']});assert denied.status==403
    pdf_link=await page.locator('a[download]').get_attribute('href');assert pdf_link.startswith('/assets/Speaker_'+str(seat['slot'])+'_')
    pdf=await page.request.get(BASE+pdf_link);assert pdf.ok and 'application/pdf' in pdf.headers['content-type']
    await page.screenshot(path=str(OUT/f'speaker_{seat["slot"]}.png'),full_page=True)
    await page.set_viewport_size({'width':390,'height':844});assert await page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    speakers.append(page)
   previous=await speakers[0].locator('#speaker-title').inner_text();await control(action='slide',slide=4);await host.wait_for_selector('[data-slide="4"].active');assert await speakers[0].locator('#speaker-title').inner_text()==previous
   legacy=await browser.new_page();await legacy.goto(BASE+'/host?room='+code+'#host='+seats[2]['token']);await legacy.wait_for_url('**/speaker?**');await legacy.wait_for_selector('#speaker-title')
   await control(action='slide',slide=8);await projection.wait_for_selector('[data-slide="8"]')
   assert await projection.get_by_text('5 / 0',exact=True).count()==1
   assert await host.locator('#verify-matrix').is_hidden()
   await control(action='diagram',verified=True)
   await projection.get_by_text('EVERY ROUND',exact=True).wait_for()
   assert await projection.get_by_text('5 / 0',exact=True).count()==1
   await control(action='diagram',verified=False)
   await host.get_by_role('button',name='Open game lobby',exact=False).click()
   await projection.wait_for_selector('[data-slide="9"] image[href^="/qr"]')
   qr=projection.locator('image[href^="/qr"]');assert (await qr.bounding_box())['width']>=470
   await projection.screenshot(path=str(OUT/'game_lobby_large_qr.png'))
   await speakers[2].locator('#speaker-follow-game').click()
   await speakers[2].wait_for_selector('#speaker-game-status[data-phase="lobby"]')
   assert await host.locator('#notes .script-text').inner_text()==DECK[9]['script']
   phones=[]
   for _ in range(2):
    ctx=await browser.new_context(viewport={'width':390,'height':844});page=await ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)));await page.goto(BASE+'/join?room='+code);await page.wait_for_selector('.wait');assert await page.locator('.role-card, #accept-role, #answerform').count()==0;phones.append(page)
   await host.get_by_role('button',name='Start round 1',exact=False).click()
   await projection.wait_for_selector('.game-trajectory')
   for year in ['2025','2026','2027']:
    assert await projection.locator('.game-trajectory').get_by_text(year,exact=True).count()==1
   assert await projection.locator('.game-trajectory').get_by_text('2028',exact=True).count()==0
   assert await projection.locator('.stage-join, image[href^="/qr"]').count()==0
   assert await projection.locator('[data-control-target="65"][stroke-dasharray]').count()==1
   for page,name in zip(phones,['OpenBrain','DeepCent']):
    assert name in await page.locator('.role-side').inner_text()
    await page.locator('#accept-role').click();await page.wait_for_selector('#answerform')
    assert name in await page.locator('.team').inner_text()
   for i in range(4):
    if i:
     await host.locator('#advance').click()
    await speakers[2].wait_for_selector('#speaker-game-status[data-phase="round-'+str(i)+'"]')
    await host.wait_for_function('(label)=>document.querySelector("#notes-purpose").textContent===label',arg=DECK[9]['facilitation'][i]['round'])
    assert await host.locator('#notes .script-text').inner_text()==DECK[9]['facilitation'][i]['say']
    assert await speakers[2].locator('#speaker-say').inner_text()==DECK[9]['facilitation'][i]['say']
    assert (await api('/api/state'))['slide']==9
    for page in phones:
     year=['2025','2026','2027','Transition'][i]
     await page.wait_for_function('(year)=>document.querySelector(".round-label")?.textContent.endsWith(year)',arg=year)
     await page.locator('input[name="value"][value="C"]').check()
     assert await page.locator('input[name="policy"]').count() == 0
     assert await page.locator('.phase-card,.agreement-vote').count() == 0
     assert 'Keep your side ahead' in await page.locator('.player-goal').inner_text()
     await page.locator('#answerform button').click();await page.wait_for_selector('.saved')
    await host.wait_for_function('()=>!document.querySelector("#resolve").disabled')
    await host.locator('#resolve').click();await host.wait_for_function('()=>document.querySelector("#resolve").disabled')
    state=await api('/api/state');r=state['history'][i];assert len(state['history'])==i+1
    phase='final' if i==3 else 'result-'+str(i)
    await speakers[2].wait_for_selector('#speaker-game-status[data-phase="'+phase+'"]')
    expected=await host.evaluate('''async state=>{const {gameNotes}=await import('/game-notes.js');return gameNotes(await(await fetch('/deck.json')).json(),state);}''',state)
    await host.wait_for_function('(s)=>document.querySelector("#notes .script-text").innerText===s',arg=expected['script'])
    assert await speakers[2].locator('#speaker-say').inner_text()==expected['script']
    assert await speakers[2].locator('#speaker-do').inner_text()==expected['delivery']
    if i==0:
     # Browsing private notes never moves the projection; Follow game returns to the live result.
     await speakers[2].locator('[data-own-slide="8"]').click()
     assert (await api('/api/state'))['slide']==9
     await speakers[2].locator('#speaker-follow-game').click()
     await speakers[2].wait_for_selector('#speaker-game-status[data-phase="result-0"]')
    if i==1:
     # Review a previous result without presenting the wrong round's notes.
     await host.locator('#result-view').select_option('r0')
     await speakers[2].wait_for_selector('#speaker-game-status[data-phase="result-0"]')
     await host.locator('#result-view').select_option('r1')
     await speakers[2].wait_for_selector('#speaker-game-status[data-phase="result-1"]')
    if i==3:
     assert await projection.get_by_text('2028',exact=True).count()==0
     assert await projection.get_by_text('2025',exact=True).count()==2
     assert await speakers[2].locator('#speaker-handover').inner_text()==DECK[9]['debrief']['transition']
     assert 'Speaker 4' in await host.locator('#notes').inner_text()
     await host.screenshot(path=str(OUT/'dynamic_final_notes.png'),full_page=True)
     await speakers[2].screenshot(path=str(OUT/'speaker3_dynamic_final.png'),full_page=True)

    for page in phones:
     await page.wait_for_selector('.control-breakdown')
     assert str(r['state']['control']) in await page.locator('.control-breakdown h2').inner_text()
     for j,side in enumerate(['A','B']):
      await page.locator('.phone-result [data-score-team="'+side+'"] [data-total-points="'+str(r['state']['a' if j==0 else 'b'])+'"]').wait_for()
      if i<3:assert await page.locator('.phone-result [data-score-team="'+side+'"] [data-round-points="3"]').count()==1
    for t in r['teams']:assert t['votes']==1 and t['move']=='C' and 'policy' not in t and t['tieBreak']=={}
    assert not await host.locator('#missing-dialog').evaluate('(x)=>x.open')
   await host.locator('#result-view').select_option('r3');await projection.get_by_text('+15 Both cooperate',exact=True).wait_for();await projection.screenshot(path=str(OUT/'two_players_final_votes_clear.png'))
   assert await projection.get_by_text('+15 Both cooperate',exact=True).count()==1
   await host.locator('#result-view').select_option('summary');await projection.wait_for_function('()=>document.querySelector("svg").textContent.includes("Control reaches the target")')
   assert (await api('/api/state'))['history'][-1]['ending']['kind']=='ordered'
   await host.locator('#advance').click();await host.wait_for_selector('[data-slide="10"].active')
   assert (await api('/api/state'))['module'] is None
   await projection.get_by_text('Make cooperation safer than racing.',exact=True).wait_for()
   for page in phones:assert await page.locator('input[value="1"]').count()==0
   before=(await api('/api/state'))['history'];await host.locator('#open-reset').click();assert await host.locator('#confirm-reset').is_disabled();await host.locator('#reset-code').fill('WRONG');assert await host.locator('#confirm-reset').is_disabled();await host.locator('#cancel-reset').click();assert (await api('/api/state'))['history']==before
   await host.locator('#open-reset').click();await host.locator('#reset-code').fill(code);await host.locator('#confirm-reset').click();await host.wait_for_selector('#reset-dialog',state='hidden');await host.wait_for_selector('[data-slide="0"].active')
   state=await api('/api/state');assert state['history']==[] and state['round']==-1 and state['total']==2 and all(x['n']==0 for x in state['polls'].values())
   await speakers[2].wait_for_function('(s)=>document.querySelector("#speaker-say").innerText===s',arg=DECK[9]['script'])
   for seat in seats:assert (await api('/api/presenters',key=seat['token']))['slot']==seat['slot']
   for i in range(len(DECK)):
    await control(action='slide',slide=i);await projection.wait_for_selector('[data-slide="'+str(i)+'"]')
    if i!=9:assert await projection.locator('.stage-join, image[href^="/qr"]').count()==0
    if i==1:
     assert await projection.get_by_text('Two fictional rivals: OpenBrain and DeepCent',exact=True).count()==1
     assert await projection.get_by_text('AI assists research',exact=True).count()==1
     assert await projection.get_by_text('OpenBrain · US',exact=True).count()==0
     assert await projection.get_by_text('DeepCent · China',exact=True).count()==0
    bounds=await projection.evaluate('''()=>[...document.querySelectorAll('.stage-container svg text')].filter(x=>{const r=x.getBBox();return r.x<0||r.x+r.width>1600||r.y+r.height>900}).map(x=>x.textContent)''');assert not bounds,(i,bounds)
    if i in [0,1,4,5,7]:await projection.screenshot(path=str(OUT/f'content_{i+1:02}.png'))
   await host.screenshot(path=str(OUT/'moderator_console.png'),full_page=True)
   assert not errors,errors
   (OUT/'report.json').write_text(json.dumps(dict(base=BASE,slides=len(DECK),speakers_read_only=4,individual_scripts_actions_handovers_match=True,simulation_speaker=3,conclusion_speaker=4,councils_named=True,matrix_modes_consistent=True,independent_own_navigation=True,legacy_links_redirect=True,large_qr_only_at_game=True,two_players_four_rounds_clear=True,guarded_reset=True,dynamic_notes_all_rounds=True,reviewed_round_notes_match=True,inline_final_debrief=True,speaker_four_handover=True,no_final_poll=True,browser_errors=errors),indent=2)+'\n',encoding='utf-8')
  finally:
   await control(action='delete');await browser.close()
 print('PASS: one moderator, four independent own-slide speaker views and PDFs, legacy links, QR only at game, two players across four rounds, single strategy vote, direct handover without final poll, guarded reset, all slides, no browser errors.')

asyncio.run(main())
