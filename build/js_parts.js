
/* ===================== 1부 · 기분은 몸에서 먼저 보인다 ===================== */
function wrapT(t,n){var out=[],line='';t.split(' ').forEach(function(w){if((line+' '+w).trim().length>n&&line){out.push(line);line=w;}else line=(line+' '+w).trim();});if(line)out.push(line);return out;}
var POSE1={hips:{arms:'hips',lean:4,roll:0,pitch:0.1,sUp:0.2},cross:{arms:'cross',lean:0,roll:0,pitch:0,sUp:0},chest:{arms:'chest',lean:6,roll:6,pitch:-0.5,sUp:0.3},back:{arms:'back',lean:0,roll:10,pitch:0,sUp:0},
  headback:{arms:'headback',lean:-4,roll:6,pitch:0.4,sUp:0},chin:{arms:'chin',lean:6,roll:8,pitch:-0.3,sUp:0},up:{arms:'up',lean:0,roll:-6,pitch:0.6,sUp:0.8},fists:{arms:'fists',lean:8,roll:0,pitch:-0.4,sUp:0.7}};
var FACE1={blame:{brow:-0.7,mouth:-0.4,open:0.35},cold:{brow:-0.2,mouth:-0.1,eye:0.8},grumble:{brow:-0.5,mouth:-0.3},worry:{brow:0.8,mouth:-0.2,sweat:1},joy:{brow:0.1,mouth:0.9,open:0.6,closed:'smile'},ponder:{brow:0.4,mouth:-0.1,gx:0.6,gy:-0.4},
  calm:{brow:0.1,mouth:0.15},relax:{brow:0.1,mouth:0.3,open:0.3,eye:0.8},anger:{brow:-0.9,mouth:-0.6,wrinkle:2},tense:{brow:-0.3,mouth:-0.2},sad:{},curious:{brow:0.3,mouth:0.1,eye:1.1},down:{brow:0.5,mouth:-0.3},bright:{mouth:0.5},neutral:{}};
P.p1_sil=function(h){var c=ctl(h),pose='hips',chk=c.querySelector('input[type=checkbox]'),W=540,H=380;seg(h,'button',function(b){pose=b.dataset.a;draw();});chk.addEventListener('change',draw);
  function draw(){var o=POSE1[pose],m=moodFromPose(o);var s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    var fo={};for(var k in o)fo[k]=o[k];fo.sil=chk.checked;fo.face=FACE1[m.k]||{};fo.who='haru';figure(s,170,370,122,fo);
    ktxt(s,330,60,chk.checked?'얼굴이 안 보이는 실루엣':'얼굴까지 그린 그림',{size:13,fill:C.muted});ktxt(s,330,95,'팔: '+ARMNAME[o.arms],{size:15,fill:C.ink,weight:700});
    ktxt(s,330,125,'몸 기울기 '+o.lean+'° · 고개 '+o.roll+'°',{size:13,fill:C.ink});ktxt(s,330,175,'읽히는 기분',{size:13,fill:C.muted});ktxt(s,330,205,m.name,{size:22,fill:C.teal,weight:700});
    out(h).innerHTML='<b>'+ARMNAME[o.arms]+'</b> → 읽히는 기분: <b>'+m.name+'</b>. 근거: '+m.why.join(' / ')+'. '+(chk.checked?'실루엣만으로도 기분이 읽힙니다. 체크를 풀어 얼굴을 확인해 보세요.':'얼굴은 자세가 정한 기분을 거들 뿐입니다.');}
  draw();};

P.p1_tilt=function(h){var ins=ctl(h).querySelectorAll('input'),W=540,H=400;ins.forEach(function(i){onIn(i,draw);});
  function draw(){var roll=+ins[0].value,pitch=+ins[1].value/10,st=+ins[2].value,su=+ins[3].value/10;var s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    var F=figure(s,170,392,128,{arms:'side',roll:roll,pitch:pitch,sTilt:st,sUp:su,who:'haru',face:{mouth:0.1}});
    // 얼굴 정중선
    var hc=F.head,a=rad(roll);el('line',{x1:hc[0]+Math.sin(a)*80,y1:hc[1]-Math.cos(a)*80,x2:hc[0]-Math.sin(a)*70,y2:hc[1]+Math.cos(a)*70,stroke:C.purple,'stroke-width':2.4,'stroke-dasharray':'6 4'},s);
    el('line',{x1:F.neck[0],y1:F.neck[1],x2:hc[0],y2:hc[1]+40,stroke:C.teal,'stroke-width':3},s);
    var diff=Math.abs(roll-(-st));var mood=pitch>=0.4?'밝은 쪽':pitch<=-0.4?'어두운·조용한 쪽':'중간';
    ktxt(s,350,60,'얼굴 정중선 '+roll+'°',{size:14,fill:C.purple,weight:700});ktxt(s,350,88,'어깨선 '+st+'°',{size:14,fill:C.orange,weight:700});ktxt(s,350,116,'고개 '+(pitch>0?'들기 ':pitch<0?'숙이기 ':'정면 ')+f2(Math.abs(pitch),1),{size:14,fill:C.teal,weight:700});
    ktxt(s,350,160,'두 선의 엇갈림 '+diff+'°',{size:13,fill:C.ink});ktxt(s,350,186,diff>=15?'→ 움직임·감정이 큼':'→ 차분함',{size:13,fill:C.ink});ktxt(s,350,230,'기분 방향: '+mood,{size:15,fill:C.ink,weight:700});
    out(h).innerHTML='얼굴 정중선 '+roll+'°, 어깨선 '+st+'° → 두 선의 엇갈림 = |'+roll+' + ('+st+')| = '+diff+'° (두 각을 서로 반대 방향으로 재므로 더합니다. 15° 이상이면 움직임이 커 보인다고 둔 예시 기준). 고개는 '+(pitch>0?'위로':'아래로')+' '+f2(Math.abs(pitch),1)+' → <b>'+mood+'</b>'+(su>=0.6?', 어깨를 올려 기분을 키웠습니다':'')+'. 얼굴 표정은 그대로인데 기분이 바뀌어 보이면, 머리·목·어깨가 일을 한 것입니다.';}
  draw();};

