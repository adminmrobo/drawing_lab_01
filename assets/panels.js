/* 구조 먼저 보는 캐릭터 그리기 연구실 — 실험 패널 모음 (외부 라이브러리 없음) */
(function(){
'use strict';
var NS='http://www.w3.org/2000/svg';
var C={teal:'#0f8f84',orange:'#e8731a',navy:'#1e2f6e',blue:'#2458d6',green:'#13733a',red:'#c9302c',purple:'#6b4fb0',grid:'#e3e8ee',muted:'#5b6874',ink:'#16212b'};
var KFONT='"IBM Plex Sans KR","Malgun Gothic","Noto Sans KR",sans-serif';
var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var P={};

/* ---------- 공용 도구 ---------- */
function el(tag,a,parent){var e=document.createElementNS(NS,tag);for(var k in a){if(a[k]!=null)e.setAttribute(k,a[k]);}if(parent)parent.appendChild(e);return e;}
function ktxt(p,x,y,s,a){a=a||{};var t=el('text',{x:x,y:y,'font-size':a.size||13,fill:a.fill||C.muted,'font-family':KFONT,'text-anchor':a.anchor||'start','font-weight':a.weight||'normal'},p);t.textContent=s;return t;}
function svgOf(h,W,H,label){h.innerHTML='';return el('svg',{viewBox:'0 0 '+W+' '+H,role:'img','aria-label':'실험 그림: '+(label||noteOf(h))},h);}
function noteOf(h){var n=h.parentNode&&h.parentNode.querySelector('.ph small');return n?n.textContent:'';}
function canvasOf(h,W,H,mw){h.innerHTML='';var c=document.createElement('canvas');c.width=W;c.height=H;c.style.width='100%';c.style.maxWidth=(mw||W*1.2)+'px';c.style.margin='0 auto';c.style.height='auto';c.style.display='block';c.style.borderRadius='10px';c.setAttribute('role','img');c.setAttribute('aria-label','실험 그림: '+noteOf(h));h.appendChild(c);return c;}
function out(h){return h.parentNode.querySelector('.readout');}
function ctl(h){return h.parentNode.querySelector('.ctrl');}
function f2(v,d){d=d==null?2:d;if(d===0)return String(Math.round(v));var m=Math.pow(10,d);var s=(Math.round(v*m)/m).toFixed(d);s=s.replace(/\.?0+$/,'');if(s==='-0')s='0';return s;}
function num(v,d){return v<0?'−'+f2(-v,d):f2(v,d);}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function lerp(a,b,t){return a+(b-a)*t;}
function hex(c){c=c.replace('#','');return[parseInt(c.substr(0,2),16),parseInt(c.substr(2,2),16),parseInt(c.substr(4,2),16)];}
function rgb(a){return 'rgb('+a.map(function(v){return Math.round(clamp(v,0,255));}).join(',')+')';}
function mix(c1,c2,t){var a=hex(c1),b=hex(c2);return rgb([lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)]);}
function shade(c,k){var a=hex(c);return rgb([a[0]*k,a[1]*k,a[2]*k]);}
function rad(d){return d*Math.PI/180;}
function seg(h,sel,cb){var bs=ctl(h).querySelectorAll(sel);bs.forEach(function(b){b.addEventListener('click',function(){bs.forEach(function(x){x.classList.remove('on');});b.classList.add('on');cb(b);});});}
function rng(seed){var s=seed>>>0||1;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function onIn(inp,f){inp.addEventListener('input',f);}
function svgPt(s,e){var m=s.getScreenCTM().inverse();var q=s.createSVGPoint();q.x=e.clientX;q.y=e.clientY;return q.matrixTransform(m);}

/* ---------- 캐릭터 얼굴(가슴 위) 그리기 — 캔버스 ---------- */
var CH={
 haru:{hair:'#E9909A',hair2:'#D9707E',streak:'#1E2F5C',buns:true,ahoge:true,eye:'#3D8BE0',skin:'#F6D3B8',outfit:'hoodie',long:true},
 sia:{hair:'#1E1B22',hair2:'#4A4656',eye:'#7A7680',skin:'#F6D9C4',outfit:'maid',long:true,earring:true},
 moa:{hair:'#D8C09A',hair2:'#B89C74',eye:'#B07A3E',skin:'#F8DCC8',outfit:'cardigan',long:true,headband:true,ribbon:'L',wavy:true}
};
function cfg(name,over){var o={};var b=CH[name];for(var k in b)o[k]=b[k];for(var j in over)o[j]=over[j];return o;}
function drawBust(ctx,W,H,o){
  var cx=W/2,s=W/200;ctx.save();ctx.clearRect(0,0,W,H);ctx.fillStyle=o.bg||'#f4f6f9';ctx.fillRect(0,0,W,H);
  var ln=o.line||2.2*s;ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle=o.ink||'#2a2230';ctx.lineWidth=ln;
  function E(x,y,rx,ry,fill,stroke){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke!==false)ctx.stroke();}
  // 뒷머리
  if(o.long){ctx.fillStyle=o.hair;ctx.beginPath();ctx.moveTo(cx-48*s,78*s);ctx.quadraticCurveTo(cx-62*s,150*s,cx-52*s,200*s);ctx.lineTo(cx+52*s,200*s);ctx.quadraticCurveTo(cx+62*s,150*s,cx+48*s,78*s);ctx.closePath();ctx.fill();ctx.stroke();}
  else{ctx.fillStyle=o.hair;ctx.beginPath();ctx.moveTo(cx-46*s,80*s);ctx.quadraticCurveTo(cx-50*s,120*s,cx-36*s,128*s);ctx.lineTo(cx+36*s,128*s);ctx.quadraticCurveTo(cx+50*s,120*s,cx+46*s,80*s);ctx.closePath();ctx.fill();ctx.stroke();}
  // 몸·옷
  var body=o.outfit==='maid'?'#34363F':o.outfit==='cardigan'?'#D4B48A':o.outfit==='generic'?'#8a93a6':'#A99AC8';
  ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(cx-70*s,200*s);ctx.quadraticCurveTo(cx-66*s,150*s,cx-26*s,140*s);ctx.lineTo(cx+26*s,140*s);ctx.quadraticCurveTo(cx+66*s,150*s,cx+70*s,200*s);ctx.closePath();ctx.fill();ctx.stroke();
  if(o.outfit==='hoodie'&&o.coat!==false){ctx.fillStyle='#fbfbfd';ctx.beginPath();ctx.moveTo(cx-70*s,200*s);ctx.quadraticCurveTo(cx-66*s,150*s,cx-30*s,141*s);ctx.lineTo(cx-18*s,200*s);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(cx+70*s,200*s);ctx.quadraticCurveTo(cx+66*s,150*s,cx+30*s,141*s);ctx.lineTo(cx+18*s,200*s);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#ffffff';ctx.beginPath();ctx.moveTo(cx-8*s,150*s);ctx.lineTo(cx-10*s,175*s);ctx.moveTo(cx+8*s,150*s);ctx.lineTo(cx+10*s,175*s);ctx.stroke();ctx.strokeStyle=o.ink||'#2a2230';}
  if(o.outfit==='maid'){ctx.fillStyle='#fbfbfd';ctx.fillRect(cx-16*s,136*s,32*s,12*s);ctx.strokeRect(cx-16*s,136*s,32*s,12*s);ctx.fillStyle='#8C8C94';E(cx-12*s,154*s,12*s,8*s,'#8C8C94');E(cx+12*s,154*s,12*s,8*s,'#8C8C94');E(cx,154*s,5*s,5*s,'#77777f');
    ctx.fillStyle='#F4F2EE';ctx.beginPath();ctx.moveTo(cx-30*s,200*s);ctx.lineTo(cx-24*s,172*s);ctx.lineTo(cx+24*s,172*s);ctx.lineTo(cx+30*s,200*s);ctx.closePath();ctx.fill();ctx.stroke();}
  if(o.outfit==='cardigan'){ctx.fillStyle='#ffffff';ctx.beginPath();ctx.moveTo(cx-18*s,142*s);ctx.lineTo(cx,175*s);ctx.lineTo(cx+18*s,142*s);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#A8323C';ctx.beginPath();ctx.moveTo(cx,150*s);ctx.lineTo(cx-12*s,144*s);ctx.lineTo(cx-12*s,158*s);ctx.closePath();ctx.moveTo(cx,150*s);ctx.lineTo(cx+12*s,144*s);ctx.lineTo(cx+12*s,158*s);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#FAF8F4';ctx.beginPath();ctx.moveTo(cx-34*s,200*s);ctx.lineTo(cx-28*s,178*s);ctx.lineTo(cx+28*s,178*s);ctx.lineTo(cx+34*s,200*s);ctx.closePath();ctx.fill();ctx.stroke();}
  // 목·얼굴
  ctx.fillStyle=o.skin;ctx.fillRect(cx-11*s,118*s,22*s,24*s);ctx.beginPath();ctx.moveTo(cx-11*s,118*s);ctx.lineTo(cx-11*s,140*s);ctx.moveTo(cx+11*s,118*s);ctx.lineTo(cx+11*s,140*s);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-38*s,70*s);ctx.quadraticCurveTo(cx-40*s,112*s,cx,128*s);ctx.quadraticCurveTo(cx+40*s,112*s,cx+38*s,70*s);ctx.closePath();ctx.fillStyle=o.skin;ctx.fill();ctx.stroke();
  // 눈
  [-1,1].forEach(function(d){var ex=cx+d*17*s,ey=96*s;E(ex,ey,8.5*s,10.5*s,'#ffffff');E(ex,ey+1*s,6.5*s,8.5*s,o.eye,false);E(ex,ey+2*s,3.4*s,4.6*s,shade(o.eye,0.45),false);E(ex-2.4*s,ey-3*s,2.2*s,2.2*s,'#ffffff',false);
    ctx.beginPath();ctx.moveTo(ex-10*s,ey-10*s);ctx.quadraticCurveTo(ex,ey-14*s,ex+10*s,ey-9*s);ctx.lineWidth=ln*1.4;ctx.stroke();ctx.lineWidth=ln;});
  ctx.beginPath();ctx.moveTo(cx-5*s,116*s);ctx.quadraticCurveTo(cx,119*s,cx+5*s,116*s);ctx.stroke();
  if(o.blush!==false){ctx.fillStyle='rgba(240,120,130,.25)';E(cx-26*s,108*s,6*s,3*s,'rgba(240,120,130,.25)',false);E(cx+26*s,108*s,6*s,3*s,'rgba(240,120,130,.25)',false);}
  // 앞머리
  ctx.fillStyle=o.hair;ctx.beginPath();ctx.moveTo(cx-46*s,88*s);ctx.quadraticCurveTo(cx-50*s,34*s,cx,30*s);ctx.quadraticCurveTo(cx+50*s,34*s,cx+46*s,88*s);
  if(o.wavy){ctx.quadraticCurveTo(cx+30*s,76*s,cx+22*s,82*s);ctx.quadraticCurveTo(cx+10*s,72*s,cx,80*s);ctx.quadraticCurveTo(cx-10*s,72*s,cx-22*s,82*s);ctx.quadraticCurveTo(cx-30*s,76*s,cx-46*s,88*s);}
  else{ctx.lineTo(cx+36*s,74*s);ctx.lineTo(cx+24*s,84*s);ctx.lineTo(cx+12*s,72*s);ctx.lineTo(cx,84*s);ctx.lineTo(cx-12*s,72*s);ctx.lineTo(cx-24*s,84*s);ctx.lineTo(cx-36*s,74*s);}
  ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle=o.hair2;ctx.beginPath();ctx.moveTo(cx-30*s,44*s);ctx.quadraticCurveTo(cx-20*s,40*s,cx-10*s,46*s);ctx.stroke();ctx.strokeStyle=o.ink||'#2a2230';
  if(o.streak){ctx.fillStyle=o.streak;ctx.beginPath();ctx.moveTo(cx-6*s,31*s);ctx.lineTo(cx+6*s,31*s);ctx.lineTo(cx+5*s,80*s);ctx.lineTo(cx,84*s);ctx.lineTo(cx-5*s,80*s);ctx.closePath();ctx.fill();
    ctx.fillRect(cx-46*s+4*s,100*s,6*s,70*s);ctx.fillRect(cx+46*s-10*s,100*s,6*s,70*s);}
  if(o.buns){E(cx-30*s,30*s,15*s,14*s,o.hair);E(cx+30*s,30*s,15*s,14*s,o.hair);ctx.strokeStyle=o.hair2;ctx.beginPath();ctx.arc(cx-30*s,30*s,8*s,3.6,5.6);ctx.stroke();ctx.beginPath();ctx.arc(cx+30*s,30*s,8*s,3.6,5.6);ctx.stroke();ctx.strokeStyle=o.ink||'#2a2230';}
  if(o.ahoge){ctx.beginPath();ctx.moveTo(cx+2*s,30*s);ctx.quadraticCurveTo(cx+14*s,12*s,cx+4*s,8*s);ctx.lineWidth=ln*1.2;ctx.strokeStyle=o.hair2;ctx.stroke();ctx.lineWidth=ln;ctx.strokeStyle=o.ink||'#2a2230';}
  if(o.headband){ctx.fillStyle='#ffffff';ctx.beginPath();ctx.ellipse(cx,38*s,44*s,12*s,0,Math.PI*1.05,Math.PI*1.95);ctx.lineWidth=7*s;ctx.strokeStyle='#ffffff';ctx.stroke();ctx.lineWidth=ln;ctx.strokeStyle=o.ink||'#2a2230';
    for(var i=-3;i<=3;i++){E(cx+i*11*s,27*s+Math.abs(i)*2.2*s,4.5*s,4*s,'#ffffff');}}
  if(o.ribbon){var side=o.ribbon==='L'?1:-1;var rx=cx+side*44*s,ry=60*s;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-10*s,ry-7*s);ctx.lineTo(rx-10*s,ry+7*s);ctx.closePath();ctx.moveTo(rx,ry);ctx.lineTo(rx+10*s,ry-7*s);ctx.lineTo(rx+10*s,ry+7*s);ctx.closePath();ctx.fill();ctx.stroke();}
  if(o.earring){ctx.fillStyle='#c9ccd6';E(cx-39*s,108*s,2.5*s,4*s,'#c9ccd6');E(cx+39*s,108*s,2.5*s,4*s,'#c9ccd6');}
  ctx.restore();
}
function pixelate(src,dst,block){var W=dst.width,H=dst.height,ctx=dst.getContext('2d');if(block<=1){ctx.imageSmoothingEnabled=true;ctx.drawImage(src,0,0,W,H);return;}
  var t=document.createElement('canvas');t.width=Math.max(1,Math.round(W/block));t.height=Math.max(1,Math.round(H/block));var tc=t.getContext('2d');tc.imageSmoothingEnabled=true;tc.drawImage(src,0,0,t.width,t.height);
  ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,W,H);ctx.drawImage(t,0,0,W,H);ctx.imageSmoothingEnabled=true;}
