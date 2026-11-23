# -*- coding: utf-8 -*-
"""Genspark 그림 요청 꾸러미(docs/image_requests) 생성. python3 build/make_requests.py
PROMPTS의 프롬프트는 각 부 '프롬프트로 직접 만들어 보기'의 A 프롬프트로도 그대로 쓰인다."""
import os, csv
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, "docs", "image_requests")
PIX = "Art style (required, always): 16-bit RPG style pixel art with clearly visible square pixels, limited palette, bold dark outline, 2–3 tone shading, small highlights; no smooth gradients, no painterly, vector, watercolor or 3D look.\nMatch the characters' proportions and colors of the attached reference images exactly, drawn in this same pixel-art style.\nBright daytime laboratory mood, soft natural sunlight through large windows, clean white walls, light lavender, mint and pink accents."
ANI = "Art style: high-quality anime illustration, clean confident lineart, two-tone cel shading, natural adult proportions.\nMatch the attached reference images exactly (face, hair, colors, accessories). All characters are adults in their early twenties (the Professor is an adult man in his thirties, normal proportions, not chibi); modest outfits exactly as described."
END = "No text, no letters, no numbers, no speech bubbles, no logos, no watermark, no revealing clothing, not childlike, no school uniform, not resembling any famous anime character."
ENDC = "No text, no letters, no numbers, no logos, no weapons, no cigarettes, no alcohol, no blood, no real brands."
SAFE = "Composition: every face and hand inside the central safe area (12% margin left and right, 10% top, 18% bottom); bottom-left corner plain and bright."
CH = {
 "haru": "Haru (adult lab assistant, long straight pink hair with navy streaks and a thick navy streak down the center of the bangs, two round hair buns on top, small ahoge, big blue eyes)",
 "sia": "Sia (adult maid intern, long straight jet-black hair, no headdress, gray eyes, small silver earrings)",
 "moa": "Moa (adult maid intern, long ash-beige wavy hair, white frilled maid headband with a white ribbon over her LEFT ear, amber eyes)",
 "doctor": "the Professor (adult male scientist, dark charcoal spiky hair with a white streak at the front, very thick black eyebrows, teal rectangular glasses)",
 "fly": "the Fruit Fly researcher (tiny cartoon fruit fly, large red compound eyes, retro dark blue helmet with a yellow-white stripe, colorful dangling cables, tiny white lab coat, translucent wings)",
 "bot": "AbaBot (boxy beige retro CRT-monitor robot, dark green screen face with mint pixel eyes, short antenna topped with a red-brown abacus bead, gray segmented arms, small tank treads)",
 "judges": "three small cute dark navy silhouette judges with white dot eyes (one with a pink side-ponytail bow, one with a beret and teal round glasses, one with a cat-ear hood and yellow pompoms) holding blank score paddles",
}
OUT = {"haru": "lavender hoodie with white drawstrings over a white t-shirt, open white knee-length lab coat, rolled-up jeans, lavender sneakers",
       "sia": "charcoal-black long-sleeved maid dress, large gray bow at the collar, long white frilled apron",
       "moa": "camel knit cardigan over a white blouse, red and navy plaid bow tie, white frilled apron, black skirt",
       "doctor": "white lab coat over a black vest, white shirt and black tie"}
def who(k, outfit=None): return CH[k] + ", wearing " + (outfit or OUT[k])
def cover(file, page, part, alt, scene, chars, meta, mood):
    p = f"Website top cover illustration, wide 16:9.\n{PIX}\nScene: {scene}\nCharacters:\n  " + ";\n  ".join(chars) + f".\nVisual metaphor: {meta}\n{SAFE}\nMood: {mood}\n{ENDC}"
    return (file, page, part, alt, p, "pixel")
def body(file, page, part, alt, ratio, scene, extra=""):
    p = ("Illustration, " + ("vertical 2:3." if ratio == "2:3" else "wide 16:9.") + f"\n{ANI}\n{scene}\n" + (extra + "\n" if extra else "") + "Plain off-white studio background or a bright clean lab interior.\n" + END)
    return (file, page, part, alt, p, "anime")

