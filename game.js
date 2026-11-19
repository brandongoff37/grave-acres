// Grave Acres — game logic
'use strict';

// ================= Data =================
const SEEDS = [
  {id:'radish', type:'crop', name:'Ghost Carrot', cost:5,  time:20,  sell:12,  xp:2,  lvl:1},
  {id:'corn',   type:'crop', name:'Moon Corn',    cost:12, time:45,  sell:30,  xp:4,  lvl:1},
  {id:'pump',   type:'crop', name:'Grin Gourd',   cost:25, time:90,  sell:65,  xp:7,  lvl:3},
  {id:'egg',    type:'crop', name:'Gloom Plum',   cost:45, time:180, sell:125, xp:12, lvl:5},
  {id:'mush',   type:'crop', name:'Spook Cap',    cost:80, time:300, sell:230, xp:20, lvl:7},
  {id:'shamb',  type:'zom', name:'Shambler',    cost:20,  time:40,  atk:3,  hp:13, xp:5,  lvl:1, sell:8,  ab:null,          abName:'Steady', abTxt:'Cheap and reliable'},
  {id:'sprint', type:'zom', name:'Dasher',      cost:45,  time:75,  atk:5,  hp:9,  xp:8,  lvl:2, sell:18, ab:{quick:.35},   abName:'Quick',  abTxt:'35% chance to strike twice'},
  {id:'brute',  type:'zom', name:'Lugnut',      cost:90,  time:150, atk:5,  hp:30, xp:14, lvl:4, sell:35, ab:{armor:2},     abName:'Tough',  abTxt:'Takes 2 less damage from every hit'},
  {id:'mummy',  type:'zom', name:'Wrapster',    cost:140, time:220, atk:7,  hp:24, xp:20, lvl:6, sell:55, ab:{stun:.3},     abName:'Wrap',   abTxt:'30% chance to wrap up its target so it loses a turn'},
  {id:'vamp',   type:'zom', name:'Night Count', cost:220, time:320, atk:11, hp:28, xp:30, lvl:8, sell:90, ab:{drain:.5},    abName:'Drain',  abTxt:'Heals half the damage it deals'},
];
const FOES = {
  farmer:   {name:'Farmer',        ab:{rally:1},             abName:'Rally',        abTxt:'When knocked down, the other townsfolk get +1 attack'},
  farmhand: {name:'Farmhand',      ab:{shield:1},            abName:'Hay Bale',     abTxt:'Blocks the first hit it takes'},
  dog:      {name:'Guard Dog',     ab:{quick:.35},           abName:'Quick',        abTxt:'35% chance to bite twice'},
  constable:{name:'Constable',     ab:{backup:1},            abName:'Whistle',      abTxt:'Calls in a Guard Dog the first time it drops below half health'},
  sheriff:  {name:'Sheriff',       ab:{crit:.3},             abName:'Sharpshooter', abTxt:'30% chance of a double-damage hit'},
  guard:    {name:'Town Guard',    ab:{taunt:.45,armor:1},   abName:'Bodyguard',    abTxt:'Often steps in to take hits meant for others; light armor'},
  knight:   {name:'Knight',        ab:{armor:3},             abName:'Heavy Armor',  abTxt:'Takes 3 less damage from every hit'},
  wizard:   {name:'Hedge Wizard',  ab:{heal:8},              abName:'Healer',       abTxt:'Heals badly hurt allies instead of attacking'},
  robot:    {name:'Scarecrow-Bot', ab:{armor:3,cleave:1},    abName:'Sweep',        abTxt:'Armored, and every swing hits two zombies'},
};
const TOWNS = [
  {name:'Pickleton',   lvl:1, foes:[['farmer',2,11],['farmer',2,11]], coins:40, bones:1, xp:15},
  {name:'Hayford',     lvl:2, foes:[['farmer',3,12],['farmhand',3,14],['dog',3,10]], coins:85, bones:2, xp:28},
  {name:'Mudbury',     lvl:3, foes:[['constable',4,14],['farmhand',3,12],['farmer',3,12],['dog',3,7]], coins:150, bones:3, xp:45},
  {name:'Cobble Creek',lvl:5, foes:[['constable',5,16],['constable',4,16],['sheriff',6,20],['dog',4,12],['farmhand',4,12]], coins:240, bones:4, xp:70},
  {name:'Fort Turnip', lvl:6, foes:[['guard',6,26],['guard',6,26],['sheriff',7,22],['constable',5,20],['dog',5,12]], coins:350, bones:6, xp:100},
  {name:'Castle Kale', lvl:8, foes:[['knight',9,46],['guard',7,32],['guard',7,32],['wizard',8,26],['sheriff',9,28],['farmer',5,16]], coins:560, bones:10, xp:150},
  {name:'The Capital', lvl:10,foes:[['robot',12,58],['knight',9,40],['knight',9,40],['wizard',9,26],['guard',8,30],['guard',8,30]], coins:1000, bones:20, xp:260},
];
const GOALS = [
  {txt:'Plant 3 crops',                 have:()=>S.stats.planted,  need:3,  coins:20},
  {txt:'Raise your first zombie',       have:()=>S.stats.raised,   need:1,  coins:25},
  {txt:'Overrun Pickleton',             have:()=>wins(0),          need:1,  coins:40},
  {txt:'Reach level 3',                 have:()=>S.level,          need:3,  coins:50},
  {txt:'Raise 8 zombies',               have:()=>S.stats.raised,   need:8,  coins:60},
  {txt:'Fight off a torch mob',         have:()=>S.stats.mobWins,  need:1,  coins:80, bones:2},
  {txt:'Overrun Mudbury',               have:()=>wins(2),          need:1,  coins:100},
  {txt:'Get a mutant zombie',           have:()=>S.stats.mutants,  need:1,  bones:3},
  {txt:'Reach level 6',                 have:()=>S.level,          need:6,  coins:150},
  {txt:'Overrun Fort Turnip',           have:()=>wins(4),          need:1,  coins:200},
  {txt:'Harvest 150 crops',             have:()=>S.stats.harvests, need:150, coins:250},
  {txt:'Overrun Castle Kale',           have:()=>wins(5),          need:1,  coins:350, bones:5},
  {txt:'Overrun The Capital',           have:()=>wins(6),          need:1,  coins:800, bones:10},
  {txt:'Overrun The Capital 3 times',   have:()=>wins(6),          need:3,  coins:1500, bones:20},
];
const xpNeed = l => 40 + (l-1)*50 + (l-1)*(l-1)*10;
const hordeCap = () => 6 + S.level;
const squadCap = () => 3 + Math.floor(S.level/2);
const PLOT_COST = [0,0,0,0,0,0,0,0, 60,90,130,180, 250,330,420,520, 650,800,1000,1250];
const WATER = 1.35;        // growth speed once watered
const CRAWL_HOME = 0.2;    // chance a fallen zombie survives
const MUTANT = 0.1;        // chance a harvested zombie is a mutant
const SERUM_COST = 6;
const witherWindow = s => Math.max(300, s.time*4);   // seconds a ripe crop lasts before it withers

