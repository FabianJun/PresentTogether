from browser_support import browser_options
import asyncio, json, os
from pathlib import Path
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('QA_BASE','http://127.0.0.1:8787')

async def main():
    data=json.loads((ROOT/'references.json').read_text(encoding='utf-8'))
    async with async_playwright() as p:
        browser=await p.chromium.launch(**browser_options())
        page=await browser.new_page(viewport={'width':1600,'height':900})
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        for i in range(15):
            await page.goto(BASE+'/slides?slide='+str(i),wait_until='networkidle')
            await page.wait_for_selector('.base-slide')
            await page.evaluate('document.fonts.ready')
            bounds=await page.evaluate('''()=>[...document.querySelectorAll('svg text')].filter(x=>{const r=x.getBBox();return r.x<0||r.x+r.width>1600||r.y+r.height>900}).map(x=>x.textContent)''')
            assert not bounds,(i,bounds)
            if i<12 and data['slides'][i]['ids']:
                c=page.locator('svg > text[x="400"][y="858"]')
                assert await c.count()==1,i
                assert await c.evaluate('(x)=>x.getBBox().x+x.getBBox().width<1420'),(i,await c.text_content())
                if i==11:assert 'p. 22' in await c.text_content()
            if i>=12:
                ids=data['pages'][i-12]
                assert await page.locator('.apa-references p').count()==len(ids)
                assert await page.locator('.apa-references').evaluate('(x)=>x.getBoundingClientRect().height<=560')
                for j,rid in enumerate(ids):
                    r=next(r for r in data['entries'] if r['id']==rid)
                    entry=page.locator('.apa-references p').nth(j)
                    assert await entry.inner_text()==r['lead']+r['title']+r['tail']+' '+r['url']
                    assert await entry.evaluate('(x)=>getComputedStyle(x).textIndent==="-34px"')
                await page.screenshot(path=str(ROOT/'output'/'qa-apa'/f'apa_{i}.png'))
            if i in [0,7,11]:await page.screenshot(path=str(ROOT/'output'/'qa-apa'/f'apa_{i}.png'))
        await page.goto(BASE,wait_until='networkidle')
        body=await page.locator('body').inner_text()
        for removed in ['11-minute seminar','4 presenter seats','QR participation','AI 2027 / AI 2040: Plan A / NIST']:
            assert removed not in body,removed
        await page.screenshot(path=str(ROOT/'output'/'qa-apa'/'home_v5.png'))
        await page.set_viewport_size({'width':390,'height':844})
        assert await page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        await page.screenshot(path=str(ROOT/'output'/'qa-apa'/'home_v5_mobile.png'))
        assert not errors,errors
        await browser.close()
    print('PASS: 15 slides, matched APA citations and references, quote locator, hanging indents, no clipping, clean desktop/mobile home.')

asyncio.run(main())