function offBust(name,over,W){var c=document.createElement('canvas');c.width=W||200;c.height=W||200;drawBust(c.getContext('2d'),c.width,c.height,cfg(name,over||{}));return c;}

/* ---------- 3D 도형 마네킹 ---------- */
function limb(a,b,t,part){var dx=b[0]-a[0],dy=b[1]-a[1];return {c:[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2],s:[t,Math.hypot(dx,dy),t*0.95],rz:Math.atan2(dx,dy)*-1,part:part,ends:[a,b]};}
function mannequin(pose){pose=pose||'hip';
  var B=[];function box(c,s,part){B.push({c:c,s:s,rz:0,part:part});}
  box([0,7.45,0],[0.82,1.0,0.88],'head');box([0,6.78,0],[0.32,0.36,0.32],'neck');box([0,5.95,0],[1.6,1.45,1.0],'chest');box([0,4.62,0],[1.36,1.15,0.85],'pelvis');
  var L=[0.96,6.5,0],R=[-0.96,6.5,0];
  var le=[1.12,5.0,0],lh=[1.18,3.65,0.05];
  var re,rh;if(pose==='up'){re=[-1.15,8.0,0];rh=[-1.2,9.4,0];le=[1.15,8.0,0];lh=[1.2,9.4,0];}else{re=[-1.55,5.35,-0.1];rh=[-0.82,4.75,0.15];}
  B.push(limb(L,le,0.36,'uarm'));B.push(limb(le,lh,0.3,'farm'));B.push(limb(R,re,0.36,'uarm'));B.push(limb(re,rh,0.3,'farm'));
  [0.38,-0.38].forEach(function(x){var hp=[x,4.15,0],kn=[x*1.05,2.2,0.05],an=[x*1.08,0.35,0];B.push(limb(hp,kn,0.5,'thigh'));B.push(limb(kn,an,0.38,'shin'));box([x*1.08,0.14,0.18],[0.34,0.28,0.7],'foot');});
  B.joints={head:[0,7.45,0],neck:[0,6.6,0],ls:L,rs:R,le:le,lh:lh,re:re,rh:rh,lp:[0.38,4.15,0],rp:[-0.38,4.15,0],lk:[0.4,2.2,0.05],rk:[-0.4,2.2,0.05],la:[0.41,0.35,0],ra:[-0.41,0.35,0]};
  return B;}
