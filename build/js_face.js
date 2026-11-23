
/* ===================== 공용: 얼굴(SVG) ===================== */
var HAIR={haru:['#E9909A','#D9707E'],sia:['#1E1B22','#4A4656'],moa:['#D8C09A','#B89C74'],doctor:['#3a3d44','#5a5e66']};
var EYEC={haru:'#3D8BE0',sia:'#7A7680',moa:'#B07A3E',doctor:'#4a4a52'};
var SKIN='#F6D3B8',INK='#2a2230';
/* o: who, brow(-1 안쪽 내려감=화남 … +1 안쪽 올라감=걱정·슬픔), browY(눈썹 높이 0~1), mouth(-1 입꼬리 내려감 … +1 올라감), open(0~1 입 벌림),
      eye(눈 뜬 정도 0~1.5, 1이 보통), pupil(눈동자 크기 0.3~1.1), gx,gy(시선 -1~1), unfocus(0~1 초점 어긋남), closed(''|'calm'|'smile'|'squeeze'),
      white(흰자만), wrinkle(미간 주름 수), asym(0~1 좌우 비대칭), blush, sweat, tears, red(붉은 빗금), blue(세로선), shade(얼굴 위 그늘 0~1), hairUp(머리카락 부피 0~1), roll(고개 기울기°) */