C1 = [
 cover("cover_index", "index.html", "목차", "낮의 연구실 무대에서 하루·시아·모아가 같은 대사를 서로 다른 자세로 연기하고, 초파리와 주판봇이 이젤 앞에, 박사가 대본을 들고, 평가단이 뒤에 앉은 장면",
   "a sunny corner of the laboratory turned into a small rehearsal stage: a low wooden platform, a full-length mirror, two easels with canvases seen from the back, a spotlight on a stand.",
   [who("haru") + ", in the center with hands on her hips, leaning slightly forward", who("sia") + ", on the left holding both hands near her chest with her head slightly lowered", who("moa") + ", on the right with both hands behind her head, relaxed",
    who("doctor") + ", at the back center holding a rolled script", CH["fly"] + ", on the far left facing right at the left easel", CH["bot"] + ", on the far right facing left at the right easel", CH["judges"] + " sitting at a small table in the back right"],
   "three people saying the same line with three different body poses.", "cheerful, friendly rivalry, the moment before rehearsal starts."),
 cover("cover_01", "01_body_mood.html", "1부 기분은 몸에서", "하루가 무대 위에서 자세를 바꾸고, 벽에는 하루의 그림자 실루엣 세 개가 서로 다른 자세로 비치는 장면",
   "the lab rehearsal stage with a bright lamp casting shadows on a white wall.",
   [who("haru") + ", in the center tilting her head and raising one shoulder", CH["fly"] + ", on the left facing right, pointing at the wall shadows", CH["bot"] + ", on the right facing left, holding a big hand mirror toward Haru's face", who("doctor") + ", at the back nodding"],
   "three clearly different body silhouettes on the wall — one with hands on hips, one with hands at the chest, one with hands behind the head.", "curious, playful."),
 cover("cover_02", "02_six_emotions.html", "2부 여섯 가지 기본 감정", "모아가 거울 앞에서 표정을 짓고, 거울 테두리에 여섯 개의 작은 표정 그림이 붙어 있으며, 박사가 손님 모델로 팔짱을 낀 장면",
   "the lab dressing corner with a large round mirror; six small blank drawing cards pinned around the mirror frame, each showing a simple face.",
   [who("moa") + ", in the center making a surprised face at the mirror", who("doctor") + ", on the right as a guest model with arms crossed and a mock-stern face", CH["fly"] + ", on the left facing right, holding a sketchbook", CH["bot"] + ", at the back left juggling six blank cards"],
   "one face, six moods around the mirror.", "lively, funny."),
 cover("cover_03", "03_eyes.html", "3부 눈은 공 위에", "시아가 커다란 눈알 모형(흰 공에 눈동자 원)을 두 손으로 들고 돌려 보고, 초파리가 확대경으로 들여다보는 장면",
   "the lab observation room with a desk lamp and a large white ball model painted with an iris circle.",
   [who("sia") + ", in the center holding the big eyeball model and turning it", CH["fly"] + ", on the left facing right, looking at the iris through a magnifying glass", CH["bot"] + ", on the right facing left, holding a flat paper circle and looking confused", who("doctor") + ", at the back pointing at the curved surface of the ball"],
   "a round iris that turns into a narrow oval as the ball rotates.", "calm, curious."),
]
C2 = [
 cover("cover_04", "04_light_mood.html", "4부 빛과 그림자", "하루가 조명 사이에 서 있고, 박사가 반사판을 들고, 초파리가 손전등을 위·옆·아래로 비춰 보는 장면",
   "the lab lighting room with a softbox, a spotlight on a stand and a large white reflector board.",
   [who("haru") + ", in the center standing in soft light from the upper left", who("doctor") + ", on the right holding a large white reflector board", CH["fly"] + ", on the left facing right, holding a small flashlight", CH["bot"] + ", at the back right turning on every lamp at once, looking dazzled"],
   "the same face lit from different directions — a soft key light and a white rim of light on the hair.", "warm, theatrical."),
 cover("cover_05", "05_ai_vfx.html", "5부 AI와 VFX로 표정 바꾸기", "하루·시아·모아가 같은 걱정하는 자세를 하고, 큰 모니터에 얼굴의 눈·입만 주황으로 표시된 화면과 막대 그래프가 떠 있는 장면",
   "the lab control desk with a big monitor showing a simple face where only the eyes and mouth are highlighted in orange, and a second monitor with six horizontal slider bars.",
   [who("haru") + ", in the center, head slightly lowered, both hands near her chest", who("sia") + ", on the left in the same worried pose", who("moa") + ", on the right in the same worried pose", CH["bot"] + ", typing at the desk", CH["fly"] + ", hovering near the monitor adjusting a slider"],
   "three people, one shared mood.", "focused, gentle humor."),
 cover("cover_06", "06_failure_lab.html", "6부 실패 사례 실험실", "표정 그림 실패작이 쌓인 책상에서 초파리가 돋보기로 살펴보고, 주판봇이 머리를 긁고, 평가단이 원인 카드를 드는 장면",
   "a cluttered lab desk covered with drawings of faces with simple expressions (no text), a big magnifying glass and a checklist board with five blank rows.",
   [CH["fly"] + ", on the left facing right, examining one face drawing with a big magnifying glass", CH["bot"] + ", on the right facing left, scratching its antenna sheepishly", CH["judges"] + " at the back holding blank cards", who("doctor") + ", at the back center pointing at the top row of the checklist board"],
   "finding the first broken rule from big to small.", "funny, detective mood."),
 cover("cover_07", "practice/index.html", "7부 실전 연습장", "작은 무대·거울·조명·진단 책상 네 곳이 있는 연습장을 하루·시아·모아와 박사가 함께 운영하는 장면",
   "a bright lab hall with four stations: a small stage, a mirror table, a lighting booth and a desk with a magnifying glass.",
   [who("haru") + ", at the mirror table", who("sia") + ", on the small stage", who("moa") + ", in the lighting booth", who("doctor") + ", at the desk", CH["fly"] + ", flying between stations", CH["bot"] + ", rolling with a clipboard"],
   "four workshops forming one circle.", "busy, cheerful."),
]
C3 = [
 body("p1_haru_silhouette_moods", "01_body_mood.html", "1부 1단계", "하루가 같은 대사를 네 가지 자세(허리에 손·가슴 앞 두 손·팔짱·머리 뒤 깍지)로 말하는 그림, 각 자세 옆에 회색 실루엣이 함께 있는 비교 그림", "16:9",
   "Four full-body versions of " + who("haru") + " in a row, each with a flat gray silhouette of the same pose right beside it: 1) hands on her hips, leaning slightly forward, annoyed; 2) both hands held near the chest, head slightly lowered, worried; 3) arms crossed, standing straight, cool; 4) both hands behind her head, relaxed.",
   "The silhouettes alone must clearly read as four different moods. Light from the upper left."),
 body("p1_haru_head_neck_shoulder", "01_body_mood.html", "1부 2단계", "같은 미소의 하루 다섯 컷 — 정면, 고개 갸웃, 고개 듦과 어깨 올림, 고개 숙임, 한쪽 어깨를 크게 올리고 턱을 든 모습", "16:9",
   "Five upper-body portraits of " + who("haru") + " in a row, all with exactly the same gentle smile: 1) facing front, neutral posture; 2) head tilted to one side; 3) head tilted up and both shoulders raised, happy; 4) head lowered, shoulders dropped, quiet; 5) one shoulder raised high, chin lifted, head tilted, very happy.",
   "Only the head, neck and shoulder angles change; the facial expression stays the same. Light from the upper left."),
 body("p1_haru_light_heavy_walk", "01_body_mood.html", "1부 4단계", "왼쪽은 등을 펴고 크게 걷는 하루, 오른쪽은 등을 둥글게 하고 좁은 보폭으로 걷는 하루의 비교 그림", "16:9",
   "Two full-body side views of " + who("haru") + ": LEFT walking happily with a straight back, long stride, arms swinging widely, head up, a light bouncing step; RIGHT walking gloomily with a rounded back, short steps, feet barely lifted, arms hanging, head down.",
   "Light from the upper left."),
]
C4 = [
 body("p2_moa_brow_mouth_grid", "02_six_emotions.html", "2부 1단계", "모아의 얼굴 여섯 장을 눈썹 안쪽(내림·보통·올림)과 입꼬리(올림·내림)로 배치한 표정 시트", "16:9",
   "An expression sheet of " + who("moa") + ": six head-and-shoulder portraits in two rows and three columns. Top row (mouth corners raised): inner eyebrows pulled down (mischievous grin), relaxed eyebrows (bright smile), inner eyebrows raised (troubled smile). Bottom row (mouth corners lowered): inner eyebrows pulled down (angry), relaxed eyebrows (sulky), inner eyebrows raised (sad).",
   "Same face angle in all six. Light from the upper left."),
 body("p2_doctor_anger_steps", "02_six_emotions.html", "2부 2단계", "손님 모델 박사의 분노 세 단계 — 입을 다물고 참는 얼굴, 이를 악문 얼굴, 입을 크게 벌린 폭발 얼굴", "16:9",
   "Three head-and-shoulder portraits of " + who("doctor") + ": 1) suppressed anger — lips pressed into a frown, head slightly lowered, one small crease between the brows; 2) clenched teeth, deeper creases, glaring; 3) exploding — mouth wide open shouting, many creases, smaller pupils, left and right sides of the face asymmetric.",
   "Comic but not scary; no fists toward the viewer. Light from the upper left."),
 body("p2_moa_surprise_levels", "02_six_emotions.html", "2부 3단계", "모아가 조금·많이·아주 놀란 세 단계, 단계마다 눈동자는 작아지고 머리카락은 부풀고 손이 입을 가리는 동작이 커지는 그림", "16:9",
   "Three upper-body portraits of " + who("moa") + ": 1) slightly surprised — eyes a little wider, one hand lightly near her chin, hair normal; 2) quite surprised — both hands covering her mouth, pupils smaller, hair volume a little bigger; 3) extremely surprised — eyes wide open with very small pupils and lots of white, mouth open, hair puffed up, shoulders jumping.",
   "Light from the upper left."),
 body("p2_moa_ease_to_blank", "02_six_emotions.html", "2부 4단계", "왼쪽은 편안한 모아가 힘이 빠져 초점이 어긋난 밝은 멍함으로, 오른쪽은 슬픈 모아가 힘이 빠져 어깨가 처진 어두운 멍함으로 바뀌는 비교 그림", "16:9",
   "Two pairs of upper-body portraits of " + who("moa") + ". LEFT PAIR (bright side): relaxed gentle smile → absent-minded daydreaming, mouth slightly open, eyes unfocused looking at nothing. RIGHT PAIR (dark side): sad with drawn eyebrows → drained and empty, eyebrows slack, eyes dull without highlights, shoulders slack and uneven.",
   "Light from the upper left on the left pair; dim cool light on the right pair."),
]
C5 = [
 body("p3_sia_eye_angles", "03_eyes.html", "3부 1단계", "시아의 얼굴을 정면·비스듬히·옆·올려다보기·내려다보기 다섯 각도로 그리고, 각 눈 위에 얇은 네모 상자 안내선을 겹친 그림", "16:9",
   "Five head studies of " + who("sia") + " in clean lineart with light colors: front view, three-quarter view, profile, looking up from below, looking down from above. Thin teal rectangular guide boxes are drawn around each visible eye; the far eye is clearly narrower in the three-quarter view and hidden in the profile.",
   "Neutral expression. Light from the upper left."),
 body("p3_sia_eyelid_steps", "03_eyes.html", "3부 3단계", "시아의 눈이 뜬 눈에서 감기 시작·반쯤·반눈·감음으로 바뀌는 다섯 단계와, 조용히 감은 눈과 웃는 눈의 곡선 비교", "16:9",
   "Top row: five close-ups of the eyes of " + who("sia") + " closing step by step — open, starting to close, half closed, nearly closed, closed; the upper eyelid moves down and the lower eyelid rises slightly. Bottom row: two face portraits side by side — eyes closed calmly (closed-eye lines curving downward like a bowl) and eyes closed in a big smile (closed-eye lines arching upward).",
   "Light from the upper left."),
 body("p3_sia_eyes_by_mood", "03_eyes.html", "3부 4단계", "시아의 같은 얼굴 여섯 장 — 喜怒哀楽驚虚마다 눈꺼풀 곡선과 눈동자 크기가 다른 표정 시트", "16:9",
   "An expression sheet of " + who("sia") + ": six head-and-shoulder portraits — joyful (outer eye corners lowered, soft arcs), angry (eye corners raised, small pupils, whites visible), sad (heavy lids, gentle droopy curve), content (crisp confident lid line, clear contrast), surprised (wide bow-shaped lids, tiny pupils), blank (almost straight lids, flat dull irises).",
   "Same face angle in all six; the eyes carry most of the emotion. Light from the upper left."),
]
C6 = [
 body("p4_haru_light_directions", "04_light_mood.html", "4부 1단계", "같은 표정의 하루 얼굴 다섯 장 — 왼쪽 위·바로 위·바로 옆·바로 아래·바로 뒤에서 빛을 받은 비교", "16:9",
   "Five identical head-and-shoulder portraits of " + who("haru") + " with the same calm expression, each lit differently: 1) soft light from the upper left; 2) strong light from directly above with shadows under the eyes; 3) hard light from the side splitting the face in half; 4) strong light from directly below, eerie; 5) backlight from behind with a bright rim on the hair and a dark face.",
   "Dark gray studio background so the lighting is clear."),
 body("p4_doctor_two_lights", "04_light_mood.html", "4부 2단계", "손님 모델 박사의 상반신 — 왼쪽 위의 약한 빛과 바로 위의 강한 빛을 함께 받아 얼굴에 밝음·중간·어둠 세 톤이 생긴 그림", "2:3",
   "Upper-body portrait of " + who("doctor") + ", calm confident expression, lit by a strong key light from directly above and a weak fill light from the upper left, giving clear light, mid-tone and dark areas on the face and lab coat.",
   "Neutral gray background."),
 body("p4_haru_rim_light", "04_light_mood.html", "4부 3단계", "어두운 배경에서 역광을 받은 하루의 옆얼굴 — 얼굴은 고르게 어둡고 윤곽선을 따라 흰 테두리 빛, 뺨에 작은 빛이 있는 그림", "2:3",
   "Three-quarter back view of " + who("haru") + " looking over her shoulder toward the viewer with a quiet knowing smile, backlit: the face is evenly in shadow, a bright white rim light outlines her profile, hair buns and shoulders, a small soft highlight on her cheek from a reflector below.",
   "Dark navy background."),
 body("p4_haru_mood_touches", "04_light_mood.html", "4부 4단계", "하루의 얼굴 네 장 — 붉은 빗금의 기쁨, 얼굴 위 그늘의 분노, 세로선의 슬픔, 터치 없는 편안함", "16:9",
   "Four head-and-shoulder portraits of " + who("haru") + " in manga-style shading: 1) joyful with short red diagonal hatch lines on the cheeks; 2) angry with a dark shadow covering the upper face and eyes; 3) shocked and sad with thin blue vertical lines over the upper face; 4) relaxed and content with no extra marks.",
   "Light from the upper left."),
]
C7 = [
 body("p5_trio_same_emotion", "05_ai_vfx.html", "5부 1단계", "하루·시아·모아가 나란히 서서 같은 '걱정'을 연기하는 그림 — 셋 다 고개를 살짝 숙이고 가슴 앞에 두 손을 모은 모습", "16:9",
   "Three characters standing side by side, full body, all acting the same mood — worried: " + who("haru") + "; " + who("sia") + "; " + who("moa") + ". Each has her head slightly lowered, inner eyebrows raised, lips slightly pressed, both hands held in front of the chest; each keeps her own face and hairstyle.",
   "Soft light from the upper left with a faint shadow over the eyes."),
 body("p5_haru_face_inpaint", "05_ai_vfx.html", "5부 2단계", "하루의 원본 미소, 눈·눈썹과 입만 반투명 주황으로 가린 그림, 걱정하는 표정으로 바뀐 결과의 세 단계 비교", "16:9",
   "Three panels of the same upper-body portrait: 1) " + who("haru") + " with a bright smile; 2) the same image with only the eyes, eyebrows and mouth covered by semi-transparent orange patches with slightly soft edges, everything else clearly outside the patches; 3) the result: identical hair buns, navy streaks, face shape and outfit, but a worried expression (inner eyebrows raised, lips pressed).",
   "Hair, face shape and clothes must be identical in all three panels. No labels."),
 body("p5_moa_style_ladder", "05_ai_vfx.html", "5부 4단계", "같은 놀란 모아를 픽셀아트·애니풍·반실사·실사풍 네 화풍으로 나란히 그린 그림, 화풍이 사실적일수록 표정이 작아짐", "16:9",
   "Four upper-body portraits of " + who("moa") + ", all surprised, in four art styles from left to right: 1) 16-bit pixel art with a big exaggerated surprised face; 2) anime style, clearly surprised, hair slightly puffed; 3) semi-realistic 2.5D painting, moderately surprised; 4) photorealistic studio photo of a fictional adult model in her early twenties cosplaying Moa, subtly surprised (slightly widened eyes, lips parted), not resembling any real celebrity.",
   "Same pose and light from the upper left in all four."),
]
FAILNOTE = "This is an intentional FAILURE example for a teaching page: draw the mistake described below clearly and convincingly, while everything else stays correct."
def fail(file, alt, scene, mistake):
    p = f"Illustration, vertical 2:3.\n{ANI}\n{FAILNOTE}\n{scene}\nIntentional mistake: {mistake}\nPlain off-white studio background.\n{END}"
    return (file, "06_failure_lab.html", "6부 실패", alt, p, "anime")
