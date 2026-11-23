# -*- coding: utf-8 -*-
"""그리기 연구실 01 · 기분 편 — 페이지 빌드.
python3 build/build.py 로 index.html, 01~06 페이지, practice/index.html 을 다시 만든다.
그림 파일(assets/img/{키}.webp)이 있으면 넣고, 없으면 '그림 준비 중' 자리만 둔다."""
import json, os, html, sys
sys.path.insert(0, os.path.dirname(__file__))
from content_a import P1, P2, P3
from content_b import P4, P5, P6
from content_make import MAKE
from make_requests import PROMPTS, CONV_OF, ATTACH_OF
STYLES = [("pixel", "픽셀"), ("anime", "애니풍"), ("semireal", "반실사"), ("photo", "실사풍")]

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VER = "v1.0"
DATE = "2026-11-23"
SITE = "https://adminmrobo.github.io/drawing_lab_01/"
PREV_SITE = "https://adminmrobo.github.io/adminmrobo-structure_first_drawing_lab/"
CLOSET = "https://adminmrobo.github.io/structure_first_drawing_lab_01/"
REPO = "https://github.com/adminmrobo/drawing_lab_01"
AUTHOR_URL = "https://adminmrobo.github.io/who_am_i/who_am_i.html"
RENDER = "https://adminmrobo.github.io/ai_rendering/"
FISH = "https://adminmrobo.github.io/unsupervised_fish_lab/"
CHARREPO = "https://github.com/adminmrobo/fruitfly-lab-expressions"
SERIES = "그리기 연구실 01 · 기분 편"
E = html.escape
PARTS = [P1, P2, P3, P4, P5, P6]

CH = {
 "doctor": ("박사", "해설 + 손님 모델(2·4부). 분노의 두 단계와 빛 두 개를 보여 준다"),
 "haru": ("조수 하루", "모델(1·4부) + 수식 상자 담당. 어려운 식을 대신 묻는다"),
 "sia": ("시아", "인턴1 · 모델(3부). 표정이 크지 않은 대신 눈이 많은 것을 말한다"),
 "moa": ("모아", "인턴2 · 모델(2부). 여섯 가지 기본 감정을 연기한다"),
 "jupanbot": ("주판봇", "화가 A. 얼굴부터, 결과부터 서두른다 — 흔한 실수 담당"),
 "fruitfly": ("초파리 연구원", "화가 B. 몸과 원리부터 의심한다. \"이걸 눌러 봐\""),
 "x1": ("X1", "평가단. 닮음을 본다"),
 "x2": ("X2", "평가단. 원리를 본다"),
 "x3": ("X3", "평가단. 자연스러움을 본다"),
}
COLOR = {"doctor": "doc", "haru": "asst", "fruitfly": "fly", "jupanbot": "robo", "sia": "sia", "moa": "moa", "x1": "x", "x2": "x", "x3": "x"}

def face(k, e="e13", pre="", cls=""):
    n = CH[k][0]
    return f'<img src="{pre}assets/chars/{k}_{e}.webp" alt="{E(n)}" width="96" height="96" loading="lazy"{(" class=%s" % cls) if cls else ""}>'

def has_img(key):
    return os.path.exists(os.path.join(ROOT, "assets", "img", key + ".webp"))

def art(key, alt, ar="16/9", cap=None, pre="", cls=""):
    cap_html = f"<figcaption>{E(cap)}</figcaption>" if cap else ""
    if has_img(key):
        return f'<figure class="art {cls}" data-img="{key}"><img src="{pre}assets/img/{key}.webp" alt="{E(alt)}" loading="lazy" decoding="async">{cap_html}</figure>'
    return (f'<figure class="art {cls}" data-img="{key}"><div class="ph-art" style="--ar:{ar}" role="img" aria-label="{E(alt)}">'
            f'<b>그림 준비 중 · {key}</b><span>{E(alt)}</span></div>{cap_html}</figure>')

def head(title, desc, og, path, pre=""):
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<meta property="og:type" content="article"><meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(desc)}">
<meta property="og:image" content="{SITE}assets/og/{og}"><meta property="og:url" content="{SITE}{path}"><meta name="twitter:card" content="summary_large_image">
<meta name="author" content="안상선">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{pre}assets/lab.css">
</head>
<body data-root="{pre}">
<div id="prog"></div>
"""

def nav(links, pre=""):
    a = "".join(f'<a href="{h}">{E(t)}</a>' for h, t in links)
    return f'<nav class="top"><div class="row"><a class="logo" href="{pre}index.html">그리기 연구실 01 <i>· 기분 편</i></a><div class="links">{a}</div></div></nav>\n'

def cover(key, cap, cast, pre=""):
    if has_img(key):
        return f'<div class="cover"><div class="frame" data-img="{key}"><img class="art" src="{pre}assets/img/{key}.webp" alt="{E(cap)}" width="1600" height="900" fetchpriority="high" decoding="async"></div></div>\n'
    # 그림이 오기 전 픽셀 대체 표지: 네모 격자 + 상자·원기둥 마네킹(픽셀 블록) + 픽셀 캐릭터
    cells = []
    for x in range(0, 1600, 40):
        for y in range(0, 900, 40):
            if (x // 40 + y // 40) % 2 == 0:
                cells.append(f'<rect x="{x}" y="{y}" width="40" height="40" fill="#f3f6fa"/>')
    blocks = [(1180, 140, 80, 100, "#c9d3e6"), (1200, 240, 40, 30, "#d8dfeb"), (1150, 270, 140, 140, "#b9c6df"), (1160, 410, 120, 90, "#a9b8d6"),
              (1110, 280, 40, 120, "#cdd6e8"), (1290, 280, 40, 120, "#cdd6e8"), (1100, 400, 40, 100, "#dfe5ef"), (1300, 400, 40, 100, "#dfe5ef"),
              (1170, 500, 50, 170, "#b9c6df"), (1230, 500, 50, 170, "#b9c6df"), (1170, 670, 50, 130, "#a9b8d6"), (1230, 670, 50, 130, "#a9b8d6")]
    bl = "".join(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{c}" stroke="#1e2f6e" stroke-width="6"/>' for x, y, w, h, c in blocks)
    easel = '<rect x="240" y="180" width="300" height="380" fill="#ffffff" stroke="#8a5a2b" stroke-width="12"/><rect x="270" y="560" width="20" height="260" fill="#8a5a2b"/><rect x="490" y="560" width="20" height="260" fill="#8a5a2b"/>' + \
            "".join(f'<rect x="{300+i*40}" y="{240+j*40}" width="40" height="40" fill="{c}"/>' for i, j, c in [(1,0,"#e9909a"),(2,0,"#e9909a"),(1,1,"#f6d3b8"),(2,1,"#f6d3b8"),(0,2,"#a99ac8"),(1,2,"#a99ac8"),(2,2,"#a99ac8"),(3,2,"#a99ac8"),(1,3,"#fbfbfd"),(2,3,"#fbfbfd"),(1,4,"#5b7fb8"),(2,4,"#5b7fb8")])
    imgs = "".join(face(k, e, pre) for k, e in cast)
    return f"""<div class="cover"><div class="frame" data-img="{key}"><svg class="grid" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" shape-rendering="crispEdges">{''.join(cells)}{easel}{bl}</svg>
<span class="cap">{E(cap)}</span><span class="badge">표지 그림 준비 중 · {key}</span><div class="cast" style="image-rendering:pixelated">{imgs}</div></div></div>
"""

def three(a, b, c, abbr):
    dl = "".join(f"<dt>{E(x)}</dt><dd>{E(y)}</dd>" for x, y in abbr)
    return f"""<div class="three"><h2>처음 오신 분께 — 세 줄 요약</h2><ul>