function faceS(s,cx,cy,r,o){o=o||{};var who=o.who||'haru',hc=HAIR[who]||HAIR.haru;var g=el('g',{transform:'rotate('+(o.roll||0)+' '+cx+' '+(cy+r)+')'},s);
  var id='fc'+Math.round(Math.random()*1e9);var cp=el('clipPath',{id:id},g);el('ellipse',{cx:cx,cy:cy,rx:r*0.82,ry:r},cp);
  // 뒷머리 + 부피
  var hv=o.hairUp||0;
  if(who!=='doctor')el('path',{d:'M'+(cx-r*1.0-hv*r*0.25)+','+(cy-r*0.1)+' Q'+(cx-r*1.15-hv*r*0.4)+','+(cy+r*1.1)+' '+(cx-r*0.9)+','+(cy+r*1.55)+' L'+(cx+r*0.9)+','+(cy+r*1.55)+' Q'+(cx+r*1.15+hv*r*0.4)+','+(cy+r*1.1)+' '+(cx+r*1.0+hv*r*0.25)+','+(cy-r*0.1)+' Z',fill:hc[0],stroke:INK,'stroke-width':1.6},g);
  if(who==='haru'){[-1,1].forEach(function(d){el('circle',{cx:cx+d*r*0.62,cy:cy-r*1.02-hv*r*0.15,r:r*0.32,fill:hc[0],stroke:INK,'stroke-width':1.6},g);});}
  if(hv>0.05){for(var i=0;i<7;i++){var a=-2.6+i*0.36;var x0=cx+Math.cos(a)*r*0.9,y0=cy-r*0.25+Math.sin(a)*r*0.95;el('path',{d:'M'+x0+','+y0+' l'+(Math.cos(a)*r*0.5*hv)+','+(Math.sin(a)*r*0.5*hv)+' l'+(-Math.sin(a)*r*0.12)+','+(Math.cos(a)*r*0.12)+'Z',fill:hc[0],stroke:INK,'stroke-width':1.2},g);}}
  // 얼굴
  el('ellipse',{cx:cx,cy:cy,rx:r*0.82,ry:r,fill:SKIN,stroke:INK,'stroke-width':1.8},g);
  var gf=el('g',{'clip-path':'url(#'+id+')'},g);
  if(o.shade)el('rect',{x:cx-r,y:cy-r,width:2*r,height:r*(0.6+o.shade*0.7),fill:'#3b3550',opacity:0.18+o.shade*0.25},gf);
  if(o.blue){for(var b=0;b<11;b++)el('line',{x1:cx-r*0.8+b*r*0.16,y1:cy-r,x2:cx-r*0.8+b*r*0.16,y2:cy-r*0.15+(b%3)*r*0.08,stroke:'#4a6fd0','stroke-width':1.1,opacity:0.75},gf);}
  if(o.blush||o.red){[-1,1].forEach(function(d){el('ellipse',{cx:cx+d*r*0.45,cy:cy+r*0.3,rx:r*0.17,ry:r*0.08,fill:'#f07888',opacity:o.red?0.45:0.28},gf);if(o.red)for(var k=0;k<4;k++)el('line',{x1:cx+d*r*0.34+k*r*0.06,y1:cy+r*0.36,x2:cx+d*r*0.38+k*r*0.06,y2:cy+r*0.24,stroke:'#d04858','stroke-width':1.1},gf);});}
  // 눈
  var eyeO=o.eye==null?1:o.eye,cl=o.closed||'',ey=cy+r*0.08,ew=r*0.22,eh=r*0.27*Math.max(0.05,eyeO),pu=o.pupil==null?1:o.pupil,ec=EYEC[who]||'#3D8BE0';
  [-1,1].forEach(function(d){var ex=cx+d*r*0.36,asy=(o.asym||0)*(d>0?1:-0.6);
    if(cl){var up=cl==='calm'?1:-1;el('path',{d:'M'+(ex-ew)+','+ey+' Q'+ex+','+(ey+up*r*0.12)+' '+(ex+ew)+','+ey,fill:'none',stroke:INK,'stroke-width':2.6,'stroke-linecap':'round'},g);
      if(cl==='squeeze'){el('path',{d:'M'+(ex-ew*0.9)+','+(ey+r*0.06)+' l'+(d*ew*0.5)+','+(r*0.04),fill:'none',stroke:INK,'stroke-width':1.2},g);}return;}
    var h_=eh*(1+asy*0.25);el('ellipse',{cx:ex,cy:ey,rx:ew,ry:h_,fill:'#fff',stroke:INK,'stroke-width':1.4},g);
    if(!o.white){var gx=(o.gx||0)+d*(o.unfocus||0)*0.55,gy=o.gy||0;var ix=ex+gx*ew*0.55,iy=ey+gy*h_*0.45;var sq=Math.cos(Math.min(1.2,Math.abs(gx)*0.9));
      var ic=el('clipPath',{id:id+'e'+d},g);el('ellipse',{cx:ex,cy:ey,rx:ew,ry:h_},ic);var ge=el('g',{'clip-path':'url(#'+id+'e'+d+')'},g);
      el('ellipse',{cx:ix,cy:iy,rx:ew*0.62*pu*sq,ry:r*0.2*pu,fill:ec},ge);el('ellipse',{cx:ix,cy:iy+r*0.02,rx:ew*0.3*pu*sq,ry:r*0.1*pu,fill:shade(ec,0.4)},ge);
      if(o.unfocus<0.5||!o.unfocus)el('circle',{cx:ix-ew*0.2,cy:iy-r*0.07,r:r*0.045*Math.max(0.6,pu),fill:'#fff'},ge);}
    el('path',{d:'M'+(ex-ew*1.1)+','+(ey-h_*0.55)+' Q'+ex+','+(ey-h_*1.25)+' '+(ex+ew*1.1)+','+(ey-h_*0.6),fill:'none',stroke:INK,'stroke-width':2.8,'stroke-linecap':'round'},g);
    if(o.tears)el('path',{d:'M'+(ex+d*ew*0.2)+','+(ey+h_)+' q'+(d*2)+','+(r*0.25)+' 0,'+(r*0.45),fill:'none',stroke:'#5aa0e0','stroke-width':2},g);});
  // 눈썹
  var by=cy-r*0.28-(o.browY||0)*r*0.16;[-1,1].forEach(function(d){var bi=cx+d*r*0.14,bo=cx+d*r*0.56;var inner=by-(o.brow||0)*r*0.13+(d>0?(o.asym||0)*r*0.06:0),outer=by+(o.brow||0)*r*0.05;
    el('path',{d:'M'+bi+','+inner+' Q'+((bi+bo)/2)+','+(Math.min(inner,outer)-r*0.06)+' '+bo+','+outer,fill:'none',stroke:hc[1]==='#4A4656'?'#2a2630':shade(hc[0],0.55),'stroke-width':r*0.06,'stroke-linecap':'round'},g);});
  for(var w=0;w<(o.wrinkle||0);w++){el('line',{x1:cx-r*0.05+w*r*0.05-(o.wrinkle-1)*r*0.025,y1:by-r*0.02,x2:cx-r*0.04+w*r*0.05-(o.wrinkle-1)*r*0.025,y2:by+r*0.1,stroke:INK,'stroke-width':1.1},g);}
  // 입
  var my=cy+r*0.58,mw=r*0.22*(1+(o.open||0)*0.35),cv=(o.mouth||0)*r*0.16,op=(o.open||0)*r*0.32,ma=(o.asym||0)*r*0.05;
  if(op>r*0.03){el('path',{d:'M'+(cx-mw)+','+(my-cv*0.3-ma)+' Q'+cx+','+(my+cv*0.6)+' '+(cx+mw)+','+(my-cv*0.3+ma)+' Q'+cx+','+(my+op+cv*0.4)+' '+(cx-mw)+','+(my-cv*0.3-ma)+'Z',fill:'#b8485a',stroke:INK,'stroke-width':1.6},g);}
  else el('path',{d:'M'+(cx-mw)+','+(my-cv*0.3-ma)+' Q'+cx+','+(my+cv)+' '+(cx+mw)+','+(my-cv*0.3+ma),fill:'none',stroke:INK,'stroke-width':2,'stroke-linecap':'round'},g);
  if(o.sweat)el('path',{d:'M'+(cx+r*0.78)+','+(cy-r*0.4)+' q'+(r*0.08)+','+(r*0.16)+' 0,'+(r*0.2)+' q-'+(r*0.08)+',-'+(r*0.04)+' 0,-'+(r*0.2)+'Z',fill:'#bfe0f6',stroke:'#5aa0e0','stroke-width':1.2},g);
  // 앞머리·장식
  el('path',{d:'M'+(cx-r*0.95)+','+(cy-r*0.05)+' Q'+(cx-r*1.0)+','+(cy-r*1.15-hv*r*0.2)+' '+cx+','+(cy-r*1.1-hv*r*0.2)+' Q'+(cx+r*1.0)+','+(cy-r*1.15-hv*r*0.2)+' '+(cx+r*0.95)+','+(cy-r*0.05)+' L'+(cx+r*0.7)+','+(cy-r*0.55)+' L'+(cx+r*0.45)+','+(cy-r*0.4)+' L'+(cx+r*0.25)+','+(cy-r*0.62)+' L'+cx+','+(cy-r*0.42)+' L'+(cx-r*0.25)+','+(cy-r*0.62)+' L'+(cx-r*0.45)+','+(cy-r*0.4)+' L'+(cx-r*0.7)+','+(cy-r*0.55)+'Z',fill:hc[0],stroke:INK,'stroke-width':1.6},g);
  if(who==='haru')el('path',{d:'M'+(cx-r*0.07)+','+(cy-r*1.1)+' L'+(cx+r*0.07)+','+(cy-r*1.1)+' L'+(cx+r*0.04)+','+(cy-r*0.48)+' L'+(cx-r*0.04)+','+(cy-r*0.48)+'Z',fill:'#1E2F5C'},g);
  if(who==='moa'){el('path',{d:'M'+(cx-r*0.85)+','+(cy-r*0.72)+' Q'+cx+','+(cy-r*1.28)+' '+(cx+r*0.85)+','+(cy-r*0.72),fill:'none',stroke:'#fff','stroke-width':r*0.12},g);el('path',{d:'M'+(cx-r*0.85)+','+(cy-r*0.72)+' Q'+cx+','+(cy-r*1.28)+' '+(cx+r*0.85)+','+(cy-r*0.72),fill:'none',stroke:INK,'stroke-width':0.8,'stroke-dasharray':'3 3'},g);
    var rx=cx+r*0.95,ry=cy-r*0.45;el('path',{d:'M'+rx+','+ry+' l-'+(r*0.2)+',-'+(r*0.13)+' l0,'+(r*0.26)+'Z M'+rx+','+ry+' l'+(r*0.2)+',-'+(r*0.13)+' l0,'+(r*0.26)+'Z',fill:'#fff',stroke:INK,'stroke-width':1.2},g);}
  if(who==='doctor'){el('rect',{x:cx-r*0.6,y:cy-r*0.08,width:r*0.48,height:r*0.32,rx:3,fill:'none',stroke:'#0f8f84','stroke-width':2},g);el('rect',{x:cx+r*0.12,y:cy-r*0.08,width:r*0.48,height:r*0.32,rx:3,fill:'none',stroke:'#0f8f84','stroke-width':2},g);}
  return g;}

