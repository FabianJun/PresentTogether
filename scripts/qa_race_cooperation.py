from browser_support import browser_options
"""Check four unchanged strategy choices, mobile roles and actual points/control."""
import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1];BASE=os.environ.get('QA_BASE','http://127.0.0.1:8787')
OUT=ROOT/'output'/'qa-game';OUT.mkdir(parents=True,exist_ok=True)

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(**browser_options())
  api=await p.request.new_context(base_url=BASE);rooms=[];errors=[]
  async def req(path,room=None,data=None,auth=False):
   r=await api.fetch(path+('?room='+room['code'] if room else ''),method='GET' if data is None else 'POST',data=data,headers={'authorization':'Bearer '+room['token']} if auth else {})
   j=await r.json();assert r.ok,(r.status,j);return j
  async def control(room,**data):return await req('/api/control',room,data,True)
  async def create():
   room=await req('/api/create',data={});rooms.append(room);return room
  async def bounds(page):
   bad=await page.evaluate('''()=>[...document.querySelectorAll('.stage-container svg text')].filter(x=>{const b=x.getBBox();return b.x<0||b.y<0||b.x+b.width>1600||b.y+b.height>900}).map(x=>x.textContent)''');assert not bad,bad
  try:
   room=await create();members=[await req('/api/join',room,{}) for _ in range(10)]
   projection=await browser.new_page(viewport={'width':1600,'height':900});projection.on('pageerror',lambda e:errors.append(str(e)));await projection.goto(BASE+'/present?room='+room['code'])
   phones=[]
   for member in members[::2]:
    ctx=await browser.new_context(viewport={'width':360,'height':800});page=await ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
    await page.goto(BASE);await page.evaluate('(x)=>localStorage.setItem("control-member-"+x.code,x.id)',{'code':room['code'],'id':member['member']});await page.goto(BASE+'/join?room='+room['code']);phones.append(page)
   expected=[[3,3],[0,5],[5,0],[1,1]]
   for i,moves in enumerate([['C','C'],['C','R'],['R','C'],['R','R']]):
    await control(room,action='round',round=i)
    for role,page in enumerate(phones):
     if i==0:await page.locator('#accept-role').click()
     await page.wait_for_function("n=>document.querySelector('.round-label')?.textContent.includes('Round '+n+' /')",arg=i+1)
     await page.wait_for_selector('#answerform')
     assert await page.locator('input[name="policy"],textarea,.phase-card,.agreement-vote').count()==0
     assert await page.locator('input[name="value"]').count()==2
     assert 'Keep your side ahead' in await page.locator('.player-goal').inner_text()
     assert 'Keep safety checks and human oversight' in await page.locator('label:has(input[value="C"])').inner_text()
     assert '5 points' in await page.locator('label:has(input[value="R"])').inner_text()
     assert await page.locator('.round-perspective').is_visible()
     assert (await page.locator('.round-perspective').bounding_box())['y']<800
     assert await page.evaluate('document.documentElement.scrollWidth<=innerWidth')
     await page.screenshot(path=str(OUT/f'role_{role}_round_{i+1}.png'),full_page=True)
    for member,move in zip(members[:2],moves):await req('/api/answer',room,{'member':member['member'],'module':'game'+str(i),'value':move})
    await control(room,action='resolve',round=i)
    state=await req('/api/state',room);r=state['history'][i]
    assert r['points']==expected[i] and r['verified']==False and len(r['controlChanges'])==1
    if i<3:
     await projection.get_by_text('Cooperate = safety checks + oversight',exact=True).wait_for();await bounds(projection)
     for j,side in enumerate(['A','B']):
      card=projection.locator('[data-score-team="'+side+'"]')
      await card.locator('[data-round-points="'+str(r['points'][j])+'"]').wait_for()
      assert await card.locator('[data-total-points="'+str(r['state']['a' if j==0 else 'b'])+'"]').count()==1
     await projection.screenshot(path=str(OUT/f'round_{i+1}_result.png'))
   await projection.get_by_text('Oversight can still miss failures',exact=True).wait_for();await bounds(projection)
   assert state['history'][3]['state']=={'capability':100,'control':25,'a':9,'b':9}
   await projection.screenshot(path=str(OUT/'final_actual_choices.png'))
   room2=await create();two=[await req('/api/join',room2,{}) for _ in range(2)]
   for i,moves in enumerate([['C','C'],['C','C'],['R','C'],['C','C']]):
    await control(room2,action='round',round=i)
    for member,move in zip(two,moves):await req('/api/answer',room2,{'member':member['member'],'module':'game'+str(i),'value':move})
    await control(room2,action='resolve',round=i)
   state=await req('/api/state',room2)
   assert state['history'][2]['points']==[5,0] and state['history'][2]['state']['control']==70
   assert state['history'][3]['state']=={'capability':100,'control':85,'a':14,'b':9}
   await projection.goto(BASE+'/present?room='+room2['code']);await projection.get_by_text('Control target met',exact=True).wait_for();await bounds(projection)
   assert await projection.locator('[data-checks-start]').count()==0
   await projection.screenshot(path=str(OUT/'target_met_no_extra_agreement.png'))
   # Revisit an earlier round: show its totals, not the final totals.
   await control(room2,action='outcome',view='round',round=2)
   await projection.locator('[data-score-team="A"] [data-round-points="5"]').wait_for()
   assert await projection.locator('[data-score-team="A"] [data-total-points="11"]').count()==1
   assert await projection.locator('[data-score-team="B"] [data-total-points="6"]').count()==1
   await projection.screenshot(path=str(OUT/'review_round_3_totals.png'))
   room3=await create();two=[await req('/api/join',room3,{}) for _ in range(2)]
   for i,moves in enumerate([['R','R'],['C','C'],['C','C'],['C','C']]):
    await control(room3,action='round',round=i)
    for member,move in zip(two,moves):await req('/api/answer',room3,{'member':member['member'],'module':'game'+str(i),'value':move})
    await control(room3,action='resolve',round=i)
   state=await req('/api/state',room3)
   assert [r['state']['control'] for r in state['history']]==[30,45,60,75]
   assert state['history'][-1]['state']=={'capability':100,'control':75,'a':10,'b':10}
   await projection.goto(BASE+'/present?room='+room3['code']);await projection.get_by_text('Control target met',exact=True).wait_for();await bounds(projection)
   await projection.screenshot(path=str(OUT/'recovered_after_mutual_race.png'))
   assert not errors,errors
   (OUT/'report.json').write_text(json.dumps({'base':BASE,'roles':5,'rounds':4,'mobile':'360x800','only_cooperate_or_race':True,'same_payoffs_every_round':True,'cooperate_always_includes_oversight':True,'no_contract_or_bonus':True,'all_four_matrix_cases':True,'points_and_control_verified':True,'round_and_cumulative_points_visible':True,'start_control':50,'mutual_cooperation':15,'recovery_after_mutual_race':75,'browser_errors':errors},indent=2)+'\n')
   print('PASS: 20 mobile role views, one strategy choice, constant points in all rounds, oversight included from round 1, no contracts or bonuses, accurate outcomes and graphs.')
  finally:
   for room in rooms:await control(room,action='delete')
   await browser.close();await api.dispose()
asyncio.run(main())