P.p1_neck=function(h){var ins=ctl(h).querySelectorAll('input'),W=540,H=320,LIM=70;ins.forEach(function(i){onIn(i,draw);});
  function draw(){var body=+ins[0].value,want=+ins[1].value,pitch=+ins[2].value;var neck=clamp(want,-LIM,LIM),faceDir=body+neck,extra=want-neck;var down=Math.max(pitch,-45),bend=pitch<-45?(-45-pitch):0;
    var s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);ktxt(s,20,24,'위에서 본 모습',{size:12.5,fill:C.muted});
    var cx=140,cy=170;el('circle',{cx:cx,cy:cy,r:118,fill:'none',stroke:C.grid},s);
    var b=rad(body);el('ellipse',{cx:cx,cy:cy,rx:80,ry:28,fill:'#A99AC8',stroke:INK,'stroke-width':1.6,transform:'rotate('+body+' '+cx+' '+cy+')'},s);
    arrow(s,cx,cy,cx+Math.sin(b)*100,cy-Math.cos(b)*100,C.orange,3);var f=rad(faceDir);el('circle',{cx:cx,cy:cy,r:30,fill:SKIN,stroke:INK,'stroke-width':1.6},s);arrow(s,cx,cy,cx+Math.sin(f)*80,cy-Math.cos(f)*80,C.teal,3.2);
    [-1,1].forEach(function(d){var a=rad(body+d*LIM);el('line',{x1:cx,y1:cy,x2:cx+Math.sin(a)*116,y2:cy-Math.cos(a)*116,stroke:C.red,'stroke-width':1.4,'stroke-dasharray':'4 4'},s);});
    ktxt(s,cx,312,'주황 = 몸 방향 · 청록 = 얼굴 방향 · 빨간 점선 = 목의 한계',{size:11.5,anchor:'middle'});
    ktxt(s,300,24,'옆에서 본 고개',{size:12.5,fill:C.muted});var hx=400,hy=170,p=rad(down);el('line',{x1:hx,y1:hy+80,x2:hx,y2:hy+20,stroke:SKIN,'stroke-width':16},s);
    el('ellipse',{cx:hx,cy:hy,rx:40,ry:46,fill:SKIN,stroke:INK,'stroke-width':1.6,transform:'rotate('+(-down)+' '+hx+' '+(hy+30)+')'},s);arrow(s,hx,hy,hx+Math.cos(p)*90,hy-Math.sin(p)*90,C.teal,3);
    if(bend)arrow(s,hx-30,hy+110,hx+20,hy+140,C.red,3);ktxt(s,hx,hy+170,bend?'고개만으로 안 돼서 몸을 '+bend+'° 숙임':pitch<-30?'입이 겨우 보일 만큼 숙임':pitch>30?'턱 아래가 보임':'',{size:12.5,anchor:'middle',fill:bend?C.red:C.ink});
    out(h).innerHTML='얼굴 방향 = 몸 '+body+'° + 목 '+neck+'° = <b>'+faceDir+'°</b>'+(extra?' — 목은 '+LIM+'°까지만 돌아가서 요청한 '+want+'° 중 '+Math.abs(extra)+'°가 모자랍니다. 몸을 더 돌리세요.':'')+(Math.abs(faceDir)>=85?' 옆얼굴이 됐습니다.':'')+' 고개 '+(pitch>=0?'들기 ':'숙이기 ')+Math.abs(down)+'°'+(bend?', 몸까지 '+bend+'° 숙였습니다':'')+'.';}
  draw();};

P.p1_walk=function(h){var ins=ctl(h).querySelectorAll('input'),W=540,H=330,t=0,raf;ins.forEach(function(i){onIn(i,function(){if(RM)draw();});});
  function draw(){var m=+ins[0].value/10,tn=+ins[1].value/10,height=160,ratio=0.35+0.15*m,stride=height*ratio;var s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    var u=110,gx=200,gy=270,ph=Math.sin(t),sw=ph*(0.25+0.35*(m+1)/2)*(1-tn*0.6),lean=(m<0?-m*18:0)+tn*4-(m>0?m*4:0),lr=rad(lean),hipY=gy-u*0.95+Math.abs(Math.cos(t))*(m>0?m*8:0)*-1;
    var nk=[gx+Math.sin(lr)*u*0.9,hipY-Math.cos(lr)*u*0.9];
    [-1,1].forEach(function(d){var a=d*sw*0.9*(0.6+ratio);el('path',{d:'M'+gx+','+hipY+' L'+(gx+Math.sin(a)*u*0.5)+','+(hipY+u*0.48)+' L'+(gx+Math.sin(a)*u*0.95+(m<0?-4:0))+','+(gy-(d*ph>0&&m<0?0:d*ph>0?m*10:0)),fill:'none',stroke:'#5b7fb8','stroke-width':16,'stroke-linecap':'round'},s);});
    el('path',{d:'M'+gx+','+hipY+' Q'+(gx+Math.sin(lr)*u*0.6+(m<0?-m*16:0))+','+(hipY-u*0.5)+' '+nk[0]+','+nk[1],fill:'none',stroke:'#A99AC8','stroke-width':30,'stroke-linecap':'round'},s);
    [-1,1].forEach(function(d){var a=-d*sw*1.1;var sh=[nk[0],nk[1]+10-tn*8];var hand=tn>0.5?[sh[0]+6,sh[1]+u*0.55]:[sh[0]+Math.sin(a)*u*0.6,sh[1]+Math.cos(a)*u*0.6];el('path',{d:'M'+sh+' L'+hand,fill:'none',stroke:SKIN,'stroke-width':11,'stroke-linecap':'round'},s);if(tn>0.5)el('circle',{cx:hand[0],cy:hand[1],r:8,fill:SKIN,stroke:INK,'stroke-width':1.4},s);});
    var hp=m*0.6;faceS(s,nk[0]+Math.sin(lr)*30+8,nk[1]-34+(hp<0?-hp*8:0),24,{who:'haru',mouth:m*0.8,brow:m<0?-m*0.7:tn>0.5?-0.5:0,open:m>0.5?0.4:0,closed:m>0.7?'smile':'',gy:-hp*0.8,roll:lean*0.5});
    el('line',{x1:20,y1:gy+12,x2:W-20,y2:gy+12,stroke:C.grid,'stroke-width':2},s);var px=60;for(var i=0;i<4;i++){el('ellipse',{cx:px+i*stride*1.6,cy:gy+30,rx:12,ry:5,fill:C.teal,opacity:0.7},s);if(i<3)ktxt(s,px+i*stride*1.6+stride*0.8,gy+52,f2(stride,0),{size:11.5,anchor:'middle'});}
    ktxt(s,W-20,30,'보폭 '+f2(stride,0)+'cm (키 160cm의 '+f2(ratio*100,0)+'%)',{size:13,anchor:'end',fill:C.ink,weight:700});
    out(h).innerHTML='기분 '+(m>0?'+':'')+f2(m,1)+' → 보폭 = 160 × (0.35 + 0.15 × '+f2(m,1)+') = <b>'+f2(stride,0)+'cm</b>. '+(m>0.3?'등을 펴고 팔을 크게 흔듭니다(가벼운 걸음).':m<-0.3?'등이 둥글고 발이 잘 안 들립니다(무거운 걸음).':'중간 걸음입니다.')+(tn>0.5?' 긴장이 높아 주먹을 쥐고 어깨가 굳었습니다. 심호흡하면 손이 풀립니다.':'');}
  function loop(){t+=0.08;draw();raf=requestAnimationFrame(loop);}if(RM)draw();else loop();};

