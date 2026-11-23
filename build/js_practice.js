
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