var FACES=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[1,2,6,5],[0,3,7,4]];
function boxVerts(b){var w=b.s[0]/2,h=b.s[1]/2,d=b.s[2]/2,c=Math.cos(b.rz),s=Math.sin(b.rz);
  var L=[[-w,-h,-d],[w,-h,-d],[w,h,-d],[-w,h,-d],[-w,-h,d],[w,-h,d],[w,h,d],[-w,h,d]];
  return L.map(function(p){var x=p[0]*c-p[1]*s,y=p[0]*s+p[1]*c;return[x+b.c[0],y+b.c[1],p[2]+b.c[2]];});}
function rotY(p,a){var c=Math.cos(a),s=Math.sin(a);return[p[0]*c+p[2]*s,p[1],-p[0]*s+p[2]*c];}
function sub3(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function norm(a){var l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
var PARTCOL={head:'#E9909A',neck:'#F6D3B8',chest:'#A99AC8',pelvis:'#5b7fb8',uarm:'#fbfbfd',farm:'#fbfbfd',thigh:'#5b7fb8',shin:'#5b7fb8',foot:'#A99AC8'};
function renderMan(s,o){/* o: yaw, mode(shade|flat|edge|depth|blocks|sketch|line|color), W,H,scale,ox,oy, light */
  var B=mannequin(o.pose),yaw=rad(o.yaw||0),Lt=norm(o.light||[-0.55,0.65,0.55]);
  var sc=o.scale||40,ox=o.ox||o.W/2,oy=o.oy||o.H-20;var polys=[];var zmin=1e9,zmax=-1e9;
  B.forEach(function(b){var V=boxVerts(b).map(function(p){return rotY(p,yaw);});
    FACES.forEach(function(f){var a=V[f[0]],bb=V[f[1]],c=V[f[2]];var n=norm(cross(sub3(bb,a),sub3(c,a)));
      var cen=[0,0,0];f.forEach(function(i){cen[0]+=V[i][0]/4;cen[1]+=V[i][1]/4;cen[2]+=V[i][2]/4;});
      // 바깥쪽 법선으로 맞춤
      var bc=rotY(b.c,yaw);if(dot(n,sub3(cen,bc))<0)n=[-n[0],-n[1],-n[2]];
      if(n[2]<=0.001)return;zmin=Math.min(zmin,cen[2]);zmax=Math.max(zmax,cen[2]);
      polys.push({pts:f.map(function(i){return[ox+V[i][0]*sc,oy-V[i][1]*sc];}),z:cen[2],n:n,part:b.part});});});
  polys.sort(function(a,b){return a.z-b.z;});var g=el('g',{},s);var R=rng(7);
  polys.forEach(function(p){var d=p.pts.map(function(q){return q[0].toFixed(1)+','+q[1].toFixed(1);}).join(' ');
    var br=0.28+0.72*Math.max(0,dot(p.n,Lt));var m=o.mode;
    if(m==='shade')el('polygon',{points:d,fill:mix('#3b3f4a','#eef1f6',br),stroke:'#2a2e38','stroke-width':0.8},g);
    else if(m==='flat')el('polygon',{points:d,fill:o.flat||'#f2d9c6',stroke:o.flat||'#f2d9c6','stroke-width':0.6},g);
    else if(m==='blocks')el('polygon',{points:d,fill:'none',stroke:C.blue,'stroke-width':1.3},g);
    else if(m==='sketch'){var q=p.pts.map(function(v){return[v[0]+(R()-.5)*3,v[1]+(R()-.5)*3];});el('polygon',{points:q.map(function(v){return v[0].toFixed(1)+','+v[1].toFixed(1);}).join(' '),fill:'none',stroke:'#8a8f99','stroke-width':1,opacity:.85},g);}
    else if(m==='line')el('polygon',{points:d,fill:'#ffffff',stroke:'#1d1a22','stroke-width':1.4},g);
    else if(m==='color'){var A=hex(PARTCOL[p.part]||'#dddddd');el('polygon',{points:d,fill:rgb(A.map(function(v){return v*(0.6+0.4*br);})),stroke:'#1d1a22','stroke-width':1.2},g);}
    else if(m==='edge')el('polygon',{points:d,fill:'#000',stroke:'#fff','stroke-width':1.1},g);
    else if(m==='depth'){var t=(p.z-zmin)/Math.max(1e-6,zmax-zmin);var v=Math.round(70+t*185);el('polygon',{points:d,fill:'rgb('+v+','+v+','+v+')',stroke:'rgb('+v+','+v+','+v+')','stroke-width':0.6},g);}
  });
  var J={};for(var k in B.joints){var r=rotY(B.joints[k],yaw);J[k]=[ox+r[0]*sc,oy-r[1]*sc,r[2]];}
  return {g:g,J:J};}


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
function board(el_,items){el_.innerHTML=items.map(function(it){return '<div class="'+(it[2]?'good':'bad')+'"><span>'+it[0]+'</span><b>'+it[1]+'</b></div>';}).join('');}
function say(el_,lines){el_.innerHTML=lines.map(function(l){return '<div class="line"><img src="../assets/chars/'+l[0]+'_'+l[1]+'.webp" alt="" width="48" height="48"><div class="bub"><b>'+l[2]+'</b>'+l[3]+'</div></div>';}).join('');}
function missions(el_,state,touched){el_.querySelectorAll('li').forEach(function(li,i){if(touched&&state[i])li.classList.add('done');});}
var DONE={};

/* ===================== 실전 연습장 ===================== */
function practice(){var root=document.getElementById('practice');if(!root)return;var tabs=root.querySelectorAll('.tabs button'),scenes=root.querySelectorAll('.scene');
  function show(id){tabs.forEach(function(b){b.classList.toggle('on',b.dataset.t===id);});scenes.forEach(function(s){s.classList.toggle('on',s.id===id);});if(history.replaceState)history.replaceState(null,'','#'+id);}
  tabs.forEach(function(b){b.addEventListener('click',function(){show(b.dataset.t);});});var hsh=(location.hash||'').slice(1);show([].some.call(scenes,function(s){return s.id===hsh;})?hsh:'stage');
  stage();faceshop();lightroom();desk();}
function wire(S,f){S.querySelectorAll('.ctrl input,.ctrl select').forEach(function(i){i.addEventListener(i.tagName==='SELECT'||i.type==='checkbox'?'change':'input',f);});}
var SIT={blame:['비난','"도대체 어떻게 할 거야?"를 따지듯 묻는다'],worry:['걱정','"어떡하지…" 하고 걱정스럽게 묻는다'],joy:['기쁨','"정말? 어떻게 할 거야!" 하고 들떠서 묻는다'],relax:['편안','"뭐, 어떻게 하든 괜찮아" 하고 느긋하게 말한다'],anger:['화를 참음','"…어떻게 할 건데" 하고 화를 누르며 묻는다']};
function stage(){var S=document.getElementById('stage');if(!S)return;var q=function(n){return S.querySelector('[name='+n+']');};var touched=false,got={};
  function upd(){var sit=q('sit').value,o={arms:q('arms').value,lean:+q('lean').value,roll:+q('roll').value,pitch:+q('pitch').value/10,sUp:+q('sup').value/10};var m=moodFromPose(o);
    var want={blame:['blame'],worry:['worry'],joy:['joy'],relax:['relax','calm'],anger:['anger']}[sit],ok=want.indexOf(m.k)>=0;
    if(touched&&ok)got[sit]=got[sit]||{};if(touched&&sit==='worry'&&ok&&o.pitch<=-0.3&&o.arms==='chest')got.worry2=1;if(touched&&sit==='joy'&&ok&&o.sUp>=0.6)got.joy2=1;
    board(S.querySelector('.board'),[['목표 기분',SIT[sit][0],true],['읽히는 기분',m.name,ok],['고개',o.pitch>0.2?'듦(밝게)':o.pitch<-0.2?'숙임(어둡게)':'정면',true],['어깨',o.sUp>=0.6?'올림':'보통',true]]);
    var s=el('svg',{viewBox:'0 0 360 330',role:'img','aria-label':'무대 위 자세'});var g1=S.querySelector('.g1');g1.innerHTML='';g1.appendChild(s);el('rect',{x:0,y:0,width:360,height:330,fill:'#fbfcfd'},s);
    var o2={};for(var k in o)o2[k]=o[k];o2.who='sia';o2.face=FACE1[m.k]||{};figure(s,180,322,108,o2);
    var s2=el('svg',{viewBox:'0 0 360 200',role:'img','aria-label':'자세 실루엣'});var g2=S.querySelector('.g2');g2.innerHTML='';g2.appendChild(s2);el('rect',{x:0,y:0,width:360,height:200,fill:'#eef1f5'},s2);var o3={};for(var k2 in o)o3[k2]=o[k2];o3.sil=true;figure(s2,180,196,64,o3);ktxt(s2,10,20,'실루엣으로도 읽히나?',{size:12,fill:C.muted});
    var M=[!!got.blame,!!got.worry2,!!got.joy2];missions(S.querySelector('.missions'),M,touched);
    say(S.querySelector('.talk'),[['doctor','e10','박사','대사: '+SIT[sit][1]+'.'],['sia','e10','시아','지금 자세는 \''+m.name+'\'로 읽혀요. '+m.why.join(' / ')+'.'],['fruitfly','e09','초파리',ok?'목표와 맞았어. 실루엣으로도 같은 기분이 읽히는지 확인해 봐.':'팔 모양부터 바꿔 봐. 실루엣에서 가장 먼저 읽히는 게 팔이야.'],['jupanbot','e16','주판봇',ok?'맞았습니다! 다음 상황도 맞히겠습니다!':'표정만 바꾸면 되지 않나요… 아, 몸이 먼저군요!']]);}
  wire(S,function(){touched=true;upd();});upd();}
function faceshop(){var S=document.getElementById('faceshop');if(!S)return;var q=function(n){return S.querySelector('[name='+n+']');};var touched=false,best={};
  function upd(){var tg=q('target').value,o={brow:+q('brow').value/10,mouth:+q('mouth').value/10,open:+q('open').value/10,eye:+q('eye').value/10,pupil:+q('pupil').value/10};var sc=emoMatch(o,tg),near=emoNearest(o);
    if(touched)best[tg]=Math.max(best[tg]||0,sc);
    board(S.querySelector('.board'),[['목표',EMO[tg].n,true],['닮음',f2(sc,0)+'%',sc>=80],['가장 가까운 감정',EMO[near].n,near===tg],['눈동자',f2(o.pupil*100,0)+'%',true]]);
    var s=el('svg',{viewBox:'0 0 360 330',role:'img','aria-label':'내가 만든 표정'});var g1=S.querySelector('.g1');g1.innerHTML='';g1.appendChild(s);el('rect',{x:0,y:0,width:360,height:330,fill:'#fbfcfd'},s);
    var fo={who:'moa',brow:o.brow,mouth:o.mouth,open:o.open,eye:o.eye,pupil:o.pupil,hairUp:tg==='surprise'&&o.eye>1.2?0.5:0,closed:o.eye<0.2?(o.mouth>0.3?'smile':'calm'):''};faceS(s,180,175,110,fo);
    var s2=el('svg',{viewBox:'0 0 360 200',role:'img','aria-label':'여섯 감정과의 닮음'});var g2=S.querySelector('.g2');g2.innerHTML='';g2.appendChild(s2);
    EMOK.forEach(function(k,i){var v=emoMatch(o,k);el('rect',{x:110,y:12+i*31,width:230*v/100,height:20,rx:4,fill:k===tg?C.teal:'#c9d3e6'},s2);ktxt(s2,104,27+i*31,EMO[k].n,{size:12.5,anchor:'end',fill:C.ink});ktxt(s2,116+230*v/100,27+i*31,f2(v,0)+'%',{size:11.5});});
    var M=[(best.joy||0)>=80,(best.anger||0)>=80,(best.surprise||0)>=80];missions(S.querySelector('.missions'),M,touched);
    var t=EMO[tg],tip=[];if(Math.abs(o.brow-t.brow)>0.4)tip.push('눈썹 안쪽을 '+(o.brow<t.brow?'올리세요':'내리세요'));if(Math.abs(o.mouth-t.mouth)>0.4)tip.push('입꼬리를 '+(o.mouth<t.mouth?'올리세요':'내리세요'));if(Math.abs(o.pupil-t.pupil)>0.3)tip.push('눈동자를 '+(o.pupil<t.pupil?'키우세요':'줄이세요'));
    var dd=emoDist(o,tg);say(S.querySelector('.talk'),[['doctor','e10','박사','목표는 '+t.n+'. 닮음 = 100 − 거리 × 55 = 100 − '+f2(dd,2)+' × 55 = '+f2(sc,0)+'%. 거리는 눈썹·입꼬리·입 벌림의 차이와, 눈 뜬 정도 차이 ÷ 1.2, 눈동자 차이 ÷ 0.8을 각각 제곱해 더한 뒤 제곱근을 씌운 값입니다(55·1.2·0.8은 예시 보정값).'],['haru','e10','조수',tip.length?tip.join(', ')+'.':'눈썹·입·눈이 모두 맞았어요!'],['fruitfly','e09','초파리',tg==='surprise'?'놀람은 눈을 크게, 눈동자는 작게. 거꾸로 하면 기쁨처럼 보여.':'눈썹과 입 두 곳부터 맞추면 빨라.'],['jupanbot','e16','주판봇',sc>=80?'80% 넘었습니다!':'전부 최대로 올리면… 안 되는군요.']]);}
  wire(S,function(){touched=true;upd();});upd();}
var SCENE={mystery:['의미심장','"…그래서, 어떻게 할 거야?" 하고 조용히 묻는 반전 장면'],warm:['따뜻한 기쁨','좋은 소식을 듣고 웃는 장면'],horror:['섬뜩함','괴담을 들려주는 장면'],gloom:['침울','실패 소식을 듣고 고개를 숙인 장면']};
function sceneOk(sc,o){if(sc==='mystery')return o.dir==='back'&&o.rim>=5;if(sc==='warm')return (o.dir==='ul'||o.dir==='top')&&o.red&&!o.blue;if(sc==='horror')return o.dir==='bottom'&&o.k>=6;if(sc==='gloom')return (o.blue||o.shade)&&!o.red&&(o.dir==='top'||o.dir==='back');return false;}
function lightroom(){var S=document.getElementById('lightroom');if(!S)return;var q=function(n){return S.querySelector('[name='+n+']');};var touched=false,got={};var cv=document.createElement('canvas');cv.width=360;cv.height=200;cv.style.cssText='width:100%;border-radius:10px';cv.setAttribute('role','img');cv.setAttribute('aria-label','빛 받는 공');var ctx=cv.getContext('2d');
  function upd(){var sc=q('scene').value,o={dir:q('dir').value,k:+q('k').value,rim:+q('rim').value,red:q('red').checked,blue:q('blue').checked,shade:q('shade').checked};var ok=sceneOk(sc,o);if(touched&&ok)got[sc]=1;
    board(S.querySelector('.board'),[['장면',SCENE[sc][0],true],['빛',LNAME[o.dir].split('(')[0]+' · '+o.k,true],['테두리 빛',o.rim,true],['분위기 일치',ok?'맞음':'아직',ok]]);
    var s=el('svg',{viewBox:'0 0 360 330',role:'img','aria-label':'빛과 터치를 넣은 얼굴'});var g1=S.querySelector('.g1');g1.innerHTML='';g1.appendChild(s);el('rect',{x:0,y:0,width:360,height:330,fill:o.dir==='back'?'#2c2a3a':'#fbfcfd'},s);
    var emo={mystery:{brow:-0.1,mouth:0.2,gx:0.5},warm:{closed:'smile',mouth:0.8,open:0.4},horror:{brow:-0.2,mouth:0.3,eye:1.1,pupil:0.6},gloom:{brow:0.8,mouth:-0.4,eye:0.7}}[sc];var fo={who:'haru',red:o.red,blue:o.blue,shade:o.shade?0.8:(o.dir==='top'&&o.k>=6?0.4:0)};for(var k in emo)fo[k]=emo[k];
    faceS(s,180,170,110,fo);var d=LDIR[o.dir];var gr=el('defs',{},s);var lg=el('linearGradient',{id:'lr',x1:String(0.5-d[0]/2),y1:String(0.5+d[1]/2),x2:String(0.5+d[0]/2),y2:String(0.5-d[1]/2)},gr);el('stop',{offset:'0','stop-color':'#000','stop-opacity':o.dir==='back'?0.5*o.k/10:0},lg);el('stop',{offset:'1','stop-color':'#000','stop-opacity':0.55*o.k/10},lg);
    el('ellipse',{cx:180,cy:170,rx:90,ry:110,fill:'url(#lr)'},s);if(o.rim)el('ellipse',{cx:180,cy:170,rx:91,ry:111,fill:'none',stroke:'#fff','stroke-width':o.rim*0.7,opacity:0.85},s);
    var g2=S.querySelector('.g2');if(!g2.contains(cv)){g2.innerHTML='';g2.appendChild(cv);}ctx.fillStyle='#fbfcfd';ctx.fillRect(0,0,360,200);sphere(ctx,180,100,90,[{d:LDIR[o.dir],k:o.k/10}],{amb:0.12,rim:o.rim/10});
    var M=[!!got.mystery,!!got.horror,!!(got.warm&&got.gloom)];missions(S.querySelector('.missions'),M,touched);
    say(S.querySelector('.talk'),[['doctor','e10','박사','장면: '+SCENE[sc][1]+'.'],['haru','e10','조수',ok?'빛과 터치가 장면 분위기와 맞아요!':'아직 분위기가 달라요. '+LMOOD[o.dir]+'.'],['fruitfly','e09','초파리',sc==='mystery'?'역광에 테두리 빛을 넉넉히 줘 봐.':sc==='horror'?'평소엔 없는 쪽에서 빛을 넣어 봐.':sc==='warm'?'붉은 빗금은 따뜻함, 세로선은 창백함이야.':'창백한 세로선이나 얼굴 그늘을 써 봐.'],['jupanbot','e16','주판봇',o.red&&o.blue?'붉게도 파랗게도! …섞이니 이상하군요.':'조명은 제 화면 밝기로 해결하면…?']]);}
  wire(S,function(){touched=true;upd();});upd();}
var DESK_CA=['몸이 기분과 따로 놂','목 가동 범위 무시','눈썹 방향 반대','눈동자 크기 반대','감은 눈 곡선 반대','빛 방향이 기분과 반대','문장에 표정이 빠짐','가림 영역 과다'];
var DESK_SYM=['얼굴은 활짝 웃는데 몸은 차렷 자세로 굳어 있다','몸은 정면인데 얼굴만 완전한 옆을 보고 있다','화났다는 장면인데 눈썹 안쪽이 올라가 슬퍼 보인다','깜짝 놀란 장면인데 눈동자가 커져 반짝인다','웃으며 눈을 감았는데 눈 곡선이 아래로 처져 졸려 보인다','슬픈 장면에 아래에서 강한 빛을 비춰 섬뜩하다','무표정이라고 적었는데 은은한 미소가 들어갔다','표정만 바꿨는데 머리 모양과 얼굴이 달라졌다'];
function desk(){var S=document.getElementById('desk');if(!S)return;var CA=DESK_CA,SYM=DESK_SYM;
  var cur=0,streak=0,seen={},wrong=0,right=0,touched=false;var r=rng(Date.now()%9999+1);
  function next(){cur=Math.floor(r()*8);S.querySelector('.sym').textContent='증상: '+SYM[cur];var o=S.querySelector('.opts');o.innerHTML='';
    var opts=[cur];while(opts.length<4){var k=Math.floor(r()*8);if(opts.indexOf(k)<0)opts.push(k);}opts.sort(function(){return r()-.5;});
    opts.forEach(function(k){var b=document.createElement('button');b.type='button';b.textContent=CA[k];b.addEventListener('click',function(){touched=true;if(k===cur){streak++;right++;seen[cur]=1;b.classList.add('ok');setTimeout(next,500);}else{streak=0;wrong++;b.classList.add('no');}upd();});o.appendChild(b);});}
  function upd(){var n=Object.keys(seen).length;board(S.querySelector('.board'),[['연속 정답',streak,streak>=3],['맞힌 종류',n+' / 8',n===8],['맞힘',right,right>0],['틀림',wrong,wrong===0]]);
    var M=[streak>=3,n===8,right>=5&&wrong===0];if(touched)missions(S.querySelector('.missions'),M,true);
    var s=el('svg',{viewBox:'0 0 360 200',role:'img','aria-label':'맞힌 실패 종류'});var g=S.querySelector('.g2');g.innerHTML='';g.appendChild(s);CA.forEach(function(t,i){el('rect',{x:16+(i%4)*86,y:20+Math.floor(i/4)*90,width:78,height:70,rx:8,fill:seen[i]?'#e8f6ec':'#f2f4f7',stroke:seen[i]?C.green:'#d5dbe2'},s);ktxt(s,55+(i%4)*86,60+Math.floor(i/4)*90,'f'+(i+1)+(seen[i]?' ✓':''),{size:14,anchor:'middle',fill:seen[i]?C.green:C.muted,weight:700});});
    say(S.querySelector('.talk'),[['doctor','e10','박사','순서: 몸 → 눈썹·입 → 눈 → 빛·터치 → 문장·가림 영역.'],['haru','e10','조수','연속 '+streak+'개, 맞힌 종류 '+n+' / 8이에요.'],['x2','e09','평가단 X2',wrong?'틀린 건 6부 실패 카드에서 다시 보세요.':'아직 틀린 게 없어요!'],['jupanbot','e16','주판봇',streak>=3?'연속 정답! 제가 만든 실패작이라 잘 압니다!':'다음 문제는 제가 맞힙니다!']]);}
  next();upd();}

/* 프롬프트 복사 버튼 */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.promptbox .copy');if(!b)return;var pre=b.parentNode.querySelector('pre');if(!pre)return;var t=pre.textContent;
  if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){b.textContent='복사했습니다';},function(){b.textContent='직접 선택해 복사하세요';});else b.textContent='직접 선택해 복사하세요';});
