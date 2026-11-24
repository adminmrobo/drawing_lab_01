# -*- coding: utf-8 -*-
"""연습 과제 중 1차 결과가 약하거나 빠진 그림의 재요청 꾸러미(docs/image_requests_retry). 1차 그림은 그대로 두고, 2차 결과를 {key}_retry로 받는다."""
import os, csv, sys
sys.path.insert(0, os.path.dirname(__file__))
from make_requests import who, ANI, END
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, "docs", "image_requests_retry")
os.makedirs(os.path.join(D, "prompts"), exist_ok=True)
def P(ratio, body): return "Illustration, " + ("wide 16:9." if ratio == "16:9" else "vertical 2:3.") + f"\n{ANI}\n{body}\n{END}"
R = [
 ("d1_haru_same_smile_two_moods_retry", "16:9", "refs/haru_anime_base.png, refs/haru_sheet.png",
  "1부 연습 2 — 어깨 차이가 작아 쓸쓸함이 약했음",
  P("16:9", "Two upper-body portraits of " + who("haru") + " side by side, with EXACTLY the same gentle closed-mouth smile.\nLEFT (bright): head tilted up and to one side, chin lifted, BOTH shoulders clearly raised toward the ears, chest open, light and lively.\nRIGHT (lonely): head clearly lowered, eyes looking down, BOTH shoulders dropped low and rolled forward, back visibly rounded, arms hanging, small and quiet.\nThe shoulder lines of the two figures must be at clearly different heights. Only head, neck, shoulders and back differ; the mouth is identical.\nSame soft light from the upper left. Plain off-white background.")),
 ("d3_sia_side_glance_retry", "16:9", "refs/sia_anime_base.png, refs/sia_sheet.png",
  "3부 연습 1 — 눈동자가 눈꼬리 쪽으로 몰리지 않아 곁눈질이 약했음",
  P("16:9", "Close-up upper body of " + who("sia") + ", head in a three-quarter view turned toward the viewer's LEFT, but her EYES glance strongly to the viewer's RIGHT (a sideways side-eye).\nBoth irises pushed all the way into the right corners of the eyes, narrowed into tall vertical ovals, lots of eye white visible on the left side of each eye.\nThe far eye is clearly narrower than the near eye and partly hidden behind the nose bridge.\nA faint knowing smile. Light from the upper left. Plain off-white background.")),
 ("d4_haru_backlit_question_retry", "2:3", "refs/haru_anime_base.png, refs/haru_sheet.png",
  "4부 연습 1 — 테두리 빛은 있었지만 얼굴이 앞에서 밝게 비춰졌음",
  P("2:3", "Head-and-shoulders of " + who("haru") + ", looking back over her shoulder at the viewer with a quiet, knowing smile.\nLighting: ONLY a strong backlight from directly behind her. NO front light, NO key light on the face.\nHer whole face and front are in deep, even shadow (dark but not pure black); a thin bright white rim light outlines her profile, hair buns, hair strands and shoulders.\nA very faint, cool bounce light from below lets the smile and the blue eyes be barely visible.\nDark navy background with a soft glow behind her head. Mysterious, meaningful mood.")),
 ("d4_doctor_light_swap_retry", "16:9", "refs/doctor_sheet.png",
  "4부 연습 2 — 아래 빛의 위로 뻗는 그림자가 약해 섬뜩함이 부족했음",
  P("16:9", "Two upper-body portraits of " + who("doctor") + " side by side, EXACTLY the same calm slight smile and pose.\nLEFT: soft warm light from the upper left, shadows fall down and to the right, friendly and reliable.\nRIGHT: the ONLY light is a strong flashlight held directly below his chin (do not draw the flashlight). Bright underside of the chin, nostrils and cheekbones; dark shadows cast UPWARD over the nose, eyes, eyebrows and forehead; glasses catching light from below; the top of the head falls into darkness. Eerie ghost-story mood.\nNeutral gray background, darker on the right half.")),
 ("d6_adult_pout_retry", "2:3", "refs/moa_anime_base.png, refs/moa_sheet.png",
  "6부 연습 2 — 성인 비율은 지켰지만 표정이 옅어 시큰둥에 가까웠음",
  P("2:3", "Upper body portrait of " + who("moa") + ", an adult woman in her early twenties with mature adult facial proportions, sulking.\nFace: lips pressed tightly together and clearly pushed forward into a pout, one cheek visibly puffed with air, eyes glancing sharply to the side, inner eyebrows pulled down a little, a faint flush on the cheeks.\nBody: arms crossed firmly, shoulders slightly raised, head turned away from the viewer.\nThe pout must be clearly visible while she still looks like an adult. Soft light from the upper left. Plain off-white background.")),
 ("d7_stage_to_prompt_retry", "2:3", "refs/sia_anime_base.png, refs/sia_sheet.png",
  "7부 연습 1 — 자세는 맞았지만 얼굴이 차분하고 몸이 앞으로 기울지 않았음",
  P("2:3", "Full body of " + who("sia") + ", clearly worried, asking 'What should we do...?'.\nBody: upper body visibly leaning forward from the hips, both hands clasped tightly together in front of her chest, head tilted to one side and lowered, shoulders raised and tense, knees slightly together.\nFace: inner eyebrows raised high and drawn together, lips pressed and slightly downturned, eyes looking down to the side, a small sweat drop near the temple.\nSoft light from the upper left with a faint shadow over the eyes. Plain off-white background.")),
 ("d5_haru_inpaint_two_steps", "16:9", "refs/haru_anime_base.png, refs/haru_sheet.png",
  "5부 연습 2 — 1차에 그림이 빠졌음(처음 요청)",
  P("16:9", "Three panels in a row of the SAME upper-body portrait of " + who("haru") + ". Hair buns, navy streaks, face shape, eye color, outfit, pose, framing and lighting are IDENTICAL in all three panels; only the marked facial parts change.\n1) bright open-mouth smile, eyes smiling.\n2) ONLY the mouth changed: lips pressed together, corners slightly down; the eyes are still smiling exactly as in panel 1 (an awkward mixed face).\n3) the mouth stays as in panel 2 and NOW the eyes and eyebrows also change: inner eyebrows raised and drawn together, eyes looking slightly down — a worried face.\nThin white gaps between panels, no labels, no arrows. Plain off-white background.")),
]
if __name__ == "__main__":
    os.makedirs(os.path.join(D, "prompts"), exist_ok=True)
    rows = []
    md = "# R01 · 연습 과제 재요청 (" + str(len(R)) + "장)\n\n**Genspark에 먼저 붙여 넣기 ↓**\n```\n해설 페이지 '프롬프트 연습 과제'의 그림을 다시 만들어 줘. 1차 결과에서 약했던 점을 고친 프롬프트야.\n- 비율은 각 프롬프트 첫 줄을 따를 것(16:9는 가로 1920px 이상, 2:3은 세로 1536px 이상)\n- 첨부한 참고 이미지의 캐릭터 외형(얼굴·머리·색·장식)을 똑같이 지킬 것\n- 등장인물은 모두 20대 성인(박사는 성인 남성). 노출·과장된 체형·교복 느낌 금지\n- 대문자로 강조한 부분(ONLY, NO, EXACTLY 등)이 이번 재요청의 핵심이니 꼭 지킬 것\n- 그림 안에 글자·숫자·로고·말풍선 금지\n아래 영어 프롬프트를 하나씩 써 줘.\n```\n"
    for i, (k, ratio, att, why, prompt) in enumerate(R, 1):
        rows.append([i, k, ratio, why, ""])
        md += f"\n---\n## {i}) {k}\n이유: {why}\n첨부: {att}\n```\n{prompt}\n```\n"
    md += "\n---\n**한 번 더 실패하면:** 같은 대화에서 'Same image. Change only: …'로 핵심 한 가지만 다시 강조해 주세요(예: 4부 역광은 'make the face darker, keep only the rim light'). 그래도 안 되면 그대로 주셔도 됩니다. 페이지에 1차·2차 결과를 나란히 두고 '결과는 매번 다르다' 사례로 설명합니다.\n"
    open(os.path.join(D, "prompts", "R01_drill_retry.md"), "w").write(md)
    with open(os.path.join(D, "checklist.csv"), "w", newline="") as f:
        w = csv.writer(f); w.writerow(["order", "file", "ratio", "why", "status"]); w.writerows(rows)
    open(os.path.join(D, "README.md"), "w").write("# 그림 요청 꾸러미 4 — 연습 과제 재요청 (" + str(len(R)) + "장)\n\n1차 결과가 약했던 6장과 빠졌던 1장입니다. **1차 그림은 지우지 않고** 페이지에 '1차 결과'로 남기고, 이번 그림은 '2차 결과'로 나란히 둡니다.\n\n- 요청: `prompts/R01_drill_retry.md` (Genspark 대화 하나)\n- 저장 이름: `checklist.csv`의 `file` 이름 그대로(`*_retry`). 5부 연습 2만 처음 받는 그림이라 이름에 `_retry`가 없습니다.\n- 성공한 7장(1부 연습 1, 2부 둘, 3부 연습 2, 5부 연습 1, 6부 연습 1, 7부 연습 2)은 다시 만들지 않습니다.\n")
    print(len(R))