/* ===================== 공용: 몸 자세(SVG 마네킹) ===================== */
var ARMS={side:[[0.15,0.45],[0.18,0.9]],hips:[[0.55,0.42],[0.24,0.82]],cross:[[0.22,0.55],[-0.22,0.42]],chest:[[0.2,0.6],[0.05,0.28]],back:[[0.24,0.5],[0.04,0.86]],
  headback:[[0.62,-0.45],[0.1,-0.78]],up:[[0.32,-0.55],[0.42,-1.15]],fists:[[0.2,0.45],[0.24,0.88]],face:[[0.22,0.2],[0.07,-0.5]],chin:[[0.25,0.55],[0.04,-0.2]]};
var ARMNAME={side:'팔 내림',hips:'허리에 손',cross:'팔짱',chest:'가슴 앞에 두 손',back:'뒷짐',headback:'머리 뒤 깍지',up:'두 팔 번쩍',fists:'주먹 쥐고 내림',face:'두 손으로 얼굴 가림',chin:'한 손 턱 괴기'};
/* o: arms, lean(앞으로 숙임°, 음수는 뒤로 젖힘), roll(고개 기울기°), pitch(-1 숙임 … 1 듦), sTilt(어깨 기울기°), sUp(어깨 올림 0~1), sil(실루엣), face(얼굴 옵션), who */
function figure(s,cx,base,u,o){o=o||{};var g=el('g',{},s);var col=o.sil?'#8f97a6':'#5b7fb8',top=o.sil?'#8f97a6':'#A99AC8',skin=o.sil?'#8f97a6':SKIN;
  var hx=cx,hy=base-u*1.05,ln=rad(o.lean||0);var nx=hx+Math.sin(ln)*u,ny=hy-Math.cos(ln)*u;var st=rad(o.sTilt||0),sup=(o.sUp||0)*u*0.12;var sw=u*0.36;
  var L=[nx-Math.cos(st)*sw,ny-sup+Math.sin(st)*sw],R=[nx+Math.cos(st)*sw,ny-sup-Math.sin(st)*sw];
  // 다리
  [-1,1].forEach(function(d){var kx=hx+d*u*0.16+(o.step?d*o.step*u*0.25:0),ky=base-u*0.52;el('path',{d:'M'+(hx+d*u*0.14)+','+hy+' L'+kx+','+ky+' L'+(kx+(o.step?d*o.step*u*0.1:0))+','+base,fill:'none',stroke:col,'stroke-width':u*0.17,'stroke-linecap':'round','stroke-linejoin':'round'},g);});
  // 뒤에 가는 팔(뒷짐·깍지)
  var A=ARMS[o.arms||'side'];function arm(d,front){var sh=d<0?L:R;var e=[sh[0]+d*A[0][0]*u,sh[1]+A[0][1]*u],h_=[sh[0]+d*A[1][0]*u,sh[1]+A[1][1]*u];
    if(o.arms==='chin'&&d>0){e=[sh[0]+0.15*u,sh[1]+0.45*u];h_=[sh[0]+0.18*u,sh[1]+0.9*u];}
    el('path',{d:'M'+sh+' L'+e+' L'+h_,fill:'none',stroke:front?skin:shade(o.sil?'#8f97a6':SKIN,0.85),'stroke-width':u*0.11,'stroke-linecap':'round','stroke-linejoin':'round',opacity:front?1:0.9},g);
    if(o.arms==='fists')el('circle',{cx:h_[0],cy:h_[1],r:u*0.08,fill:skin,stroke:INK,'stroke-width':1.4},g);}
  var behind=o.arms==='back'||o.arms==='headback';if(behind){arm(-1,false);arm(1,false);}
  // 몸통
  el('path',{d:'M'+L+' L'+R+' L'+(hx+u*0.24)+','+hy+' L'+(hx-u*0.24)+','+hy+'Z',fill:top,stroke:o.sil?'none':INK,'stroke-width':1.6},g);
  el('line',{x1:L[0],y1:L[1],x2:R[0],y2:R[1],stroke:o.sil?'none':C.orange,'stroke-width':2.4,'stroke-dasharray':'5 4'},g);
  if(!behind){arm(-1,true);arm(1,true);}
  // 목·머리
  var pitch=o.pitch||0,roll=o.roll||0,hr=u*0.27;var headC=[nx+Math.sin(ln)*hr*1.25,ny-hr*1.25+pitch*0+Math.max(0,-pitch)*hr*0.25];
  el('line',{x1:nx,y1:ny-sup,x2:headC[0],y2:headC[1]+hr*0.6,stroke:skin,'stroke-width':u*0.1},g);
  if(o.sil){el('ellipse',{cx:headC[0],cy:headC[1],rx:hr*0.95,ry:hr*1.08,fill:col,transform:'rotate('+roll+' '+headC[0]+' '+(headC[1]+hr)+')'},g);if(o.arms==='face'){}}
  else{var fo={};for(var k in (o.face||{}))fo[k]=o.face[k];fo.who=o.who||'haru';fo.roll=roll;fo.gy=(fo.gy||0)-pitch*0.6;faceS(g,headC[0],headC[1]-pitch*hr*0.15,hr,fo);
    if(o.arms==='face')[-1,1].forEach(function(d){el('ellipse',{cx:headC[0]+d*hr*0.32,cy:headC[1]+hr*0.15,rx:hr*0.34,ry:hr*0.42,fill:SKIN,stroke:INK,'stroke-width':1.4},g);});}
  return {g:g,L:L,R:R,neck:[nx,ny],head:headC};}