<li><b>무엇을</b>: {E(a)}</li><li><b>왜 알아야 하나</b>: {E(b)}</li><li><b>어디에 쓰나</b>: {E(c)}</li></ul>
<p>그림 실력·코드·수식을 몰라도 됩니다. 실험을 눌러 보며 따라오세요.</p>
<details class="abbr"><summary>낱말·약어 풀이 (펼치기)</summary><dl>{dl}</dl></details></div>\n"""

ABBR = [("喜怒哀楽", "기쁨·분노·슬픔·즐거움. 여기에 놀람(驚)과 멍함(虚)을 더해 여섯 가지 기본 감정으로 다룬다"), ("실루엣", "인물을 한 가지 색으로 칠한 윤곽. 자세만으로 기분이 읽히는지 확인할 때 쓴다"),
        ("정중선", "얼굴(몸)의 가운데를 세로로 지나는 선. 기울기를 잡는 기준"), ("가동 범위", "관절이 움직일 수 있는 범위. 이 페이지에서 목은 ±70°(예시값)"),
        ("눈 상자", "눈을 감싸는 네모(위 a·오른쪽 b·아래 c·왼쪽 d). 각도에 따라 폭을 줄인다"), ("반눈", "윗눈꺼풀이 내려오고 아랫눈꺼풀도 조금 올라와 눈동자를 반쯤 가린 눈"),
        ("앙각·부감", "올려다보는 각도(앙각)와 내려다보는 각도(부감)"), ("역광", "인물 뒤에서 오는 빛. 얼굴은 어둡고 윤곽이 밝아진다"),
        ("반사판(레프판)", "빛을 되돌려 원하는 곳만 밝히는 흰 판"), ("기분 터치", "빛 계산과 상관없이 기분을 그리는 약속(붉은 빗금·세로선·얼굴 그늘)"),
        ("가림 영역(마스크)", "AI가 다시 그릴 부분을 표시한 영역"), ("블렌드셰이프", "3D 얼굴의 부위별 표정 모양. 0~1 값으로 섞는다"), ("VFX", "영화·영상의 시각 효과(Visual Effects)")]

def talk(lines, pre=""):
    out = []
    for k, e, t in lines:
        side = " r" if k in ("moa", "sia") else ""
        out.append(f'<div class="line{side}">{face(k, e, pre)}<div class="bub"><b style="color:var(--c-{COLOR[k]})">{E(CH[k][0])}</b>{E(t)}</div></div>')
    return '<div class="talk">' + "".join(out) + "</div>"

def quiz(q, opts, ans, ok, no):
    b = "".join(f'<button type="button">{E(o)}</button>' for o in opts)
    return f'<div class="quiz" data-ans="{ans}"><div class="qq">확인 퀴즈 — {E(q)}</div><div class="opts">{b}</div><div class="fb" aria-live="polite"></div><span class="qok" hidden>{E(ok)}</span><span class="qno" hidden>{E(no)}</span></div>'

def panel(no, i, p):
    return (f'<div class="panel"><div class="ph"><b>실험 {no}-{i}</b><small>{E(p["note"])}</small></div>'
            f'<div id="pp-{p["key"]}" data-panel="{p["key"]}"></div><div class="ctrl">{p["ctrl"]}</div><div class="readout" aria-live="polite"></div></div>')

def mathbox(m):
    tries = "".join(f"<div>{E(t)}</div>" for t in m["tries"])
    pcs = "".join(f"<tr><td class='m'>{E(a)}</td><td>{E(b)}</td></tr>" for a, b in m["pieces"])
    return f"""<div class="box mathbox"><h4>수식이 어려운 조수가 대신 묻습니다</h4>
<div class="q">{face('haru','e04')}<div><b>조수</b> {E(m['ask'])}</div></div>
<div class="easy"><b>말로 하면</b> — {E(m['words'])}</div>
<p><b>학교 수학으로 보면</b> — {E(m['school'])}</p>
<div class="fx">{E(m['formula'])}</div>
<table><thead><tr><th>식 조각</th><th>뜻</th></tr></thead><tbody>{pcs}</tbody></table>
<div class="try"><b>숫자로 한 번 해 보기</b>{tries}</div>
<div class="q">{face('haru','e16')}<div><b>조수</b> {E(m['comment'])}</div></div></div>"""

def gallery():
    rows = []
    for who, nm in [("haru", "하루"), ("sia", "시아"), ("moa", "모아")]:
        cells = "".join(art(f"p5_{who}_{st}", f"{nm}의 {sn} 전신 — 같은 자세, 왼쪽 위 빛", "2/3", sn) for st, sn in STYLES)
        rows.append(f'<h4 style="margin:14px 0 6px">{nm}</h4><div class="artrow">{cells}</div>')
    return '<div class="box" style="background:#fff">' + "".join(rows) + '<p class="hint" style="margin-top:8px">실사풍은 이 캐릭터를 코스프레한 가상의 성인 모델 사진으로 만든 것입니다. 실존 인물이 아닙니다.</p></div>'

EXAMPLE_PROMPT = """Full body character illustration, vertical 2:3.
High-quality anime illustration, clean confident lineart, two-tone cel shading with soft highlights, natural proportions of a young adult woman in her early twenties.
Character (match the attached reference sheet exactly): Haru, a cheerful lab assistant, long straight pink hair reaching the waist with navy blue streaks, including a thick navy streak down the center of the bangs, two round slightly messy hair buns on top of the head, a small ahoge, big bright blue eyes, lavender hoodie with white drawstrings over a white t-shirt, open white knee-length lab coat, rolled-up blue jeans, lavender sneakers. Modest outfit exactly as described.
Pose: standing upright in a three-quarter view turned slightly to the right, left arm relaxed at her side, right hand resting on her hip.
Lighting: soft daylight from the upper left, form shadows on the right side of the body, a soft cast shadow on the floor toward the lower right.
Background: plain off-white studio background.
No text, no letters, no logos, no watermark, no revealing clothing, not resembling any famous anime character, no pixel art."""

def step(P, i, s):
    no = P["no"]
    labels = ["무엇이 문제인가", "그냥 하면 막히는 곳", "이렇게 푼다"]
    why = "".join(f"<li><b>{labels[k]}</b> — {E(x)}</li>" for k, x in enumerate(s["why"]))
    whybox = f'<div class="box why"><h4>왜 이렇게 하나</h4><ol>{why}</ol><div class="easy"><b>쉽게 말하면</b> — {E(s["easy"])}</div></div>'
    calm = talk([("doctor", "e08", "여기서 한 번 멈춰도 괜찮아요. 식이 낯설면 건너뛰고 아래 실험부터 눌러 보세요. 숫자는 실험이 대신 계산해 줍니다.")])
    duo = f'<div class="duo">{whybox}{mathbox(s["math"])}</div>{calm}' if s.get("math") else f'<div style="margin:16px 0">{whybox}</div>'
    solve = "".join(f"<p>{E(x)}</p>" for x in s["solve"])
    extra = ""
    if s.get("gallery"):
        extra += gallery()
    if s.get("imgs"):
        extra += '<div class="box" style="background:#fff"><div class="artrow">' + "".join(art(k, al, "2/3", cp) for k, al, cp in s["imgs"]) + '</div><p class="hint" style="margin-top:8px">실사풍은 캐릭터를 코스프레한 가상의 성인 모델 사진으로 만든 것입니다. 실존 인물이 아닙니다.</p></div>'
    if s.get("prompts"):
        extra += f'<div class="promptbox"><b>예시 — 이 시리즈의 그림 요청문(하루, 애니풍 기준 전신)</b><p class="hint">고정값 → 자세 → 빛(그림자 방향까지) → 화풍 → 금지 순서입니다.</p><pre>{E(EXAMPLE_PROMPT)}</pre></div>'
    img = art(s["img"][0], s["img"][1], s["img"][2], s["img"][1], cls="tall" if s["img"][2] == "2/3" else "") if s.get("img") else ""
    q = s["quiz"]
    return f"""<section class="room" id="{s['id']}"><div class="wrap">