/* ===================== 2부 · 여섯 가지 기본 감정 ===================== */
function axesLabel(b,m){if(m>0.3&&b<0.4)return '밝은 웃음(喜·楽)';if(m>0.3)return '곤란한 웃음 — 웃는데 마음은 복잡';if(m<-0.3&&b>=0.4)return '哀 슬픔·괴로움';if(m<-0.3&&b<=-0.4)return '怒 화남';if(b<=-0.4)return '짜증·결심(입을 다문 집중)';if(b>=0.4)return '걱정·불안';return '무표정에 가까움';}
P.p2_axes=function(h){var ins=ctl(h).querySelectorAll('input'),W=540,H=330;ins.forEach(function(i){onIn(i,draw);});
  function draw(){var b=+ins[0].value/10,m=+ins[1].value/10;var s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    faceS(s,140,170,95,{who:'moa',brow:b,mouth:m,open:m>0.6?0.4:0,closed:m>0.85&&b<0.3?'smile':'',blush:m>0.5});
    var gx=300,gy=40,gw=220;el('rect',{x:gx,y:gy,width:gw,height:gw,fill:'#fff',stroke:'#d5dbe2'},s);el('line',{x1:gx+gw/2,y1:gy,x2:gx+gw/2,y2:gy+gw,stroke:C.grid},s);el('line',{x1:gx,y1:gy+gw/2,x2:gx+gw,y2:gy+gw/2,stroke:C.grid},s);
    [['喜·楽',gx+gw*0.28,gy+30],['곤란한 웃음',gx+gw*0.75,gy+30],['怒',gx+gw*0.22,gy+gw-18],['哀',gx+gw*0.8,gy+gw-18],['걱정',gx+gw*0.85,gy+gw/2-8],['짜증',gx+gw*0.14,gy+gw/2-8]].forEach(function(q){ktxt(s,q[1],q[2],q[0],{size:12,anchor:'middle',fill:C.muted});});
    ktxt(s,gx+gw/2,gy+gw+18,'← 눈썹 안쪽 내려감 · 올라감 →',{size:11.5,anchor:'middle'});ktxt(s,gx-6,gy+10,'입꼬리 ↑',{size:11.5,anchor:'end'});ktxt(s,gx-6,gy+gw,'↓',{size:11.5,anchor:'end'});
    el('circle',{cx:gx+gw/2+b*gw/2,cy:gy+gw/2-m*gw/2,r:9,fill:C.orange,stroke:'#fff','stroke-width':2.5},s);
    out(h).innerHTML='눈썹 안쪽 '+num(b,1)+', 입꼬리 '+num(m,1)+' → <b>'+axesLabel(b,m)+'</b>. 눈썹과 입, 두 곳만으로도 여섯 감정의 큰 방향이 갈립니다. 같은 웃는 입이라도 눈썹을 찌푸리면 복잡한 웃음이 됩니다.';}
  draw();};

P.p2_anger=function(h){var inp=ctl(h).querySelector('input'),W=540,H=320;onIn(inp,draw);
  function draw(){var a=+inp.value/100,boil=a>=0.5,wr=Math.round(a*5),asy=a>0.6?(a-0.6)/0.4:0;var s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    faceS(s,150,170,100,{who:'doctor',brow:-0.3-0.7*a,mouth:boil?-0.3:-0.4-0.4*a,open:boil?(a-0.5)/0.5*0.9:0,wrinkle:wr,asym:asy,pupil:1-0.45*a,gy:boil?0:0.25,shade:a>0.8?0.6:0});
    el('rect',{x:300,y:60,width:220,height:18,rx:9,fill:'#e3e8ee'},s);el('rect',{x:300,y:60,width:220*a,height:18,rx:9,fill:boil?C.red:C.orange},s);el('line',{x1:410,y1:52,x2:410,y2:86,stroke:INK,'stroke-width':1.5},s);
    ktxt(s,300,48,'참음',{size:12.5});ktxt(s,520,48,'폭발',{size:12.5,anchor:'end'});
    [['단계',boil?'② 폭발':'① 참음'],['미간 주름',wr+'줄'],['입',boil?'크게 벌림':'へ자로 다묾'],['좌우 비대칭',f2(asy*100,0)+'%'],['눈동자',f2((1-0.45*a)*100,0)+'%']].forEach(function(r,i){ktxt(s,300,120+i*30,r[0],{size:13,fill:C.muted});ktxt(s,420,120+i*30,r[1],{size:14,fill:C.ink,weight:700});});
    out(h).innerHTML='분노 '+f2(a*100,0)+' → <b>'+(boil?'② 폭발':'① 참음')+'</b>. '+(boil?'입을 크게 벌리고, 주름을 늘리고, 눈동자를 조금 작게, 좌우를 어긋나게 그립니다.':'입을 へ자로 다물고 고개를 살짝 숙입니다. 미간 주름은 '+wr+'줄로 아껴 둡니다.')+' 분노는 한 장의 얼굴이 아니라 참는 단계에서 터지는 단계로 이어지는 흐름입니다.';}
  draw();};

var MIX={none:{},joy:{mouth:0.5,brow:0.1,blush:1},aghast:{open:0.5,brow:0.2},sad:{brow:0.9,mouth:-0.2,open:0.3,tears:1},fear:{brow:0.7,open:0.8,sweat:1,blue:1},worry:{brow:0.6,mouth:-0.2,open:0,sweat:1},anger:{brow:-0.7,open:0.6,mouth:-0.2}};
P.p2_surprise=function(h){var c=ctl(h),inp=c.querySelector('input'),sel=c.querySelector('select'),W=540,H=330;onIn(inp,draw);sel.addEventListener('change',draw);
  function draw(){var v=+inp.value/100,r=0.7-0.35*v,white=1-r*r;var o={who:'moa',eye:1+0.45*v,pupil:r/0.7,hairUp:v>=0.3?v:0,browY:v,open:0.25+0.65*v,brow:0.3};var mx=MIX[sel.value];for(var k in mx)o[k]=mx[k];if(sel.value==='none'&&v<0.2)o.open=0.1;
    var s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);faceS(s,150,180,95,o);
    var ex=400,ey=110;el('circle',{cx:ex,cy:ey,r:60,fill:'#fff',stroke:INK,'stroke-width':1.6},s);el('circle',{cx:ex,cy:ey,r:60*r,fill:EYEC.moa},s);el('circle',{cx:ex-60*r*0.35,cy:ey-60*r*0.35,r:7,fill:'#fff'},s);
    ktxt(s,ex,ey+84,'눈 지름 1 : 눈동자 '+f2(r,2),{size:12.5,anchor:'middle'});ktxt(s,ex,ey+110,'흰자 '+f2(white*100,0)+'%',{size:18,anchor:'middle',fill:C.teal,weight:700});ktxt(s,ex,ey+136,'머리카락 부피 +'+f2(o.hairUp*100,0)+'%',{size:13,anchor:'middle'});
    out(h).innerHTML='놀람 '+f2(v*100,0)+' → 눈동자 지름 '+f2(r,2)+', 흰자 = 1 − '+f2(r,2)+'² = <b>'+f2(white*100,0)+'%</b>. '+(sel.value==='none'?'반사에 가까운 놀람은 눈을 크게, 눈동자는 작게, 머리카락은 곤두세웁니다.':'섞인 감정('+sel.options[sel.selectedIndex].text+')은 눈썹과 입이 갈라 줍니다. 눈은 놀람, 눈썹·입은 섞인 감정입니다.');}
  draw();};