# ── 3차(재요청 2회차): 2차에서도 일부만 된 4장. 방법 자체를 바꾼다(구도·크롭·판 나누기) ──
R2 = [
 ("d7_stage_to_prompt_retry2", "2:3", "refs/sia_anime_base.png, refs/sia_sheet.png",
  "7부 연습 1 — 2차에서도 허리부터 앞으로 숙이는 자세가 안 나왔음 → 옆에서 본 구도로 바꿈",
  P("2:3", "SIDE VIEW (profile, facing the viewer's left), knees up, of " + who("sia") + ", clearly worried.\nHer upper body is bent forward from the hips at about 20 degrees, so her head is clearly in front of her feet; her back is gently rounded; both hands are clasped tightly in front of her chest; her head is lowered; her shoulders are raised and tense.\nFace (seen in profile): inner eyebrow raised, lips pressed, eyes looking down, a small sweat drop near the temple.\nSoft light from the upper left. Plain off-white background.")),
 ("d4_doctor_light_swap_retry2", "16:9", "refs/doctor_sheet.png",
  "4부 연습 2 — 2차에서 배경까지 어두워져 왼쪽의 따뜻함이 줄었음 → 두 판의 배경을 따로 정함",
  P("16:9", "Two SEPARATE panels side by side with a thin white gap, the same upper-body portrait of " + who("doctor") + ", EXACTLY the same calm slight smile and pose.\nLEFT PANEL: warm cream background, bright and cheerful; soft warm light from the upper left; gentle shadows fall down and to the right.\nRIGHT PANEL: dark charcoal background; the ONLY light is a strong flashlight directly below his chin (do not draw the flashlight); bright underside of the chin, nostrils and cheekbones; dark shadows cast UPWARD over the nose, eyes and forehead; the top of his head fades into darkness. Eerie ghost-story mood.\nThe left panel must stay bright and warm.")),
 ("d1_haru_same_smile_two_moods_retry2", "16:9", "refs/haru_anime_base.png, refs/haru_sheet.png",
  "1부 연습 2 — 2차에서도 어깨 높이 차이가 작았음 → 팔과 어깨가 다 보이는 허리 위 구도로 바꿈",
  P("16:9", "Two waist-up portraits of " + who("haru") + " side by side, both arms and both shoulders fully visible, EXACTLY the same gentle closed-mouth smile.\nLEFT (bright): BOTH shoulders lifted high toward the ears in a happy shrug, elbows bent, hands loosely in front of her chest, chin lifted, head tilted to one side.\nRIGHT (lonely): BOTH shoulders sloping low, arms hanging straight down, back rounded, head lowered, eyes looking down.\nDraw the two shoulder lines at clearly different heights: the left figure's shoulders sit much higher than the right figure's.\nSame soft light from the upper left. Plain off-white background.")),
 ("d5_haru_inpaint_two_steps_retry", "16:9", "refs/haru_anime_base.png, refs/haru_sheet.png",
  "5부 연습 2 — 1회차에서 무릎 위까지 나왔고 둘째 컷의 눈이 웃지 않았음 → 가슴 위로 자르고 둘째 컷 눈을 못 박음",
  P("16:9", "Three panels in a row of the SAME chest-up portrait of " + who("haru") + ", face large in each panel. Hair buns, navy streaks, face shape, eye color, outfit, framing and lighting are IDENTICAL in all three.\n1) bright open-mouth smile, eyes closed into happy upward crescents.\n2) the eyes are EXACTLY the same happy upward crescents as panel 1, but ONLY the mouth changed: lips pressed together, corners slightly down (an awkward mixed face).\n3) the mouth stays as in panel 2 and NOW the eyes open and the eyebrows change: inner eyebrows raised and drawn together, eyes looking slightly down — a worried face.\nThin white gaps between panels, no labels, no arrows. Plain off-white background.")),
]