<div class="roomno">{no}부 · {i}단계</div>
<h2>{E(s['title'])}</h2><p class="muted">{E(s['sub'])}</p>
<div class="tags"><span class="tag how">{E(s['how'])}</span><span class="tag day">{E(s['day'])}</span></div>
{duo}
<div class="pair"><div class="box"><h4>일상으로 치면</h4><p>{E(s['daily'])}</p></div><div class="box ml"><h4>그림·VFX 현장에서는</h4><p>{E(s['field'])}</p></div></div>
{talk(s['talk'])}
{panel(no, i, s['panel'])}
<div class="solve"><h4>풀이</h4>{solve}</div>
{extra}{img}
<div class="solve"><h4>AI 결과, 그대로 써도 될까?</h4><p>{E(s['ai'][0])}</p><details class="code"><summary>답 보기</summary><p>{E(s['ai'][1])}</p></details></div>
<div class="limit"><b>주의할 점</b> — {E(s['limit'])}</div>
{quiz(q[0], q[1], q[2], q[3], q[4])}
</div></section>
"""

def judge(J):
    rows = ""
    for idx, item in enumerate(J["items"]):
        a, b = J["a"][1][idx], J["b"][1][idx]
        mx = 8 if "8개" in item else 10
        rows += f'<span>{E(item)}</span><span class="bar" title="{J["a"][0]} {a}"><i style="width:{a/mx*100:.0f}%"></i></span><span class="bar" title="{J["b"][0]} {b}"><i style="width:{b/mx*100:.0f}%;background:var(--teal)"></i></span>'
    sa, sb = sum(J["a"][1]), sum(J["b"][1])
    tbl = "".join(f"<tr><td>{E(it)}</td><td>{J['a'][1][k]}</td><td>{J['b'][1][k]}</td></tr>" for k, it in enumerate(J["items"]))
    return f"""<section class="room" id="judge"><div class="wrap"><div class="roomno">평가단 채점</div><h2>{E(J['title'])}</h2>
{talk(J['setup'])}
<div class="judge"><h4>평가단 X1·X2·X3 채점</h4>
<div class="score"><span></span><b>{E(J['a'][0])}</b><b>{E(J['b'][0])}</b>{rows}</div>
<div class="tbl" style="margin-top:10px"><table><thead><tr><th>항목</th><th>{E(J['a'][0])}</th><th>{E(J['b'][0])}</th></tr></thead><tbody>{tbl}<tr><th>합계</th><th>{sa}</th><th>{sb}</th></tr></tbody></table></div>
{talk(J['comments'])}</div>
{talk(J['result'])}
<p class="hint">점수는 이야기 속 예시입니다. 실제 그림을 평가한 값이 아닙니다.</p>
</div></section>
"""

def summary(P):
    rows = "".join(f"<tr><td>{E(a)}</td><td>{E(b)}</td><td>{E(c)}</td></tr>" for a, b, c in P["summary"])
    return f"""<section id="sum"><div class="wrap"><h2>{P['no']}부 정리</h2>
<div class="tbl"><table><thead><tr><th>주제</th><th>한 줄</th><th>작업에서는</th></tr></thead><tbody>{rows}</tbody></table></div></div></section>
"""

def outro(P):
    return f"""<section id="outro"><div class="wrap"><h2>다음으로</h2>{talk(P['outro'])}