C8 = [
 fail("f1_smile_stiff_body", "활짝 웃는 하루의 얼굴, 그런데 몸은 차렷 자세로 팔을 내리고 굳어 있는 그림", "Full body of " + who("haru") + ".", "her face shows a huge happy smile, but her body stands stiffly at attention: arms straight down at her sides, shoulders level, back rigid, head perfectly straight — the body says nothing about joy."),
 fail("f2_neck_over_twist", "몸과 어깨는 정면을 향했는데 얼굴만 완전한 옆을 보고 있어 목이 꺾여 보이는 시아", "Upper body of " + who("sia") + ".", "her chest and shoulders face the viewer directly, but her head is turned a full 90 degrees into a perfect side profile, so the neck looks unnaturally twisted."),
 fail("f3_anger_reads_sad", "화난 장면인데 눈썹 안쪽이 올라가 모여 슬프거나 곤란해 보이는 모아", "Upper body of " + who("moa") + ", supposed to be angry, fists clenched.", "the inner ends of her eyebrows are raised and drawn together (a sad, troubled brow shape) instead of pulled down, so the face reads as sad rather than angry."),
 fail("f4_surprise_big_pupils", "깜짝 놀란 장면인데 눈동자가 커지고 반짝여 감동한 것처럼 보이는 모아", "Upper body of " + who("moa") + ", supposed to be shocked, hands near her mouth.", "her eyes are wide but the pupils are HUGE and full of sparkles, so she looks moved and delighted instead of shocked."),
 fail("f5_smile_eyes_droop", "활짝 웃으며 눈을 감았는데 감은 눈 곡선이 아래로 처져 졸려 보이는 하루", "Upper body of " + who("haru") + ", laughing with her mouth open.", "her closed eyes are drawn as downward-curving bowl-shaped lines like a sleepy or calm face, instead of upward arcs, so the laugh looks sleepy."),
 fail("f6_sad_under_light", "슬픈 표정의 시아 얼굴에 바로 아래에서 강한 빛이 비쳐 섬뜩해 보이는 그림", "Upper body of " + who("sia") + ", with a sad expression, tears in her eyes.", "she is lit by a strong light from directly below her chin, casting upward shadows over her nose and eyes, so the sad scene looks eerie and frightening."),
 fail("f7_blank_with_smile", "무표정을 부탁했는데 은은한 미소와 반짝이는 눈이 들어간 시아", "Upper body of " + who("sia") + ", supposed to have a completely blank, expressionless face.", "she has a soft gentle smile and bright sparkling eyes, as if the default pleasant expression was added."),
 fail("f8_mask_changed_hair", "하루의 표정만 바꾸려 했는데 머리 번과 남색 줄이 사라지고 얼굴형도 달라진 결과", "Upper body portrait of a young adult woman with long pink hair, worried expression, wearing a lavender hoodie and an open white lab coat.", "this was supposed to be Haru with only her expression changed, but the result is a different person: no hair buns, no navy streaks, a different face shape and green eyes."),
]
CONV = [("C01_covers_A", "표지 A (픽셀아트, 16:9)", "16:9", "refs 전부", C1), ("C02_covers_B", "표지 B (픽셀아트, 16:9)", "16:9", "refs 전부 + C01에서 받은 cover_index", C2),
        ("C03_part1_body", "1부 기분은 몸에서", "16:9", "refs/haru_anime_base.png, refs/haru_sheet.png", C3), ("C04_part2_emotions", "2부 여섯 가지 기본 감정", "16:9", "refs/moa_anime_base.png, refs/moa_sheet.png, refs/doctor_sheet.png", C4),
        ("C05_part3_eyes", "3부 눈", "16:9", "refs/sia_anime_base.png, refs/sia_sheet.png", C5), ("C06_part4_light", "4부 빛과 그림자", "16:9·2:3", "refs/haru_anime_base.png, refs/doctor_sheet.png", C6),
        ("C07_part5_ai_vfx", "5부 AI와 VFX", "16:9", "refs/haru_anime_base.png, refs/sia_anime_base.png, refs/moa_anime_base.png", C7), ("C08_fail", "6부 실패 8종", "2:3", "해당 캐릭터의 refs/*_anime_base.png", C8)]