if __name__ == "__main__":
    md = "# R02 · 연습 과제 재요청 2회차 (" + str(len(R2)) + "장)\n\n2차에서도 일부만 된 그림입니다. 이번에는 문장을 세게 하는 대신 **구도를 바꿉니다**(옆모습, 허리 위, 가슴 위, 판 나누기).\n\n**Genspark에 먼저 붙여 넣기 ↓**\n```\n해설 페이지 '프롬프트 연습 과제'의 그림을 한 번 더 다시 만들어 줘. 두 번 시도해도 약했던 점을, 이번에는 구도를 바꿔서 해결하려는 프롬프트야.\n- 비율은 각 프롬프트 첫 줄을 따를 것(16:9는 가로 1920px 이상, 2:3은 세로 1536px 이상)\n- 첨부한 참고 이미지의 캐릭터 외형(얼굴·머리·색·장식)을 똑같이 지킬 것\n- 등장인물은 모두 20대 성인(박사는 성인 남성). 노출·과장된 체형·교복 느낌 금지\n- 대문자로 강조한 부분(SIDE VIEW, BOTH, EXACTLY, ONLY 등)이 핵심이니 꼭 지킬 것\n- 그림 안에 글자·숫자·로고·말풍선 금지\n아래 영어 프롬프트를 하나씩 써 줘.\n```\n"
    rows = []
    for i, (k, ratio, att, why, prompt) in enumerate(R2, 1):
        rows.append([i, k, ratio, why, ""])
        md += f"\n---\n## {i}) {k}\n이유: {why}\n첨부: {att}\n```\n{prompt}\n```\n"
    md += "\n---\n**이번에도 안 되면:** 그대로 주세요. 1·2·3차를 나란히 두고, 도구가 끝내 따르지 않는 지시와 그때의 대처(부분 수정, 손 그림 보정)를 적겠습니다.\n"
    open(os.path.join(D, "prompts", "R02_drill_retry2.md"), "w").write(md)
    with open(os.path.join(D, "checklist_R02.csv"), "w", newline="") as f:
        w = csv.writer(f); w.writerow(["order", "file", "ratio", "why", "status"]); w.writerows(rows)
    print("R02", len(R2))