// ================= State =================
const KEY='graveacres.v1';
function fresh(){return {coins:50,bones:0,level:1,xp:0,plots:Array.from({length:20},(_,i)=>i<8?{}:null),horde:[],beaten:{},zid:1,goal:0,sound:true,fast:false,
  stats:{harvests:0,raised:0,raids:0,wins:0,planted:0,mutants:0,mobWins:0,mobLosses:0,withered:0}}}
let S; try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!S||!Array.isArray(S.plots))S=fresh();
(function migrate(){
  const f=fresh();
  for(const k of Object.keys(f)) if(S[k]===undefined) S[k]=f[k];
  for(const k of Object.keys(f.stats)) if(S.stats[k]===undefined) S.stats[k]=0;
  while(S.plots.length<20)S.plots.push(null);
  S.plots=S.plots.map(p=>p&&p.seed&&!SEEDS.some(s=>s.id===p.seed)?{}:p);
  S.horde=(S.horde||[]).filter(z=>SEEDS.some(s=>s.id===z.s));
  for(const k in S.beaten) S.beaten[k]=+S.beaten[k]||1;   // old saves stored true/1
  if(S.goal===undefined) S.goal=0;
})();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
const seed = id => SEEDS.find(s=>s.id===id);
const wins = i => S.beaten[i]||0;
const $ = id => document.getElementById(id);
const mi = k => '<span class="mi">'+art(k)+'</span>';
const fmtN = n => n>=100000?Math.round(n/1000)+'k':n>=10000?(n/1000).toFixed(1)+'k':String(n);
const buzz = ms => {try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}};
const shuffle = a => {for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick = a => a[Math.floor(Math.random()*a.length)];
document.querySelectorAll('[data-art]').forEach(el=>el.innerHTML=art(el.dataset.art));
$('logo').innerHTML=art('hand');

// ================= Sound =================
let AC;
function tone(f,d=.09,type='square',v=.035,delay=0){
  if(!S.sound)return;
  try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime+delay;const o=AC.createOscillator(),g=AC.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.02)}catch(e){}
}
const sfx = {
  plant:()=>tone(420,.07,'triangle',.05),
  water:()=>{tone(900,.05,'sine',.04);tone(700,.06,'sine',.04,.05)},
  coin:()=>{tone(880,.06,'square',.03);tone(1320,.09,'square',.03,.06)},
  raise:()=>{tone(160,.12,'sawtooth',.04);tone(120,.16,'sawtooth',.04,.1)},
  hit:()=>tone(140+Math.random()*60,.05,'square',.025),
  win:()=>[523,659,784,1046].forEach((f,i)=>tone(f,.12,'square',.035,i*.1)),
  lose:()=>[392,330,262,196].forEach((f,i)=>tone(f,.14,'triangle',.05,i*.12)),
  bad:()=>tone(110,.25,'sawtooth',.05),
};

