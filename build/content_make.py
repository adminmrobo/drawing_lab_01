# -*- coding: utf-8 -*-
"""부마다 '프롬프트로 직접 만들어 보기' 실습. A 프롬프트는 make_requests.py(이 페이지 그림을 실제로 만든 프롬프트)에서 가져온다.
B 결과 그림이 아직 없으므로 res(실제 결과)는 그림이 들어온 뒤 채운다."""

def T(key, title, goal, b_title, b_text, check, tip=None, img=None, b_imgs=None, res=None):
    return dict(key=key, title=title, goal=goal, b_title=b_title, b_text=b_text, check=check, tip=tip, img=img or key, b_imgs=[key + "_b"] if b_imgs is None else b_imgs, res=res)

WAIT = "실제 결과: B 그림이 들어오면 A와 나란히 보고 무엇이 달라졌는지(또는 달라지지 않았는지) 여기에 적습니다. 지금은 위 확인표로 직접 비교해 보세요."

MAKE = {
1: [
 T("p1_haru_silhouette_moods", "자세 네 가지와 실루엣", "얼굴을 지워도 자세만으로 기분이 읽히는지 실제 그림으로 확인합니다.",
   "B — 원리 빼기: 팔을 모두 내리기", "Same image, same layout. Change only: in all four poses, both arms hang straight down at her sides; only the facial expressions differ. Keep the gray silhouettes next to each pose. Still no text.",
   [("A의 실루엣 네 개가 서로 다른 기분으로 읽히나", "#s1"), ("B의 실루엣 네 개가 거의 같아 보이나(기분이 사라졌나)", "#s1"), ("얼굴의 머리 번·남색 줄이 네 컷 모두 같은가", None)], res='실제 결과: A는 허리에 손·가슴 앞 두 손·팔짱·머리 뒤 깍지가 실루엣만으로도 네 가지로 갈렸습니다. B는 팔을 모두 내리자 회색 실루엣 네 개가 거의 똑같아졌고, 기분 차이는 작은 얼굴 표정에만 남았습니다. 원리를 뺀 효과가 가장 또렷하게 나온 실습입니다.'),
 T("p1_haru_light_heavy_walk", "가벼운 걸음과 무거운 걸음", "보폭·등·팔의 차이가 기분을 전하는지 봅니다.",
   "B — 원리 빼기: 같은 걸음, 다른 얼굴", "Same image. Change only: both figures walk with exactly the same posture and stride (straight back, medium steps); only the faces show happy and gloomy. Keep the same framing.",
   [("A의 보폭이 왼쪽이 오른쪽보다 확실히 큰가", "#s4"), ("A 오른쪽은 등이 둥글고 발이 잘 안 들리나", "#s4"), ("B에서 표정만으로는 기분 차이가 약해지는지 비교", None)], res="실제 결과: B는 A와 거의 달라지지 않았습니다. 오른쪽 하루는 여전히 등을 굽히고 좁은 보폭으로 걷습니다. 도구가 '슬픈 걸음'의 자세를 그대로 유지한 경우로, 같은 대화에서 차이가 약하면 새 대화에서 B 문장만으로 처음부터 만들어 보세요."),
],
2: [
 T("p2_moa_brow_mouth_grid", "눈썹과 입의 표정 시트", "눈썹 안쪽과 입꼬리 두 축으로 여섯 표정이 나뉘는지 실제 그림으로 봅니다.",
   "B — 원리 빼기: 눈썹을 모두 같게", "Same image, same layout. Change only: keep the eyebrows exactly the same relaxed shape in all six portraits; only the mouths change. Still no text.",
   [("A 위 줄 오른쪽이 '곤란한 웃음'으로 읽히나", "#s1"), ("A 아래 줄 왼쪽은 화남, 오른쪽은 슬픔으로 갈리나", "#s1"), ("B에서 여섯 감정이 두세 가지로 뭉치는지 비교", None)], res="실제 결과: A는 위 줄(씩 웃음·밝은 웃음·곤란한 웃음)과 아래 줄(화남·뾰로통·슬픔)이 눈썹으로 갈렸습니다. B는 눈썹을 모두 같게 하라고 했지만 눈썹 차이가 조금 줄었을 뿐 완전히 같아지지 않았고, 여섯 장의 차이도 약간 흐려진 정도입니다. 도구는 '감정 낱말'에 맞춰 눈썹을 다시 움직이는 버릇이 있습니다."),
 T("p2_moa_surprise_levels", "놀람 세 단계", "놀람이 커질수록 눈동자는 작아지고 머리카락은 부푸는지 봅니다.",
   "B — 원리 거꾸로: 눈동자 키우기", "Same image. Change only: in all three panels make the pupils LARGER and sparkling as the surprise grows. Keep everything else the same.",
   [("A 3단계의 흰자가 1단계보다 확실히 많은가", "#s3"), ("A의 머리카락 부피와 손 동작이 단계마다 커지나", "#s3"), ("B가 놀람보다 감동·기쁨으로 읽히는지 비교", "06_failure_lab.html#f4_surp")], res='실제 결과: A는 3단계에서 눈동자가 작아지고 흰자가 늘며 머리카락이 부풀었습니다. B는 눈동자가 커지고 반짝임이 들어가, 3단계가 놀람보다 들뜬 기쁨에 가깝게 보입니다. 눈동자 크기 하나로 감정이 바뀌는 것이 확인됩니다.'),
],
3: [
 T("p3_sia_eye_angles", "각도별 눈과 눈 상자", "비스듬한 얼굴에서 먼 눈이 좁아지는지 실제 그림으로 봅니다.",
   "B — 원리 빼기: 두 눈을 같은 폭으로", "Same image. Change only: in the three-quarter view draw both eyes exactly the same width, as if the face were flat. Keep the teal guide boxes.",
   [("A 3/4 얼굴에서 먼 눈 상자가 가까운 눈의 절반쯤인가", "#s1"), ("A 올려다보기·내려다보기에서 눈을 잇는 선이 반대로 휘나", "#s1"), ("B 얼굴이 평평한 가면처럼 보이는지 비교", None)], res="실제 결과: 차이가 약합니다. B에서도 도구가 3/4 얼굴의 먼 눈을 자연스럽게 좁혀 그렸습니다. 애니풍 학습이 '먼 눈은 좁다'를 이미 알고 있다는 뜻이므로, 이 원리는 손 그림과 3D에서 더 중요합니다."),
 T("p3_sia_eyelid_steps", "눈꺼풀 다섯 단계", "아랫눈꺼풀도 조금 올라오는지, 감은 눈 곡선이 기분을 가르는지 봅니다.",
   "B — 원리 거꾸로: 감은 눈 곡선 뒤집기", "Same image. Change only: in the bottom row, draw the smiling closed eyes as downward bowl-shaped lines and the calm closed eyes as upward arcs. Keep everything else the same.",
   [("A 위 줄에서 반눈일 때 아랫눈꺼풀도 올라왔나", "#s3"), ("A 아래 줄: 조용히 감은 눈 ‿, 웃는 눈 ⌒인가", "#s3"), ("B에서 웃는 얼굴이 졸려 보이는지 비교", "06_failure_lab.html#f5_smil")], res='실제 결과: A의 위 줄은 눈 클로즈업이 아니라 전신으로 나와 눈꺼풀 단계가 작게 보입니다(실험 3-3에서 확인하세요). 아래 줄은 조용히 감은 눈과 웃는 눈이 구분됩니다. B에서 감은 눈 곡선을 뒤집으라고 했지만 눈에 띄는 변화가 없었습니다.'),
],
4: [
 T("p4_haru_light_directions", "빛 방향 다섯 가지", "같은 표정이 빛의 방향만으로 다르게 읽히는지 봅니다.",
   "B — 원리 빼기: 모두 같은 빛", "Same image, same layout. Change only: light all five portraits the same way, with soft light from the upper left. Keep everything else the same.",
   [("A 네 번째(아래 빛)가 섬뜩하게 보이나", "#s1"), ("A 다섯 번째(역광)에 머리 테두리 빛이 있나", "#s3"), ("B에서 다섯 장의 분위기 차이가 사라지는지 비교", None)], res='실제 결과: A는 왼쪽 위·바로 위·옆·아래·역광이 뚜렷하게 달라, 넷째는 그늘진 눈이 섬뜩하고 다섯째는 머리 테두리만 밝습니다. B는 다섯 장이 모두 같은 밝기의 얼굴이 되어 분위기 차이가 사라졌습니다.'),
 T("p4_haru_mood_touches", "기분 터치 네 가지", "붉은 빗금·얼굴 그늘·세로선이 감정과 짝을 이루는지 봅니다.",
   "B — 원리 거꾸로: 터치 바꿔 넣기", "Same image. Change only: put the blue vertical lines on the joyful face and the red cheek hatching on the sad face. Keep the expressions the same.",
   [("A 기쁨에는 볼의 붉은 빗금만 있나", "#s4"), ("A 슬픔의 세로선이 얼굴 위쪽에만 있나", "#s4"), ("B에서 기쁨이 창백하게, 슬픔이 들떠 보이는지 비교", None)], res='실제 결과: A는 기쁨(볼 홍조)·분노(눈 위 그늘)·슬픔(파란 세로선)·편안(터치 없음)으로 나왔습니다. 다만 기쁨의 붉은 빗금은 빗금보다 둥근 홍조에 가깝습니다. B에서는 기쁜 얼굴에 세로선이 들어가 웃는데 질린 얼굴이 되었고, 화난 얼굴에 붉은 홍조가 생겼습니다. 슬픈 얼굴은 세로선이 그대로 남았습니다.'),
],
5: [
 T("p5_trio_same_emotion", "세 사람의 같은 '걱정'", "여섯 조각 표정 문장으로 세 사람이 같은 기분을 연기하는지 봅니다.",
   "B — 원리 빼기: 감정 낱말 하나만(새 대화, 첨부 없이)", "Three young adult women named Haru, Sia and Moa standing side by side, worried. Anime style. No text.",
   [("A 셋 다 고개를 숙이고 가슴 앞에 손을 모았나", "#s1"), ("A 셋이 각자의 머리 모양(번·흑발·리본)을 지켰나", "#s1"), ("B에서 자세가 차렷에 가깝고 얼굴이 서로 닮아지는지 비교", None)],
   tip="B는 일부러 참고 그림 없이, 새 대화에서 만듭니다. 원리를 뺐을 때 무엇이 사라지는지 보기 위해서입니다.", res='실제 결과: A는 세 사람이 각자의 머리 모양(번·흑발·리본)을 지키며 가슴 앞에 손을 모은 걱정 자세를 했습니다. B(첨부 없이 감정 낱말만)는 하루·시아·모아와 전혀 다른 세 사람이 어두운 거리 배경에 나왔고, 자세도 제각각이었습니다. 참고 그림과 여섯 조각 문장이 무엇을 지켜 주는지 한눈에 보입니다.'),
 T("p5_haru_face_inpaint", "얼굴만 다시 그리기", "눈·눈썹과 입만 가려 표정을 바꿀 때 나머지가 그대로 남는지 봅니다.",
   "B — 원리 빼기: 머리까지 넓게 가리기(부분 수정 기능에서)", "Paint the mask over the whole head including the hair buns and the bangs. Instruction: make her look worried.",
   [("A 세 번째 그림에서 머리 번·남색 줄·옷이 그대로인가", "#s2"), ("A 표정만 걱정으로 바뀌었나", "#s2"), ("B에서 머리 모양이나 얼굴형이 바뀌는지 비교", "06_failure_lab.html#f8_mask")],
   tip="옷장 편과 같이, 부분 수정은 그림 생성이 아니라 도구의 '부분 수정(영역 칠하기)' 기능으로 합니다.", b_imgs=["f8_mask_changed_hair"], res='실제 결과: B는 부분 수정 기능으로 따로 만들지 않고, 같은 실수를 일부러 만든 6부 f8 그림으로 대신 보여 줍니다. 오른쪽 그림처럼 머리까지 가려 표정을 바꾸면 머리 번과 남색 줄이 사라지고 눈 색과 얼굴형까지 바뀌어 다른 사람이 됩니다. A는 눈·눈썹과 입만 가려 머리 번·남색 줄·옷이 그대로 남았습니다. 직접 부분 수정 기능으로 해 보면 결과는 매번 다르니 f8과 비교해 보세요.'),
],
6: [
 T("f3_anger_reads_sad", "f3 고치기 — 눈썹 방향", "실패 그림 f3에 고치는 조각 한 줄만 더해 화난 얼굴로 바뀌는지 봅니다.",
   "B — 고치는 조각 한 줄", "Same image. Change only: inner eyebrows pulled DOWN with a crease between the brows, lips pressed into a frown. Keep everything else the same.",
   [("눈썹 안쪽이 내려가 화남으로 읽히나", "02_six_emotions.html#s1"), ("다른 곳(머리띠·왼쪽 리본·옷)은 그대로인가", None), ("한 줄만 바꿔도 감정이 바뀌는지 확인", "#s1")], b_imgs=["f3_fixed"], res='실제 결과: B는 거의 달라지지 않았습니다. 고치는 한 줄을 붙였지만 눈썹 안쪽은 여전히 올라가 곤란한 얼굴입니다. 같은 대화에서는 처음 그림의 인상이 강하게 남으므로, 이럴 때는 새 대화에서 고친 문장으로 처음부터 만들거나 5부 2단계처럼 눈썹만 가려 다시 그립니다.'),
 T("f6_sad_under_light", "f6 고치기 — 빛 방향", "실패 그림 f6의 빛만 바꿔 슬픔이 제대로 읽히는지 봅니다.",
   "B — 고치는 조각 한 줄", "Same image. Change only: remove the light from below; light her with soft cool light from above, pale bluish tone on the upper face. Keep the expression the same.",
   [("섬뜩함이 사라지고 슬픔으로 읽히나", "04_light_mood.html#s1"), ("표정과 옷은 그대로인가", None), ("빛만으로 기분이 바뀌는지 확인", "#s1")], b_imgs=["f6_fixed"], res='실제 결과: B는 아래 빛이 사라지고 차가운 푸른 빛으로 바뀌어, 섬뜩함이 줄고 조용한 슬픔으로 읽힙니다. 표정과 옷은 그대로 남았습니다. 빛만 바꿔도 기분이 바뀐다는 4부 1단계를 확인한 결과입니다.'),
],
}