P.p2_ease=function(h){var c=ctl(h),inp=c.querySelector('input'),side='light',W=540,H=360;seg(h,'button',function(b){side=b.dataset.s;draw();});onIn(inp,draw);
  function draw(){var v=+inp.value/100,s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);var f,name;
    if(side==='light'){f={brow:0.15*(1-v),mouth:0.4-0.3*v,open:v>0.5?0.15:0,eye:0.85-0.15*v,unfocus:v>0.6?(v-0.6)/0.4:0};name=v<0.6?'楽 편안':'밝은 虚 — 멍함';}
    else{f={brow:0.9*(1-v),mouth:-0.5+0.45*v,open:v>0.6?0.15:0,eye:0.75-0.1*v,white:v>=0.85,shade:v>0.6?0.4:0};name=v<0.6?'哀 슬픔':'어두운 虚 — 기운이 빠짐';}
    figure(s,170,352,118,{arms:'side',lean:side==='dark'?v*10:-v*3,pitch:side==='dark'?-v*0.5:v*0.3,roll:side==='dark'?v*6:v*8,sTilt:side==='dark'&&v>0.6?6:0,sUp:0,who:'moa',face:f});
    ktxt(s,340,70,name,{size:20,fill:C.teal,weight:700});[['눈썹 힘',f2(Math.abs(f.brow)*100,0)+'%'],['입꼬리',num(f.mouth,2)],['초점',f.white?'눈동자 없음':f.unfocus?'어긋남':'맞음'],['어깨',side==='dark'&&v>0.6?'좌우 각도가 어긋남':'자연스러움']].forEach(function(r,i){ktxt(s,340,110+i*30,r[0],{size:13,fill:C.muted});ktxt(s,430,110+i*30,r[1],{size:14,fill:C.ink,weight:700});});
    out(h).innerHTML='힘 빼기 '+f2(v*100,0)+' → <b>'+name+'</b>. '+(side==='light'?'楽은 감정이라기보다 상태입니다. 힘이 끝까지 빠지면 두 눈의 초점이 어긋난 밝은 멍함이 됩니다.':'哀가 끝까지 가면 눈썹의 힘마저 빠집니다. 눈동자를 지운 흰 눈과 어긋난 어깨가 어두운 멍함입니다.');}
  draw();};

/* ===================== 3부 · 눈은 공 위에 그린다 ===================== */
P.p3_angle=function(h){var c=ctl(h),inp=c.querySelector('input'),pv='front',W=540,H=330;seg(h,'button',function(b){pv=b.dataset.v;draw();});onIn(inp,draw);
  function draw(){var yaw=+inp.value,s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);var cx=150,cy=160,R=100;
    el('ellipse',{cx:cx,cy:cy,rx:R*0.85,ry:R,fill:SKIN,stroke:INK,'stroke-width':1.8},s);var curve=pv==='aori'?-18:pv==='fukan'?18:0;
    el('path',{d:'M'+(cx-R*0.85)+','+(cy+8)+' Q'+(cx+Math.sin(rad(yaw))*R*0.8)+','+(cy+8+curve*2)+' '+(cx+R*0.85)+','+(cy+8),fill:'none',stroke:C.purple,'stroke-width':1.4,'stroke-dasharray':'4 4'},s);
    var ws=[];[-1,1].forEach(function(d){var az=d*30+yaw,vis=Math.max(0,Math.cos(rad(az)));ws.push([d,az,vis]);if(vis<0.05)return;var x=cx+Math.sin(rad(az))*R*0.82,w=34*vis,yy=cy+8+curve*(1-Math.pow(Math.sin(rad(az)),2));
      el('rect',{x:x-w/2,y:yy-22,width:w,height:40,fill:'none',stroke:C.teal,'stroke-width':1.4},s);el('ellipse',{cx:x,cy:yy,rx:w/2*0.9,ry:16,fill:'#fff',stroke:INK,'stroke-width':1.6},s);el('ellipse',{cx:x,cy:yy+2,rx:w/2*0.55,ry:12,fill:EYEC.sia},s);
      el('path',{d:'M'+(x-w/2)+','+(yy-10)+' Q'+x+','+(yy-24)+' '+(x+w/2)+','+(yy-10),fill:'none',stroke:INK,'stroke-width':3},s);});
    var nx=cx+Math.sin(rad(yaw))*R*0.85;el('path',{d:'M'+nx+','+(cy+30)+' l'+(yaw>0?6:-6)+',18 l'+(yaw>0?-8:8)+',2',fill:'none',stroke:INK,'stroke-width':1.6},s);
    var tx=320,ty=70;ktxt(s,tx,40,'위에서 본 머리',{size:12.5,fill:C.muted});el('circle',{cx:tx+80,cy:ty+40,r:50,fill:SKIN,stroke:INK,'stroke-width':1.4},s);arrow(s,tx+80,ty+170,tx+80,ty+100,C.muted,2);ktxt(s,tx+80,ty+186,'보는 사람',{size:11.5,anchor:'middle'});
    ws.forEach(function(e){var a=rad(e[1]);el('circle',{cx:tx+80+Math.sin(a)*50,cy:ty+40+Math.cos(a)*50,r:7,fill:e[2]>0.05?C.teal:'#c9ced6'},s);});
    var near=ws[0][2]>=ws[1][2]?ws[0]:ws[1],far=near===ws[0]?ws[1]:ws[0];ktxt(s,tx,ty+218,'가까운 눈 폭 '+f2(near[2]*100,0)+'% · 먼 눈 폭 '+f2(far[2]*100,0)+'%',{size:13,fill:C.ink,weight:700});
    out(h).innerHTML='얼굴을 '+yaw+'° 돌림 → 보이는 폭 = cos(눈 방향과 보는 방향 사이 각). 가까운 눈 cos('+Math.abs(near[1])+'°) = '+f2(near[2],2)+', 먼 눈 cos('+Math.abs(far[1])+'°) = <b>'+f2(far[2],2)+'</b>. '+(far[2]<0.05?'먼 눈은 보이지 않습니다(옆얼굴).':'먼 눈은 더 좁고 길쭉해집니다.')+(pv!=='front'?' '+(pv==='aori'?'올려다보면 눈머리와 눈꼬리를 잇는 선이 위로 볼록해집니다.':'내려다보면 그 선이 아래로 볼록해집니다.'):'');}
  draw();};

P.p3_gaze=function(h){var ins=ctl(h).querySelectorAll('input'),W=540,H=300;ins.forEach(function(i){onIn(i,draw);});
  function draw(){var ax=+ins[0].value*6,ay=+ins[1].value*4,s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);var cx=170,cy=150,R=110;
    el('circle',{cx:cx,cy:cy,r:R,fill:'none',stroke:C.grid,'stroke-width':1.4,'stroke-dasharray':'5 5'},s);var cp=el('clipPath',{id:'gz'},s);el('ellipse',{cx:cx,cy:cy,rx:R*0.95,ry:R*0.55},cp);
    el('ellipse',{cx:cx,cy:cy,rx:R*0.95,ry:R*0.55,fill:'#fff',stroke:INK,'stroke-width':2},s);var g=el('g',{'clip-path':'url(#gz)'},s);
    var ix=cx+Math.sin(rad(ax))*R,iy=cy-Math.sin(rad(ay))*R,sx=Math.cos(rad(ax)),sy=Math.cos(rad(ay));el('ellipse',{cx:ix,cy:iy,rx:R*0.42*sx,ry:R*0.42*sy,fill:EYEC.sia,stroke:INK,'stroke-width':1.2},g);el('ellipse',{cx:ix,cy:iy,rx:R*0.2*sx,ry:R*0.2*sy,fill:'#3a3640'},g);el('circle',{cx:ix-R*0.12*sx,cy:iy-R*0.12,r:9,fill:'#fff'},g);
    el('path',{d:'M'+(cx-R*1.0)+','+(cy-R*0.28)+' Q'+cx+','+(cy-R*0.85)+' '+(cx+R*1.0)+','+(cy-R*0.3),fill:'none',stroke:INK,'stroke-width':5,'stroke-linecap':'round'},s);
    ktxt(s,330,80,'눈동자 가로 비율',{size:13,fill:C.muted});ktxt(s,330,110,f2(sx*100,0)+'%',{size:24,fill:C.teal,weight:700});ktxt(s,330,150,'세로 비율',{size:13,fill:C.muted});ktxt(s,330,180,f2(sy*100,0)+'%',{size:24,fill:C.teal,weight:700});
    out(h).innerHTML='시선 가로 '+ax+'°, 세로 '+ay+'° → 눈동자는 공 표면에 붙은 원이라 돌아간 만큼 납작해집니다. 가로 폭 = cos('+Math.abs(ax)+'°) = <b>'+f2(sx,2)+'</b>. 정면에서는 거의 원, 옆을 볼수록 세로로 긴 타원입니다.';}
  draw();};