/* 자세로 읽히는 기분 — 연습장과 1부가 함께 쓴다(설명용 규칙) */
function moodFromPose(o){var a=o.arms||'side',p=o.pitch||0,lean=o.lean||0,roll=Math.abs(o.roll||0),su=o.sUp||0,why=[];
  var k='neutral';
  if(a==='hips'){k='blame';why.push('허리에 손 → 앞으로 맞서는 자세');}
  else if(a==='cross'){k=(roll>=8||lean>=8)?'grumble':'cold';why.push(roll>=8||lean>=8?'팔짱 + 몸이나 고개가 기울어 움직임이 생김':'팔짱 + 똑바로 선 정면 → 조용하고 차가움');}
  else if(a==='chest'){k=p>0.2||su>0.5?'joy':'worry';why.push(p>0.2||su>0.5?'가슴 앞 두 손 + 고개를 들거나 어깨를 올림 → 기쁨':'가슴 앞 두 손 + 고개를 숙임 → 걱정');}
  else if(a==='back'){k=roll>=8?'ponder':'calm';why.push(roll>=8?'뒷짐 + 고개 기울임 → 고민':'뒷짐 + 똑바로 → 차분함');}
  else if(a==='headback'){k='relax';why.push('머리 뒤 깍지 → 편안함');}
  else if(a==='up'){k='joy';why.push('두 팔 번쩍 → 기쁨이 밖으로 터짐');}
  else if(a==='fists'){k=lean>=5||p<-0.2?'anger':'tense';why.push(lean>=5||p<-0.2?'주먹 + 앞으로 숙인 자세 → 화를 참음':'주먹만 쥠 → 긴장');}
  else if(a==='face'){k='sad';why.push('두 손으로 얼굴을 가림 → 슬픔');}
  else if(a==='chin'){k=p<0?'ponder':'curious';why.push(p<0?'턱 괴고 고개 숙임 → 고민':'턱 괴기 → 궁금함');}
  else{if(lean>=12){k='curious';why.push('몸을 앞으로 기울임 → 들여다보기·관심');}else if(p<=-0.5){k='down';why.push('팔 내리고 고개를 숙임 → 가라앉음');}else if(p>=0.5){k='bright';why.push('팔 내리고 고개를 듦 → 밝음');}else why.push('팔 내리고 똑바로 → 아직 기분이 드러나지 않음');}
  if(p>=0.4&&k!=='bright')why.push('고개를 들어 밝은 쪽으로');if(p<=-0.4&&k!=='down')why.push('고개를 숙여 어두운 쪽으로');if(su>=0.6)why.push('어깨가 올라감 → '+(k==='joy'?'기쁨이 커짐':'긴장'));
  return {k:k,name:MOODN[k],why:why};}