HEAD_PIX = "웹페이지 맨 위에 거는 표지 그림을 한 장씩 차례로 만들어 줘.\n- 비율 16:9, 가로 1920px 이상\n- 그림체는 반드시 16비트 RPG풍 픽셀아트 (네모 픽셀이 보이게, 매끈한 일러스트·벡터·수채화·3D 금지)\n- 첨부한 참고 이미지의 캐릭터를 같은 외형으로 그릴 것\n- 그림 안에 글자·숫자·로고 금지\n- 얼굴과 손은 가장자리에서 떨어진 가운데 영역에, 왼쪽 아래 구석은 밝고 단순하게\n아래 영어 프롬프트를 하나씩 써 줘."
HEAD_ANI = "해설 페이지 본문에 넣을 그림을 한 장씩 차례로 만들어 줘.\n- 비율은 각 프롬프트 첫 줄을 따를 것(16:9는 가로 1920px 이상, 2:3은 세로 1536px 이상)\n- 첨부한 참고 이미지의 캐릭터 외형(얼굴·머리·색·장식)을 똑같이 지킬 것\n- 등장인물은 모두 20대 성인(박사는 성인 남성). 노출·과장된 체형·교복 느낌 금지\n- 그림 안에 글자·숫자·로고·말풍선 금지, 유명 애니 캐릭터와 닮으면 다시 만들 것\n아래 영어 프롬프트를 하나씩 써 줘."
PROMPTS = {it[0]: it for _c in CONV for it in _c[4]}
CONV_OF = {it[0]: _c[0] for _c in CONV for it in _c[4]}
ATTACH_OF = {_c[0]: _c[3] for _c in CONV}