var LIDNAME=[[15,'뜬 눈'],[40,'감기 시작'],[60,'반쯤 감음'],[80,'반눈 직전'],[98,'반눈·실눈'],[101,'감음']];
P.p3_lid=function(h){var c=ctl(h),inp=c.querySelector('input'),mode='calm',W=540,H=300;seg(h,'button',function(b){mode=b.dataset.m;draw();});onIn(inp,draw);
  function draw(){var v=+inp.value,k=v/100,s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);var cx=170,cy=150,w=120,hh=60;var nm=LIDNAME.filter(function(x){return v<x[0];})[0][1];
    var top=cy-hh+k*hh*1.05,bot=cy+hh-k*hh*0.15;
    if(v<98){var cp=el('clipPath',{id:'ld'},s);el('path',{d:'M'+(cx-w)+','+cy+' Q'+cx+','+(top-hh*0.5*(1-k))+' '+(cx+w)+','+cy+' Q'+cx+','+(bot+hh*0.3)+' '+(cx-w)+','+cy+'Z'},cp);
      el('path',{d:'M'+(cx-w)+','+cy+' Q'+cx+','+(top-hh*0.5*(1-k))+' '+(cx+w)+','+cy+' Q'+cx+','+(bot+hh*0.3)+' '+(cx-w)+','+cy+'Z',fill:'#fff'},s);var g=el('g',{'clip-path':'url(#ld)'},s);
      el('circle',{cx:cx,cy:cy+4,r:52,fill:EYEC.sia},g);el('circle',{cx:cx,cy:cy+4,r:24,fill:'#3a3640'},g);el('rect',{x:cx-w,y:cy-hh*1.6,width:2*w,height:Math.max(0,top-(cy-hh*1.6)),fill:'#3b3550',opacity:0.2},g);
      el('path',{d:'M'+(cx-w)+','+cy+' Q'+cx+','+(top-hh*0.5*(1-k))+' '+(cx+w)+','+cy,fill:'none',stroke:INK,'stroke-width':6,'stroke-linecap':'round'},s);el('path',{d:'M'+(cx-w*0.8)+','+(cy+8)+' Q'+cx+','+(bot+hh*0.3)+' '+(cx+w*0.8)+','+(cy+8),fill:'none',stroke:INK,'stroke-width':2},s);}
    else{var up=mode==='calm'?1:-1;el('path',{d:'M'+(cx-w)+','+cy+' Q'+cx+','+(cy+up*hh*0.9)+' '+(cx+w)+','+cy,fill:'none',stroke:INK,'stroke-width':7,'stroke-linecap':'round'},s);if(mode==='squeeze')for(var i=0;i<3;i++)el('path',{d:'M'+(cx-w-6)+','+(cy-10+i*10)+' l-18,'+(i-1)*8,stroke:INK,'stroke-width':2},s);}
    el('line',{x1:cx-w-20,y1:cy,x2:cx+w+20,y2:cy,stroke:C.purple,'stroke-dasharray':'4 4'},s);
    ktxt(s,340,70,nm,{size:22,fill:C.teal,weight:700});ktxt(s,340,110,'윗눈꺼풀 내려옴 '+f2(k*100,0)+'%',{size:13.5,fill:C.ink});ktxt(s,340,138,'아랫눈꺼풀 올라옴 '+f2(k*15,0)+'%',{size:13.5,fill:C.ink});
    if(v>=98)ktxt(s,340,180,mode==='calm'?'아래로 처진 곡선 ‿ (조용히 감음)':mode==='smile'?'위로 볼록한 곡선 ⌒ (웃는 눈)':'위로 볼록 + 눈가 주름 (꽉 감음)',{size:13,fill:C.orange,weight:700});
    out(h).innerHTML='감기 '+v+' → <b>'+nm+'</b>. 윗눈꺼풀이 주로 내려오고 아랫눈꺼풀도 조금(여기서는 최대 15%) 올라옵니다. '+(v>=98?'다 감은 눈은 곡선 방향이 기분을 가릅니다: 조용히 감으면 아래로 처지고, 웃거나 꽉 감으면 위로 볼록합니다.':'반눈은 위·아래 눈꺼풀이 함께 눈동자를 가린 상태입니다.');}
  draw();};

var EYE6={joy:['喜','눈꼬리를 내린 처진 눈. 반짝임을 위해 흰 부분을 넉넉히',{closed:'smile',mouth:0.8,open:0.4}],anger:['怒','눈꼬리를 치켜올리고 눈동자를 작게, 세 방향 흰자를 강조',{brow:-0.9,pupil:0.55,eye:0.85,mouth:-0.5,asym:0.3}],
  sad:['哀','눈꺼풀 곡선을 완만하게, 힘없이 뜬 무거운 눈꺼풀',{brow:0.9,eye:0.6,mouth:-0.4}],ease:['楽','힘 있는 곡선의 눈꺼풀, 흰·검정·회색의 또렷한 대비',{brow:0.1,mouth:0.35,eye:0.95}],
  surprise:['驚','활 모양의 날카로운 곡선으로 크게 뜨고 눈동자는 작게',{eye:1.45,pupil:0.45,browY:1,open:0.8,hairUp:0.6}],blank:['虚','거의 직선인 눈꺼풀, 대비 없는 눈동자(또는 흰 눈)',{eye:0.6,unfocus:1,mouth:0}]};
P.p3_mood=function(h){var k='joy',W=540,H=300;seg(h,'button',function(b){k=b.dataset.e;draw();});
  function draw(){var e=EYE6[k],s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);var f={who:'sia'};for(var q in e[2])f[q]=e[2][q];faceS(s,140,160,100,f);
    ktxt(s,300,70,e[0],{size:44,fill:C.teal,weight:700});wrapT(e[1],17).forEach(function(w,i){ktxt(s,300,120+i*26,w,{size:13.5,fill:C.ink});});
    out(h).innerHTML='<b>'+e[0]+'</b> — '+e[1]+'. 같은 사람, 같은 눈동자라도 기분에 따라 눈꺼풀 곡선과 눈동자 크기가 바뀝니다.';}
  draw();};