<div class="next"><a href="{P['prev'][0]}">{E(P['prev'][1])}</a><a href="{P['next'][0]}">{E(P['next'][1])}</a></div></div></section>
"""

def failcard(f):
    note = f'<p class="hint">{E(f["note"])}</p>' if f.get("note") else ""
    return f"""<div class="failcard" id="{f['key'][:7]}"><h3>{E(f['title'])}</h3><div class="failgrid">
{art(f['key'], f['alt'], f['ar'])}
<div><p><span class="chip">증상</span>{E(f['symptom'])}</p>
{quiz(f['q'], f['opts'], f['ans'], f['ok'], f['no'])}
<p><span class="chip">연결된 원리</span><a href="{f['link'][0]}">{E(f['link'][1])}</a></p>
<div class="promptbox"><b>고치는 프롬프트 조각</b><pre>{E(f['fix'])}</pre></div>{note}</div></div></div>"""

# ---------------- 지식 색인
KG = [
 ("concept/silhouette-mood", "Concept", "실루엣으로 읽히는 기분", "Mood readable from silhouette", "01_body_mood.html", "#s1", "팔 모양과 몸의 기울기만으로 기분의 큰 방향이 갈린다"),
 ("method/head-neck-shoulder", "Method", "머리·목·어깨 세 선", "Head, neck and shoulder lines", "01_body_mood.html", "#s2", "얼굴 정중선과 어깨선의 방향·엇갈림이 밝기와 움직임을 정한다"),
 ("concept/neck-range", "Concept", "목의 가동 범위", "Neck range of motion", "01_body_mood.html", "#s3", "얼굴 방향 = 몸 돌린 각 + 목 돌린 각, 목은 한계가 있다"),
 ("concept/gait-mood", "Concept", "기분과 걸음", "Gait and mood", "01_body_mood.html", "#s4", "보폭 = 키 × (0.35 + 0.15 × 기분)"),
 ("method/brow-mouth-axes", "Method", "눈썹·입 두 축", "Brow and mouth axes", "02_six_emotions.html", "#s1", "눈썹 안쪽과 입꼬리 조합으로 감정이 갈리고, 어긋나면 섞인 감정"),
 ("concept/anger-stages", "Concept", "분노의 두 단계", "Two stages of anger", "02_six_emotions.html", "#s2", "참는 단계(입을 다묾) → 터지는 단계(입을 열고 주름을 늘림)"),
 ("concept/surprise-white", "Concept", "놀람의 흰자 비율", "Eye white ratio in surprise", "02_six_emotions.html", "#s3", "흰자 = 1 − r², 눈은 크게 눈동자는 작게"),
 ("concept/blank-states", "Concept", "밝은 멍함과 어두운 멍함", "Bright and dark blankness", "02_six_emotions.html", "#s4", "楽의 끝은 초점 어긋남, 哀의 끝은 흰 눈과 처진 어깨"),
 ("concept/eye-foreshortening", "Concept", "각도에 따른 눈 폭", "Eye width by head angle", "03_eyes.html", "#s1", "보이는 눈 폭 = 실제 폭 × cos(사이각)"),
 ("concept/iris-on-sphere", "Concept", "공 위의 눈동자", "Iris on an eyeball sphere", "03_eyes.html", "#s2", "시선을 돌린 만큼 눈동자가 납작한 타원이 된다"),
 ("concept/eyelid-steps", "Concept", "눈꺼풀 단계와 감은 눈 곡선", "Eyelid steps and closed-eye curves", "03_eyes.html", "#s3", "위아래 눈꺼풀이 함께 움직이고, 조용히 ‿ 웃으면 ⌒"),
 ("method/eyes-by-mood", "Method", "기분별 눈 모양", "Eye shapes by emotion", "03_eyes.html", "#s4", "눈꺼풀 곡선·눈동자 크기·반짝임으로 여섯 감정을 나눈다"),
 ("concept/light-direction", "Concept", "빛의 방향과 분위기", "Light direction and mood", "04_light_mood.html", "#s1", "밝기 = 세기 × cos(사이각), 방향마다 분위기가 다르다"),
 ("concept/two-lights", "Concept", "빛 둘의 명·중·암", "Light, mid and dark tones with two lights", "04_light_mood.html", "#s2", "보조 빛이 그림자 일부를 밝혀 중간 톤이 생긴다"),
 ("method/rim-reflector", "Method", "역광·테두리 빛·반사판", "Backlight, rim light and reflector", "04_light_mood.html", "#s3", "얼굴은 어둡게, 윤곽은 희게, 반사광으로 표정"),
 ("method/mood-touches", "Method", "기분 터치", "Emotional manga touches", "04_light_mood.html", "#s4", "喜 붉은 빗금, 哀 세로선, 怒 얼굴 그늘"),
 ("method/expression-prompt", "Method", "표정 문장 여섯 조각", "Six-part expression prompt", "05_ai_vfx.html", "#s1", "감정·얼굴·눈·몸·빛·고정"),
 ("method/face-inpaint", "Method", "얼굴만 다시 그리기", "Inpainting only the face", "05_ai_vfx.html", "#s2", "바뀌는 비율 = 가린 넓이 ÷ 전체 넓이"),
 ("method/blendshapes", "Method", "표정 값 섞기", "Blending facial blendshapes", "05_ai_vfx.html", "#s3", "섞인 위치 = 기본 + Σ(값 × 움직이는 양)"),
 ("method/style-exaggeration", "Method", "화풍별 과장 배수", "Exaggeration factor per art style", "05_ai_vfx.html", "#s4", "실제 표정 값 = 세기 × 과장 배수"),
 ("method/expression-diagnosis", "Method", "표정 그림 진단 순서", "Expression drawing diagnosis checklist", "06_failure_lab.html", "#s1", "몸 → 눈썹·입 → 눈 → 빛·터치 → 문장·가림 영역"),
 ("application/expression-failures", "Application", "표정 그림 실패 8종", "Eight expression drawing failures", "06_failure_lab.html", "#fails", "차렷 몸·꺾인 목·반대 눈썹·큰 눈동자·처진 웃는 눈·아래 빛·미소 끼어듦·가림 과다"),
 ("open/expression-age-drift", "OpenQuestion", "표정 낱말이 나이를 바꾸는 현상", "Expression words shifting apparent age", "06_failure_lab.html", "#drift", "귀여운 표정 낱말 대신 근육·자세를 적고 성인 나이를 고정한다"),
 ("application/practice", "Application", "실전 연습장", "Practice simulator", "practice/index.html", "#stage", "무대·표정 공방·조명실·진단 데스크"),
 ("analogy/friend-afar", "Analogy", "멀리서 알아보는 친구", "Recognizing a friend from afar", "01_body_mood.html", "#s1", "얼굴이 안 보여도 팔과 어깨로 기분을 안다"),
 ("analogy/globe", "Analogy", "지구본", "Turning a globe", "03_eyes.html", "#s1", "가장자리로 간 나라는 좁게 보인다"),
 ("analogy/flashlight", "Analogy", "손전등 괴담", "Flashlight under the chin", "04_light_mood.html", "#s1", "평소에 없는 방향의 빛은 섬뜩하다"),
 ("analogy/mixer", "Analogy", "음악 믹서", "Audio mixer", "05_ai_vfx.html", "#s3", "부위마다 크기를 섞어 하나의 표정을 만든다"),
]
KG_EDGES = [("concept/silhouette-mood","motivates","method/head-neck-shoulder"),("method/head-neck-shoulder","motivates","concept/neck-range"),("concept/neck-range","motivates","concept/gait-mood"),
 ("concept/gait-mood","motivates","method/brow-mouth-axes"),("method/brow-mouth-axes","motivates","concept/anger-stages"),("concept/anger-stages","motivates","concept/surprise-white"),("concept/surprise-white","motivates","concept/blank-states"),
 ("concept/blank-states","motivates","concept/eye-foreshortening"),("concept/eye-foreshortening","motivates","concept/iris-on-sphere"),("concept/iris-on-sphere","motivates","concept/eyelid-steps"),("concept/eyelid-steps","motivates","method/eyes-by-mood"),
 ("method/eyes-by-mood","motivates","concept/light-direction"),("concept/light-direction","motivates","concept/two-lights"),("concept/two-lights","motivates","method/rim-reflector"),("method/rim-reflector","motivates","method/mood-touches"),
 ("method/mood-touches","motivates","method/expression-prompt"),("method/expression-prompt","motivates","method/face-inpaint"),("method/face-inpaint","motivates","method/blendshapes"),("method/blendshapes","motivates","method/style-exaggeration"),
 ("method/style-exaggeration","motivates","method/expression-diagnosis"),("method/expression-diagnosis","usedIn","application/expression-failures"),("method/expression-prompt","explains","open/expression-age-drift"),
 ("concept/eye-foreshortening","explains","concept/light-direction"),("method/brow-mouth-axes","explains","method/blendshapes"),("concept/surprise-white","explains","method/eyes-by-mood"),
 ("analogy/friend-afar","explains","concept/silhouette-mood"),("analogy/globe","explains","concept/eye-foreshortening"),("analogy/flashlight","explains","concept/light-direction"),("analogy/mixer","explains","method/blendshapes"),
 ("method/expression-prompt","usedIn","application/practice"),("method/brow-mouth-axes","usedIn","application/practice")]
REFS = [
 dict(id="hayashi_kubun_feelings", title="キャラの気持ちの描き方 — 表情・感情の表と裏を描き分けよう", author="林晃(Go office)・九分くりん", year=2017, note="2장까지의 원리(기분을 몸·머리·목·어깨로 그리기, 喜怒哀楽+驚虚, 기분의 밝음·어두움과 움직임·고요함, 눈의 각도·눈동자·눈꺼풀, 기분을 연출하는 빛과 그림자, p.11~70)를 참고. 책의 그림·문장·도식·구성 순서는 옮기지 않고 연구실 캐릭터와 실험으로 새로 구성"),
 dict(id="lambert_1760", title="Photometria (Lambert's cosine law)", author="Johann Heinrich Lambert", year=1760, note="면의 밝기 = cos θ, 보이는 폭 = cos θ. https://en.wikipedia.org/wiki/Lambert%27s_cosine_law"),
 dict(id="lewis_2014_blendshape", title="Practice and Theory of Blendshape Facial Models", author="J. P. Lewis, Ken Anjyo, Taehyun Rhee, Mengjie Zhang, Fred Pighin, Zhigang Deng", year=2014, note="Eurographics 2014 State of the Art Report — 표정 값(블렌드셰이프)을 가중합으로 섞는 방식"),
 dict(id="ekman_1978_facs", title="Facial Action Coding System", author="Paul Ekman, Wallace V. Friesen", year=1978, note="얼굴 근육 움직임을 부위별 단위로 나눈 체계. 이 페이지는 학술적 분류가 아니라 눈썹·입 두 축으로 단순화해 씀"),
 dict(id="lugmayr_2022_repaint", title="RePaint: Inpainting using Denoising Diffusion Probabilistic Models", author="Andreas Lugmayr et al.", year=2022, note="CVPR 2022. arXiv:2201.09865 — 가림 영역만 다시 그리는 방식"),
 dict(id="rombach_2022_ldm", title="High-Resolution Image Synthesis with Latent Diffusion Models", author="Robin Rombach et al.", year=2022, note="CVPR 2022. arXiv:2112.10752 — 글 지시로 그림을 만드는 확산 모델(인페인팅 포함)"),
 dict(id="prev_series", title="구조 먼저 보는 캐릭터 그리기 연구실 / 구조 먼저 그리기 연구실 01 · 옷장 편", author="안상선", year=2026, note="앞 시리즈. 구조·빛·주름 기초와 옷 주름. https://adminmrobo.github.io/adminmrobo-structure_first_drawing_lab/ · https://adminmrobo.github.io/structure_first_drawing_lab_01/"),
]

def kg_block(page, pages):
    nodes = [dict(id="lab:" + i, type=t, label=dict(ko=ko, en=en), page=p, anchor=a, definition=dict(ko=d), source="lab:work/drawing_lab_01")
             for i, t, ko, en, p, a, d in KG if p in pages]
    ids = {n["id"] for n in nodes}
    edges = [dict(s="lab:" + s, p=p, o="lab:" + o) for s, p, o in KG_EDGES if "lab:" + s in ids and "lab:" + o in ids]
    raw = dict(version="1.3", page=page, series=SERIES, nodes=nodes, edges=edges)
    ld = {"@context": {"@vocab": "urn:lab:", "skos": "http://www.w3.org/2004/02/skos/core#", "schema": "https://schema.org/"},
          "@graph": [{"@id": "urn:" + n["id"], "@type": n["type"], "skos:prefLabel": [{"@value": n["label"]["ko"], "@language": "ko"}, {"@value": n["label"]["en"], "@language": "en"}],
                      "skos:definition": n["definition"]["ko"], "schema:url": SITE + n["page"] + n["anchor"]} for n in nodes]}
    meta = dict(title=page, series=SERIES, creator=[dict(name="안상선", role="author", affiliation="(주)M-Robo")], date=DATE, version=VER, license="캐릭터·그림 무단 사용 금지")
    J = lambda o: json.dumps(o, ensure_ascii=False).replace("</", "<\\/")
    return f"""<section id="kg"><div class="wrap"><h2>지식 색인 — 이 페이지의 낱말 찾기</h2>