if __name__ == "__main__":
    os.makedirs(os.path.join(D, "prompts"), exist_ok=True)
    rows = []; n = 0
    for cid, title, ratio, att, items in CONV:
        pix = items[0][5] == "pixel"
        md = f"# {cid[:3]} · {title} — " + ", ".join(i[0] for i in items) + f"\n\n**첨부:** {att}\n\n**Genspark에 먼저 붙여 넣기 ↓**\n```\n{HEAD_PIX if pix else HEAD_ANI}\n```\n"
        for k, (file, page, part, alt, prompt, style) in enumerate(items):
            n += 1; rows.append([n, cid[:3], file, page, part, "16:9" if "16:9" in prompt.split("\n")[0] else "2:3", style, ""])
            md += f"\n---\n## {k+1}) {file} — {part}\nalt: {alt}\n```\n{prompt}\n```\n"
        if cid.startswith("C08"):
            md += "\n---\n**실패 그림 주의:** 도구가 실수를 자동으로 고쳐 버리면 두 번까지만 다시 시도해 주세요. 그래도 안 되면 그대로 주셔도 됩니다(페이지에서 '결과는 매번 달라진다'는 사례로 설명합니다).\n"
        open(os.path.join(D, "prompts", cid + ".md"), "w").write(md)
    with open(os.path.join(D, "checklist.csv"), "w", newline="") as f:
        w = csv.writer(f); w.writerow(["order", "conversation", "file", "page", "part", "ratio", "style", "status"]); w.writerows(rows)
    open(os.path.join(D, "README.md"), "w").write(f"""# 그림 요청 꾸러미 1 — 표지·본문·실패 그림 ({n}장)

## 요청 순서 (Genspark 대화 하나 = 파일 하나)
""" + "\n".join(f"{i+1}. `prompts/{c[0]}.md` — {c[1]} ({len(c[4])}장) · 첨부: {c[3]}" for i, c in enumerate(CONV)) + """

## 저장 이름
`checklist.csv`의 `file` 열 이름 그대로(png·jpg). 받은 그림은 `assets/img/{이름}.webp`로 넣고 `python3 build/build.py`, 표지는 `python3 build/make_og.py`까지 다시 돌립니다.

## 주의
- 표지 8장은 16비트 RPG풍 픽셀아트, 본문은 애니풍(5부 4단계만 네 화풍).
- 참고 그림은 `assets/refs/`(앞 시리즈에서 확정한 기준 전신·설정 시트)를 매번 첨부합니다.
- 실사풍은 캐릭터를 코스프레한 가상의 성인 모델입니다. 실존 인물과 닮으면 다시 만듭니다.
""")
    print("prompts", len(CONV), "images", n)