/* ===================== 4부 · 빛과 그림자로 기분을 더한다 ===================== */
var LMOOD={top:'위에서 강하게 — 진지함·무게',ul:'왼쪽 위에서 약하게 — 차분한 기본',side:'바로 옆 — 얼굴 반이 어두워져 갈등·결심',bottom:'바로 아래 — 평소에 없는 빛이라 섬뜩함',back:'바로 뒤(역광) — 얼굴이 어둡고 테두리만 밝아 의미심장'};
function faceShade(ctx,W,H,dir,k){var d=LDIR[dir],x0=W/2-d[0]*W/2,y0=H/2+d[1]*H/2,x1=W/2+d[0]*W/2,y1=H/2-d[1]*H/2;var gr=ctx.createLinearGradient(x0,y0,x1,y1);var back=dir==='back';
  gr.addColorStop(0,'rgba(40,30,60,'+(back?0.55*k:0)+')');gr.addColorStop(0.55,'rgba(40,30,60,'+(back?0.55*k:0.15*k)+')');gr.addColorStop(1,'rgba(40,30,60,'+(back?0.6*k:0.5*k)+')');ctx.fillStyle=gr;ctx.globalCompositeOperation='multiply';ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over';}
P.p4_dir=function(h){var c=ctl(h),inp=c.querySelector('input'),dir='ul',W=520,H=250;seg(h,'button',function(b){dir=b.dataset.d;draw();});onIn(inp,draw);var cv=canvasOf(h,W,H,560),ctx=cv.getContext('2d');var bust=offBust('haru',{bg:'#f4f6f9'},220);
  function draw(){var k=+inp.value/10;ctx.fillStyle='#fbfcfd';ctx.fillRect(0,0,W,H);sphere(ctx,125,125,100,[{d:LDIR[dir],k:0.95*k}],{amb:0.18,rim:dir==='back'?0.6*k:0});
    var t=document.createElement('canvas');t.width=220;t.height=220;var tc=t.getContext('2d');tc.drawImage(bust,0,0);faceShade(tc,220,220,dir,k);ctx.drawImage(t,280,15);
    out(h).innerHTML='<b>'+LNAME[dir]+'</b> 빛, 세기 '+f2(k*10,0)+' → '+LMOOD[dir]+'. 면의 밝기 = 세기 × cos(면과 빛 사이 각): 빛을 정면으로 받는 면은 '+f2(k,2)+', 60° 비낀 면은 '+f2(k*0.5,2)+', 90° 이상은 0(그림자)입니다.';}
  draw();};
P.p4_multi=function(h){var c=ctl(h),ins=c.querySelectorAll('input[type=range]'),chk=c.querySelector('input[type=checkbox]'),W=520,H=240;ins.forEach(function(i){onIn(i,draw);});chk.addEventListener('change',draw);var cv=canvasOf(h,W,H,560),ctx=cv.getContext('2d');
  function draw(){var a=+ins[0].value/10,b=+ins[1].value/10;ctx.fillStyle='#fbfcfd';ctx.fillRect(0,0,W,H);var t1=sphere(ctx,120,120,95,[{d:LDIR.top,k:b}],{amb:0.12,cel:chk.checked,count:true}),t2=sphere(ctx,390,120,95,[{d:LDIR.top,k:b},{d:LDIR.ul,k:a}],{amb:0.12,cel:chk.checked,count:true});
    ctx.fillStyle='#16212b';ctx.font='13px '+KFONT;ctx.textAlign='center';ctx.fillText('바로 위 빛 하나',120,234);ctx.fillText('+ 왼쪽 위 약한 빛',390,234);
    var p=function(t){return ['암','중','명'].map(function(n,i){return t[i]>0.005?n+' '+f2(t[i]*100,0)+'%':null;}).filter(Boolean).join(' · ');};var three=t2[0]>0.02&&t2[1]>0.02&&t2[2]>0.02;
    out(h).innerHTML='빛 하나: '+p(t1)+' — 빛을 받는 곳과 못 받는 곳, <b>두 톤</b>뿐입니다.<br>빛 둘: <b>'+p(t2)+'</b> — '+(three?'두 빛을 다 받는 곳(명), 하나만 받는 곳(중), 못 받는 곳(암)으로 <b>세 톤</b>이 생겼습니다. 밝은 면은 줄어도 존재감이 깊어집니다.':'한 빛이 너무 약해 중간 톤이 거의 없습니다. 왼쪽 위 빛을 올려 보세요.');}
  draw();};
P.p4_rim=function(h){var ins=ctl(h).querySelectorAll('input'),W=520,H=240;ins.forEach(function(i){onIn(i,draw);});var cv=canvasOf(h,W,H,560),ctx=cv.getContext('2d');var bust=offBust('sia',{bg:'#f4f6f9'},200);
  function draw(){var rim=+ins[0].value/10,fill=+ins[1].value/10;ctx.fillStyle='#fbfcfd';ctx.fillRect(0,0,W,H);var t=sphere(ctx,120,120,100,[{d:LDIR.back,k:0.9}],{amb:0.06,rim:rim*2.2,fill:fill});
    var tc=document.createElement('canvas');tc.width=200;tc.height=200;var x=tc.getContext('2d');x.drawImage(bust,0,0);x.fillStyle='rgba(30,24,50,'+(0.6-fill*0.25)+')';x.globalCompositeOperation='multiply';x.fillRect(0,0,200,200);x.globalCompositeOperation='source-over';
    if(rim>0){x.strokeStyle='rgba(255,255,255,'+(0.3+rim*0.7)+')';x.lineWidth=2+rim*5;x.beginPath();x.ellipse(100,78,46,52,0,Math.PI*1.05,Math.PI*1.95);x.stroke();}ctx.drawImage(tc,300,20);
    out(h).innerHTML='역광만 두면 얼굴이 대부분 어둡습니다(암 '+f2(t[0]*100,0)+'%). 테두리 빛 '+f2(rim*10,0)+'은 윤곽을 따라 \'가장자리\'를 하얗게 남기고, 반사판 '+f2(fill*10,0)+'은 바닥에서 튄 빛으로 얼굴을 조금 살립니다. 의미심장한 장면에서 표정을 보여 주고 싶을 때 씁니다.';}
  draw();};
var TOUCH={joy:['red'],anger:['shade'],sad:['blue'],ease:[],surprise:['red'],blank:['blue']};var TOUCHN={red:'붉은 빗금',blue:'세로선(창백함)',shade:'얼굴 위 그늘'};
P.p4_touch=function(h){var c=ctl(h),cks=c.querySelectorAll('input'),k='joy',W=540,H=300;seg(h,'button',function(b){k=b.dataset.e;cks.forEach(function(x){x.checked=TOUCH[k].indexOf(x.name)>=0;});draw();});cks.forEach(function(x){x.addEventListener('change',draw);});
  function draw(){var o={who:'haru'};var e=EYE6[k][2];for(var q in e)o[q]=e[q];cks.forEach(function(x){if(x.checked)o[x.name]=x.name==='shade'?0.8:1;});var s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);faceS(s,150,160,105,o);
    var on=[].filter.call(cks,function(x){return x.checked;}).map(function(x){return TOUCHN[x.name];});var rec=TOUCH[k].map(function(n){return TOUCHN[n];});var same=on.join()===rec.join();
    ktxt(s,310,70,EYE6[k][0],{size:40,fill:C.teal,weight:700});ktxt(s,310,110,'지금: '+(on.join(', ')||'터치 없음'),{size:13.5,fill:C.ink});ktxt(s,310,138,'권장: '+(rec.join(', ')||'터치 거의 없음'),{size:13.5,fill:same?C.green:C.orange,weight:700});
    out(h).innerHTML=EYE6[k][0]+' 얼굴에 '+(on.join(', ')||'터치 없음')+'. '+(same?'권장 조합과 같습니다. ':'권장은 '+(rec.join(', ')||'터치 거의 없음')+'입니다. ')+'이 터치는 빛 계산과 상관없이 기분을 그리는 약속입니다. 체크를 바꿔 어울리지 않는 터치가 기분을 어떻게 흔드는지 보세요.';}
  draw();};