<p class="muted">이 페이지에 나온 개념·방법·비유·쓰임을 모았습니다. 검색하고, "설명 보러 가기"로 본문에 돌아갑니다.</p><div id="kg-mount"></div></div></section>
<section id="export"><div class="wrap"><h2>온톨로지·서지 꾸러미 내려받기</h2>
<p class="muted">지식 색인을 출처와 함께 파일로 내려받습니다. 서지 관리는 BibTeX·RIS, 온톨로지 편집은 Turtle, 그래프 도구는 CSV, 여러 페이지 합치기는 kg.json입니다.</p><div id="export-mount"></div></div></section>
<script type="application/json" id="kg-raw">{J(raw)}</script>
<script type="application/ld+json" id="kg-ld">{J(ld)}</script>
<script type="application/json" id="refs-csl">{J(REFS)}</script>
<script type="application/json" id="page-meta">{J(meta)}</script>
"""

FOOT_LINKS = [("index.html", "목차")] + [(P["file"], f"{P['no']}부") for P in PARTS] + [("practice/index.html", "7부 실전 연습장")]

def footer(pre=""):
    links = " · ".join(f'<a href="{pre}{h}">{E(t)}</a>' for h, t in FOOT_LINKS) + f' · <a href="{REPO}">저장소</a>'
    refs = "".join(f"<tr><td>[{i+1}]</td><td>{E(r['author'])} ({r['year']}). {E(r['title'])}</td><td>{E(r['note'])}</td></tr>" for i, r in enumerate(REFS))
    return f"""<footer><div class="wrap">
<h3>출처·참고</h3>
<div class="tbl"><table><thead><tr><th>#</th><th>자료</th><th>어디에 썼나</th></tr></thead><tbody>{refs}</tbody></table></div>
<h3>예시값·설명용 숫자</h3>
<p>목의 한계 70°, 보폭 비율(0.35·0.15), 눈의 벌어진 각 30°, 감정 기준값, 아랫눈꺼풀 15%, 빛 세기, 가림 영역 크기, 표정 값의 움직이는 양(10px·8px), 화풍별 과장 배수, 평가단 점수는 모두 원리를 보이기 위한 예시값입니다. 실제 값은 사람·화풍·도구마다 다릅니다.</p>
<p>등장인물은 모두 20대 성인 연구원입니다(박사는 성인 남성). 실사풍 그림은 캐릭터를 코스프레한 가상의 성인 모델이며 실존 인물이 아닙니다. 다른 작품의 캐릭터를 닮은 그림은 만들지 않습니다.</p>
<p>원리 참고: 林晃·九分くりん『キャラの気持ちの描き方』(p.11~70). 책의 그림·문장·도식·구성 순서는 옮기지 않았습니다.</p>
<p>캐릭터 이름·설정·그림은 저작권자 안상선의 허락 없이 사용할 수 없습니다. 캐릭터 그림: <a href="{CHARREPO}">fruitfly-lab-expressions</a>.</p>
<p>글 · 안상선 ((주)M-Robo 대표) · <a href="{AUTHOR_URL}">저자 소개</a> · {DATE} · {VER}</p>
<p>{links}</p>
</div></footer>
<script src="{pre}assets/panels.js"></script>
</body></html>
"""

REFS_DL = ["haru_anime_base.png", "sia_anime_base.png", "moa_anime_base.png", "haru_sheet.png", "sia_sheet.png", "moa_sheet.png", "doctor_sheet.png", "fruitfly_sprites_6.png", "jupanbot_ref_genspark_v0.png", "pixel_style_ref_prev_cover.png"]
def make_section(P):
    tasks = MAKE.get(P["no"])
    if not tasks:
        return ""
    refs = " · ".join(f'<a href="assets/refs/{f}" download>{f.replace(".png", "")}</a>' for f in REFS_DL)
    out = f"""<section class="room" id="make"><div class="wrap"><div class="roomno">{P['no']}부 · 직접 만들기</div><h2>프롬프트로 직접 만들어 보기</h2>
<div class="box"><p>이 부에서 배운 원리를 그림 생성 AI(Genspark 등)로 직접 확인합니다. <b>A</b>는 이 페이지 그림을 실제로 만든 프롬프트, <b>B</b>는 원리를 하나 빼거나 바꾼 비교용 문장입니다.</p>
<ol style="margin:6px 0 0;padding-left:20px"><li>새 대화를 열고 아래 '첨부'에 적힌 참고 그림을 올립니다.</li><li>A를 붙여 넣어 만들고, 확인표로 결과를 점검합니다.</li><li>같은 대화에 B를 이어 붙여 다시 만들고, A 결과와 나란히 비교합니다.</li><li>결과는 매번 다릅니다. 두세 번 만들어 가장 나은 것을 고르세요.</li></ol>
<p class="hint" style="margin-top:8px">참고 그림 내려받기: {refs}</p></div>"""
    for i, t in enumerate(tasks, 1):
        A = PROMPTS[t["key"]][4]
        att = ATTACH_OF[CONV_OF[t["key"]]]
        ar = "16/9" if "16:9" in A.split("\n")[0] else "2/3"
        alt = PROMPTS[t["img"]][3]
        chk = "".join(f'<li>{E(c)}' + (f' <a href="{l}">원리 보기</a>' if l else "") + "</li>" for c, l in t["check"])
        bimgs = ""
        if t["b_imgs"]:
            bimgs = '<div class="artrow">' + "".join(art(k, "비교 결과 — " + t["b_title"], ar, f"B 결과 {j}") for j, k in enumerate(t["b_imgs"], 1)) + "</div>"
        tip = f'<p class="hint">{E(t["tip"])}</p>' if t.get("tip") else ""
        if t.get("res"):
            tip = f'<p style="background:#fff7ec;border-left:4px solid var(--orange);padding:8px 12px;border-radius:6px">{E(t["res"])}</p>' + tip
        bbox = f'<div class="promptbox"><b>{E(t["b_title"])}</b><pre>{E(t["b_text"])}</pre><button type="button" class="btn copy">복사하기</button></div>'
        if len(t["b_imgs"]) == 1:
            k = t["b_imgs"][0]
            bpart = f'<div class="pair">{bbox}<div>{art(k, "비교 결과 — " + t["b_title"], "2/3" if k == "p5_haru_face_inpaint_b" else ar, "B 결과")}</div></div>'
        else:
            bpart = bbox + bimgs
        out += f"""<div class="failcard" id="make{i}"><h3>실습 {i} · {E(t['title'])}</h3><p>{E(t['goal'])}</p>
<div class="pair"><div class="promptbox"><b>A — 이 페이지 그림을 만든 프롬프트</b><p class="hint">첨부: {E(att)}</p><pre>{E(A)}</pre><button type="button" class="btn copy">복사하기</button></div>
<div>{art(t['img'], alt, ar, "A 결과 — Genspark로 만든 실제 그림")}</div></div>
{bpart}<h4>결과에서 확인할 것</h4><ol>{chk}</ol>{tip}</div>"""
    return out + "</div></section>"

def build_part(P):
    t = f"{SERIES} {P['no']}부 — {P['title']}"
    s = head(t, P["desc"], P["og"], P["file"])
    navl = [(f"#{x['id']}", f"{k+1}단계") for k, x in enumerate(P["steps"])]
    if P.get("fails"): navl += [("#fails", "실패 8종")]
    navl += [("#make", "직접 만들기"), ("#judge", "평가"), ("#sum", "정리"), (P["next"][0], "다음 →")]
    s += nav(navl)
    s += cover(P["cover_key"], P["cover_cap"], P["cover_cast"])
    s += f"""<header class="hero"><div class="wrap"><span class="kicker">{E(P['kicker'])}</span><h1>{E(P['title'])}</h1><p class="lead">{E(P['lead'])}</p>