// ================= UI helpers =================
let tt; function toast(t){const el=$('toast');el.textContent=t;el.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>el.classList.remove('show'),2200)}
function floatAt(el,html){const r=el.getBoundingClientRect();const f=document.createElement('div');f.className='float';f.innerHTML=html;f.style.left=(r.left+r.width/2-24)+'px';f.style.top=(r.top)+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),900)}
function fmt(s){s=Math.max(0,Math.ceil(s));return s>=60?Math.floor(s/60)+'m '+(s%60)+'s':s+'s'}
const clock = s => {s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
// --- 3D effects. Each one is skipped if the phone asks for reduced motion or can't animate this way.
const motionOK = () => !!document.body.animate && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
function bump(el){if(!el)return;el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')}
// A picture leaps off the spot toward the player, spins, and flies to a target (coins to the purse, zombies to the Horde tab)
function flyArt(key,from,to,o={}){
  if(!motionOK()||!from||!to)return o.done&&o.done();
  const a=from.getBoundingClientRect(),b=to.getBoundingClientRect(),sz=o.size||Math.min(a.width,a.height)*.7;
  const el=document.createElement('div');el.className='fly';el.innerHTML=art(key);
  el.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+(a.left+a.width/2-sz/2)+'px;top:'+(a.top+a.height/2-sz/2)+'px';
  document.body.appendChild(el);
  const dx=b.left+b.width/2-(a.left+a.width/2),dy=b.top+b.height/2-(a.top+a.height/2),spin=o.spin===undefined?360:o.spin,P='perspective(480px) ';
  el.animate([
    {transform:P+'translate3d(0,0,0) rotateY(0deg) scale(1)',opacity:1},
    {transform:P+'translate3d('+(o.dx||0)+'px,-44px,130px) rotateY('+spin+'deg) scale(1.1)',opacity:1,offset:.38,easing:'ease-in'},
    {transform:P+'translate3d('+dx+'px,'+dy+'px,0) rotateY('+spin*2+'deg) scale('+(o.end||.35)+')',opacity:.85}
  ],{duration:o.dur||680,delay:o.delay||0,easing:'ease-out',fill:'both'}).onfinish=()=>{el.remove();o.done&&o.done()};
}
// A harvested crop jumps up out of its bed toward the player and fades
function popArt(key,from){
  if(!motionOK()||!from)return;
  const a=from.getBoundingClientRect(),sz=Math.min(a.width,a.height)*.8;
  const el=document.createElement('div');el.className='fly';el.innerHTML=art(key);
  el.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+(a.left+a.width/2-sz/2)+'px;top:'+(a.top+a.height/2-sz/2)+'px';
  document.body.appendChild(el);
  el.animate([{transform:'perspective(480px) translate3d(0,0,0) rotateY(0deg)',opacity:1},{transform:'perspective(480px) translate3d(0,-64px,170px) rotateY(200deg)',opacity:0}],{duration:520,easing:'cubic-bezier(.2,.7,.4,1)',fill:'both'}).onfinish=()=>el.remove();
}
function coinsFrom(el,n){for(let i=0;i<n;i++)flyArt('coin',el,$('coins').parentNode,{size:24,delay:i*70,dx:(i-(n-1)/2)*26,end:.7,done:i===n-1?()=>bump($('coins').parentNode):null})}
let lvlT; function levelCard(lines){const el=$('lvlUp');el.innerHTML='<div class="card"><div class="st">'+art('star')+'</div><div><b>Level '+S.level+'!</b>'+lines.join('<br>')+'</div></div>';clearTimeout(lvlT);lvlT=setTimeout(()=>{el.innerHTML=''},3300)}
let sheetLock=false;
function openSheet(html,lock=false){$('sheetBody').innerHTML=html;$('sheet').classList.add('show');sheetLock=lock}
function closeSheet(){$('sheet').classList.remove('show');sheetLock=false}
$('sheet').onclick=e=>{if(e.target.id==='sheet'&&!sheetLock)closeSheet()};

function gainXP(n){
  S.xp+=n;
  while(S.xp>=xpNeed(S.level)){S.xp-=xpNeed(S.level);S.level++;const bonus=25*S.level;S.coins+=bonus;
    const un=SEEDS.filter(s=>s.lvl===S.level).map(s=>s.name);const towns=TOWNS.filter(t=>t.lvl===S.level).map(t=>t.name);
    levelCard(['+'+bonus+' coins · squad size '+squadCap()].concat(un.length?['New seed: '+un.join(', ')]:[],towns.length?['New town: '+towns.join(', ')]:[]));
    sfx.win();buzz([30,40,30]);}
}
function hud(){
  $('lvl').textContent=S.level;$('coins').textContent=fmtN(S.coins);$('bones').textContent=fmtN(S.bones);
  $('xp').style.width=(100*S.xp/xpNeed(S.level))+'%';
  [['coins',S.coins],['bones',S.bones],['lvl',S.level]].forEach(([id,v])=>{if(hudSeen[id]!==undefined&&hudSeen[id]!==v)bump($(id).parentNode);hudSeen[id]=v});
}
const hudSeen={};

// ================= Farm =================
const rate = p => p.w?WATER:1;
const elapsed = p => (Date.now()-p.t)/1000*rate(p);
const readyAt = p => p.t + seed(p.seed).time/rate(p)*1000;
function plotState(p){
  if(!p||!p.seed)return 'empty';
  const s=seed(p.seed);
  if(elapsed(p)<s.time)return 'grow';
  if(s.type==='crop'&&Date.now()>readyAt(p)+witherWindow(s)*1000)return 'withered';
  return 'ready';
}
const progress = p => Math.min(1,elapsed(p)/seed(p.seed).time);
const remaining = p => (seed(p.seed).time-elapsed(p))/rate(p);
const witherLeft = p => (readyAt(p)+witherWindow(seed(p.seed))*1000-Date.now())/1000;
const nextLockedIndex = () => S.plots.findIndex(p=>p===null);

function renderField(){
  const f=$('field');
  if(f.children.length!==20){f.innerHTML='';for(let i=0;i<20;i++){const d=document.createElement('button');d.className='plot';d.onclick=()=>tapPlot(i,d);f.appendChild(d)}}
  const nl=nextLockedIndex();
  S.plots.forEach((p,i)=>{
    const d=f.children[i];let key,html,cls='plot',label,grow=null;
    if(p===null){
      cls='plot locked';
      if(i===nl){key='lock';html='<div class="art">'+art('lock')+'</div>'+mi('coin')+' '+PLOT_COST[i];label='Locked plot, costs '+PLOT_COST[i]+' coins';}
      else{key='lock2';html='';label='Locked plot';}
    }else{
      const st=plotState(p);
      if(st==='empty'){key='empty';html='<span class="plus" aria-hidden="true">+</span>';label='Empty plot, tap to plant';}
      else{
        const s=seed(p.seed);
        if(st==='withered'){cls='plot wither';key='wilt';html='<div class="art">'+art('wilt')+'</div>';label='Withered '+s.name+', tap to clear';}
        else if(st==='ready'){
          const warn=s.type==='crop'&&witherLeft(p)<witherWindow(s)*.25;
          cls='plot '+(warn?'warn':'ready');key=cls+s.id;html='<div class="art">'+art(s.id)+'</div>';label=s.name+' ready to harvest'+(warn?', about to wither':'');}
        else{
          const pr=progress(p);const stage=s.type==='zom'?(pr<.5?'mound':'hand'):(pr<.5?'sprout':'sprout2');
          key='g-'+s.id+'-'+stage+'-'+(p.w?1:0);grow=[pr,clock(remaining(p))];
          html='<div class="art">'+art(stage)+'</div><span class="wet'+(p.w?'':' dry')+'">'+art('drop')+'</span><span class="tm"></span><div class="bar"><div style="width:'+(pr*100)+'%"></div></div>';
          label=s.name+' growing, '+fmt(remaining(p))+' left'+(p.w?'':', tap to water');
        }
      }
    }
    // Only rebuild a plot when what's in it changes; the bar and countdown are updated in place
    if(d.dataset.k!==key){d.dataset.k=key;d.className=cls;d.innerHTML=html}
    if(grow){d.querySelector('.bar>div').style.width=(grow[0]*100)+'%';const tm=d.querySelector('.tm');if(tm.textContent!==grow[1])tm.textContent=grow[1]}
    if(d.getAttribute('aria-label')!==label)d.setAttribute('aria-label',label);
  });
  const readyN=S.plots.filter(p=>plotState(p)==='ready').length, wiltN=S.plots.filter(p=>plotState(p)==='withered').length;
  const hb=$('harvestAll');hb.disabled=!readyN&&!wiltN;
  hb.textContent=readyN?'Harvest all ('+readyN+')':wiltN?'Clear withered ('+wiltN+')':'Harvest all';
  const nb=$('nbFarm');nb.hidden=!readyN;nb.textContent=readyN;
}

function tapPlot(i,el){
  const p=S.plots[i];
  if(p===null){
    if(i!==nextLockedIndex())return toast('Unlock plots in order');
    const c=PLOT_COST[i];
    if(S.coins<c)return toast('You need '+c+' coins to clear this plot');
    S.coins-=c;S.plots[i]={};floatAt(el,'-'+c+mi('coin'));sfx.plant();buzz(15);save();return refresh();
  }
  const st=plotState(p);
  if(st==='empty')return seedPicker(i);
  if(st==='withered'){S.plots[i]={};toast('Cleared the withered '+seed(p.seed).name);sfx.plant();save();return refresh()}
  if(st==='grow'){
    if(p.w)return toast(seed(p.seed).name+': '+fmt(remaining(p))+' left');
    const done=(Date.now()-p.t)/1000;p.w=1;p.t=Date.now()-done/WATER*1000; // keep progress where it is
    floatAt(el,mi('drop'));sfx.water();buzz(10);save();return refresh();
  }
  harvest(i,el,false);save();refresh();
}

function harvest(i,el,quiet){
  const p=S.plots[i];const s=seed(p.seed);
  if(s.type==='crop'){S.coins+=s.sell;gainXP(s.xp);S.stats.harvests++;if(el){floatAt(el,'+'+s.sell+mi('coin'));popArt(s.id,el);coinsFrom(el,quiet?1:Math.min(4,1+Math.floor(s.sell/60)))}if(!quiet)sfx.coin()}
  else{
    if(S.horde.length>=hordeCap()){if(!quiet){toast('Your horde is full ('+hordeCap()+'). Raid a town or release a zombie.');sfx.bad()}return false}
    const mut=Math.random()<MUTANT;
    S.horde.push({id:S.zid++,s:s.id,mut});gainXP(s.xp);S.stats.raised++;if(mut)S.stats.mutants++;
    if(el){floatAt(el,mut?mi('sparkle')+'Mutant!':'+1 '+mi(s.id));const tab=document.querySelector('nav button[data-v=horde]');flyArt(s.id,el,tab,{spin:180,dur:780,done:()=>bump(tab)})}
    if(!quiet){sfx.raise();if(mut)toast('A mutant '+s.name+' rose from the dirt! +50% stats')}
  }
  S.plots[i]={};buzz(12);return true;
}
$('harvestAll').onclick=()=>{
  let n=0,blocked=0,cleared=0;const f=$('field');
  S.plots.forEach((p,i)=>{const st=plotState(p);if(st==='ready'){if(harvest(i,f.children[i],true))n++;else blocked++}else if(st==='withered'){S.plots[i]={};cleared++}});
  if(n)sfx.coin();
  const parts=[];if(n)parts.push('Harvested '+n);if(cleared)parts.push('cleared '+cleared+' withered');if(blocked)parts.push(blocked+' zombie'+(blocked>1?'s':'')+' left in the ground (horde full)');
  if(parts.length)toast(parts.join(' · '));
  save();refresh();
};

function seedPicker(i){
  const empties=S.plots.filter(p=>p&&!p.seed).length;
  const rows=['crop','zom'].map(t=>'<h4>'+(t==='crop'?'Crops — sell for coins (harvest before they wither)':'Zombie seeds — grow your horde')+'</h4>'+
    SEEDS.filter(s=>s.type===t).map(s=>{
      const lock=S.level<s.lvl;const afford=S.coins>=s.cost;
      return '<div class="row'+(lock?' lock':'')+'"><div class="em">'+art(s.id)+'</div><div class="info"><b>'+s.name+'</b>'+
        (lock?'Unlocks at level '+s.lvl:fmt(s.time)+(s.type==='crop'?' · sells for '+s.sell+' · profit +'+(s.sell-s.cost)+'<br>Withers '+fmt(witherWindow(s))+' after ripening':' · attack '+s.atk+' · health '+s.hp+'<br><span class="ab">'+s.abName+'</span> '+s.abTxt))+
        (!lock&&empties>1&&S.coins>=s.cost*2?'<br><button class="mini" onclick="plantAll(\''+s.id+'\')">Plant '+Math.min(empties,Math.floor(S.coins/s.cost))+' at once · '+Math.min(empties,Math.floor(S.coins/s.cost))*s.cost+' coins</button>':'')+
        '</div><button '+(lock||!afford?'disabled':'')+' onclick="plant('+i+',\''+s.id+'\')">'+mi('coin')+' '+s.cost+'</button></div>'}).join('')).join('');
  openSheet('<h3>'+mi('sprout')+'Plant something</h3>'+rows);
}
function plant(i,id){
  const s=seed(id);if(S.coins<s.cost)return;
  S.coins-=s.cost;S.plots[i]={seed:id,t:Date.now()};S.stats.planted++;closeSheet();sfx.plant();buzz(10);save();refresh();
}
function plantAll(id){
  const s=seed(id);let n=0;
  S.plots.forEach((p,i)=>{if(p&&!p.seed&&S.coins>=s.cost){S.coins-=s.cost;S.plots[i]={seed:id,t:Date.now()};n++}});
  S.stats.planted+=n;closeSheet();sfx.plant();toast('Planted '+n+' '+s.name+(n>1?'s':''));save();refresh();
}

// ================= Goals =================
function renderGoal(){
  const g=GOALS[S.goal];const el=$('goal');
  if(!g){el.innerHTML='<div class="em">'+art('trophy')+'</div><div><b>All goals complete!</b>Every repeat raid makes towns tougher — how far can you push?</div>';return}
  const have=Math.min(g.have(),g.need);const done=have>=g.need;
  const reward=[g.coins?g.coins+' coins':'',g.bones?g.bones+' bones':''].filter(Boolean).join(' + ');
  el.innerHTML='<div class="em">'+art('trophy')+'</div><div style="flex:1"><b>Goal '+(S.goal+1)+': '+g.txt+'</b>Reward: '+reward+(g.need>1?' · '+have+' / '+g.need:'')+
    '<div class="gbar"><div style="width:'+(100*have/g.need)+'%"></div></div></div>'+(done?'<button class="gold" onclick="claimGoal()">Claim</button>':'');
}
function claimGoal(){
  const g=GOALS[S.goal];if(!g||g.have()<g.need)return;
  S.coins+=g.coins||0;S.bones+=g.bones||0;S.goal++;sfx.win();buzz([20,30,20]);
  toast('Goal complete! +'+[g.coins?g.coins+' coins':'',g.bones?g.bones+' bones':''].filter(Boolean).join(' + '));save();refresh();
}

// ================= Horde =================
function zStats(z){const s=seed(z.s);const m=z.mut?1.5:1;return{atk:Math.round(s.atk*m),hp:Math.round(s.hp*m),name:s.name,ab:s.ab,abName:s.abName}}
function unitPower(atk,hp,ab){ab=ab||{};return atk*2*(1+(ab.quick||0))*(1+(ab.crit||0))*(ab.cleave?1.6:1)+hp/2*(1+(ab.armor||0)*.18)+(ab.drain?atk*.6:0)+(ab.stun?atk*.8:0)+(ab.heal?ab.heal*1.2:0)+(ab.rally?3:0)+(ab.shield?atk*.8+2:0)+(ab.backup?12:0)+(ab.taunt?4:0)}
const zPower = z => {const s=zStats(z);return unitPower(s.atk,s.hp,s.ab)};
const power = list => list.reduce((a,z)=>a+zPower(z),0);
const strongest = n => [...S.horde].sort((a,b)=>zPower(b)-zPower(a)).slice(0,n);
function renderHorde(){
  $('hordeInfo').innerHTML='Horde: <b style="color:var(--ink)">'+S.horde.length+' / '+hordeCap()+'</b> · Raid squad: up to <b style="color:var(--ink)">'+squadCap()+'</b><br>Tap a zombie to release it for coins. Glowing ones are mutants.';
  const sorted=[...S.horde].sort((a,b)=>zPower(b)-zPower(a));
  $('hordeList').innerHTML=sorted.length?sorted.map(z=>{const st=zStats(z);
    return '<div class="zcard'+(z.mut?' mut':'')+'" onclick="releaseZ('+z.id+')">'+(z.mut?'<span class="badge">'+art('sparkle')+'</span>':'')+'<div class="e">'+art(z.s)+'</div>'+st.name+'<br><small style="color:var(--muted)">atk '+st.atk+' · hp '+st.hp+'</small>'+(st.ab?'<br><span class="ab">'+st.abName+'</span>':'')+'</div>'}).join('')
    :'<div class="hint" style="grid-column:1/-1">No zombies yet. Plant a Shambler on the farm!</div>';
  const plain=S.horde.filter(z=>!z.mut);
  $('serumWrap').innerHTML='<div class="row" style="margin-top:12px"><div class="em">'+art('flask')+'</div><div class="info"><b>Mutation Serum</b>Turns a random regular zombie into a mutant (+50% stats). Earn bones from raids and mobs.</div><button class="gold" '+(S.bones<SERUM_COST||!plain.length?'disabled':'')+' onclick="serum()">'+mi('bone')+' '+SERUM_COST+'</button></div>';
}
function releaseZ(id){
  const z=S.horde.find(z=>z.id===id);if(!z)return;const st=zStats(z);const val=seed(z.s).sell*(z.mut?2:1);
  openSheet('<h3>'+mi(z.s)+st.name+(z.mut?' (mutant)':'')+'</h3><p>Release this zombie back into the soil for '+val+' coins?</p>'+
    '<div class="toolbar"><button onclick="closeSheet()">Keep</button><button class="gold" onclick="doRelease('+id+','+val+')">Release</button></div>');
}
function doRelease(id,val){S.horde=S.horde.filter(z=>z.id!==id);S.coins+=val;closeSheet();sfx.coin();save();refresh()}
function serum(){const plain=S.horde.filter(z=>!z.mut);if(S.bones<SERUM_COST||!plain.length)return;const z=pick(plain);z.mut=true;S.bones-=SERUM_COST;S.stats.mutants++;toast('Your '+seed(z.s).name+' mutated!');sfx.win();buzz([20,30,20]);save();refresh()}

// ================= Battle engine =================
const alive = u => u.hp>0;
function makeZ(z,i){const s=zStats(z);return{side:'m',idx:i,k:z.s,atk:s.atk,hp:s.hp,max:s.hp,zid:z.id,name:s.name,ab:s.ab||{},mut:z.mut}}
function makeFoe(f,i,mult=1){const d=FOES[f[0]];const hp=Math.round(f[2]*mult);return{side:'f',idx:i,k:f[0],atk:Math.round(f[1]*mult),hp,max:hp,name:d.name,ab:d.ab||{},scale:mult}}
function simulate(mine,foes){
  const steps=[];const snap=()=>[mine.map(u=>u.hp),foes.map(u=>u.hp)];
  const rec=(actor,target,text,kind)=>steps.push({a:actor&&[actor.side,actor.idx],t:target&&[target.side,target.idx],text,kind,hp:snap()});
  let rounds=0;
  while(mine.some(alive)&&foes.some(alive)&&rounds++<200){
    const order=shuffle([...mine.filter(alive),...foes.filter(alive)]);
    for(const a of order){
      if(!alive(a))continue;
      const us=a.side==='m'?mine:foes, them=a.side==='m'?foes:mine;
      if(!them.some(alive))break;
      if(a.stunned){a.stunned=false;rec(a,null,a.name+' is wrapped up and loses a turn','stun');continue}
      const ab=a.ab;
      if(ab.heal){const hurt=us.filter(u=>alive(u)&&u.hp<u.max*.6).sort((x,y)=>x.hp/x.max-y.hp/y.max)[0];
        if(hurt&&Math.random()<.6){const h=Math.min(ab.heal,hurt.max-hurt.hp);hurt.hp+=h;rec(a,hurt,a.name+' heals '+hurt.name+' for '+h,'heal');continue}}
      const swings=1+(ab.quick&&Math.random()<ab.quick?1:0);
      for(let s=0;s<swings;s++){
        const live=them.filter(alive);if(!live.length)break;
        let targets=ab.cleave?shuffle(live).slice(0,2):[pick(live)];
        if(!ab.cleave){const tank=live.find(u=>u.ab.taunt&&u!==targets[0]&&Math.random()<u.ab.taunt);if(tank){targets=[tank];rec(tank,null,tank.name+' steps in front to take the hit','info')}}
        for(const t of targets){
          if(t.ab.shield&&!t.blocked){t.blocked=true;rec(a,t,a.name+' swings at '+t.name+' — blocked by a hay bale!','block');continue}
          const crit=Math.random()<(ab.crit||.08);
          let dmg=Math.max(1,Math.round(a.atk*(.75+Math.random()*.5))*(crit?2:1)-(t.ab.armor||0));
          const wasAbove=t.hp>t.max/2;
          t.hp-=dmg;
          let txt=a.name+(s?' strikes again —':' hits')+' '+t.name+' for '+dmg+(crit?' (critical!)':'');
          if(ab.drain){const h=Math.min(Math.ceil(dmg*ab.drain),a.max-a.hp);if(h>0){a.hp+=h;txt+=', drains '+h}}
          if(ab.stun&&t.hp>0&&Math.random()<ab.stun){t.stunned=true;txt+=' and wraps them up'}
          if(t.hp<=0)txt+=' — down!';
          rec(a,t,txt,'hit');
          const tside=t.side==='m'?mine:foes;
          if(t.hp<=0&&t.ab.rally){tside.filter(alive).forEach(u=>u.atk+=t.ab.rally);if(tside.some(alive))rec(t,null,'The '+t.name+"'s rallying cry gives the others +"+t.ab.rally+' attack!','info')}
          if(t.hp>0&&wasAbove&&t.hp<=t.max/2&&t.ab.backup&&!t.called){t.called=true;
            const m=t.scale||1;const hp=Math.round(8*m);
            const d={side:t.side,idx:tside.length,k:'dog',atk:Math.round(2*m),hp,max:hp,name:'Guard Dog',ab:FOES.dog.ab,summoned:true};tside.push(d);
            rec(t,d,t.name+' blows a whistle — a Guard Dog joins the fight!','info')}
        }
      }
    }
  }
  return {win:!foes.some(alive)&&mine.some(alive),steps};
}
function settleLosses(mine){
  const fallen=mine.filter(u=>!alive(u));let crawled=0;
  const lost=fallen.filter(()=>{if(Math.random()<CRAWL_HOME){crawled++;return false}return true}).map(u=>u.zid);
  S.horde=S.horde.filter(z=>!lost.includes(z.id));
  return {lost:lost.length,crawled};
}

// ================= Raids =================
let fighting=false;
const townMult = i => 1+.2*Math.min(wins(i),10);
const foePower = (t,i) => t.foes.reduce((a,f)=>a+unitPower(f[1]*townMult(i),f[2]*townMult(i),FOES[f[0]].ab),0);
const loot = (t,i) => wins(i)?{coins:Math.round(t.coins*.6*(1+.1*wins(i))),bones:Math.ceil(t.bones/2),xp:Math.round(t.xp*.5)}:{coins:t.coins,bones:t.bones,xp:t.xp};
function odds(r){return r>=1.5?['Easy','#7bd36b','#132']:r>=1.15?['Fair','#c9e86b','#132']:r>=.9?['Risky','#ffcf4a','#321']:['Deadly','#ff6b6b','#300']}
function renderRaid(){
  if(fighting)return;
  $('raidPick').style.display='';$('battle').style.display='none';
  const best=power(strongest(squadCap()));
  $('raidPick').innerHTML='<div class="hint">Best squad power: <b style="color:var(--ink)">'+Math.round(best)+'</b> · Squad size: <b style="color:var(--ink)">'+squadCap()+'</b><br>'+(S.horde.length?'Fallen zombies are usually lost. Towns rebuild stronger every time you overrun them.':'<b style="color:var(--gold)">You have no zombies yet.</b> Plant a zombie seed on the Farm, harvest it, then come back to raid.')+'</div>'+
    mobRow()+
    TOWNS.map((t,i)=>{
      const lock=S.level<t.lvl||(i>0&&!wins(i-1));const fp=foePower(t,i);const o=odds(best/fp);const L=loot(t,i);
      return '<div class="row'+(lock?' lock':'')+'"><div class="em">'+art(wins(i)?'ruin':'house')+'</div><div class="info"><b>'+t.name+(wins(i)?' <small style="color:var(--muted)">· rebuilt ×'+wins(i)+'</small>':'')+'</b>'+
        (lock?(S.level<t.lvl?'Reach level '+t.lvl:'Overrun '+TOWNS[i-1].name+' first'):
          'Defense '+Math.round(fp)+' · '+t.foes.map(f=>FOES[f[0]].name).filter((v,j,a)=>a.indexOf(v)===j).join(', ')+'<br>Loot '+L.coins+' coins, '+L.bones+' bones, '+L.xp+' XP'+
          (S.horde.length?'<br><span class="odds" style="background:'+o[1]+';color:'+o[2]+'">'+o[0]+'</span>':''))+
        '</div><button '+(lock||!S.horde.length?'disabled':'')+' onclick="pickSquad('+i+')">Raid</button></div>'}).join('');
}
let squadSel=[];
function pickSquad(ti){
  squadSel=strongest(squadCap()).map(z=>z.id);drawSquad(ti);
}
function drawSquad(ti){
  const t=TOWNS[ti];const sel=S.horde.filter(z=>squadSel.includes(z.id));const p=power(sel),fp=foePower(t,ti);const o=odds(p/fp);
  const sorted=[...S.horde].sort((a,b)=>zPower(b)-zPower(a));
  openSheet('<h3>'+mi('swords')+'Raid '+t.name+'</h3>'+
    '<p style="margin:0">Pick up to <b style="color:var(--ink)">'+squadCap()+'</b> zombies. Squad power <b style="color:var(--ink)">'+Math.round(p)+'</b> vs defense <b style="color:var(--ink)">'+Math.round(fp)+'</b> <span class="odds" style="background:'+o[1]+';color:'+o[2]+'">'+o[0]+'</span></p>'+
    '<div class="sumrow">'+t.foes.map(f=>'<div class="s" title="'+FOES[f[0]].name+'">'+art(f[0])+'</div>').join('')+'</div>'+
    '<div style="font-size:12px;color:var(--muted);line-height:1.5">'+[...new Set(t.foes.map(f=>f[0]))].map(k=>'<b style="color:var(--ink)">'+FOES[k].name+'</b> <span class="ab">'+FOES[k].abName+'</span> '+FOES[k].abTxt).join('<br>')+'</div>'+
    '<div class="grid4">'+sorted.map(z=>{const st=zStats(z);const on=squadSel.includes(z.id);
      return '<div class="zcard '+(on?'sel':'off')+(z.mut?' mut':'')+'" onclick="toggleSquad('+ti+','+z.id+')">'+(z.mut?'<span class="badge">'+art('sparkle')+'</span>':'')+'<div class="e" style="width:40px;height:40px">'+art(z.s)+'</div>'+st.name+'<br><small style="color:var(--muted)">'+st.atk+' / '+st.hp+'</small></div>'}).join('')+'</div>'+
    '<div class="toolbar"><button onclick="closeSheet()">Cancel</button><button class="gold" '+(sel.length?'':'disabled')+' onclick="raid('+ti+')">Attack with '+sel.length+'</button></div>');
}
function toggleSquad(ti,id){
  if(squadSel.includes(id))squadSel=squadSel.filter(x=>x!==id);
  else if(squadSel.length<squadCap())squadSel.push(id);
  else return toast('Your squad is full ('+squadCap()+'). Tap a selected zombie to swap it out.');
  drawSquad(ti);
}

// Each fighter is a small upright picture standing on the tilted battlefield, with a health bar over its head.
function unitHTML(u,i,side){return '<div class="u'+(side==='f'?' foe':'')+(u.mut?' mut':'')+'" id="'+side+i+'"><div class="b"><div class="hp"><div></div></div><div class="a">'+art(u.k)+'</div></div><div class="fx"></div></div>'}
const stepTime = () => S.fast?250:520;
let battleSkip=null;
function playBattle(title,mine,foes,result,onDone){
  fighting=true;
  $('raidPick').style.display='none';$('battle').style.display='';$('battleDone').style.display='none';$('skipBtn').style.display='';$('speedBtn').style.display='';
  $('speedBtn').textContent='Speed ×'+(S.fast?2:1);
  $('vsTxt').textContent=title;$('log').innerHTML='';$('result').className='';$('result').innerHTML='';$('mine').innerHTML='';$('foes').innerHTML='';
  const anim=motionOK(),LEAN=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lean'))||50;
  $('skyline').innerHTML=[0,1,2,3,4].map(()=>'<span>'+art('house')+'</span>').join('');
  const els={m:[],f:[]},shown={m:[],f:[]},list=side=>side==='m'?mine:foes;
  const add=(u,i,side,drop)=>{
    const box=$(side==='m'?'mine':'foes');box.insertAdjacentHTML('beforeend',unitHTML(u,i,side));
    const el=box.lastChild;els[side][i]=el;shown[side][i]=u.max;
    if(drop&&anim)el.animate([{transform:'translate3d(0,0,150px)',opacity:0},{transform:'translate3d(0,0,0)',opacity:1,offset:.7},{transform:'translate3d(0,0,14px)',offset:.85},{transform:'translate3d(0,0,0)'}],{duration:420,easing:'ease-in'});
  };
  mine.forEach((u,i)=>add(u,i,'m'));foes.forEach((u,i)=>{if(!u.summoned)add(u,i,'f')});
  // A number or word pops up over a fighter's head
  const pop=(el,text,cls)=>{
    const sp=document.createElement('span');sp.className='dmg '+(cls||'');sp.textContent=text;el.querySelector('.fx').appendChild(sp);
    if(anim)sp.animate([{transform:'translate(-50%,8px) scale(.4)',opacity:0},{transform:'translate(-50%,-16px) scale(1.3)',opacity:1,offset:.22},{transform:'translate(-50%,-22px) scale(1)',opacity:1,offset:.6},{transform:'translate(-50%,-44px) scale(.9)',opacity:0}],{duration:850,easing:'ease-out'}).onfinish=()=>sp.remove();
    else setTimeout(()=>sp.remove(),800);
  };
  // The attacker jumps across the field at its target and lands back in place
  const lunge=(A,T,dur)=>{if(!anim)return;const dx=(T.offsetLeft-A.offsetLeft)*.74,dy=(T.offsetTop-A.offsetTop)*.74;
    A.animate([{transform:'translate3d(0,0,0)'},{transform:'translate3d('+dx*.55+'px,'+dy*.55+'px,46px)',offset:.3},{transform:'translate3d('+dx+'px,'+dy+'px,8px)',offset:.5},{transform:'translate3d('+dx*.4+'px,'+dy*.4+'px,26px)',offset:.75},{transform:'translate3d(0,0,0)'}],{duration:dur,easing:'ease-in-out'})};
  const hop=A=>{if(anim)A.animate([{transform:'translate3d(0,0,0)'},{transform:'translate3d(0,0,26px)'},{transform:'translate3d(0,0,0)'}],{duration:300,easing:'ease-out'})};
  // A fighter that takes a hit rocks back, away from whoever hit it, and flashes
  const recoil=(el,side)=>{if(anim)el.querySelector('.b').animate([{transform:'rotateX(-'+LEAN+'deg)'},{transform:'rotateX(-'+(side==='m'?LEAN+30:LEAN-26)+'deg)',filter:'brightness(2.4)',offset:.3},{transform:'rotateX(-'+LEAN+'deg)'}],{duration:280,easing:'ease-out'})};
  const shake=()=>{const st=$('stage');st.classList.remove('shake');void st.offsetWidth;st.classList.add('shake')};
  // Bring every health bar up to date. Anyone whose health changed gets a number; anyone at zero tips over.
  const apply=(hp,crit,quiet)=>[['m',hp[0]],['f',hp[1]]].forEach(([side,arr])=>arr.forEach((v,i)=>{
    const u=list(side)[i];if(!els[side][i])add(u,i,side,!quiet);
    const el=els[side][i],was=shown[side][i];shown[side][i]=v;
    el.querySelector('.hp>div').style.width=Math.max(0,100*v/u.max)+'%';
    if(v<=0)el.classList.add('dead');
    if(quiet||v===was)return;
    if(v<was){pop(el,String(v-was),crit?'crit':'');if(v>0)recoil(el,side)}else pop(el,'+'+(v-was),'heal');
  }));
  const lines=[];let k=0,timer=0,over=false;
  const showLog=()=>{const l=$('log');l.innerHTML=lines.slice(-30).join('<br>');l.scrollTop=1e9};
  function finish(){
    if(over)return;over=true;clearTimeout(timer);battleSkip=null;
    while(k<result.steps.length)lines.push(result.steps[k++].text);
    const last=result.steps[result.steps.length-1];if(last)apply(last.hp,false,true);
    showLog();fighting=false;
    els[result.win?'m':'f'].forEach(el=>{if(el&&!el.classList.contains('dead'))el.classList.add('cheer')});
    onDone(m=>{lines.push(m);showLog()},(html,win)=>{const r=$('result');r.innerHTML='<div class="card '+(win?'win':'lose')+'">'+html+'</div>';r.className='show'});
    $('battleDone').style.display='';$('skipBtn').style.display='none';$('speedBtn').style.display='none';
  }
  function step(){
    if(over)return;
    if(k>=result.steps.length)return finish();
    const st=result.steps[k++],d=stepTime();lines.push(st.text);showLog();
    const A=st.a&&els[st.a[0]][st.a[1]],T=st.t&&els[st.t[0]][st.t[1]],crit=/critical/.test(st.text);
    if((st.kind==='hit'||st.kind==='block')&&A&&T){
      lunge(A,T,d*.85);
      timer=setTimeout(()=>{if(over)return;apply(st.hp,crit);if(st.kind==='block')pop(T,'Blocked!','txt');sfx.hit();if(crit&&anim)shake();timer=setTimeout(step,d*.6)},d*.4);
    }else{
      if(A)hop(A);if(st.kind==='stun'&&A)pop(A,'Wrapped!','txt');
      apply(st.hp,false);timer=setTimeout(step,d*.8);
    }
  }
  battleSkip=finish;
  timer=setTimeout(step,anim?650:80);   // a beat to take in the line-up before the first swing
}
function raid(ti){
  const t=TOWNS[ti];const squad=S.horde.filter(z=>squadSel.includes(z.id));if(!squad.length)return;
  closeSheet();S.stats.raids++;
  view='raid';setView();
  const mine=squad.map(makeZ),foes=t.foes.map((f,i)=>makeFoe(f,i,townMult(ti)));
  const res=simulate(mine,foes);
  playBattle('Raiding '+t.name,mine,foes,res,(log,banner)=>{
    const {lost,crawled}=settleLosses(mine);let card;
    if(res.win){const L=loot(t,ti);S.coins+=L.coins;S.bones+=L.bones;gainXP(L.xp);S.beaten[ti]=wins(ti)+1;S.stats.wins++;
      log('<b style="color:var(--green)">Victory! +'+L.coins+' coins, +'+L.bones+' bones, +'+L.xp+' XP</b>');log(t.name+' will rebuild stronger.');toast(t.name+' has been overrun!');sfx.win();buzz([30,50,30]);
      card='<h2>Victory!</h2><div class="loot"><span class="chip">'+mi('coin')+'+'+L.coins+'</span><span class="chip">'+mi('bone')+'+'+L.bones+'</span><span class="chip">'+mi('star')+'+'+L.xp+' XP</span></div>'}
    else{log('<b style="color:var(--red)">The townsfolk held them off…</b>');sfx.lose();
      card='<h2>Driven off</h2><p>The townsfolk held the line. Raise a stronger squad and try again.</p>'}
    if(lost)log(lost+' zombie'+(lost>1?'s':'')+' fell for good.');
    if(crawled)log(crawled+' fallen zombie'+(crawled>1?'s':'')+' crawled back home.');
    const tail=[lost?lost+' zombie'+(lost>1?'s':'')+' fell for good':'',crawled?crawled+' crawled back home':''].filter(Boolean).join(' · ');
    banner(card+(tail?'<p>'+tail+'</p>':''),res.win);
    if(res.win)coinsFrom($('result'),4);
    save();hud();
  });
}
$('skipBtn').onclick=()=>{battleSkip&&battleSkip()};
$('speedBtn').onclick=e=>{S.fast=!S.fast;save();e.currentTarget.textContent='Speed ×'+(S.fast?2:1)};
$('battleDone').onclick=()=>refresh();

// ================= Torch mobs (towns fight back) =================
const mobUnlocked = () => Object.keys(S.beaten).length>0;
function scheduleMob(from=Date.now()){S.nextMob=from+(7+Math.random()*5)*60000;save()}
function mobForce(){
  const L=S.level,n=Math.min(2+Math.floor(L/2.5),6);
  const pool=['farmer','farmhand','dog'].concat(L>=4?['constable']:[],L>=6?['guard','sheriff']:[],L>=9?['knight']:[]);
  const base={farmer:[2,11],farmhand:[3,13],dog:[3,10],constable:[4,18],guard:[6,26],sheriff:[6,22],knight:[9,40]};
  const m=1+L*.06+Object.values(S.beaten).reduce((a,b)=>a+b,0)*.025;
  return Array.from({length:n},()=>{const k=pick(pool);return [k,base[k][0],base[k][1],m]});
}
function mobRow(){
  if(!mobUnlocked())return '';
  if(!S.nextMob)scheduleMob();
  const left=(S.nextMob-Date.now())/1000;
  return '<div class="row" style="background:#4a1f2466"><div class="em">'+art('torch')+'</div><div class="info"><b>Torch mob</b>The towns you raid will send angry mobs to your farm. Your strongest '+squadCap()+' zombies defend. Lose, and the mob tramples crops and steals coins.<br>Next mob in about <b style="color:var(--ink)">'+fmt(left)+'</b></div></div>';
}
function mobTick(){
  if(!mobUnlocked()){$('mobBanner').style.display='none';$('nbRaid').hidden=true;return}
  if(!S.nextMob)scheduleMob();
  const left=(S.nextMob-Date.now())/1000;
  const soon=left<180;
  $('mobBanner').style.display=soon?'flex':'none';$('nbRaid').hidden=!soon;
  if(soon)$('mobTxt').innerHTML='<b style="color:#fff">A torch mob is coming in '+clock(left)+'!</b><br>Your strongest '+squadCap()+' zombies will defend. Defenders: power '+Math.round(power(strongest(squadCap())))+'.';
  if(left<=0&&!fighting&&!$('sheet').classList.contains('show'))resolveMob(left<-10);
}
function resolveMob(away){
  const force=mobForce();
  const def=strongest(squadCap());
  const mine=def.map(makeZ),foes=force.map((f,i)=>makeFoe(f,i,f[3]));
  const res=def.length?simulate(mine,foes):{win:false,steps:[]};
  const {lost,crawled}=settleLosses(mine);
  let html='<h3>'+mi('torch')+(away?'A mob came while you were away':'The torch mob is here!')+'</h3><div class="sumrow">'+foes.map(f=>'<div class="s">'+art(f.k)+'</div>').join('')+'</div>';
  if(res.win){
    const b=1+Math.floor(S.level/3),c=10*S.level;S.bones+=b;S.coins+=c;S.stats.mobWins++;gainXP(5*S.level);
    html+='<p><b style="color:var(--green)">Your horde drove them off!</b> You scavenged '+c+' coins and '+b+' bones.</p>';sfx.win();
  }else{
    const victims=shuffle(S.plots.map((p,i)=>p&&p.seed?i:-1).filter(i=>i>=0)).slice(0,2);
    victims.forEach(i=>S.plots[i]={});
    const stolen=Math.round(S.coins*.15);S.coins-=stolen;S.stats.mobLosses++;
    html+='<p><b style="color:var(--red)">'+(def.length?'The mob broke through!':'No zombies were home to defend!')+'</b> They trampled '+victims.length+' plot'+(victims.length===1?'':'s')+' and made off with '+stolen+' coins.</p>';sfx.lose();
  }
  if(lost)html+='<p>'+lost+' defender'+(lost>1?'s':'')+' fell for good'+(crawled?', and '+crawled+' crawled back':'')+'.</p>';
  else if(crawled)html+='<p>'+crawled+' fallen defender'+(crawled>1?'s':'')+' crawled back home.</p>';
  html+='<p style="font-size:12px">Tip: keep a strong horde at home, and use mutants and tough zombies to hold the line.</p><button class="gold" style="width:100%" onclick="closeSheet()">OK</button>';
  scheduleMob();save();refresh();buzz([60,40,60]);
  openSheet(html,true);
}

// ================= Menu, backup =================
$('menuBtn').onclick=()=>{
  const st=S.stats;
  openSheet('<h3>'+mi('gear')+'Menu</h3>'+
    '<div class="stats"><div><b>'+st.harvests+'</b>crops harvested</div><div><b>'+st.raised+'</b>zombies raised</div><div><b>'+st.wins+' / '+st.raids+'</b>raids won</div><div><b>'+st.mobWins+' / '+(st.mobWins+st.mobLosses)+'</b>mobs repelled</div></div>'+
    '<button style="width:100%" id="soundBtn">Sound: '+(S.sound?'On':'Off')+'</button>'+
    '<h4>Move your farm to another device</h4><p style="margin:4px 0">Copy your save code, then paste it into the game on your other phone.</p>'+
    '<div class="toolbar" style="margin-top:4px"><button id="exportBtn">Copy save code</button><button id="importBtn">Load a save code</button></div><div id="saveArea"></div>'+
    '<h4>Install on your phone</h4><p><b style="color:var(--ink)">iPhone:</b> open in Safari → Share → Add to Home Screen.<br><b style="color:var(--ink)">Android:</b> open in Chrome → ⋮ menu → Install app.</p>'+
    '<button class="danger" style="width:100%" id="resetBtn">Start a new farm</button>'+
    '<button style="width:100%;margin-top:8px" onclick="closeSheet()">Close</button>');
  $('soundBtn').onclick=e=>{S.sound=!S.sound;save();e.currentTarget.textContent='Sound: '+(S.sound?'On':'Off');sfx.plant()};
  $('exportBtn').onclick=()=>{
    const code='GA1:'+btoa(unescape(encodeURIComponent(JSON.stringify(S))));
    $('saveArea').innerHTML='<textarea readonly id="saveCode">'+code+'</textarea>';
    const ta=$('saveCode');ta.select();
    try{navigator.clipboard.writeText(code).then(()=>toast('Save code copied'),()=>toast('Select the code and copy it'))}catch(e){toast('Select the code and copy it')}
  };
  $('importBtn').onclick=()=>{
    $('saveArea').innerHTML='<textarea id="loadCode" placeholder="Paste your save code here"></textarea><button class="gold" style="width:100%;margin-top:6px" id="loadGo">Load this farm (replaces this one)</button>';
    $('loadGo').onclick=()=>{
      try{const raw=$('loadCode').value.trim();if(!raw.startsWith('GA1:'))throw 0;
        const d=JSON.parse(decodeURIComponent(escape(atob(raw.slice(4)))));if(!d||!Array.isArray(d.plots)||typeof d.coins!=='number')throw 0;
        localStorage.setItem(KEY,JSON.stringify(d));location.reload();
      }catch(e){toast("That save code didn't work. Check that you copied all of it.")}
    };
  };
  $('resetBtn').onclick=e=>{const b=e.currentTarget;if(b.dataset.sure){S=fresh();S.seen=1;S.lastDay=today();save();closeSheet();refresh();toast('A fresh plot of land awaits.')}else{b.dataset.sure=1;b.textContent='Tap again to erase everything'}};
};

// ================= Nav / loop =================
let view='farm';
function setView(){document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('on',x.dataset.v===view));document.querySelectorAll('.view').forEach(v=>v.classList.toggle('show',v.id==='v-'+view))}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{if(fighting)return toast('Battle in progress!');view=b.dataset.v;setView();refresh()});
function refresh(){hud();if(view==='farm'){renderGoal();renderField()}if(view==='horde')renderHorde();if(view==='raid')renderRaid();mobTick()}
setInterval(()=>{if(document.hidden)return;if(view==='farm'){renderField();renderGoal()}mobTick()},500);
setInterval(()=>{if(!document.hidden&&view==='raid'&&!fighting&&!$('sheet').classList.contains('show'))renderRaid()},5000);