/* ===================== 5부 · AI와 VFX로 표정 바꾸기 ===================== */
var EXN={joy:'joyful',anger:'angry',sad:'sad',ease:'relaxed and content',surprise:'surprised',blank:'blank, absent-minded',worry:'worried'};
var EXFACE={joy:'eyebrows relaxed in a soft curve, corners of the mouth lifted, eyes narrowed into upward arcs',anger:'inner eyebrows pulled down with a crease between the brows, eyes narrowed with small pupils, mouth pressed into a frown',
  sad:'inner eyebrows raised and drawn together, heavy half-lowered eyelids, mouth corners turned down',ease:'gently curved relaxed eyebrows, a faint smile, calm half-open eyes',surprise:'eyebrows raised high, eyes wide open with small pupils, mouth open in a round shape',
  blank:'eyebrows and mouth almost straight, unfocused eyes looking at nothing',worry:'inner eyebrows raised, lips slightly pressed, eyes glancing aside'};
var EXBODY={joy:'head tilted slightly up, shoulders raised, hands clasped near the chest',anger:'leaning slightly forward, neck pulled in, shoulders raised, fists clenched',sad:'head lowered, shoulders dropped, back slightly rounded',
  ease:'back straight and relaxed, head tilted a little, hands loose',surprise:'shoulders jumping up, hands raised near the mouth, hair lifted',blank:'shoulders slack and uneven, face pushed slightly forward',worry:'head slightly lowered, both hands held in front of the chest'};
var EXLIGHT={joy:'soft warm light from the upper left, a light rosy blush on the cheeks',anger:'strong light from above casting a shadow over the eyes',sad:'cool dim light from above, pale bluish tone on the upper face',
  ease:'soft even daylight from the upper left',surprise:'bright light from the upper left',blank:'flat dim light, low contrast',worry:'soft light from the upper left with a faint shadow over the eyes'};
var LVL={weak:'slightly ',mid:'',strong:'very '};
function exprPrompt(o){var who={haru:'Haru',sia:'Sia',moa:'Moa'}[o.who];var t=['Upper body portrait of '+who+' (match the attached reference exactly), an adult woman in her early twenties.'];var score=0,miss=[];
  if(o.emo){t.push('Emotion: '+LVL[o.lvl||'mid']+EXN[o.emo]+'.');score++;}else miss.push('감정');
  if(o.face){t.push('Face: '+EXFACE[o.emo||'joy']+'.');score++;}else miss.push('얼굴(눈썹·입)');
  if(o.eyes){t.push('Eyes: '+(o.emo==='blank'?'no clear focus':'gaze direction and eyelid shape match the emotion')+'.');score++;}else miss.push('눈');
  if(o.body){t.push('Body: '+EXBODY[o.emo||'joy']+'.');score++;}else miss.push('몸(머리·목·어깨)');
  if(o.light){t.push('Lighting: '+EXLIGHT[o.emo||'joy']+'.');score++;}else miss.push('빛');
  if(o.neg){t.push('Keep the face identity, hair and outfit exactly as in the reference. Adult proportions. No text, no logos, no exaggerated cartoon symbols.');score++;}else miss.push('금지·고정');
  return {text:t.join('\n'),score:score,miss:miss};}
function exprForm(host,cb){var f=document.createElement('div');f.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px 14px;width:100%';host.appendChild(f);
  f.innerHTML='<label>모델 <select name="who"><option value="haru">하루</option><option value="sia">시아</option><option value="moa">모아</option></select></label>'+
   '<label>감정 <select name="emo"><option value="">(비움)</option><option value="joy" selected>喜 기쁨</option><option value="anger">怒 분노</option><option value="sad">哀 슬픔</option><option value="ease">楽 편안</option><option value="surprise">驚 놀람</option><option value="blank">虚 멍함</option><option value="worry">걱정</option></select></label>'+
   '<label>세기 <select name="lvl"><option value="weak">약하게</option><option value="mid" selected>보통</option><option value="strong">강하게</option></select></label>'+
   '<label><input type="checkbox" name="face" checked> 얼굴(눈썹·입)</label><label><input type="checkbox" name="eyes"> 눈(시선·눈꺼풀)</label><label><input type="checkbox" name="body"> 몸(머리·목·어깨)</label><label><input type="checkbox" name="light"> 빛</label><label><input type="checkbox" name="neg"> 고정·금지</label>';
  f.querySelectorAll('select,input').forEach(function(x){x.addEventListener('change',cb);});
  return function(){var o={};f.querySelectorAll('select').forEach(function(x){o[x.name]=x.value;});f.querySelectorAll('input').forEach(function(x){o[x.name]=x.checked;});return o;};}
P.p5_prompt=function(h){h.innerHTML='';var get=exprForm(h,draw);var pb=document.createElement('div');pb.className='promptbox';pb.innerHTML='<b>조립된 표정 문장</b><pre aria-live="polite"></pre><button type="button" class="btn copy">복사하기</button>';h.appendChild(pb);
  function draw(){var o=get(),r=exprPrompt(o);pb.querySelector('pre').textContent=r.text;out(h).innerHTML='점검표 <b>'+r.score+' / 6</b>'+(r.miss.length?' — 빠진 조각: '+r.miss.join(', ')+'. 감정 낱말 하나만 주면 도구는 얼굴만 바꾸고 몸과 빛은 평소대로 둡니다.':' — 감정·얼굴·눈·몸·빛·고정이 모두 들어갔습니다.');}
  draw();};
var MASKS={mouth:[216,352,80,50,'입'],eyes:[176,286,160,60,'눈·눈썹'],face:[156,156,200,240,'얼굴 전체'],head:[106,60,300,380,'머리까지']};
P.p5_mask=function(h){var c=ctl(h),inp=c.querySelector('input'),k='eyes',W=256,H=384;seg(h,'button',function(b){k=b.dataset.k;draw();});onIn(inp,draw);var cv=canvasOf(h,W,H,300),ctx=cv.getContext('2d');var bust=offBust('haru',{bg:'#f4f6f9'},256);
  function draw(){var fe=+inp.value,m=MASKS[k],sc=0.5;ctx.fillStyle='#f4f6f9';ctx.fillRect(0,0,W,H);ctx.drawImage(bust,0,40);ctx.fillStyle='#A99AC8';ctx.fillRect(0,296,W,88);
    ctx.save();ctx.fillStyle='rgba(232,115,26,0.45)';ctx.shadowColor='rgba(232,115,26,0.9)';ctx.shadowBlur=fe;ctx.fillRect(m[0]*sc,m[1]*sc,m[2]*sc,m[3]*sc);ctx.restore();
    var area=m[2]*m[3],tot=512*768;out(h).innerHTML='가림 영역 <b>'+m[4]+'</b> '+m[2]+'×'+m[3]+' = '+area+' → 바뀌는 비율 = '+area+' ÷ '+tot+' = <b>'+f2(area/tot*100,1)+'%</b>. '+(k==='head'?'머리까지 가리면 번·남색 줄 같은 고정값도 다시 그려져 다른 사람이 되기 쉽습니다.':k==='face'?'얼굴 전체는 표정이 크게 바뀌지만 얼굴형·눈 색이 흔들릴 수 있습니다.':'작게 가릴수록 나머지는 그대로 남습니다. 표정은 눈·눈썹과 입 두 곳이면 대부분 바뀝니다.')+(fe>10?' 경계를 흐리게('+fe+'px) 하면 이음매가 덜 보입니다.':'');}
  draw();};