/* ===================== 퀴즈·지식 색인·꾸러미 ===================== */
function quiz(q){var ans=+q.getAttribute('data-ans');var fb=q.querySelector('.fb');var OK=q.querySelector('.qok'),NO=q.querySelector('.qno');q.querySelectorAll('.opts button').forEach(function(b,i){b.addEventListener('click',function(){q.querySelectorAll('.opts button').forEach(function(x){x.classList.remove('ok','no');});b.classList.add(i===ans?'ok':'no');fb.innerHTML=i===ans?'⭕ '+OK.innerHTML:'❌ '+NO.innerHTML;});});}
function kg(){var raw=document.getElementById('kg-raw');var mount=document.getElementById('kg-mount');if(!raw||!mount)return;var K=JSON.parse(raw.textContent);
  mount.innerHTML='<input class="kg-search" type="search"><div class="kg-list"></div>';var list=mount.querySelector('.kg-list'),inp=mount.querySelector('input');inp.placeholder='개념 찾기 (예: 그림자, 주름, 강도)';inp.setAttribute('aria-label','지식 색인 검색');
  var TY={Concept:'개념',Method:'방법',Analogy:'비유',Application:'쓰임',OpenQuestion:'열린 질문'};var pre=document.body.getAttribute('data-root')||'';
  function render(){var qv=inp.value.trim().toLowerCase();list.innerHTML=K.nodes.filter(function(n){return !qv||(n.label.ko+' '+n.label.en+' '+n.definition.ko).toLowerCase().indexOf(qv)>=0;}).map(function(n){
    var nb=K.edges.filter(function(e){return e.s===n.id||e.o===n.id;}).map(function(e){var o=e.s===n.id?e.o:e.s;var m=K.nodes.filter(function(x){return x.id===o;})[0];return m?m.label.ko:'';}).filter(Boolean);
    return '<div class="kg-item"><span class="t">'+(TY[n.type]||n.type)+'</span><b>'+n.label.ko+'</b><span class="muted">'+n.label.en+'</span><div>'+n.definition.ko+'</div>'+(nb.length?'<div class="muted" style="font-size:12.5px">이웃: '+nb.join(', ')+'</div>':'')+'<a href="'+pre+n.page+n.anchor+'">설명 보러 가기 →</a></div>';}).join('');}
  inp.addEventListener('input',render);render();var ex=document.getElementById('export-mount');if(!ex)return;
  ex.innerHTML='<div class="exp-btns"><button class="btn" data-x="json">kg.json</button><button class="btn" data-x="ld">JSON-LD</button><button class="btn" data-x="ttl">Turtle (Protégé)</button><button class="btn" data-x="csv">CSV (Neo4j·Gephi)</button><button class="btn" data-x="bib">BibTeX</button><button class="btn" data-x="ris">RIS</button></div>';
  function dl(name,text,type){var b=new Blob([text],{type:type||'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},500);}
  var base=K.page;var refs=JSON.parse((document.getElementById('refs-csl')||{textContent:'[]'}).textContent);
  ex.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){var x=b.getAttribute('data-x');
    if(x==='json')dl(base+'.kg.json',JSON.stringify(K,null,2),'application/json');
    if(x==='ld')dl(base+'.jsonld',document.getElementById('kg-ld').textContent,'application/ld+json');
    if(x==='ttl'){var t='@prefix lab: <urn:lab:> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\n\n';K.nodes.forEach(function(n){t+='<urn:'+n.id+'> a lab:'+n.type+' ;\n  skos:prefLabel "'+n.label.ko+'"@ko , "'+n.label.en+'"@en ;\n  rdfs:comment "'+n.definition.ko.replace(/"/g,'\\"')+'"@ko .\n\n';});K.edges.forEach(function(e){t+='<urn:'+e.s+'> lab:'+e.p+' <urn:'+e.o+'> .\n';});dl(base+'.ttl',t,'text/turtle');}
    if(x==='csv'){var c='id,type,label_ko,label_en,anchor\n'+K.nodes.map(function(n){return [n.id,n.type,n.label.ko,n.label.en,n.page+n.anchor].map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(',');}).join('\n');c+='\n\nsource,relation,target\n'+K.edges.map(function(e){return [e.s,e.p,e.o].join(',');}).join('\n');dl(base+'.csv',c,'text/csv');}
    if(x==='bib')dl(base+'.bib',refs.map(function(r){return '@misc{'+r.id+',\n  title = {'+r.title+'},\n  author = {'+r.author+'},\n  note = {'+(r.note||'')+'},\n  year = {'+r.year+'}\n}';}).join('\n\n'));
    if(x==='ris')dl(base+'.ris',refs.map(function(r){return 'TY  - GEN\nTI  - '+r.title+'\nAU  - '+r.author+'\nPY  - '+r.year+'\nN1  - '+(r.note||'')+'\nER  - ';}).join('\n'));});});}

function boot(){document.querySelectorAll('[data-panel]').forEach(function(h){var k=h.getAttribute('data-panel');if(P[k]){try{P[k](h);}catch(e){h.textContent='실험을 불러오지 못했습니다.';if(window.console)console.warn(k,e);}}});
  document.querySelectorAll('.quiz').forEach(quiz);kg();practice();
  var pr=document.getElementById('prog');if(pr)window.addEventListener('scroll',function(){var d=document.documentElement;pr.style.width=(100*d.scrollTop/Math.max(1,d.scrollHeight-d.clientHeight))+'%';},{passive:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