var MOODN={blame:'비난·어이없음',grumble:'움직이는 불만',cold:'조용한 거리 두기',worry:'걱정',joy:'기쁨',ponder:'고민',calm:'차분함',relax:'편안함',anger:'화를 참음',tense:'긴장',sad:'슬픔',curious:'관심·궁금함',down:'가라앉음',bright:'밝음',neutral:'드러나지 않음'};

/* 얼굴 값으로 감정 찾기(설명용 기준값) */
var EMO={joy:{n:'喜 기쁨',brow:0.1,mouth:0.9,open:0.6,eye:0.9,pupil:1},anger:{n:'怒 분노',brow:-0.9,mouth:-0.6,open:0.35,eye:1,pupil:0.7},sad:{n:'哀 슬픔',brow:0.9,mouth:-0.55,open:0.1,eye:0.75,pupil:1},
  ease:{n:'楽 편안',brow:0.15,mouth:0.4,open:0,eye:0.75,pupil:1},surprise:{n:'驚 놀람',brow:0.45,mouth:0,open:0.9,eye:1.4,pupil:0.5},blank:{n:'虚 멍함',brow:0,mouth:-0.05,open:0.12,eye:0.7,pupil:0.85}};
var EMOK=['joy','anger','sad','ease','surprise','blank'];
function emoDist(o,k){var t=EMO[k];return Math.sqrt(Math.pow(o.brow-t.brow,2)+Math.pow(o.mouth-t.mouth,2)+Math.pow(o.open-t.open,2)+Math.pow((o.eye-t.eye)/1.2,2)+Math.pow((o.pupil-t.pupil)/0.8,2));}
function emoMatch(o,k){return clamp(100-emoDist(o,k)*55,0,100);}
function emoNearest(o){var best=null,bd=9;EMOK.forEach(function(k){var d=emoDist(o,k);if(d<bd){bd=d;best=k;}});return best;}

