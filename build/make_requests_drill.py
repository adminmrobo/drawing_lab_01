# -*- coding: utf-8 -*-
"""'프롬프트 연습 과제' 예상 결과 그림 요청 꾸러미(docs/image_requests_drill) 생성."""
import os, csv, sys
sys.path.insert(0, os.path.dirname(__file__))
from content_drill import DRILL
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, "docs", "image_requests_drill")
os.makedirs(os.path.join(D, "prompts"), exist_ok=True)
HEAD = ("해설 페이지 '프롬프트 연습 과제'의 예상 결과 그림을 한 장씩 차례로 만들어 줘.\n- 비율은 각 프롬프트 첫 줄을 따를 것(16:9는 가로 1920px 이상, 2:3은 세로 1536px 이상)\n"
        "- 첨부한 참고 이미지의 캐릭터 외형(얼굴·머리·색·장식)을 똑같이 지킬 것\n- 등장인물은 모두 20대 성인(박사는 성인 남성). 노출·과장된 체형·교복 느낌 금지\n"
        "- 여러 컷이 든 그림은 컷 사이를 얇은 흰 여백으로만 나누고, 그림 안에 글자·숫자·로고·말풍선 금지\n아래 영어 프롬프트를 하나씩 써 줘.")
PAGES = ["", "01_body_mood", "02_six_emotions", "03_eyes", "04_light_mood", "05_ai_vfx", "06_failure_lab", "practice/index"]
GROUPS = [("D01_part1_2", [1, 2]), ("D02_part3_4", [3, 4]), ("D03_part5_7", [5, 6, 7])]
rows = []; n = 0
for cid, parts in GROUPS:
    atts = sorted({x["attach"].split(" + ")[-1] for no in parts for x in DRILL[no]})
    md = f"# {cid[:3]} · {', '.join(str(p) + '부' for p in parts)} 연습 과제 예상 결과\n\n**첨부:** " + " / ".join(atts) + f"\n\n**Genspark에 먼저 붙여 넣기 ↓**\n```\n{HEAD}\n```\n"
    for no in parts:
        for i, x in enumerate(DRILL[no], 1):
            n += 1; k, alt, _ = x["expect"]
            rows.append([n, cid[:3], k, f"{PAGES[no]}.html#drill{i}", x["ratio"], ""])
            md += f"\n---\n## {k} — {no}부 연습 {i} · {x['title']}\n첨부: {x['attach'].split(' + ')[-1]}\nalt: {alt}\n```\n{x['gen']}\n```\n"
    open(os.path.join(D, "prompts", cid + ".md"), "w").write(md)
with open(os.path.join(D, "checklist.csv"), "w", newline="") as f:
    w = csv.writer(f); w.writerow(["order", "conversation", "file", "page", "ratio", "status"]); w.writerows(rows)
open(os.path.join(D, "README.md"), "w").write(f"""# 그림 요청 꾸러미 3 — '프롬프트 연습 과제' 예상 결과 ({n}장)

1~7부에 부마다 두 개씩 있는 '프롬프트 연습 과제'의 **예상 결과** 그림입니다.

## 요청 순서 (Genspark 대화 하나 = 파일 하나)
""" + "\n".join(f"{i+1}. `prompts/{c}.md` — {', '.join(str(p) + '부' for p in ps)} ({sum(len(DRILL[p]) for p in ps)}장)" for i, (c, ps) in enumerate(GROUPS)) + """

## 저장 이름
`checklist.csv`의 `file` 열 이름 그대로(png·jpg). 받은 그림은 원본 해상도 그대로 `assets/img/{이름}.webp`로 넣고 `python3 build/build.py`를 다시 돌립니다.

## 주의
- 한 장에 여러 컷이 든 그림(비교·단계 그림)은 컷마다 캐릭터의 머리 모양·옷이 같아야 합니다.
- 6부 연습 2(d6_adult_pout)는 성인 비율이 핵심입니다. 어려 보이면 다시 만들어 주세요.
- 첨부 그림은 `assets/refs/`의 기준 전신·설정 시트를 씁니다.
""")
print("drill images", n)