<p class="byline">글 · 안상선 ((주)M-Robo 대표) · <a href="{AUTHOR_URL}">저자 소개</a> · {DATE} · {VER}</p></div></header>
<section><div class="wrap">{three(*P['three'], ABBR)}</div></section>
<section><div class="wrap"><h2>오늘의 과제</h2>{talk(P['intro'])}{flow_strip(P['no'])}</div></section>
"""
    for k, st in enumerate(P["steps"]):
        s += step(P, k + 1, st)
    if P.get("fails"):
        s += '<section class="room" id="fails"><div class="wrap"><div class="roomno">6부 · 2단계</div><h2>표정 그림 실패 8종 진단</h2><p class="muted">그림마다 증상을 보고 원인을 고른 뒤, 연결된 원리와 고치는 프롬프트 조각을 확인합니다.</p>'
        s += "".join(failcard(f) for f in P["fails"])
        d = P["drift"]
        s += f'<div class="failcard" id="drift"><h3>{E(d["title"])}</h3>' + "".join(f"<p>{E(x)}</p>" for x in d["body"]) + '<p><span class="chip">연결된 원리</span><a href="05_ai_vfx.html#s1">5부 1단계 표정 문장</a></p></div></div></section>'
    s += make_section(P)
    s += judge(P["judge"]) + summary(P) + outro(P)
    s += kg_block(P["file"].replace(".html", ""), [P["file"]])
    s += footer()
    open(os.path.join(ROOT, P["file"]), "w").write(s)

FLOW = [
 (1, "기분은 몸에서 먼저 보인다", "표정만 그리면 몸이 기분과 따로 논다", "실루엣·머리·목·어깨·목의 범위·걸음"),
 (2, "여섯 가지 기본 감정", "몸으로 방향을 정해도, 가까이서는 얼굴이 감정을 가른다", "눈썹·입 두 축, 분노 두 단계, 놀람의 흰자, 멍함"),
 (3, "눈은 공 위에 그린다", "눈썹·입이 맞아도 눈이 평평하면 얼굴이 가면 같다", "각도·눈동자·눈꺼풀·기분별 눈"),
 (4, "빛과 그림자로 기분을 더한다", "표정이 맞아도 빛이 어긋나면 기분이 흔들린다", "빛 방향·빛 둘·역광·기분 터치"),
 (5, "AI와 VFX로 표정 바꾸기", "도구는 기분을 모른다. 말과 숫자로 나눠 알려 줘야 한다", "표정 문장·가림 영역·표정 값·화풍별 과장"),
 (6, "실패 사례 실험실", "문장을 잘 써도 표정은 틀릴 수 있다", "진단 순서와 고치는 조각"),
 (7, "실전 연습장", "배운 것을 한 화면에서 함께 다뤄 본다", "무대·표정 공방·조명실·진단 데스크"),
]
def flow_strip(cur=None, pre=""):
    files = {P["no"]: P["file"] for P in PARTS}
    files[7] = "practice/index.html"
    cells = []
    for n, t, _, _ in FLOW:
        mark = ' style="border-color:var(--orange);background:var(--orange-soft)"' if n == cur else ""
        cells.append(f'<a href="{pre}{files[n]}"{mark}><b>{n}부</b>{E(t)}</a>')
    return '<div class="flowgrid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr));margin-top:16px">' + "".join(cells) + "</div>"

def build_index():
    t = f"{SERIES} — 같은 얼굴, 다른 마음"
    d = "얼굴이 안 보여도 읽히는 몸의 기분, 喜怒哀楽+驚虚 여섯 감정, 공 위에 그리는 눈, 기분을 더하는 빛과 그림자를 실험으로 익히고, AI 표정 문장·가림 영역·VFX 표정 값으로 옮겨 봅니다. 표정 그림 실패 8종 진단까지."
    s = head(t, d, "og_index.jpg", "index.html")
    s += nav([("#howto", "읽는 법"), ("#parts", "편 목록"), ("#map", "전체 흐름"), ("#cast", "등장인물"), ("#source", "원리와 출처")])
    s += cover("cover_index", "연구실 무대 · 같은 대사, 세 가지 기분", [("fruitfly", "e09"), ("haru", "e01"), ("sia", "e13"), ("moa", "e19"), ("jupanbot", "e16")])
    s += f"""<header class="hero"><div class="wrap"><span class="kicker">연구실 특별편 · 그리기와 렌더링 · 기분 편</span>
