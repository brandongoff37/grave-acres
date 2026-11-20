// Grave Acres — original hand-drawn SVG art (v2: outlined, shaded, detailed).
// Every piece is drawn on a 64x64 grid. Shared gradients live in one hidden <defs> block.
(function(){
const INK = '#1b1626';
const O = 'stroke="'+INK+'" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"';
const O2 = 'stroke="'+INK+'" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"';

// ---------- shared gradients ----------
const rad = (id,a,b,cx=.38,cy=.32) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r=".75"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
const lin = (id,a,b,vert=true) => `<linearGradient id="${id}" x1="0" y1="0" x2="${vert?0:1}" y2="${vert?1:0}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const DEFS = `<svg width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true"><defs>
${rad('ga-zg','#b8e68f','#5a9142')}${rad('ga-zt','#a9e6c6','#4a9473')}${rad('ga-zb','#bcd0e0','#5d778e')}
${rad('ga-mu','#fbf3dc','#bfae86')}${rad('ga-vp','#f3eefc','#a597c9')}${rad('ga-sk','#ffe2c2','#d49b6a')}
${rad('ga-or','#ffb56a','#c2521a')}${rad('ga-or2','#e98a3e','#9c3f14')}${rad('ga-pu','#a06ac8','#371a52')}
${rad('ga-cn','#a87af0','#43248a')}${rad('ga-gh','#ffffff','#bcb1d8')}${rad('ga-mr','#e0679e','#651c42')}
${lin('ga-st','#fff8e8','#d5c39c',false)}${lin('ga-lf','#9be886','#3f8a3a')}${lin('ga-lf2','#7fcf6c','#2f6e2c')}
${lin('ga-dt','#82593a','#3b2716')}${rad('ga-ts','#cdc8e0','#6b6590')}${rad('ga-gd','#fff0a6','#d08a12')}
${lin('ga-mt','#f4f6fb','#878da3',false)}${lin('ga-mtv','#f4f6fb','#878da3')}${lin('ga-wd','#c08a52','#6b4426',false)}
${lin('ga-bl','#6a8fd6','#28407a')}${lin('ga-rd','#ee6a5c','#922620')}${lin('ga-gr','#62b072','#285533')}
${lin('ga-br','#a8774a','#55361c')}${lin('ga-cp','#3e305c','#120d1b')}${lin('ga-or3','#ffa055','#c4561a')}
${lin('ga-wa','#b3e3ff','#2a84d4')}${lin('ga-cr','#fff6df','#cdbb94')}${lin('ga-gl','#e7f0ff','#9fb2d4')}
${lin('ga-straw','#ffe58a','#c99a2e')}${lin('ga-pk','#ff7aa8','#b8325e')}${lin('ga-gy','#8d8aa3','#4b4862')}
<radialGradient id="ga-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e9e2ff" stop-opacity=".55"/><stop offset="1" stop-color="#e9e2ff" stop-opacity="0"/></radialGradient>
<radialGradient id="ga-eyeY" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff9c4"/><stop offset=".6" stop-color="#ffd84a"/><stop offset="1" stop-color="#e09a1a"/></radialGradient>
<radialGradient id="ga-eyeG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#eaffd9"/><stop offset=".55" stop-color="#8cff5a"/><stop offset="1" stop-color="#8cff5a" stop-opacity="0"/></radialGradient>
<radialGradient id="ga-fire" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#fff6b0"/><stop offset=".6" stop-color="#ffc23a"/><stop offset="1" stop-color="#f07a1a"/></radialGradient>
<radialGradient id="ga-orb" cx=".4" cy=".35" r=".6"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#8fe3ff"/><stop offset="1" stop-color="#3a8ad6"/></radialGradient>
</defs></svg>`;

// ---------- little helpers ----------
const shadow = (cx=32,cy=60,rx=19,ry=3.2) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity=".25"/>`;
const shine = (cx,cy,rx,ry,op=.45,rot=-25) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${op}" transform="rotate(${rot} ${cx} ${cy})"/>`;
const eye = (cx,cy,r,dx=0,dy=0,pupil=INK) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" ${O2}/><circle cx="${cx+dx}" cy="${cy+dy}" r="${r*.5}" fill="${pupil}"/><circle cx="${cx+dx-r*.18}" cy="${cy+dy-r*.22}" r="${r*.17}" fill="#fff"/>`;
const dot = (cx,cy,r=1.9) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${INK}"/><circle cx="${cx-.6}" cy="${cy-.7}" r="${r*.32}" fill="#fff"/>`;
const blush = (cx,cy,c='#ff8a8a') => `<ellipse cx="${cx}" cy="${cy}" rx="3" ry="1.8" fill="${c}" opacity=".45"/>`;
const bust = (fill,w=22,top=46,cx=32) => `<path d="M${cx-w} 64 Q${cx-w+1} ${top} ${cx} ${top} Q${cx+w-1} ${top} ${cx+w} 64Z" fill="${fill}" ${O}/>`;
const neck = (fill,cx=32,w=10,y=38,h=10) => `<rect x="${cx-w/2}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${O2}/>`;

// feathery carrot-top frond: stem along a curve with alternating leaflets
const frond = (x0,y0,cx,cy,x1,y1,n,len,col,dark) => {
  const pt=t=>[(1-t)*(1-t)*x0+2*(1-t)*t*cx+t*t*x1,(1-t)*(1-t)*y0+2*(1-t)*t*cy+t*t*y1];
  const tan=t=>[2*(1-t)*(cx-x0)+2*t*(x1-cx),2*(1-t)*(cy-y0)+2*t*(y1-cy)];
  let leaves='';
  for(let i=1;i<=n;i++){const t=.25+.75*i/n;const [x,y]=pt(t);const [dx,dy]=tan(t);const ang=Math.atan2(dy,dx)*180/Math.PI;const l=len*(1.15-.5*t);
    for(const side of [1,-1]){leaves+=`<ellipse cx="${(x).toFixed(1)}" cy="${(y).toFixed(1)}" rx="${(l/2).toFixed(1)}" ry="${(l/5).toFixed(1)}" fill="${col}" stroke="${dark}" stroke-width=".6" transform="rotate(${(ang+side*55).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)}) translate(${(l/2).toFixed(1)} 0)"/>`;}}
  const [ex,ey]=pt(1);
  return `<path d="M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}" stroke="${dark}" stroke-width="1.3" fill="none" stroke-linecap="round"/>${leaves}<ellipse cx="${ex}" cy="${ey}" rx="${(len/2.4).toFixed(1)}" ry="${(len/5).toFixed(1)}" fill="${col}" stroke="${dark}" stroke-width=".6" transform="rotate(${(Math.atan2(tan(1)[1],tan(1)[0])*180/Math.PI).toFixed(0)} ${ex} ${ey})"/>`;
};

const ART = {
  // ================= UI =================
  coin: `${shadow(32,59,17,2.6)}<circle cx="32" cy="31" r="26" fill="url(#ga-gd)" ${O}/><circle cx="32" cy="31" r="20.5" fill="none" stroke="#c07f10" stroke-width="2"/>
    <path d="M24 45 V29 a8 8 0 0 1 16 0 V45 Z" fill="#e4a522" stroke="#a96c0c" stroke-width="1.6"/>
    <path d="M32 29 v10 M28 33 h8" stroke="#fff3b8" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M14 22 a20 20 0 0 1 12 -10" stroke="#fff" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/>`,
  bone: `<g transform="rotate(-35 32 32)"><path d="M17 27.5 H47 a6.5 6.5 0 1 1 3 6 a6.5 6.5 0 1 1 -3 6 H17 a6.5 6.5 0 1 1 -3 -6 a6.5 6.5 0 1 1 3 -6Z" fill="url(#ga-cr)" ${O}/>
    <path d="M19 30 H45" stroke="#fff" stroke-width="2" opacity=".7" stroke-linecap="round"/><path d="M20 37 H44" stroke="#b9a678" stroke-width="1.6" stroke-linecap="round"/></g>`,
  star: `<path d="M32 5 L39.6 23.4 L59 24.6 L43.8 37 L49 56 L32 45.2 L15 56 L20.2 37 L5 24.6 L24.4 23.4 Z" fill="url(#ga-lf)" ${O}/>
    <path d="M32 11 L37 23.5" stroke="#d6ffc9" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>${dot(27,32,2.3)}${dot(37,32,2.3)}<path d="M28.5 38 q3.5 2.6 7 0" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
  drop: `<path d="M32 6 C24 20 14 29 14 41 a18 18 0 0 0 36 0 C50 29 40 20 32 6 Z" fill="url(#ga-wa)" ${O}/>${shine(24,40,3.2,7,.75,10)}<circle cx="27" cy="51" r="1.8" fill="#fff" opacity=".7"/>`,
  lock: `<path d="M21 29 V21 a11 11 0 0 1 22 0 V29" fill="none" stroke="${INK}" stroke-width="8.5"/><path d="M21 29 V21 a11 11 0 0 1 22 0 V29" fill="none" stroke="#b9bdd0" stroke-width="5"/>
    <rect x="13" y="27" width="38" height="29" rx="6" fill="url(#ga-gd)" ${O}/><path d="M17 33 h30" stroke="#fff3b8" stroke-width="2" opacity=".8" stroke-linecap="round"/>
    <circle cx="32" cy="40" r="4.2" fill="${INK}"/><path d="M30.4 41 h3.2 l1 8 h-5.2Z" fill="${INK}"/>`,
  house: `${shadow(32,59,24,2.6)}<rect x="44" y="12" width="6" height="12" fill="url(#ga-br)" ${O2}/>
    <rect x="14" y="29" width="36" height="28" fill="url(#ga-cr)" ${O}/><path d="M14 36 H50 M14 43 H50 M14 50 H50" stroke="#d6c39a" stroke-width="1.2"/>
    <path d="M8 31 L32 10 L56 31 Z" fill="url(#ga-rd)" ${O}/><path d="M16 26 L48 26 M22 20 L42 20" stroke="#7a1f1a" stroke-width="1.3" opacity=".6"/>
    <rect x="27.5" y="40" width="9" height="17" rx="1.5" fill="url(#ga-br)" ${O2}/><circle cx="34" cy="49" r="1" fill="#ffcf4a"/>
    <rect x="17.5" y="34" width="7" height="7" fill="#ffe9a0" ${O2}/><rect x="39.5" y="34" width="7" height="7" fill="#ffe9a0" ${O2}/><path d="M21 34 v7 M17.5 37.5 h7 M43 34 v7 M39.5 37.5 h7" stroke="${INK}" stroke-width="1"/>`,
  ruin: `${shadow(32,59,24,2.6)}<rect x="14" y="29" width="36" height="28" fill="#9a8f7a" ${O}/><path d="M14 36 H50 M14 43 H50 M14 50 H50" stroke="#80766a" stroke-width="1.2"/>
    <path d="M8 31 L27 14 L30 22 L35 15 L56 31 Z" fill="url(#ga-gy)" ${O}/>
    <rect x="27.5" y="40" width="9" height="17" fill="#2a1f18" ${O2}/><path d="M28 44 l8 5" stroke="#8a5a2b" stroke-width="2.4"/>
    <rect x="17.5" y="34" width="7" height="7" fill="#1d1a2b" ${O2}/><rect x="39.5" y="34" width="7" height="7" fill="#1d1a2b" ${O2}/>
    <path d="M16 36 l10 4 M38 40 l10 -4" stroke="#a87a48" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M45 45 l-3 4 l2 3 l-2 3" stroke="#5a5040" stroke-width="1.4" fill="none"/>
    <path d="M40 10 q3 -4 0 -7 M45 12 q4 -4 1 -8" stroke="#a69fc0" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>`,
  flask: `${shadow(32,60,16,2.4)}<rect x="25" y="4" width="14" height="7" rx="2" fill="url(#ga-wd)" ${O2}/>
    <path d="M27 11 H37 V25 L50.5 48.5 a6.5 6.5 0 0 1 -5.6 9.5 H19.1 a6.5 6.5 0 0 1 -5.6 -9.5 L27 25 Z" fill="#dfe8f8" fill-opacity=".28" ${O}/>
    <path d="M18.6 39 H45.4 L50.5 48.5 a6.5 6.5 0 0 1 -5.6 9.5 H19.1 a6.5 6.5 0 0 1 -5.6 -9.5 Z" fill="url(#ga-lf)"/>
    <path d="M18.6 39 H45.4" stroke="#d6ffc9" stroke-width="1.6"/><circle cx="26" cy="48" r="2.6" fill="#e3ffd9" opacity=".85"/><circle cx="36" cy="52" r="1.8" fill="#e3ffd9" opacity=".85"/><circle cx="33" cy="33" r="1.8" fill="#9be886"/><circle cx="30" cy="27" r="1.2" fill="#9be886"/>
    <path d="M29.5 14 V26 L19 46" stroke="#fff" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>
    <path d="M27 11 H37 V25 L50.5 48.5 a6.5 6.5 0 0 1 -5.6 9.5 H19.1 a6.5 6.5 0 0 1 -5.6 -9.5 L27 25 Z" fill="none" ${O}/>`,
  swords: `<g ${O}><path d="M45 9 L52 6 L49 13 L22 40 L18 36 Z" fill="url(#ga-mt)"/><path d="M19 9 L12 6 L15 13 L42 40 L46 36 Z" fill="url(#ga-mt)"/>
    <rect x="13" y="35" width="15" height="5" rx="2" fill="url(#ga-gd)" transform="rotate(45 20.5 37.5)"/><rect x="36" y="35" width="15" height="5" rx="2" fill="url(#ga-gd)" transform="rotate(-45 43.5 37.5)"/>
    <rect x="11" y="42" width="5" height="12" rx="2" fill="url(#ga-wd)" transform="rotate(45 13.5 48)"/><rect x="48" y="42" width="5" height="12" rx="2" fill="url(#ga-wd)" transform="rotate(-45 50.5 48)"/>
    <circle cx="8.5" cy="55.5" r="3" fill="url(#ga-gd)"/><circle cx="55.5" cy="55.5" r="3" fill="url(#ga-gd)"/></g>`,
  gear: `<g fill="url(#ga-mtv)" ${O}><path d="${(()=>{let d='';for(let i=0;i<8;i++){const a=i*Math.PI/4,b=a+.26,c=a-.26;const p=(r,t)=>(32+r*Math.cos(t)).toFixed(1)+' '+(32+r*Math.sin(t)).toFixed(1);d+=(i?'L':'M')+p(19,c-.13)+' L'+p(26,c)+' L'+p(26,b)+' L'+p(19,b+.13)+' ';}return d+'Z'})()}"/></g>
    <circle cx="32" cy="32" r="8" fill="#2a2540" ${O}/><path d="M20 22 a15 15 0 0 1 8 -5" stroke="#fff" stroke-width="2.4" fill="none" opacity=".7" stroke-linecap="round"/>`,
  sparkle: `<path d="M30 3 L35 25 L57 30 L35 35 L30 57 L25 35 L3 30 L25 25 Z" fill="url(#ga-gd)" ${O}/><path d="M52 6 L54 12 L60 14 L54 16 L52 22 L50 16 L44 14 L50 12Z" fill="#fff6c4" ${O2}/>`,
  trophy: `${shadow(32,60,16,2.4)}<path d="M18 13 H9 a9 10 0 0 0 11 14 M46 13 H55 a9 10 0 0 1 -11 14" fill="none" stroke="${INK}" stroke-width="6"/><path d="M18 13 H9 a9 10 0 0 0 11 14 M46 13 H55 a9 10 0 0 1 -11 14" fill="none" stroke="#f0b52e" stroke-width="3"/>
    <path d="M17 8 H47 V24 a15 15 0 0 1 -30 0 Z" fill="url(#ga-gd)" ${O}/><rect x="28.5" y="38" width="7" height="10" fill="#d08a12" ${O2}/><rect x="19" y="48" width="26" height="9" rx="2" fill="url(#ga-wd)" ${O}/>
    <rect x="25" y="51" width="14" height="3" rx="1" fill="#ffcf4a"/><path d="M22 12 V24" stroke="#fff" stroke-width="2.6" opacity=".7" stroke-linecap="round"/>`,
  gift: `${shadow(32,59,22,2.6)}<rect x="11" y="27" width="42" height="30" rx="3" fill="url(#ga-pu)" ${O}/><rect x="8" y="19" width="48" height="11" rx="3" fill="#a07ad0" ${O}/>
    <rect x="28.5" y="19" width="7" height="38" fill="url(#ga-lf)" ${O2}/><path d="M32 19 C24 6 12 12 21 19 Z M32 19 C40 6 52 12 43 19 Z" fill="url(#ga-lf)" ${O}/>
    <path d="M13 23 h12" stroke="#fff" stroke-width="2" opacity=".5" stroke-linecap="round"/>`,

  // ================= growth stages =================
  sprout: `<ellipse cx="32" cy="54" rx="21" ry="7" fill="url(#ga-dt)" ${O}/><circle cx="20" cy="53" r="1.4" fill="#2a1a0e"/><circle cx="44" cy="55" r="1.2" fill="#2a1a0e"/>
    <path d="M32 54 C32 45 30 39 34 30" stroke="${INK}" stroke-width="5.5" fill="none" stroke-linecap="round"/><path d="M32 54 C32 45 30 39 34 30" stroke="#6fbf5a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M33.5 34 C40 25 51 27 52 27 C48 37 39 39 33.5 34Z" fill="url(#ga-lf)" ${O}/><path d="M35 33.5 C40 31 45 30 49 29" stroke="#2f6e2c" stroke-width="1" fill="none"/>
    <path d="M31.5 41 C24 34 14 38 13 38 C18 46 27 46 31.5 41Z" fill="url(#ga-lf2)" ${O}/><path d="M30 40.5 C25 39 20 39 16 39" stroke="#1f4f1e" stroke-width="1" fill="none"/>`,
  sprout2: `<ellipse cx="32" cy="56" rx="23" ry="6.5" fill="url(#ga-dt)" ${O}/>
    <path d="M32 56 C29 45 36 36 32 25" stroke="${INK}" stroke-width="5.5" fill="none" stroke-linecap="round"/><path d="M32 56 C29 45 36 36 32 25" stroke="#6fbf5a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M31 48 C21 44 19 34 25 31 C30 31 28 37 24 37" stroke="${INK}" stroke-width="4.2" fill="none" stroke-linecap="round"/><path d="M31 48 C21 44 19 34 25 31 C30 31 28 37 24 37" stroke="#5ea04a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M34 41 C42 32 53 35 53 35 C49 44 39 45 34 41Z" fill="url(#ga-lf)" ${O}/>
    <path d="M24 16 L28 21 M40 16 L36 21 M32 11 V17" stroke="#6b3fa0" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="32" cy="21" r="9.5" fill="url(#ga-pu)" ${O}/>${shine(28.5,17.5,2.6,1.6,.5)}
    <ellipse cx="28.8" cy="22" rx="2" ry="2.4" fill="url(#ga-eyeY)"/><ellipse cx="35.2" cy="22" rx="2" ry="2.4" fill="url(#ga-eyeY)"/><circle cx="29" cy="22.4" r=".9" fill="${INK}"/><circle cx="35.4" cy="22.4" r=".9" fill="${INK}"/>`,
  mound: `<path d="M22 49 V27 a10 10 0 0 1 20 0 V49 Z" fill="url(#ga-ts)" ${O}/><path d="M32 23 v12 M27.5 28 h9" stroke="#55507a" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M38 30 l-3 4 l2 3" stroke="#55507a" stroke-width="1.2" fill="none"/><path d="M24 47 q3 -5 6 -1 q2 -3 4 0" fill="#5ea04a" ${O2}/>${shine(26,25,2,4,.45,20)}
    <path d="M5 60 Q32 35 59 60Z" fill="url(#ga-dt)" ${O}/><path d="M14 56 q4 -3 8 -1 M41 54 q5 -2 9 1" stroke="#2a1a0e" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="31" cy="54" r="1.6" fill="#2a1a0e"/>`,
  hand: `<path d="M22 48 L20.6 37 Q20 30 21.4 27 L21.4 17.5 a2.1 2.1 0 0 1 4.2 0 V26 L26.1 12.5 a2.1 2.1 0 0 1 4.2 0 V25 L30.8 10 a2.1 2.1 0 0 1 4.2 0 V25.5 L35.5 13.5 a2.1 2.1 0 0 1 4.2 0 V30 L42.6 24 a2.3 2.3 0 0 1 4.3 1.6 L42 39 Q41 44 40 48 Z" fill="url(#ga-zg)" ${O}/>
    <path d="M22.3 18.5 h2.6 M27 13.5 h2.6 M31.7 11 h2.6 M36.4 14.5 h2.6" stroke="#e8f7d6" stroke-width="1.4" stroke-linecap="round"/><path d="M26 37 q5 2.2 11 0" stroke="#3f6e2e" stroke-width="1.3" fill="none"/>
    <path d="M19.5 49 L22 43 L26 46 L30 42 L34 46 L38 42 L42 47 L42.5 52 H20Z" fill="url(#ga-bl)" ${O}/>
    <path d="M4 61 Q32 41 60 61Z" fill="url(#ga-dt)" ${O}/><circle cx="17" cy="56" r="2" fill="#2a1a0e"/><circle cx="47" cy="56" r="2.4" fill="#2a1a0e"/><path d="M27 55 q4 -2 8 0" stroke="#2a1a0e" stroke-width="1.4" fill="none"/>`,

  wilt: `<ellipse cx="32" cy="55" rx="21" ry="6.5" fill="url(#ga-dt)" ${O}/><path d="M44 56 q4 -3 8 -1 q-3 3 -8 1Z" fill="#8a6a3a" ${O2}/>
    <path d="M30 55 C30 44 27 36 33 29 C38 24 45 27 44 35" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M30 55 C30 44 27 36 33 29 C38 24 45 27 44 35" stroke="#9a8048" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M29.5 44 C23 42 18 46 17 51 C22 51 27 49 29.5 44Z" fill="#8a6a3a" ${O}/><path d="M31 37 C36 37 39 41 39 46 C34 45 31 42 31 37Z" fill="#a08050" ${O}/>
    <circle cx="44" cy="39" r="6" fill="#6e5a7a" ${O}/><path d="M41 38.5 l2 1.2 M45 39.7 l2 -1.2" stroke="${INK}" stroke-width="1.3" stroke-linecap="round"/><path d="M42 42.5 q2 -1.4 4 0" stroke="${INK}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M20 22 q2 -3 4 0 M47 16 q2 -3 4 0" stroke="#a69fc0" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>`,
  // ---- graveyard pieces (v10): headstones, stirring dirt, fence, gate, dead tree, lantern, brambles ----
  stone0: `<path d="M14 62 V27 a18 18 0 0 1 36 0 V62 Z" fill="url(#ga-ts)" ${O}/><path d="M23 30 h18 M25 37 h14 M27 44 h10" stroke="#55507a" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M44 20 l-4 5 l3 4 l-2 4" stroke="#55507a" stroke-width="1.3" fill="none" stroke-linecap="round"/>${shine(22,21,2.6,6,.45,24)}
    <path d="M12 62 q2 -9 5 -2 q2 -8 5 0 q2 -5 4 2Z M42 62 q3 -8 5 -1 q3 -6 5 1Z" fill="#5ea04a" ${O2}/>`,
  stone1: `<path d="M25 62 V35 H11 V21 H25 V7 H39 V21 H53 V35 H39 V62 Z" fill="url(#ga-ts)" ${O}/><path d="M32 13 v38 M19 28 h26" stroke="#55507a" stroke-width="2" stroke-linecap="round" opacity=".7"/>
    ${shine(28,12,1.6,4,.45,0)}<path d="M19 62 q3 -9 6 -1 q2 -6 4 1Z M37 62 q3 -7 5 -1 q2 -5 4 1Z" fill="#5ea04a" ${O2}/>`,
  stone2: `<path d="M11 62 V27 q0 -6 6 -6 h5 q2 -11 10 -11 q8 0 10 11 h5 q6 0 6 6 V62 Z" fill="url(#ga-ts)" ${O}/>
    <circle cx="32" cy="24" r="5" fill="none" stroke="#55507a" stroke-width="2"/><path d="M21 36 h22 M23 43 h18 M25 50 h14" stroke="#55507a" stroke-width="2.2" stroke-linecap="round"/>
    ${shine(18,28,2,5,.4,10)}<path d="M9 62 q3 -8 5 -1 q3 -7 5 1Z M45 62 q2 -9 5 -2 q2 -5 4 2Z" fill="#5ea04a" ${O2}/>`,
  stone3: `<g transform="rotate(-7 32 40)"><rect x="27" y="7" width="10" height="56" rx="1.5" fill="url(#ga-wd)" ${O}/><rect x="12" y="19" width="40" height="10" rx="1.5" fill="url(#ga-wd)" ${O}/>
    <path d="M30 34 v20 M34 12 v5 M17 24 h8 M40 23 h8" stroke="#55361c" stroke-width="1.1" stroke-linecap="round"/><circle cx="32" cy="24" r="1.5" fill="${INK}"/><circle cx="32" cy="21" r="1" fill="#f4f6fb" opacity=".6"/></g>
    <path d="M20 62 q3 -8 5 -1 q2 -6 4 1Z M36 62 q3 -7 5 -1 q2 -5 4 1Z" fill="#5ea04a" ${O2}/>`,
  dirt: `<path d="M4 60 Q32 28 60 60Z" fill="url(#ga-dt)" ${O}/><path d="M12 56 q4 -3 8 -1 M43 55 q5 -2 9 1" stroke="#2a1a0e" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M19 51 Q32 38 45 51 Q32 57 19 51Z" fill="${INK}"/><circle cx="27" cy="49.5" r="4" fill="url(#ga-eyeG)"/><circle cx="37" cy="49.5" r="4" fill="url(#ga-eyeG)"/><circle cx="27" cy="49.5" r="1.2" fill="${INK}"/><circle cx="37" cy="49.5" r="1.2" fill="${INK}"/>
    <path d="M30 40 l-3 -6 M34 40 l2 -7 M38 42 l5 -4" stroke="#2a1a0e" stroke-width="1.4" stroke-linecap="round"/><circle cx="14" cy="38" r="2" fill="#6b4a2e" ${O2}/><circle cx="50" cy="35" r="1.6" fill="#6b4a2e" ${O2}/><circle cx="24" cy="30" r="1.3" fill="#6b4a2e" ${O2}/>`,
  fence: `<g fill="#4d4873" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round">${[8,24,40,56].map(x=>`<path d="M${x-2.2} 64 V16 L${x-4.6} 13 L${x} 3 L${x+4.6} 13 L${x+2.2} 16 V64Z"/>`).join('')}<rect x="-2" y="26" width="68" height="5"/><rect x="-2" y="50" width="68" height="5"/></g>
    <g stroke="#8a84b4" stroke-width="1" stroke-linecap="round" opacity=".8"><path d="M0 27.4 H64 M0 51.4 H64"/>${[8,24,40,56].map(x=>`<path d="M${x-1} 33 V48 M${x-2.4} 12.5 L${x} 6"/>`).join('')}</g>`,
  gate: `<path d="M12 24 Q32 -4 52 24" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M12 24 Q32 -4 52 24" fill="none" stroke="#3a3556" stroke-width="3.6" stroke-linecap="round"/>
    <path d="M32 11 v7" stroke="${INK}" stroke-width="2"/><circle cx="32" cy="23" r="8" fill="url(#ga-glow)"/><rect x="28.5" y="18" width="7" height="9" rx="1.5" fill="url(#ga-fire)" ${O2}/>
    <rect x="3" y="22" width="13" height="42" fill="url(#ga-ts)" ${O}/><rect x="1" y="17" width="17" height="7" rx="2" fill="url(#ga-ts)" ${O}/><rect x="48" y="22" width="13" height="42" fill="url(#ga-ts)" ${O}/><rect x="46" y="17" width="17" height="7" rx="2" fill="url(#ga-ts)" ${O}/>
    <path d="M6 34 h7 M5 44 h8 M6 54 h7 M51 34 h7 M51 44 h8 M51 54 h7" stroke="#55507a" stroke-width="1.4" stroke-linecap="round"/>${shine(6,28,1.2,3,.4,0)}${shine(51,28,1.2,3,.4,0)}`,
  tree: `<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M31 63 C30 50 34 44 31 34 M31 40 C24 34 18 34 11 25 M17 31 C13 31 9 33 5 31 M14 28 C13 23 14 19 12 14 M32 36 C36 28 44 27 50 17 M45 24 C50 24 55 22 59 23 M48 20 C48 14 51 11 51 6 M31 34 C30 26 26 22 28 12 M28.5 19 C25 16 23 13 22 8" stroke="${INK}" stroke-width="6.4"/>
    <path d="M31 63 C30 50 34 44 31 34 M31 40 C24 34 18 34 11 25 M17 31 C13 31 9 33 5 31 M14 28 C13 23 14 19 12 14 M32 36 C36 28 44 27 50 17 M45 24 C50 24 55 22 59 23 M48 20 C48 14 51 11 51 6 M31 34 C30 26 26 22 28 12 M28.5 19 C25 16 23 13 22 8" stroke="#55486b" stroke-width="3.2"/></g>
    <path d="M24 63 Q26 54 31 52 Q37 54 39 63Z" fill="#55486b" ${O}/><path d="M29 50 q-1 5 1 10 M34 47 q1 4 0 8" stroke="#3a2f4c" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M38 13.5 q5 -6 10 -1.5 l4 .6 l-3.4 2 q-1 4 -6 4 q-4 0 -4.6 -5.1Z" fill="${INK}"/><circle cx="46.6" cy="12.6" r="1.1" fill="#ffd84a"/>`,
  lamp: `<circle cx="32" cy="17" r="17" fill="url(#ga-glow)"/><rect x="30" y="26" width="4" height="37" fill="url(#ga-gy)" ${O2}/><rect x="25" y="60" width="14" height="4" rx="1.5" fill="url(#ga-gy)" ${O2}/>
    <path d="M24 9 H40 L38 26 H26Z" fill="url(#ga-fire)" ${O}/><path d="M32 9 V26 M25 17.5 H39" stroke="${INK}" stroke-width="1.3"/><path d="M22 9 L32 2 L42 9Z" fill="url(#ga-gy)" ${O}/>${shine(28,14,1.4,3.4,.6,8)}`,
  weeds: `<path d="M8 62 C10 48 18 46 16 34 M30 62 C28 50 38 44 34 30 M52 62 C54 50 46 46 50 36" fill="none" stroke="${INK}" stroke-width="4.6" stroke-linecap="round"/>
    <path d="M8 62 C10 48 18 46 16 34 M30 62 C28 50 38 44 34 30 M52 62 C54 50 46 46 50 36" fill="none" stroke="#4d7a52" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M13 48 l-5 -3 M15 41 l5 -2 M31 50 l-6 -2 M35 41 l6 -1 M33 35 l-5 -3 M52 50 l5 -3 M49 43 l-5 -2" stroke="#4d7a52" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M2 63 q4 -12 7 -1 q3 -9 6 0 q4 -8 6 1Z M38 63 q3 -10 6 -1 q3 -7 5 0 q4 -9 7 1Z M20 63 q3 -7 5 0 q3 -6 6 0Z" fill="#3f6646" ${O2}/>`,

  torch: `<path d="M18 58 L36 30" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M18 58 L36 30" stroke="url(#ga-wd)" stroke-width="5" stroke-linecap="round"/>
    <path d="M31.5 31 L39.5 36 L42 31.5 L34 26.5Z" fill="url(#ga-gy)" ${O}/>
    <path d="M38 29 C30 24 31 14 37 6 C38 12 42 12 43 8 C48 14 50 24 42 30 Z" fill="url(#ga-fire)" ${O}/>
    <path d="M39.5 26 C36 22 37 17 39.5 14 C40.5 18 43 18 43.5 16 C45 20 44 24 41.5 26Z" fill="#fff6c4"/>`,
  // ================= crops (spooky, PG) =================
  radish: `<ellipse cx="32" cy="36" rx="26" ry="27" fill="url(#ga-glow)"/>
    ${frond(30,20,22,12,9,13,5,6,'#7fd36a','#2f6e2c')}${frond(31,19,30,9,24,3,5,6,'#6fc45c','#2f6e2c')}
    ${frond(33,19,40,8,44,3,5,6,'#8fe07a','#2f6e2c')}${frond(34,20,46,12,55,15,5,6,'#7fd36a','#2f6e2c')}
    ${frond(30,21,20,18,15,24,3,5.5,'#6fc45c','#2f6e2c')}${frond(34,21,44,18,50,24,3,5.5,'#8fe07a','#2f6e2c')}
    <path d="M29 22 q3 -4 6 0" fill="#4a8a3a" ${O2}/>
    <path d="M18 24 Q32 15 46 24 Q44 35 38 47 Q35 53 36 58 Q30 55 31 60 Q27 53 26 45 Q20 35 18 24Z" fill="url(#ga-gh)" ${O}/>
    <path d="M21 32 h5 M39 37 h4 M24 44 h4 M35 49 h3" stroke="#b3a8d0" stroke-width="1.6" stroke-linecap="round"/>${shine(24,27,3,5,.8,-20)}
    <ellipse cx="27.5" cy="31" rx="2.8" ry="3.9" fill="${INK}"/><ellipse cx="36.5" cy="31" rx="2.8" ry="3.9" fill="${INK}"/><circle cx="26.6" cy="29.6" r="1" fill="#fff"/><circle cx="35.6" cy="29.6" r="1" fill="#fff"/>
    <ellipse cx="32" cy="39" rx="2.3" ry="3" fill="${INK}"/>${blush(23,36,'#c8a8ff')}${blush(41,36,'#c8a8ff')}`,
  corn: `${shadow(32,61,13,2.2)}<path d="M29 63 V55 M35 63 V55" stroke="${INK}" stroke-width="5.4" stroke-linecap="round"/><path d="M29 63 V55 M35 63 V55" stroke="#4f8a3a" stroke-width="3" stroke-linecap="round"/>
    <path d="M23 7 q3 -5 9 -3 q6 -2 9 3 M27 9 q2 -6 5 -6 M37 9 q-2 -6 -5 -6" stroke="#e8cf72" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <ellipse cx="32" cy="29" rx="12.5" ry="21" fill="url(#ga-cn)" ${O}/>
    <ellipse cx="30.5" cy="10.8" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="29.9" cy="10.3" r=".5" fill="#fff" opacity=".85"/><ellipse cx="34.1" cy="10.8" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="33.6" cy="10.3" r=".5" fill="#fff" opacity=".85"/><ellipse cx="25.1" cy="14.1" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="24.6" cy="13.6" r=".5" fill="#fff" opacity=".85"/><ellipse cx="28.7" cy="14.1" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="28.1" cy="13.6" r=".5" fill="#fff" opacity=".85"/><ellipse cx="32.3" cy="14.1" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="31.7" cy="13.6" r=".5" fill="#fff" opacity=".85"/><ellipse cx="35.9" cy="14.1" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="35.4" cy="13.6" r=".5" fill="#fff" opacity=".85"/><ellipse cx="39.5" cy="14.1" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="39.0" cy="13.6" r=".5" fill="#fff" opacity=".85"/><ellipse cx="23.3" cy="17.4" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="22.8" cy="16.9" r=".5" fill="#fff" opacity=".85"/><ellipse cx="26.9" cy="17.4" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="26.3" cy="16.9" r=".5" fill="#fff" opacity=".85"/><ellipse cx="30.5" cy="17.4" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="29.9" cy="16.9" r=".5" fill="#fff" opacity=".85"/><ellipse cx="34.1" cy="17.4" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="33.6" cy="16.9" r=".5" fill="#fff" opacity=".85"/><ellipse cx="37.7" cy="17.4" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="37.2" cy="16.9" r=".5" fill="#fff" opacity=".85"/><ellipse cx="25.1" cy="20.7" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="24.6" cy="20.2" r=".5" fill="#fff" opacity=".85"/><ellipse cx="28.7" cy="20.7" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="28.1" cy="20.2" r=".5" fill="#fff" opacity=".85"/><ellipse cx="32.3" cy="20.7" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="31.7" cy="20.2" r=".5" fill="#fff" opacity=".85"/><ellipse cx="35.9" cy="20.7" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="35.4" cy="20.2" r=".5" fill="#fff" opacity=".85"/><ellipse cx="39.5" cy="20.7" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="39.0" cy="20.2" r=".5" fill="#fff" opacity=".85"/><ellipse cx="23.3" cy="24.0" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="22.8" cy="23.5" r=".5" fill="#fff" opacity=".85"/><ellipse cx="41.3" cy="24.0" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="40.8" cy="23.5" r=".5" fill="#fff" opacity=".85"/><ellipse cx="21.5" cy="27.3" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="20.9" cy="26.8" r=".5" fill="#fff" opacity=".85"/><ellipse cx="43.1" cy="27.3" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="42.6" cy="26.8" r=".5" fill="#fff" opacity=".85"/><ellipse cx="21.5" cy="33.9" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="20.9" cy="33.4" r=".5" fill="#fff" opacity=".85"/><ellipse cx="23.3" cy="37.2" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="22.8" cy="36.7" r=".5" fill="#fff" opacity=".85"/><ellipse cx="41.3" cy="37.2" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="40.8" cy="36.7" r=".5" fill="#fff" opacity=".85"/><ellipse cx="25.1" cy="40.5" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="24.6" cy="40.0" r=".5" fill="#fff" opacity=".85"/><ellipse cx="28.7" cy="40.5" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="28.1" cy="40.0" r=".5" fill="#fff" opacity=".85"/><ellipse cx="32.3" cy="40.5" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="31.7" cy="40.0" r=".5" fill="#fff" opacity=".85"/><ellipse cx="35.9" cy="40.5" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="35.4" cy="40.0" r=".5" fill="#fff" opacity=".85"/><ellipse cx="39.5" cy="40.5" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="39.0" cy="40.0" r=".5" fill="#fff" opacity=".85"/><ellipse cx="26.9" cy="43.8" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="26.3" cy="43.3" r=".5" fill="#fff" opacity=".85"/><ellipse cx="30.5" cy="43.8" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="29.9" cy="43.3" r=".5" fill="#fff" opacity=".85"/><ellipse cx="34.1" cy="43.8" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="33.6" cy="43.3" r=".5" fill="#fff" opacity=".85"/><ellipse cx="37.7" cy="43.8" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="37.2" cy="43.3" r=".5" fill="#fff" opacity=".85"/><ellipse cx="28.7" cy="47.1" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="28.1" cy="46.6" r=".5" fill="#fff" opacity=".85"/><ellipse cx="32.3" cy="47.1" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="31.7" cy="46.6" r=".5" fill="#fff" opacity=".85"/><ellipse cx="35.9" cy="47.1" rx="1.75" ry="1.5" fill="#b892f7" stroke="#3a1f78" stroke-width=".7"/><circle cx="35.4" cy="46.6" r=".5" fill="#fff" opacity=".85"/>
    <ellipse cx="32" cy="31" rx="10.4" ry="8.4" fill="#6a3fc0" opacity=".55"/>
    <ellipse cx="27" cy="29" rx="4.1" ry="4.7" fill="url(#ga-eyeY)" ${O2}/><ellipse cx="37" cy="29" rx="4.1" ry="4.7" fill="url(#ga-eyeY)" ${O2}/><circle cx="27.6" cy="30" r="1.9" fill="${INK}"/><circle cx="37.6" cy="30" r="1.9" fill="${INK}"/>
    <path d="M25 36.5 l2.8 2.6 l4.2 -2.6 l4.2 2.6 l2.8 -2.6" stroke="${INK}" stroke-width="2" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M32 58 Q11 52 13 21 Q18 33 24 41 Q28 50 32 58Z" fill="url(#ga-lf2)" ${O}/><path d="M31 56 Q22 49 19 36 Q22 44 27 49 Q29.5 53 31 56Z" fill="#d7efa2" opacity=".9"/>
    <path d="M32 58 Q53 52 51 21 Q46 33 40 41 Q36 50 32 58Z" fill="url(#ga-lf)" ${O}/><path d="M33 56 Q42 49 45 36 Q42 44 37 49 Q34.5 53 33 56Z" fill="#e3f7b4" opacity=".9"/>
    <path d="M16 30 Q17 42 26 52 M18 26 Q20 36 24 42 M48 30 Q47 42 38 52 M46 26 Q44 36 40 42" stroke="#1f4f1e" stroke-width=".9" fill="none"/>
    <path d="M24 41 Q28 50 32 58 Q36 50 40 41" stroke="${INK}" stroke-width="1.8" fill="none"/>`,
  pump: `${shadow(32,59,24,3)}<path d="M33 14 q2 -9 -2 -10 l-3 1 q3 3 1 9" fill="url(#ga-wd)" ${O}/><path d="M34 9 q10 -8 16 1 q-3 1 -5 -1" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M34 9 q10 -8 16 1 q-3 1 -5 -1" stroke="#5ea04a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M47 8 q7 -3 9 3 q-5 4 -9 -3Z" fill="url(#ga-lf)" ${O2}/>
    <ellipse cx="19" cy="37" rx="13" ry="19" fill="url(#ga-or2)" ${O}/><ellipse cx="45" cy="37" rx="13" ry="19" fill="url(#ga-or2)" ${O}/><ellipse cx="32" cy="37" rx="14.5" ry="21" fill="url(#ga-or)" ${O}/>
    <path d="M25 20 Q23 37 25 56 M39 20 Q41 37 39 56" stroke="#b3471a" stroke-width="1.3" fill="none" opacity=".7"/>${shine(26,24,3,6,.45,15)}
    <path d="M18 31 L25.5 23 L28 33 Z M46 31 L38.5 23 L36 33 Z" fill="url(#ga-fire)" ${O2}/><path d="M30.5 36 l1.5 -3 l1.5 3 Z" fill="url(#ga-fire)" ${O2}/>
    <path d="M15 40 Q32 56 49 40 L45.5 43.5 L42 39.5 L37.5 46 L32 41 L26.5 46 L22 39.5 L18.5 43.5 Z" fill="url(#ga-fire)" ${O2}/>`,
  egg: `${shadow(35,61,17,2.6)}
    <path d="M22 18 C13 22 12 33 16 42 C20 53 28 60 38.5 60 C50 60 55 50 52 39.5 C49 30 42 25 35 18.5 C31 14.5 26.5 15.5 22 18Z" fill="url(#ga-pu)" ${O}/>
    <path d="M43 30 C49 35 52 43 49 51" stroke="#250d3c" stroke-width="2.4" fill="none" opacity=".45" stroke-linecap="round"/>
    <path d="M19 27 C17 34 20 43 25 49" stroke="#d6b4f5" stroke-width="2.8" fill="none" opacity=".55" stroke-linecap="round"/>
    ${shine(22.5,26,1.8,4.2,.7,25)}<ellipse cx="44" cy="54" rx="3" ry="1.4" fill="#fff" opacity=".18" transform="rotate(-30 44 54)"/>
    ${[[29,52],[42,47],[24,40],[46,40],[36,56]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".7" fill="#2a1040" opacity=".55"/>`).join('')}
    <path d="M17.5 20 L11.5 27.5 L19.5 25 L17.5 33 L24.5 26.5 L28.5 33.5 L30 25 L36.5 27.5 L33 20.5 L35 16.5 L27 17.5 L24 14 L20 17.5 Z" fill="url(#ga-lf2)" ${O}/>
    <path d="M18 24.5 L21.5 21.5 M22 28.5 L24 22.5 M28 29.5 L27 22 M33 25 L29 21" stroke="#a8e08a" stroke-width="1.1" stroke-linecap="round" opacity=".8"/>
    <path d="M23 18.5 q-1 -2 1 -3.5 q2 1 1.5 3.5Z" fill="#3f7a2e" ${O2}/>
    <path d="M24.5 16 q-3.5 -8 2.5 -12.5" stroke="${INK}" stroke-width="4.6" fill="none" stroke-linecap="round"/><path d="M24.5 16 q-3.5 -8 2.5 -12.5" stroke="#6a9a3e" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M26.2 4.5 l2.4 -1.4" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M23.5 36 l8.5 -3 M48.5 36 l-8.5 -3" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M23.8 41.5 Q29.2 37.4 34.6 41.5 Q29.2 46.6 23.8 41.5Z" fill="#f4ecff" ${O2}/><path d="M23.8 41.5 Q29.2 37.4 34.6 41.5" fill="#7d4aa3" stroke="${INK}" stroke-width="2.3" stroke-linecap="round"/>
    <path d="M37.4 41.5 Q42.8 37.4 48.2 41.5 Q42.8 46.6 37.4 41.5Z" fill="#f4ecff" ${O2}/><path d="M37.4 41.5 Q42.8 37.4 48.2 41.5" fill="#7d4aa3" stroke="${INK}" stroke-width="2.3" stroke-linecap="round"/>
    <circle cx="29.4" cy="43" r="2.2" fill="${INK}"/><circle cx="42.6" cy="43" r="2.2" fill="${INK}"/><circle cx="28.7" cy="42.3" r=".75" fill="#fff"/><circle cx="41.9" cy="42.3" r=".75" fill="#fff"/>
    <path d="M23.9 42 l-2.2 1.6 M48.1 42 l2.2 1.6" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"/>
    ${blush(26,47.5,'#ff8fc8')}${blush(46,47.5,'#ff8fc8')}
    <path d="M31.5 52 Q36 47.8 40.5 52 Q36 50.6 31.5 52Z" fill="#3a1030" ${O2}/>
    <path d="M47.5 45 q-2.4 4.2 0 6.4 q2.4 -2.2 0 -6.4Z" fill="url(#ga-wa)" ${O2}/><circle cx="47" cy="49.3" r=".6" fill="#fff"/>`,
  mush: `${shadow(32,60,18,2.6)}<path d="M18 58 q3 -6 5 0 M43 58 q3 -6 5 0 M38 59 q1.6 -4 3 0" stroke="#3f8a3a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M23 35 Q21 50 24 57 H40 Q43 50 41 35Z" fill="url(#ga-st)" ${O}/><path d="M26 38 Q25 48 27 55" stroke="#c9b48a" stroke-width="1.2" fill="none"/>
    <path d="M7 37 Q7 9 32 9 Q57 9 57 37 Q32 42 7 37Z" fill="url(#ga-mr)" ${O}/><path d="M12 36 Q32 40 52 36" stroke="#4a1030" stroke-width="1.2" fill="none"/>
    <circle cx="19" cy="26" r="4.2" fill="#fbe3ef" ${O2}/><circle cx="33" cy="17" r="3.6" fill="#fbe3ef" ${O2}/><circle cx="45.5" cy="27" r="4.8" fill="#fbe3ef" ${O2}/><circle cx="29" cy="31" r="2.2" fill="#fbe3ef" ${O2}/>
    ${shine(16,19,2.4,4.5,.5,35)}
    <ellipse cx="28.5" cy="43" rx="2.3" ry="3.1" fill="${INK}"/><ellipse cx="35.5" cy="43" rx="2.3" ry="3.1" fill="${INK}"/><circle cx="27.7" cy="41.8" r=".8" fill="#fff"/><circle cx="34.7" cy="41.8" r=".8" fill="#fff"/>
    <ellipse cx="32" cy="50.5" rx="2.6" ry="3.2" fill="${INK}"/>${blush(25.5,47.5)}${blush(38.5,47.5)}`,

  // ================= zombies =================
  shamb: `${bust('url(#ga-bl)')}<path d="M24 46 L32 53 L40 46" fill="#3a5ea8" ${O2}/><path d="M16 64 l3 -6 l3 4 l3 -5 l2 7" fill="#1d1a2b" opacity=".35"/>
    <rect x="42" y="53" width="7" height="6" fill="#c9a54a" ${O2} transform="rotate(8 45 56)"/><path d="M43 55 h5 M43 57.5 h5" stroke="#8a6a20" stroke-width=".8" transform="rotate(8 45 56)"/>
    ${neck('#7fb35d')}<ellipse cx="14.5" cy="29" rx="3" ry="4.5" fill="#86bd63" ${O2}/><ellipse cx="49.5" cy="29" rx="3" ry="4.5" fill="#86bd63" ${O2}/>
    <rect x="15" y="10" width="34" height="35" rx="13" fill="url(#ga-zg)" ${O}/>
    <path d="M15 22 Q16 7 32 7 Q48 7 49 22 L45.5 15.5 L42 21 L38 13 L33.5 19.5 L29 12 L25 19.5 L21 14 L18 21Z" fill="#3b3a2a" ${O2}/>
    <ellipse cx="25" cy="32" rx="6" ry="3" fill="#5a8a42" opacity=".5"/>${eye(25,28,5.6,.6,.6)}${eye(39.5,28.5,3.8,-.4,.6)}
    <path d="M22.5 38.5 Q32 34 41.5 39" stroke="${INK}" stroke-width="2.4" fill="none"/><path d="M28.5 36.6 l3.2 -.6 l.2 3.4 l-3 .2Z" fill="#fff" ${O2}/>
    <path d="M41.5 13.5 v8.5 M38.5 15.5 h6 M38.5 19 h6" stroke="${INK}" stroke-width="1.3"/>${blush(19.5,35,'#4f7e3a')}`,
  sprint: `<g stroke="#a69fc0" stroke-width="2.6" stroke-linecap="round" opacity=".8"><line x1="1" y1="22" x2="9" y2="22"/><line x1="3" y1="31" x2="11" y2="31"/><line x1="1" y1="40" x2="8" y2="40"/></g>
    ${bust('url(#ga-or3)',22,46,35)}<path d="M15 53 Q22 48 26 47 M55 53 Q48 48 44 47" stroke="#fff" stroke-width="2.4" fill="none"/><path d="M35 47 V64" stroke="${INK}" stroke-width="1.4"/><path d="M33 47 h4" stroke="#d6d9e6" stroke-width="3"/>
    ${neck('#62a886',35)}<ellipse cx="35" cy="27" rx="15.5" ry="17" fill="url(#ga-zt)" ${O}/>
    <path d="M19.5 22 Q20 7 35 7.5 Q50 8 50.5 22 L46 14 L42 19 L38 11.5 L34 18 L30 11.5 L26 18 L22.5 13Z" fill="#6a3f26" ${O2}/>
    <rect x="19" y="17" width="32.5" height="6.5" rx="2.5" fill="url(#ga-rd)" ${O2}/><path d="M20 19.5 l-10 -5 l2.2 7Z M20 21.5 l-11 3 l4.5 3.4Z" fill="url(#ga-rd)" ${O2}/>
    <path d="M25 26.5 l8 -1.5 M38 25 l8 1.5" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>${eye(29.5,29.5,3.4,1,.4)}${eye(41,29.5,3.4,1,.4)}
    <path d="M27.5 35.5 Q35 43 43 35.5Z" fill="#4a1a1a" ${O2}/><path d="M29.5 35.8 h12" stroke="#fff" stroke-width="2"/>
    <path d="M50.5 26 q2 3 0 5 q-2 -2 0 -5Z" fill="#8fd3ff" ${O2}/>`,
  brute: `<path d="M1 64 Q2 40 32 40 Q62 40 63 64Z" fill="url(#ga-br)" ${O}/><path d="M23 41 L32 61 L41 41Z" fill="url(#ga-cr)" ${O2}/><circle cx="32" cy="50" r="1.2" fill="${INK}"/><circle cx="32" cy="56" r="1.2" fill="${INK}"/>
    <path d="M8 52 q5 -2 8 2 M48 54 q4 -4 8 -2" stroke="#3b2414" stroke-width="1.4" fill="none"/>
    <ellipse cx="12.5" cy="30" rx="3.2" ry="5" fill="#8aa3b8" ${O2}/><ellipse cx="51.5" cy="30" rx="3.2" ry="5" fill="#8aa3b8" ${O2}/>
    <path d="M32 8.5 C48.5 8.5 53.5 20 52.5 32 C51.5 42.5 44 47.5 32 47.5 C20 47.5 12.5 42.5 11.5 32 C10.5 20 15.5 8.5 32 8.5Z" fill="url(#ga-zb)" ${O}/>
    <path d="M18 15 Q22 4 29 9.5 Q33 2.5 38.5 8.5 Q45 5 46.5 15 Q41 11 37 13 Q32 9 27 13 Q22 11 18 15Z" fill="#4a3a2a" ${O2}/>
    <path d="M21.5 23.5 l6 1.5 M42.5 23.5 l-6 1.5" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>${eye(25.5,28,3,.3,.4)}${eye(38.5,28,3,-.3,.4)}
    <path d="M20 36.5 Q32 44.5 44 36.5" stroke="${INK}" stroke-width="2.6" fill="none"/><path d="M25.5 38.6 l2.4 -5 l2.2 5.6Z M33.9 39.2 l2.2 -5.6 l2.4 5Z" fill="#fff" ${O2}/>
    <rect x="40" y="30.5" width="10" height="6.5" rx="2" fill="url(#ga-cr)" ${O2} transform="rotate(-15 45 34)"/><path d="M43 32 l3.5 3.5 M46.5 32 l-3.5 3.5" stroke="#b9a678" stroke-width="1" transform="rotate(-15 45 34)"/>
    <path d="M18 31 l3 2 M18 34 l3 1" stroke="#51687c" stroke-width="1.3" stroke-linecap="round"/>`,
  mummy: `${bust('url(#ga-mu)')}<g stroke="#a8976e" stroke-width="2" fill="none"><path d="M13 55 L51 50"/><path d="M11 61 L53 58"/><path d="M20 49 L44 53"/></g>
    <path d="M48.5 24 q11 4 8 16 q-2 4 -5 3" stroke="${INK}" stroke-width="6.2" fill="none" stroke-linecap="round"/><path d="M48.5 24 q11 4 8 16 q-2 4 -5 3" stroke="#efe4c6" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    <rect x="15" y="9" width="34" height="38" rx="14.5" fill="url(#ga-mu)" ${O}/>
    <g stroke="#a8976e" stroke-width="2.2" fill="none" stroke-linecap="round"><path d="M16 16 L48 20.5"/><path d="M15.5 39 L48.5 34.5"/><path d="M18 44.5 L46 42.5"/><path d="M22 11.5 L44 14"/></g>
    <path d="M15.2 24 L48.8 22.6 L48.8 32.4 L15.2 33.4 Z" fill="#241d33" ${O2}/>
    <circle cx="25" cy="28.3" r="5.5" fill="url(#ga-eyeG)"/><circle cx="39.5" cy="27.6" r="4" fill="url(#ga-eyeG)"/><circle cx="25" cy="28.3" r="1.6" fill="#f0ffe6"/><circle cx="39.5" cy="27.6" r="1.1" fill="#f0ffe6"/>
    ${shine(21,14,4,2,.6,5)}`,
  vamp: `<path d="M2 64 L8 31 L22 46 H42 L56 31 L62 64Z" fill="url(#ga-cp)" ${O}/><path d="M13.5 39.5 L22 48 H42 L50.5 39.5 L48 64 H16Z" fill="url(#ga-rd)" ${O2}/>
    <path d="M25 47 L32 62 L39 47Z" fill="#f6f3ff" ${O2}/><path d="M28.5 48.5 L32 52 L35.5 48.5" fill="#9b2335" ${O2}/><circle cx="32" cy="55" r="2" fill="url(#ga-rd)" ${O2}/>
    ${neck('#c9bfe0',32,8,38,10)}<path d="M18.5 27 L13 20 L19 25Z M45.5 27 L51 20 L45 25Z" fill="url(#ga-vp)" ${O2}/>
    <ellipse cx="32" cy="27" rx="14.2" ry="17" fill="url(#ga-vp)" ${O}/>
    <path d="M17.3 26 Q15 8.5 32 8.5 Q49 8.5 46.7 26 Q44 15 32 22.5 Q20 15 17.3 26Z" fill="#1a1426" ${O2}/><path d="M24 12.5 q5 -2.5 10 -1" stroke="#5a4a80" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M21.5 25.5 l7 2.2 M42.5 25.5 l-7 2.2" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    <ellipse cx="26" cy="30.5" rx="3.2" ry="2.4" fill="#ff5a5a" ${O2}/><ellipse cx="38" cy="30.5" rx="3.2" ry="2.4" fill="#ff5a5a" ${O2}/><circle cx="26" cy="30.5" r="1" fill="${INK}"/><circle cx="38" cy="30.5" r="1" fill="${INK}"/>
    <path d="M26.5 37 Q32 40.5 38 36.5" stroke="${INK}" stroke-width="1.8" fill="none"/><path d="M28.4 38.1 l1.3 3.6 l1.3 -2.8Z M33.4 38.6 l1.3 2.9 l1.3 -3.6Z" fill="#fff" ${O2}/>`,

  // ================= townsfolk =================
  farmer: `<path d="M55 64 V16" stroke="${INK}" stroke-width="5"/><path d="M55 64 V16" stroke="#a8774a" stroke-width="2.6"/>
    <path d="M48.5 19.5 V8 M55 19.5 V5.5 M61.5 19.5 V8 M48.5 19.5 H61.5" stroke="${INK}" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M48.5 19.5 V8 M55 19.5 V5.5 M61.5 19.5 V8 M48.5 19.5 H61.5" stroke="#d6d9e6" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${bust('url(#ga-rd)',21,46,30)}<path d="M12 54 H48 M12 59 H48 M20 47 V64 M40 47 V64" stroke="#7a1f1a" stroke-width="1" opacity=".55"/>
    <path d="M19.5 50 H40.5 V64 H19.5Z" fill="url(#ga-bl)" ${O}/><path d="M20.5 50 L17 45.5 M39.5 50 L43 45.5" stroke="${INK}" stroke-width="4.2"/><path d="M20.5 50 L17 45.5 M39.5 50 L43 45.5" stroke="#4a6ab0" stroke-width="2.4"/><circle cx="22.5" cy="53" r="1.4" fill="#ffcf4a"/><circle cx="37.5" cy="53" r="1.4" fill="#ffcf4a"/>
    <circle cx="30" cy="31.5" r="13.2" fill="url(#ga-sk)" ${O}/><path d="M24 26.5 q2 -1.4 4 0 M32 26.5 q2 -1.4 4 0" stroke="${INK}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    ${dot(26,30.5)}${dot(34,30.5)}<ellipse cx="30" cy="38.5" rx="2.2" ry="2.8" fill="#6a2a1e" ${O2}/>${blush(22,35)}${blush(38,35)}<path d="M41.5 30 q2 3 0 4.6 q-2 -1.6 0 -4.6Z" fill="#8fd3ff" ${O2}/>
    <ellipse cx="30" cy="20.5" rx="21" ry="4.8" fill="url(#ga-straw)" ${O}/><path d="M19.5 20.5 Q19.5 7.5 30 7.5 Q40.5 7.5 40.5 20.5Z" fill="url(#ga-straw)" ${O}/>
    <rect x="19.6" y="15.6" width="20.8" height="3.4" fill="url(#ga-rd)" ${O2}/><path d="M23 11 l3 4 M29 9 l2 5 M35 10 l1 5 M14 21 l3 1.5 M44 22 l3 -1" stroke="#a87a1e" stroke-width="1" stroke-linecap="round"/>`,
  farmhand: `${bust('url(#ga-gr)')}<path d="M16 52 H48 M14 58 H50 M24 47 V64 M40 47 V64" stroke="#1d3f25" stroke-width="1.2" opacity=".7"/><path d="M26 46 L32 52 L38 46" fill="#f2ecd9" ${O2}/>
    <path d="M18 40 Q11 47 18 50" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M18 40 Q11 47 18 50" stroke="#8a5a2b" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <circle cx="32" cy="31.5" r="13.2" fill="url(#ga-sk)" ${O}/>${dot(27,31)}${dot(37,31)}<circle cx="25" cy="35.5" r=".7" fill="#b06a3a"/><circle cx="27" cy="36.5" r=".7" fill="#b06a3a"/><circle cx="37" cy="36.5" r=".7" fill="#b06a3a"/><circle cx="39" cy="35.5" r=".7" fill="#b06a3a"/>
    <path d="M28 38.5 q4 -3 8 0" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M17.5 27.5 Q17.5 13.5 32 13.5 Q46.5 13.5 46.5 27.5 Z" fill="url(#ga-pk)" ${O}/><circle cx="24" cy="21" r="1.6" fill="#fff"/><circle cx="34" cy="17.5" r="1.6" fill="#fff"/><circle cx="40" cy="23" r="1.6" fill="#fff"/><circle cx="29" cy="24" r="1.3" fill="#fff"/>
    <path d="M45.5 25 l8 -4 l-2.4 8Z" fill="url(#ga-pk)" ${O2}/><path d="M45.5 25 l7 4.5 l-6.4 1.6Z" fill="url(#ga-pk)" ${O2}/>`,
  dog: `${shadow(32,61,18,2.4)}<path d="M17 24 Q5 32 11 50 Q19 44 21 30Z" fill="#6e4423" ${O}/><path d="M47 24 Q59 32 53 50 Q45 44 43 30Z" fill="#6e4423" ${O}/>
    <ellipse cx="32" cy="35" rx="16.5" ry="16.5" fill="url(#ga-br)" ${O}/><path d="M25 21 q7 -4 14 0 q-7 5 -14 0Z" fill="#f2e2c4" opacity=".6"/>
    <ellipse cx="32" cy="43.5" rx="9.5" ry="7.5" fill="#f0dcb6" ${O2}/><ellipse cx="32" cy="39.3" rx="3.8" ry="2.8" fill="${INK}"/><circle cx="31" cy="38.5" r=".9" fill="#fff"/>
    ${eye(24.5,31,3,.4,.3)}${eye(39.5,31,3,-.4,.3)}<ellipse cx="24.5" cy="26.3" rx="2" ry="1" fill="#f0dcb6"/><ellipse cx="39.5" cy="26.3" rx="2" ry="1" fill="#f0dcb6"/>
    <path d="M32 42 v3 M27.5 45 q4.5 3.4 9 0" stroke="${INK}" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M31.5 47 q0 5 3 5 q3 0 2.5 -5Z" fill="#f06a7a" ${O2}/>
    <path d="M17.5 53.5 Q32 60 46.5 53.5 L46.5 58.5 Q32 65 17.5 58.5Z" fill="url(#ga-rd)" ${O2}/><circle cx="32" cy="61" r="2.8" fill="url(#ga-gd)" ${O2}/>`,
  constable: `${bust('url(#ga-bl)')}<path d="M26.5 46 L32 54 L37.5 46" fill="#dfe6f5" ${O2}/><path d="M30.5 47 L32 55 L33.5 47" fill="#1d2f5c"/>
    <circle cx="24" cy="54.5" r="1.8" fill="url(#ga-gd)" ${O2}/><circle cx="40" cy="54.5" r="1.8" fill="url(#ga-gd)" ${O2}/><path d="M40 50 l2.5 1.8 l2.5 -1.8 v3.4 l-2.5 1.8 l-2.5 -1.8Z" fill="url(#ga-gd)" ${O2}/>
    <circle cx="32" cy="32" r="13.2" fill="url(#ga-sk)" ${O}/>${dot(27,31.5)}${dot(37,31.5)}<path d="M25.5 27.5 l3.5 .8 M38.5 27.5 l-3.5 .8" stroke="${INK}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M26 37 q6 -3 12 0 q-6 2 -12 0Z" fill="#6a3a22" ${O2}/>
    <path d="M17.5 24.5 Q16 12.5 32 12.5 Q48 12.5 46.5 24.5 Z" fill="url(#ga-bl)" ${O}/><path d="M15.5 25 H48.5 a2 2 0 0 1 0 4.2 H15.5 a2 2 0 0 1 0 -4.2Z" fill="#1d2f5c" ${O2}/>
    <path d="M32 14.5 l2.6 2.4 v3.4 l-2.6 2 l-2.6 -2 v-3.4Z" fill="url(#ga-gd)" ${O2}/>`,
  sheriff: `${bust('#efe6d0')}<path d="M10 64 Q11 47 25 46 L28 64Z M54 64 Q53 47 39 46 L36 64Z" fill="url(#ga-br)" ${O}/><path d="M30 46 L32 49 L34 46" fill="#9b2335"/>
    <path d="M45.5 51 l1.8 3.5 l3.8 .5 l-2.8 2.6 l.7 3.8 l-3.5 -1.8 l-3.5 1.8 l.7 -3.8 l-2.8 -2.6 l3.8 -.5Z" fill="url(#ga-gd)" ${O2}/>
    <circle cx="32" cy="32" r="13.2" fill="url(#ga-sk)" ${O}/>${dot(27,30.5)}${dot(37,30.5)}<path d="M24.5 26.5 l4 .5 M39.5 26.5 l-4 .5" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M23.5 37.5 q4.2 -4 8.5 -1.5 q4.3 -2.5 8.5 1.5 q-4.3 1 -8.5 -.4 q-4.2 1.4 -8.5 .4Z" fill="#5a3a2a" ${O2}/>
    <path d="M7 22 Q32 31 57 22 Q53 28.5 32 28.5 Q11 28.5 7 22Z" fill="url(#ga-br)" ${O}/><path d="M19.5 23.5 Q18.5 8.5 25.5 9 Q32 13 38.5 9 Q45.5 8.5 44.5 23.5Z" fill="url(#ga-br)" ${O}/><rect x="19.5" y="19" width="25" height="3.2" fill="#2a1a0e"/>`,
  guard: `<path d="M56 64 V14" stroke="${INK}" stroke-width="5"/><path d="M56 64 V14" stroke="#a8774a" stroke-width="2.6"/><path d="M56 2.5 L61 16 H51Z" fill="url(#ga-mt)" ${O}/>
    ${bust('url(#ga-rd)')}<path d="M20 49 H44 V64 H20Z" fill="url(#ga-mtv)" ${O}/><path d="M32 49 V64 M20 55 H44" stroke="#6f7690" stroke-width="1.4"/><circle cx="32" cy="58" r="2.4" fill="url(#ga-gd)" ${O2}/>
    <circle cx="32" cy="32.5" r="13" fill="url(#ga-sk)" ${O}/>${dot(27,33)}${dot(37,33)}<path d="M28 39.5 h8" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M16.5 29.5 Q16.5 13.5 32 13.5 Q47.5 13.5 47.5 29.5 Z" fill="url(#ga-mtv)" ${O}/><path d="M15 29.5 H49" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path d="M15 29.5 H49" stroke="#b9bdd0" stroke-width="1.8" stroke-linecap="round"/>
    <rect x="30" y="28" width="4" height="9" rx="1" fill="url(#ga-mtv)" ${O2}/><path d="M32 13.5 Q37 2 47 6 Q40 8 35 14.5Z" fill="url(#ga-rd)" ${O}/>${shine(23,20,2,4,.6,30)}`,
  knight: `${bust('url(#ga-mtv)',24)}<path d="M14 54 Q32 50 50 54" stroke="#6f7690" stroke-width="1.4" fill="none"/>
    <path d="M32 11 Q36 2 44 4 Q38 6 35 12Z" fill="url(#ga-bl)" ${O2}/>
    <rect x="16.5" y="11.5" width="31" height="35" rx="11.5" fill="url(#ga-mtv)" ${O}/><path d="M32 11.5 V46.5" stroke="#878da3" stroke-width="1.6"/>
    <rect x="19.5" y="24.5" width="25" height="4.6" rx="2.2" fill="#14101e" ${O2}/><circle cx="26" cy="26.8" r="1" fill="#8fd3ff"/><circle cx="38" cy="26.8" r="1" fill="#8fd3ff"/>
    ${[[25,36],[28.5,39.5],[35.5,39.5],[39,36],[32,42.5]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.2" fill="${INK}"/>`).join('')}${shine(22,17,2.2,4,.7,25)}
    <path d="M3 37 H25 V51 Q25 61.5 14 64 Q3 61.5 3 51 Z" fill="url(#ga-bl)" ${O}/><path d="M7 42.5 L14 50 L21 42.5" stroke="${INK}" stroke-width="4.6" fill="none" stroke-linejoin="round"/><path d="M7 42.5 L14 50 L21 42.5" stroke="#ffcf4a" stroke-width="2.6" fill="none" stroke-linejoin="round"/>`,
  wizard: `<path d="M56 64 V20" stroke="${INK}" stroke-width="5"/><path d="M56 64 V20" stroke="#8a5a2b" stroke-width="2.8"/><circle cx="56" cy="15" r="6.5" fill="url(#ga-glow)"/><circle cx="56" cy="15" r="5" fill="url(#ga-orb)" ${O}/>
    ${bust('url(#ga-bl)')}<path d="M19 50 l2 3 l-2 3 M45 50 l-2 3 l2 3" stroke="#ffcf4a" stroke-width="1.4" fill="none"/>
    <circle cx="32" cy="32.5" r="12.3" fill="url(#ga-sk)" ${O}/>${dot(27.5,30.5)}${dot(36.5,30.5)}<path d="M24.5 27 q3 -2 5 0 M34.5 27 q2 -2 5 0" stroke="#e8e8f4" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M19.5 34.5 Q21 40 25 38 Q28 41 32 39.5 Q36 41 39 38 Q43 40 44.5 34.5 Q46 50 39 58 Q35 61 32 63.5 Q29 61 25 58 Q18 50 19.5 34.5Z" fill="#f4f2fb" ${O}/>
    <path d="M27 39.5 q5 -3 10 0" stroke="#c9c6dc" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M26 47 q3 5 6 2 q3 3 6 -2" stroke="#d6d3e6" stroke-width="1.2" fill="none"/>
    <path d="M13 25 L34 0.5 L49 25 Z" fill="url(#ga-bl)" ${O}/><path d="M34 .5 Q38 4 42 4" stroke="${INK}" stroke-width="1" fill="none"/><ellipse cx="31" cy="25" rx="20" ry="4.2" fill="#28407a" ${O}/>
    <path d="M30 11.5 l1.2 2.6 l2.8 .3 l-2.1 1.8 l.7 2.7 l-2.6 -1.5 l-2.6 1.5 l.7 -2.7 l-2.1 -1.8 l2.8 -.3Z" fill="url(#ga-gd)"/><circle cx="38" cy="17" r="1.4" fill="#ffcf4a"/><circle cx="24" cy="21" r="1" fill="#ffcf4a"/>`,
  robot: `<path d="M32 3.5 V12" stroke="${INK}" stroke-width="4.6"/><path d="M32 3.5 V12" stroke="#b9bdd0" stroke-width="2.4"/><circle cx="32" cy="4.5" r="4" fill="url(#ga-rd)" ${O}/>
    <rect x="5" y="46" width="54" height="18" rx="5" fill="url(#ga-mtv)" ${O}/><rect x="23" y="50" width="18" height="9" rx="2" fill="#3a4058" ${O2}/><circle cx="28" cy="54.5" r="1.8" fill="#7bd36b"/><circle cx="32" cy="54.5" r="1.8" fill="#ffcf4a"/><circle cx="36" cy="54.5" r="1.8" fill="#ff6b6b"/>
    <circle cx="10" cy="51" r="1.2" fill="#6f7690"/><circle cx="54" cy="51" r="1.2" fill="#6f7690"/>
    <rect x="9.5" y="22" width="5" height="12" rx="2" fill="#878da3" ${O2}/><rect x="49.5" y="22" width="5" height="12" rx="2" fill="#878da3" ${O2}/>
    <rect x="13.5" y="11.5" width="37" height="33" rx="7" fill="url(#ga-mtv)" ${O}/><rect x="17.5" y="19.5" width="29" height="10" rx="5" fill="#141020" ${O2}/>
    <rect x="21" y="22.2" width="8" height="4.6" rx="2.3" fill="#5ef0ff"/><rect x="35" y="22.2" width="8" height="4.6" rx="2.3" fill="#5ef0ff"/><rect x="21" y="22.2" width="8" height="1.6" rx=".8" fill="#e6fdff"/><rect x="35" y="22.2" width="8" height="1.6" rx=".8" fill="#e6fdff"/>
    <rect x="21" y="33.5" width="22" height="7" rx="2" fill="#3a4058" ${O2}/><path d="M26 33.5 V40.5 M30.5 33.5 V40.5 M35 33.5 V40.5 M39.5 33.5 V40.5" stroke="#878da3" stroke-width="1.4"/>
    ${[[17,15],[47,15],[17,41],[47,41]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.1" fill="#6f7690"/>`).join('')}${shine(20,15,3,1.5,.7,0)}`,
};

window.ART_DEFS = DEFS;
function injectDefs(){ if(typeof document!=='undefined' && document.body && !document.getElementById('ga-defs')){ const d=document.createElement('div'); d.id='ga-defs'; d.innerHTML=DEFS; document.body.prepend(d);} }
if(typeof document!=='undefined'){ if(document.body) injectDefs(); else document.addEventListener('DOMContentLoaded', injectDefs); }
window.art = (key, cls='') => `<svg class="ic ${cls}" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${ART[key]||''}</svg>`;
window.ART_KEYS = Object.keys(ART);
})();
