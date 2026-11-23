# 실전 연습장 미션 판정 점검 (로컬 서버 8765번 필요). 직접 조작해야만 판정되는지도 확인한다.
import asyncio
from playwright.async_api import async_playwright
async def setr(page,sc,name,v):
    await page.evaluate("([sc,n,v])=>{const e=document.querySelector('#'+sc+' [name='+n+']');if(e.type==='checkbox'){e.checked=v;}else e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));}",[sc,name,v])
async def done(page,sc): return await page.evaluate("sc=>[...document.querySelectorAll('#'+sc+' .missions li')].map(l=>l.classList.contains('done'))",sc)
async def board(page,sc): return await page.evaluate("sc=>[...document.querySelectorAll('#'+sc+' .board div')].map(d=>d.textContent).join(' | ')",sc)
async def main():
    bad=0
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        page=await b.new_page();await page.route('**/fonts.g*/**',lambda r: r.abort())
        await page.goto("http://localhost:8765/practice/index.html#stage");await page.wait_for_timeout(800)
        r0=await done(page,'stage');print('stage before',r0);bad+=any(r0)
        await setr(page,'stage','sit','blame');await setr(page,'stage','arms','hips');print(await board(page,'stage'))
        await setr(page,'stage','sit','worry');await setr(page,'stage','arms','chest');await setr(page,'stage','pitch',-5);print(await board(page,'stage'))
        await setr(page,'stage','sit','joy');await setr(page,'stage','pitch',4);await setr(page,'stage','sup',7);print(await board(page,'stage'))
        r=await done(page,'stage');print('stage after',r);bad+=not all(r)
        await page.click('.tabs button[data-t=faceshop]')
        r0=await done(page,'faceshop');print('faceshop before',r0);bad+=any(r0)
        for tg,vals in [('joy',dict(brow=1,mouth=9,open=6,eye=9,pupil=10)),('anger',dict(brow=-9,mouth=-6,open=3,eye=10,pupil=7)),('surprise',dict(brow=5,mouth=0,open=9,eye=14,pupil=5))]:
            await setr(page,'faceshop','target',tg)
            for k,v in vals.items(): await setr(page,'faceshop',k,v)
            print(await board(page,'faceshop'))
        r=await done(page,'faceshop');print('faceshop after',r);bad+=not all(r)
        await page.click('.tabs button[data-t=lightroom]')
        r0=await done(page,'lightroom');print('lightroom before',r0);bad+=any(r0)
        await setr(page,'lightroom','scene','mystery');await setr(page,'lightroom','dir','back');await setr(page,'lightroom','rim',6);print(await board(page,'lightroom'))
        await setr(page,'lightroom','scene','horror');await setr(page,'lightroom','dir','bottom');await setr(page,'lightroom','k',8);await setr(page,'lightroom','rim',0);print(await board(page,'lightroom'))
        await setr(page,'lightroom','scene','warm');await setr(page,'lightroom','dir','ul');await setr(page,'lightroom','red',True);print(await board(page,'lightroom'))
        await setr(page,'lightroom','scene','gloom');await setr(page,'lightroom','dir','top');await setr(page,'lightroom','red',False);await setr(page,'lightroom','blue',True);print(await board(page,'lightroom'))
        r=await done(page,'lightroom');print('lightroom after',r);bad+=not all(r)
        await page.click('.tabs button[data-t=desk]')
        SYM=['차렷 자세','완전한 옆','눈썹 안쪽이 올라가','눈동자가 커져','아래로 처져','아래에서 강한 빛','무표정이라고','머리 모양과']
        CA=['몸이 기분과 따로 놂','목 가동 범위 무시','눈썹 방향 반대','눈동자 크기 반대','감은 눈 곡선 반대','빛 방향이 기분과 반대','문장에 표정이 빠짐','가림 영역 과다']
        for _ in range(60):
            sym=await page.text_content('#desk .sym');k=[i for i,s in enumerate(SYM) if s in sym][0]
            await page.click(f"#desk .deskopts button:text-is('{CA[k]}')");await page.wait_for_timeout(560)
        r=await done(page,'desk');print('desk after',r);bad+=not all(r)
        await b.close()
    print("BAD",bad)
asyncio.run(main())
