# -*- coding: utf-8 -*-
"""본문 '숫자로 한 번 해 보기'와 평가 점수 검산. python3 build/check_numbers.py"""
import math, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from content_a import P1, P2, P3
from content_b import P4, P5, P6
ok = True
def chk(name, got, want, tol=0.01):
    global ok
    good = abs(got - want) <= tol
    ok &= good
    print(("OK " if good else "XX "), name, round(got, 4), "기대", want)
cos = lambda d: math.cos(math.radians(d))
# 1부
chk("1-3 목 한계", 0 + min(90, 70), 70); chk("1-3 옆얼굴", 30 + 60, 90); chk("1-3 100도", 70 + 30, 100)
chk("1-4 +1", 160 * (0.35 + 0.15), 80); chk("1-4 0", 160 * 0.35, 56); chk("1-4 -1", 160 * (0.35 - 0.15), 32)
# 2부
chk("2-3 0.7", 1 - 0.7**2, 0.51); chk("2-3 0.5", 1 - 0.5**2, 0.75); chk("2-3 0.35", 1 - 0.35**2, 0.8775, 0.0001)
r70 = 0.7 - 0.35 * 0.7; chk("2-3 놀람70 r", r70, 0.455, 0.0001); chk("2-3 놀람70 흰자", 1 - r70**2, 0.79, 0.005)
chk("2-2 주름30", round(0.3 * 5 + 1e-9), 2); chk("2-2 주름80", round(0.8 * 5), 4)
# 3부
chk("3-1 정면", cos(30), 0.87, 0.005); chk("3-1 30도 먼눈", cos(60), 0.5); chk("3-1 60도 먼눈", cos(90), 0)
chk("3-2 30도", cos(30), 0.87, 0.005); chk("3-2 48도", cos(48), 0.67, 0.005); chk("3-3 아랫눈꺼풀50", 0.5 * 15, 7.5)
# 4부
chk("4-1 0도", cos(0), 1); chk("4-1 60도", cos(60), 0.5); chk("4-1 90도", max(0, cos(90)), 0)
# 5부
T = 512 * 768; chk("5-2 전체", T, 393216)
chk("5-2 입", 80 * 50 / T, 0.010, 0.0005); chk("5-2 눈", 160 * 60 / T, 0.024, 0.0005); chk("5-2 얼굴", 200 * 240 / T, 0.122, 0.0005); chk("5-2 머리", 300 * 380 / T, 0.290, 0.0005)
chk("5-2 눈+입", (4000 + 9600) / T, 0.035, 0.0005)
chk("5-3 a", 10 * 0.6, 6); chk("5-3 b", 10 * 0.6 - 8 * 0.5, 2); chk("5-3 c", -8 * 1, -8)
chk("5-4 픽셀", min(1, 0.7 * 1.6), 1); chk("5-4 애니", 0.7 * 1.3, 0.91); chk("5-4 반실사", 0.7 * 1.0, 0.7); chk("5-4 실사", 0.7 * 0.7, 0.49)
for P in (P1, P2, P3, P4, P5, P6):
    J = P["judge"]; print("   ", P["no"], "부 평가", sum(J["a"][1]), ":", sum(J["b"][1]), J["result"][0][2][:16])
print("전체 통과" if ok else "검산 실패"); sys.exit(0 if ok else 1)