<h1>그리기 연구실 01<br>기분 편 — 같은 얼굴, 다른 마음</h1>
<p class="lead">앞 시리즈에서 몸을 도형으로 잡고, 옷장 편에서 옷 주름을 익혔습니다. 이번에는 <b>캐릭터의 기분</b>입니다. 같은 대사 "어떻게 할 거야?"도 따질 때, 걱정할 때, 들뜰 때 몸·얼굴·눈·빛이 모두 달라집니다. 원리를 실험으로 보고, <b>AI와 VFX로 표정을 바꿔</b> 봅니다.</p>
<p class="byline">글 · 안상선 ((주)M-Robo 대표) · <a href="{AUTHOR_URL}">저자 소개</a> · {DATE} · {VER}</p></div></header>
<section><div class="wrap">{three("기분을 몸(머리·목·어깨)으로 먼저 정하고, 눈썹·입·눈으로 여섯 감정을 나누고, 빛과 터치로 더하는 원리를 실험으로 익힌 뒤, AI 문장과 VFX 표정 값으로 옮깁니다.", "표정만 바꾸면 얼굴과 몸, 빛이 서로 다른 말을 해 기분이 전해지지 않습니다. AI는 감정 낱말 하나로는 얼굴만 살짝 바꿉니다.", "캐릭터 표정 시트, 만화 연출, AI 그림의 표정 수정과 검수, 3D 얼굴 애니메이션에 씁니다.", ABBR)}</div></section>
<section id="howto"><div class="wrap"><h2>읽는 순서와 시간</h2><div class="box"><ul style="margin:0;padding-left:20px">
<li><b>처음부터 차례로</b>(권장): 부마다 실험을 눌러 보며 20~30분, 전체 3시간 안팎입니다.</li>
<li><b>앞 시리즈를 안 봤다면</b>: <a href="{PREV_SITE}">구조 먼저 보는 캐릭터 그리기 연구실</a>의 빛과 그림자 부분을 먼저 보면 4부가 편합니다. 안 봐도 읽을 수 있게 다시 설명합니다. 옷 주름은 <a href="{CLOSET}">옷장 편</a>에 있습니다.</li>
<li><b>손 그림 원리만</b>: 1~4부. <b>AI·VFX가 급하다면</b>: 5부 → 6부 → 7부, 막히는 낱말은 각 단계의 링크로 되짚어 보세요.</li>
<li>각 부 끝의 <b>평가단 채점</b>은 이야기 속 예시 점수입니다. 확인 퀴즈와 실전 연습장 미션으로 스스로 점검하세요.</li></ul></div></div></section>
<section id="parts"><div class="wrap"><h2>편 목록</h2>
<p class="muted">모델은 하루·모아·시아(2·4부에는 박사가 손님 모델), 화가는 주판봇과 초파리, 평가단은 X1·X2·X3, 해설은 박사입니다. 부마다 두 화가가 겨루고 평가단이 점수를 매깁니다.</p>
<div class="cards">
<a class="card" href="01_body_mood.html">{face("haru","e01")}<span class="n">1부 · 모델 하루</span><h3>기분은 몸에서 먼저 보인다</h3><p>실루엣, 머리·목·어깨 세 선, 목의 범위, 가벼운 걸음과 무거운 걸음.</p></a>
<a class="card" href="02_six_emotions.html">{face("moa","e01")}<span class="n">2부 · 모델 모아 · 손님 박사</span><h3>여섯 가지 기본 감정</h3><p>눈썹·입 두 축, 분노의 두 단계, 놀람의 흰자, 밝은 멍함과 어두운 멍함.</p></a>
<a class="card" href="03_eyes.html">{face("sia","e13")}<span class="n">3부 · 모델 시아</span><h3>눈은 공 위에 그린다</h3><p>각도에 따른 눈 폭, 공 위의 눈동자, 눈꺼풀 단계, 기분별 눈.</p></a>
<a class="card" href="04_light_mood.html">{face("doctor","e10")}<span class="n">4부 · 모델 하루 · 손님 박사</span><h3>빛과 그림자로 기분을 더한다</h3><p>빛의 방향, 빛 둘의 명·중·암, 역광과 테두리 빛, 기분 터치.</p></a>
<a class="card" href="05_ai_vfx.html">{face("haru","e19")}<span class="n">5부 · 모델 셋 모두</span><h3>AI와 VFX로 표정 바꾸기</h3><p>표정 문장 여섯 조각, 얼굴만 가려 다시 그리기, 표정 값 섞기, 화풍별 과장.</p></a>
<a class="card" href="06_failure_lab.html">{face("jupanbot","e20")}<span class="n">6부 · 의도적 실패 8종</span><h3>실패 사례 실험실</h3><p>증상 → 원인 → 원리 → 고치는 조각. 표정 그림 진단 순서.</p></a>
<a class="card" href="practice/index.html">{face("x2","e16")}<span class="n">7부 · 마지막 장</span><h3>실전 연습장</h3><p>무대·표정 공방·조명실·진단 데스크를 직접 운영합니다.</p></a>
</div></div></section>
<section id="map"><div class="wrap"><h2>전체 흐름 — 1부부터 7부까지 이어지는 순서</h2>{flow_strip()}
<div class="tbl" style="margin-top:16px"><table><thead><tr><th>부</th><th>제목</th><th>이 부를 배우는 까닭</th><th>핵심</th></tr></thead><tbody>
{''.join(f"<tr><td>{n}</td><td>{E(t)}</td><td>{E(a)}</td><td>{E(b)}</td></tr>" for n, t, a, b in FLOW)}</tbody></table></div>
<p class="muted" style="margin-top:12px">기초부터 보고 싶다면: <a href="{PREV_SITE}">구조 먼저 보는 캐릭터 그리기 연구실(구조·빛·주름·확산 모델)</a> · <a href="{CLOSET}">옷장 편(옷 주름)</a> · <a href="{RENDER}">AI 렌더링 연구실</a></p></div></section>
<section id="cast"><div class="wrap"><h2>등장인물</h2><div class="cast-grid">{''.join(f'<div class="who">{face(k, "e01" if k in ("haru","sia","moa") else "e13")}<b>{E(CH[k][0])}</b><span>{E(CH[k][1])}</span></div>' for k in ["doctor","haru","sia","moa","jupanbot","fruitfly","x1","x2","x3"])}</div>
<p class="hint" style="margin-top:10px">모델은 모두 20대 성인 연구원입니다(박사는 성인 남성). 원리 실습은 연구실 의상(랩코트·후드티·카디건·메이드복·조끼와 넥타이)으로 합니다.</p></div></section>
<section id="source"><div class="wrap"><h2>원리와 출처</h2>
<p>1~4부의 그리기 원리(기분을 몸·머리·목·어깨로 먼저 그리기, 喜怒哀楽에 驚·虚를 더한 여섯 감정, 기분의 밝음·어두움과 움직임·고요함, 눈의 각도·눈동자·눈꺼풀, 기분을 연출하는 빛과 그림자)는 일반적인 드로잉 원리이며, 林晃(Go office)·九分くりん의 작법서 『キャラの気持ちの描き方 — 表情・感情の表と裏を描き分けよう』 p.11~70을 참고해 정리했습니다. 책의 그림·문장·도식·구성 순서는 옮기지 않았고, 연구실 캐릭터와 직접 움직이는 실험으로 새로 구성했습니다. 책의 교복·맨몸 습작 예시는 쓰지 않고 같은 원리를 연구실 의상으로 다뤘습니다.</p>
<p>cos로 줄어드는 눈 폭과 면의 밝기는 램버트의 코사인 법칙, 표정 값 섞기는 블렌드셰이프 연구, 가림 영역 다시 그리기는 확산 모델 연구를 바탕으로 쉽게 풀었습니다(아래 출처). 페이지의 그림 33장(표지 8장은 픽셀아트, 본문은 애니풍, 5부 4단계만 네 화풍)은 Genspark로 만들며, 그림이 오기 전에는 '그림 준비 중' 자리로 둡니다. 실험 패널은 모두 페이지 안에서 직접 계산해 그립니다.</p></div></section>
"""
    s += kg_block("index", [P["file"] for P in PARTS] + ["practice/index.html"])
    s += footer()
    open(os.path.join(ROOT, "index.html"), "w").write(s)

def build_practice():
    pre = "../"
    t = f"{SERIES} 7부 — 실전 연습장"
    d = "무대(자세로 기분 연기), 표정 공방(눈썹·입·눈 맞추기), 조명실(빛과 터치로 분위기), 진단 데스크(실패 맞히기) 네 곳을 직접 운영하며 1~6부를 함께 연습합니다."
    s = head(t, d, "og_07.jpg", "practice/index.html", pre)
    s += nav([("#stage", "무대"), ("#faceshop", "표정 공방"), ("#lightroom", "조명실"), ("#desk", "진단 데스크"), ("#wrap", "마무리")], pre)
    s += cover("cover_07", "연구실 연습장 · 무대·거울·조명·진단 책상", [("haru", "e19"), ("doctor", "e16"), ("fruitfly", "e09"), ("jupanbot", "e16")], pre)
    s += f"""<header class="hero"><div class="wrap"><span class="kicker">7부 · 마지막 장</span><h1>실전 연습장</h1>
<p class="lead">네 곳의 작업장을 직접 운영합니다. <span style="color:var(--green)">초록 조작판</span>은 주어진 환경, <span style="color:var(--blue)">파랑 조작판</span>은 내 결정입니다. 미션은 직접 조작해야 판정됩니다.</p>
<p class="byline">글 · 안상선 ((주)M-Robo 대표) · <a href="{AUTHOR_URL}">저자 소개</a> · {DATE} · {VER}</p></div></header>
<section id="practice"><div class="wrap">
<div class="tabs" role="tablist"><button type="button" data-t="stage">무대</button><button type="button" data-t="faceshop">표정 공방</button><button type="button" data-t="lightroom">조명실</button><button type="button" data-t="desk">진단 데스크</button></div>
"""
    def sc(id_, title, situ, env, me, missions, back):
        ms = "".join(f"<li>{E(m)}</li>" for m in missions)
        bk = " · ".join(f'<a href="{pre}{h}">{E(t)}</a>' for h, t in back)
        return f"""<div class="scene" id="{id_}"><h2>{E(title)}</h2><div class="box"><b>상황</b> — {E(situ)}</div>