// ================= Welcome, daily bonus, away summary =================
function today(){const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
refresh();
const readyOnLoad=S.plots.filter(p=>plotState(p)==='ready').length, wiltOnLoad=S.plots.filter(p=>plotState(p)==='withered').length;
if(!S.seen){
  S.seen=1;S.lastDay=today();save();
  setTimeout(()=>openSheet('<h3>'+mi('hand')+'Welcome to Grave Acres</h3><p>Grow spooky crops to earn coins — but harvest them before they wither. Plant zombie seeds to raise a horde, pick your best squad, and raid nearby towns for coins, bones and XP.</p><p>Careful: towns you raid will send torch mobs back at your farm. Keep a strong horde at home!</p><p>Follow the goals at the top of the farm to get started.</p><button class="gold" style="width:100%" onclick="closeSheet()">Start farming</button>'),300);
}else if(S.lastDay!==today()){
  const bonus=20+5*S.level;S.coins+=bonus;S.lastDay=today();save();hud();
  setTimeout(()=>openSheet('<h3>'+mi('gift')+'Daily bonus</h3><p>Welcome back! The crows left you <b style="color:var(--gold)">'+bonus+' coins</b>.'+(readyOnLoad?' '+readyOnLoad+' plot'+(readyOnLoad>1?'s are':' is')+' ready to harvest.':'')+(wiltOnLoad?' '+wiltOnLoad+' crop'+(wiltOnLoad>1?'s':'')+' withered while you were gone.':'')+'</p><button class="gold" style="width:100%" onclick="closeSheet()">Thanks!</button>'),300);
}else if(readyOnLoad||wiltOnLoad){setTimeout(()=>toast((readyOnLoad?readyOnLoad+' ready to harvest':'')+(readyOnLoad&&wiltOnLoad?' · ':'')+(wiltOnLoad?wiltOnLoad+' withered':'')),400)}

if('serviceWorker' in navigator&&location.protocol==='https:'){navigator.serviceWorker.register('sw.js').catch(()=>{})}