/* ===================== 공용: 빛 받는 공(캔버스) ===================== */
var LDIR={top:[0,0.95,0.3],ul:[-0.55,0.6,0.58],side:[-1,0.05,0.2],bottom:[0,-0.95,0.3],back:[0,0.2,-1]};
var LNAME={top:'바로 위',ul:'왼쪽 위(약하게 쓰기 좋은 기본)',side:'바로 옆',bottom:'바로 아래',back:'바로 뒤(역광)'};
/* lights: [{d:[x,y,z],k:세기}], amb, rim(테두리 세기), fill(아래 반사광 세기) */
function sphere(ctx,cx,cy,R,lights,o){o=o||{};var img=ctx.createImageData(2*R,2*R),D=img.data;var tones=[0,0,0];
  for(var y=0;y<2*R;y++)for(var x=0;x<2*R;x++){var nx=(x-R)/R,ny=(R-y)/R,rr=nx*nx+ny*ny;var i=(y*2*R+x)*4;if(rr>1){D[i+3]=0;continue;}var nz=Math.sqrt(1-rr),b=o.amb==null?0.12:o.amb;
    lights.forEach(function(L){var l=norm(L.d);b+=L.k*Math.max(0,nx*l[0]+ny*l[1]+nz*l[2]);});
    if(o.fill)b+=o.fill*Math.max(0,-ny)*0.6;if(o.rim)b+=o.rim*Math.pow(1-nz,3);b=clamp(b,0,1.2);
    if(o.count){var lit=0;lights.forEach(function(L){var l=norm(L.d);if(L.k>0.02&&nx*l[0]+ny*l[1]+nz*l[2]>0.05)lit++;});var ti=lit===0?0:(lit===lights.length?2:1);tones[ti]++;if(o.cel)b=[0.22,0.55,0.95][ti];}
    else{if(o.cel){b=b<0.33?0.22:b<0.7?0.55:0.95;}tones[b<0.33?0:b<0.7?1:2]++;}var v=40+b*180;D[i]=v*1.02;D[i+1]=v*0.97;D[i+2]=v*0.95;D[i+3]=255;}
  ctx.putImageData(img,cx-R,cy-R);var tot=tones[0]+tones[1]+tones[2];return tones.map(function(t){return t/tot;});}
function arrow(s,x1,y1,x2,y2,col,w){col=col||C.purple;var a=Math.atan2(y2-y1,x2-x1),L=9;var g=el('g',{},s);el('line',{x1:x1,y1:y1,x2:x2,y2:y2,stroke:col,'stroke-width':w||2.6,'stroke-linecap':'round'},g);
  el('path',{d:'M'+x2+','+y2+' L'+(x2-L*Math.cos(a-0.45))+','+(y2-L*Math.sin(a-0.45))+' L'+(x2-L*Math.cos(a+0.45))+','+(y2-L*Math.sin(a+0.45))+'Z',fill:col},g);return g;}