<div class="panel"><div class="ph"><b>조작판</b><small>초록 = 환경 · 파랑 = 내 결정</small></div>
<div class="ctrl ctl-env">{env}</div><div class="ctrl ctl-me">{me}</div>
<div class="board" aria-live="polite"></div>
<div class="pair"><div class="g1"></div><div class="g2"></div></div>
<div class="talk"></div>
<h4>미션</h4><ol class="missions">{ms}</ol></div>
<p class="muted">배운 곳 다시 보기: {bk}</p></div>
"""
    def rg(label, name, lo, hi, val):
        return f'<label>{label} <input type="range" name="{name}" min="{lo}" max="{hi}" step="1" value="{val}"></label>'
    arms = "".join(f'<option value="{k}"{" selected" if k == "side" else ""}>{v}</option>' for k, v in [("side", "팔 내림"), ("hips", "허리에 손"), ("cross", "팔짱"), ("chest", "가슴 앞 두 손"), ("back", "뒷짐"), ("headback", "머리 뒤 깍지"), ("chin", "턱 괴기"), ("up", "두 팔 번쩍"), ("fists", "주먹 쥐고 내림"), ("face", "두 손으로 얼굴 가림")])
    s += sc("stage", "무대 — 같은 대사, 다른 기분", "대사는 \"어떻게 할 거야?\" 하나입니다. 상황이 주어지면 시아의 자세(팔·몸·고개·어깨)를 정해 그 기분이 읽히게 만듭니다. 오른쪽 실루엣으로도 확인하세요.",
            '<label>상황 <select name="sit"><option value="blame">비난 — 따지듯</option><option value="worry">걱정 — 어떡하지</option><option value="joy">기쁨 — 들떠서</option><option value="relax">편안 — 느긋하게</option><option value="anger">화를 참음</option></select></label>',
            f'<label>팔 <select name="arms">{arms}</select></label>' + rg("몸 앞기울기(°)", "lean", -10, 20, 0) + rg("고개 기울기(°)", "roll", -20, 20, 0) + rg("고개 숙임 ↔ 들기", "pitch", -10, 10, 0) + rg("어깨 올림", "sup", 0, 10, 0),
            ["상황 '비난'에서 '비난·어이없음'으로 읽히게 하기", "상황 '걱정'을 고개 숙임(−3 이하)과 가슴 앞 두 손으로 만들기", "상황 '기쁨'에서 어깨를 6 이상 올려 기쁨을 키우기"],
            [("01_body_mood.html#s1", "1부 1단계 실루엣"), ("01_body_mood.html#s2", "1부 2단계 머리·목·어깨")])
    s += sc("faceshop", "표정 공방 — 목표 감정 맞히기", "목표 감정이 주어집니다. 모아의 눈썹·입·눈·눈동자 값을 정해 목표와 80% 이상 닮게 만듭니다.",
            '<label>목표 감정 <select name="target"><option value="joy">喜 기쁨</option><option value="anger">怒 분노</option><option value="sad">哀 슬픔</option><option value="ease">楽 편안</option><option value="surprise">驚 놀람</option><option value="blank">虚 멍함</option></select></label>',
            rg("눈썹 안쪽(− 내림 ~ + 올림)", "brow", -10, 10, 0) + rg("입꼬리(− 내림 ~ + 올림)", "mouth", -10, 10, 0) + rg("입 벌림", "open", 0, 10, 0) + rg("눈 뜬 정도", "eye", 0, 15, 10) + rg("눈동자 크기", "pupil", 3, 11, 10),
            ["喜 기쁨을 80% 이상 맞추기", "怒 분노를 80% 이상 맞추기", "驚 놀람을 80% 이상 맞추기(눈동자를 작게)"],
            [("02_six_emotions.html#s1", "2부 1단계 눈썹과 입"), ("02_six_emotions.html#s3", "2부 3단계 놀람"), ("03_eyes.html#s4", "3부 4단계 기분별 눈")])
    s += sc("lightroom", "조명실 — 빛과 터치로 분위기 맞추기", "장면이 주어집니다. 하루의 표정은 장면에 맞춰 바뀝니다. 빛의 방향·세기·테두리 빛과 기분 터치를 골라 장면 분위기를 만듭니다.",
            '<label>장면 <select name="scene"><option value="mystery">의미심장 — 반전 장면</option><option value="warm">따뜻한 기쁨</option><option value="horror">섬뜩함 — 괴담</option><option value="gloom">침울 — 실패 소식</option></select></label>',
            '<label>빛 방향 <select name="dir"><option value="ul">왼쪽 위</option><option value="top">바로 위</option><option value="side">바로 옆</option><option value="bottom">바로 아래</option><option value="back">바로 뒤(역광)</option></select></label>' + rg("빛 세기", "k", 0, 10, 6) + rg("테두리 빛", "rim", 0, 10, 0) + '<label><input type="checkbox" name="red"> 붉은 빗금</label><label><input type="checkbox" name="blue"> 세로선</label><label><input type="checkbox" name="shade"> 얼굴 위 그늘</label>',
            ["'의미심장' 장면 맞추기(역광 + 테두리 빛)", "'섬뜩함' 장면 맞추기", "'따뜻한 기쁨'과 '침울'을 둘 다 맞추기"],
            [("04_light_mood.html#s1", "4부 1단계 빛의 방향"), ("04_light_mood.html#s3", "4부 3단계 역광"), ("04_light_mood.html#s4", "4부 4단계 기분 터치")])
    s += sc("desk", "진단 데스크 — 원인 맞히기", "표정 그림 실패의 증상이 하나씩 들어옵니다. 원인을 고르세요. 순서: 몸 → 눈썹·입 → 눈 → 빛·터치 → 문장·가림 영역.",
            '<span class="hint">환경: 증상은 무작위로 들어옵니다.</span>',
            '<div style="width:100%"><p class="sym" style="font-weight:600"></p><div class="opts deskopts"></div></div>',
            ["3개 연속 정답", "8종 원인을 모두 한 번 이상 맞히기", "틀리지 않고 5개 맞히기"],
            [("06_failure_lab.html#s1", "6부 진단 순서"), ("06_failure_lab.html#fails", "6부 실패 8종")])
    s += f"""</div></section>
<section id="wrap"><div class="wrap"><h2>마무리 — 네 작업장을 하나로 묶으면</h2>
<div class="box"><p>무대에서 정한 자세는 표정 문장의 '몸' 조각이 되고, 표정 공방의 값은 '얼굴'·'눈' 조각과 VFX 표정 값이 되며, 조명실의 선택은 '빛' 조각이 됩니다. 진단 데스크에서 틀린 원인은 대부분 앞의 세 곳 중 하나가 빠진 경우입니다. 기분 그림은 결국 <b>몸이 방향을 정하고, 얼굴과 눈이 감정을 가르고, 빛이 분위기를 더하는</b> 기록입니다.</p>
<p><b>실제 그림으로 이어 가기</b> — 5부 1단계 실험에서 표정 문장을 조립해 그림 생성 AI에 넣어 보세요. 결과는 각 부의 '프롬프트로 직접 만들어 보기' 확인표로 점검합니다: <a href="{pre}01_body_mood.html#make">1부</a> · <a href="{pre}02_six_emotions.html#make">2부</a> · <a href="{pre}03_eyes.html#make">3부</a> · <a href="{pre}04_light_mood.html#make">4부</a> · <a href="{pre}05_ai_vfx.html#make">5부</a> · <a href="{pre}06_failure_lab.html#make">6부</a></p>
<p class="hint">주의할 점: 이 연습장의 기분 판정·닮음 점수·분위기 판정은 원리를 보이기 위해 크게 단순화한 규칙입니다. 숫자는 교육용 예시이며, 실제 그림에서는 장면의 앞뒤와 인물 설정이 함께 기분을 정합니다.</p></div>
<div class="next"><a href="{pre}06_failure_lab.html">← 6부 실패 사례 실험실</a><a href="{pre}index.html">목차로</a></div></div></section>
"""
    s += kg_block("practice_index", ["practice/index.html"])
    s += footer(pre)
    open(os.path.join(ROOT, "practice", "index.html"), "w").write(s)

if __name__ == "__main__":
    JS = ["js_base.js", "js_face.js", "js_parts.js", "js_practice_util.js", "js_practice.js", "js_tail.js"]
    open(os.path.join(ROOT, "assets", "panels.js"), "w").write("".join(open(os.path.join(ROOT, "build", f)).read() for f in JS))
    build_index()
    for P in PARTS:
        build_part(P)
    build_practice()
    print("built", len(PARTS) + 2, "pages")
