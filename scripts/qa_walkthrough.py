"""Exercise the guide in a real host page; verify that it never moves the session."""
import asyncio
import os
from playwright.async_api import async_playwright
from browser_support import browser_options

BASE = os.environ.get('QA_BASE', 'http://127.0.0.1:8787')


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(**browser_options())
        page = await browser.new_page(viewport={'width': 1440, 'height': 1000})
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        response = await page.request.post(BASE + '/api/create', data={})
        assert response.ok
        room = await response.json()
        async def state():
            return await (await page.request.get(BASE + '/api/state?room=' + room['code'])).json()
        try:
            await page.goto(BASE + '/host?room=' + room['code'] + '#host=' + room['token'])
            guide = page.locator('#presenter-guide')
            await guide.wait_for(state='visible')
            before = await state()
            await page.keyboard.press('ArrowRight')
            await page.locator('#guide-skip').click()
            assert not await guide.is_visible()
            assert await state() == before
            await page.reload()
            await page.locator('#quick-guide').wait_for()
            assert not await guide.is_visible()
            await page.locator('#quick-guide').click()
            await page.keyboard.press('Escape')
            assert not await guide.is_visible()
            await page.locator('#quick-guide').click()
            await page.locator('#guide-next').click()
            assert await page.locator('#guide-title').inner_text() == 'Show the audience screen'
            await page.locator('#guide-back').click()
            assert await page.locator('#guide-back').is_disabled()
            await page.set_viewport_size({'width': 360, 'height': 800})
            for step in range(6):
                bounds = await guide.bounding_box()
                assert bounds['x'] >= 0 and bounds['x'] + bounds['width'] <= 361
                assert await page.locator('#guide-next').is_visible()
                await page.locator('#guide-next').click()
            assert not await guide.is_visible()
            assert await state() == before
            await page.goto(BASE + '/present?room=' + room['code'])
            await page.locator('svg').wait_for()
            assert await page.locator('#presenter-guide, #quick-guide').count() == 0
            assert not errors, errors
            print('PASS: walkthrough skip, reopen, Escape, back, completion, narrow layout, projection isolation and unchanged game state.')
        finally:
            await page.request.post(BASE + '/api/control?room=' + room['code'], data={'action':'delete'}, headers={'authorization':'Bearer '+room['token']})
            await browser.close()


asyncio.run(main())