var BS=['미소','입꼬리 내림','눈썹 안쪽 올림','눈썹 내림','눈 크게','입 벌림'];
P.p5_blend=function(h){var ins=ctl(h).querySelectorAll('input'),W=540,H=320;ins.forEach(function(i){onIn(i,draw);});
  function draw(){var w=[].map.call(ins,function(i){return +i.value/10;});var mouthPx=10*w[0]-8*w[1],brow=w[2]-w[3];var o={who:'sia',mouth:clamp(mouthPx/10,-1,1),brow:clamp(brow,-1,1),wrinkle:w[3]>0.5?2:0,eye:1+0.45*w[4]-0.2*w[0],pupil:1-0.4*w[4],open:w[5],browY:w[4]*0.8,closed:w[0]>0.85&&w[4]<0.2?'smile':''};
    var s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);faceS(s,140,170,100,o);
    BS.forEach(function(n,i){el('rect',{x:330,y:40+i*36,width:180,height:16,rx:4,fill:'#e3e8ee'},s);el('rect',{x:330,y:40+i*36,width:180*w[i],height:16,rx:4,fill:C.purple},s);ktxt(s,330,36+i*36,n+' '+f2(w[i],1),{size:12,fill:C.ink});});
    var warn=[];if(w[2]>0.3&&w[3]>0.3)warn.push('눈썹 올림과 내림이 서로 지웁니다');if(w[0]>0.5&&w[3]>0.5)warn.push('웃는데 눈썹을 내려 심술궂은 웃음이 됩니다');if(w[0]>0.4&&w[2]>0.6)warn.push('웃는데 눈썹이 올라가 곤란한 웃음이 됩니다');
    var near=EMO[emoNearest({brow:o.brow,mouth:o.mouth,open:o.open,eye:o.eye,pupil:o.pupil})].n;
    out(h).innerHTML='입꼬리 높이 = +10px × '+f2(w[0],1)+' − 8px × '+f2(w[1],1)+' = <b>'+num(mouthPx,1)+'px</b>. 가장 가까운 기본 감정: <b>'+near+'</b>. '+(warn.length?'주의: '+warn.join(' / ')+'.':'값을 섞어 원하는 표정을 만듭니다. VFX에서는 이 값을 시간에 따라 바꿔 표정을 움직입니다.');}
  draw();};
var STF={pixel:[1.6,'픽셀'],anime:[1.3,'애니풍'],semireal:[1.0,'반실사'],photo:[0.7,'실사풍']};
P.p5_style=function(h){var c=ctl(h),inp=c.querySelector('input'),sel=c.querySelector('select'),sty='anime',W=260,H=260;seg(h,'button',function(b){sty=b.dataset.s;draw();});onIn(inp,draw);sel.addEventListener('change',draw);var cv=canvasOf(h,W,H,300),ctx=cv.getContext('2d');var tok=0;
  function draw(){var e=sel.value,v=+inp.value/10,f=STF[sty][0],eff=Math.min(1,v*f),t=EMO[e];var o={who:'moa',brow:t.brow*eff,mouth:t.mouth*eff,open:t.open*eff,eye:1+(t.eye-1)*eff,pupil:1+(t.pupil-1)*eff,hairUp:e==='surprise'&&sty!=='photo'?0.5*eff:0,red:e==='joy'&&sty==='anime'&&eff>0.6};
    var svg=document.createElementNS(NS,'svg');svg.setAttribute('xmlns',NS);svg.setAttribute('viewBox','0 0 260 260');svg.setAttribute('width',260);svg.setAttribute('height',260);el('rect',{x:0,y:0,width:260,height:260,fill:'#f4f6f9'},svg);faceS(svg,130,140,85,o);
    var img=new Image(),my=++tok;img.onload=function(){if(my!==tok)return;var t2=document.createElement('canvas');t2.width=260;t2.height=260;t2.getContext('2d').drawImage(img,0,0);pixelate(t2,cv,sty==='pixel'?8:1);
      if(sty==='photo'){ctx.fillStyle='rgba(120,100,90,0.08)';ctx.fillRect(0,0,W,H);}};img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svg));
    out(h).innerHTML=STF[sty][1]+' 과장 배수 '+f+' × 세기 '+f2(v,1)+' = 실제 표정 값 <b>'+f2(eff,2)+'</b>'+(v*f>1?' (1에서 멈춤)':'')+'. '+(sty==='photo'?'실사는 근육을 조금만 움직이고 그늘·주름으로 전합니다.':sty==='pixel'?'픽셀은 눈·입이 점 몇 개뿐이라 크게 과장해야 읽힙니다.':'');}
  draw();};

/* ===================== 6부 · 진단 ===================== */
var CHECK=['① 몸 — 머리·목·어깨·팔','② 눈썹·입','③ 눈·눈꺼풀','④ 빛·터치','⑤ 문장·가림 영역'];
var FAILAT=[0,0,1,2,2,3,4,4];
var FAILWHY=['얼굴은 웃는데 몸은 차렷 자세라 기분이 몸에서 끊깁니다.','몸은 정면인데 얼굴만 완전한 옆을 봐서 목이 꺾여 보입니다.','화났다는데 눈썹 안쪽이 올라가 슬퍼 보입니다.','놀랐다는데 눈동자가 커져 반짝이는 기쁨처럼 보입니다.','웃는 눈인데 눈꺼풀 곡선이 아래로 처져 졸려 보입니다.','슬픈 장면에 아래에서 강한 빛을 넣어 섬뜩해 보입니다.','\'무표정\'이라고만 적어 도구가 기본 미소를 넣었습니다.','표정만 바꾸려다 머리까지 가려 다른 사람이 됐습니다.'];
P.p6_check=function(h){var c=ctl(h),sel=c.querySelector('select');h.innerHTML='';var list=document.createElement('div');list.style.cssText='display:flex;flex-direction:column;gap:6px';h.appendChild(list);var done=0;
  function build(){list.innerHTML='';done=0;CHECK.forEach(function(t,i){var b=document.createElement('button');b.type='button';b.className='btn';b.style.textAlign='left';b.textContent=t;b.addEventListener('click',function(){press(i,b);});list.appendChild(b);});out(h).innerHTML='점검표를 <b>위에서부터</b> 눌러 보세요.';}
  function press(i,b){var f=+sel.value,at=FAILAT[f];if(i!==done){out(h).innerHTML='순서대로! 먼저 <b>'+CHECK[done]+'</b>을 보세요. 큰 덩어리(몸)에서 작은 표현 순서입니다.';return;}
    if(i<at){b.style.borderColor=C.green;b.style.background='#ecf7ef';b.textContent=CHECK[i]+' — 통과';done++;out(h).innerHTML=CHECK[i]+' 통과. 다음 항목으로.';}
    else{b.style.borderColor=C.red;b.style.background='#fdeceb';b.textContent=CHECK[i]+' — 여기서 걸림';done=99;out(h).innerHTML='<b>'+CHECK[i]+'</b>에서 처음 걸렸습니다: '+FAILWHY[f]+' 아래 실패 카드 f'+(f+1)+'에서 고치는 조각을 보세요.';}}
  sel.addEventListener('change',build);build();};
