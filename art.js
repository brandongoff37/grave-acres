// Grave Acres — original hand-drawn SVG art. All shapes drawn on a 64x64 grid.
(function(){
const skin = '#f2c9a0';
const eyesDot = (y=30, x1=25, x2=35, c='#2a1f1a') => `<circle cx="${x1}" cy="${y}" r="2" fill="${c}"/><circle cx="${x2}" cy="${y}" r="2" fill="${c}"/>`;
const shoulders = (fill, w=22) => `<path d="M${32-w} 64 Q${34-w} 46 32 46 Q${30+w} 46 ${32+w} 64Z" fill="${fill}"/>`;

const ART = {
  // ---------- UI ----------
  coin: `<circle cx="32" cy="32" r="27" fill="#d1961c"/><circle cx="32" cy="32" r="22" fill="#ffcf4a"/>
    <path d="M23 46 V29 a9 9 0 0 1 18 0 V46 Z" fill="#d1961c"/><rect x="30.5" y="29" width="3" height="11" fill="#ffcf4a"/><rect x="27" y="32.5" width="10" height="3" fill="#ffcf4a"/>`,
  bone: `<g transform="rotate(-35 32 32)" fill="#efe8d6"><rect x="15" y="28" width="34" height="8" rx="3"/>
    <circle cx="14" cy="27" r="6"/><circle cx="14" cy="37" r="6"/><circle cx="50" cy="27" r="6"/><circle cx="50" cy="37" r="6"/></g>`,
  star: `<path d="M32 5 L39.5 23.5 L59 24.5 L43.5 37 L49 56 L32 45 L15 56 L20.5 37 L5 24.5 L24.5 23.5 Z" fill="#7bd36b" stroke="#4f9a42" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="27" cy="31" r="2.2" fill="#1d1a2b"/><circle cx="37" cy="31" r="2.2" fill="#1d1a2b"/>`,
  drop: `<path d="M32 7 C24 21 15 30 15 41 a17 17 0 0 0 34 0 C49 30 40 21 32 7 Z" fill="#5bb8ff"/><ellipse cx="24.5" cy="41" rx="3" ry="6.5" fill="#c4e8ff"/>`,
  lock: `<path d="M22 29 V21 a10 10 0 0 1 20 0 V29" fill="none" stroke="#a69fc0" stroke-width="6"/><rect x="15" y="28" width="34" height="27" rx="6" fill="#a69fc0"/><circle cx="32" cy="39" r="4" fill="#2a2540"/><rect x="30.5" y="40" width="3" height="8" fill="#2a2540"/>`,
  house: `<rect x="16" y="30" width="32" height="25" fill="#d9c39a"/><path d="M9 32 L32 11 L55 32 Z" fill="#b04a3a"/>
    <rect x="28" y="40" width="8" height="15" fill="#6b4a2e"/><rect x="19" y="35" width="7" height="7" fill="#ffe9a0"/><rect x="38" y="35" width="7" height="7" fill="#ffe9a0"/>`,
  ruin: `<rect x="16" y="30" width="32" height="25" fill="#8d8270"/><path d="M9 32 L27 15 L31 22 L37 16 L55 32 Z" fill="#5a5470"/>
    <rect x="28" y="40" width="8" height="15" fill="#3a2a1e"/><rect x="19" y="35" width="7" height="7" fill="#2a2540"/><rect x="38" y="35" width="7" height="7" fill="#2a2540"/>
    <path d="M18 37 l10 4 M37 41 l10 -4" stroke="#a0784a" stroke-width="2.5"/><path d="M44 46 l-3 4 l2 3" stroke="#5a5040" stroke-width="1.5" fill="none"/>`,
  flask: `<rect x="25" y="5" width="14" height="6" rx="2" fill="#a0784a"/>
    <path d="M27 11 H37 V25 L50 49 a6 6 0 0 1 -5.3 9 H19.3 a6 6 0 0 1 -5.3 -9 L27 25 Z" fill="#cfd8e8" fill-opacity=".35" stroke="#cfd8e8" stroke-width="2"/>
    <path d="M18.5 40 H45.5 L50 49 a6 6 0 0 1 -5.3 9 H19.3 a6 6 0 0 1 -5.3 -9 Z" fill="#7bd36b"/><circle cx="27" cy="48" r="2.5" fill="#c9f5be"/><circle cx="36" cy="51" r="1.8" fill="#c9f5be"/><circle cx="33" cy="34" r="1.8" fill="#7bd36b"/>`,
  swords: `<g stroke-linecap="round"><line x1="15" y1="49" x2="48" y2="12" stroke="#d6d9e6" stroke-width="6"/><line x1="49" y1="49" x2="16" y2="12" stroke="#d6d9e6" stroke-width="6"/>
    <line x1="13" y1="39" x2="24" y2="50" stroke="#a0784a" stroke-width="5"/><line x1="51" y1="39" x2="40" y2="50" stroke="#a0784a" stroke-width="5"/>
    <line x1="9" y1="55" x2="15" y2="49" stroke="#6b4a2e" stroke-width="6"/><line x1="55" y1="55" x2="49" y2="49" stroke="#6b4a2e" stroke-width="6"/></g>`,
  gear: `<g fill="#a69fc0"><circle cx="32" cy="32" r="16"/>${[0,45,90,135,180,225,270,315].map(a=>`<rect x="28" y="6" width="8" height="12" rx="2" transform="rotate(${a} 32 32)"/>`).join('')}</g><circle cx="32" cy="32" r="7" fill="#2a2540"/>`,
  sparkle: `<path d="M32 4 L37 27 L60 32 L37 37 L32 60 L27 37 L4 32 L27 27 Z" fill="#ffcf4a"/>`,
  trophy: `<path d="M18 10 H46 V26 a14 14 0 0 1 -28 0 Z" fill="#ffcf4a"/><path d="M18 14 H9 a9 9 0 0 0 11 12 M46 14 H55 a9 9 0 0 1 -11 12" fill="none" stroke="#ffcf4a" stroke-width="4"/>
    <rect x="29" y="38" width="6" height="10" fill="#d1961c"/><rect x="20" y="48" width="24" height="8" rx="2" fill="#d1961c"/>`,
  gift: `<rect x="12" y="28" width="40" height="28" rx="3" fill="#8b6bb8"/><rect x="9" y="20" width="46" height="10" rx="3" fill="#a688d4"/><rect x="29" y="20" width="6" height="36" fill="#7bd36b"/>
    <path d="M32 20 C24 8 14 14 22 20 Z M32 20 C40 8 50 14 42 20 Z" fill="#7bd36b"/>`,

  // ---------- Growth stages ----------
  sprout: `<ellipse cx="32" cy="55" rx="20" ry="6" fill="#4a321e"/><path d="M32 55 C32 45 30 39 34 30" stroke="#5ea04a" stroke-width="4" fill="none"/>
    <path d="M33 34 C40 26 51 28 51 28 C47 37 38 38 33 34Z" fill="#7bd36b"/><path d="M32 41 C24 35 15 39 15 39 C20 45 28 45 32 41Z" fill="#5ea04a"/>`,
  sprout2: `<ellipse cx="32" cy="56" rx="22" ry="6" fill="#4a321e"/><path d="M32 56 C29 45 36 36 32 24" stroke="#5ea04a" stroke-width="4" fill="none"/>
    <path d="M31 47 C22 43 20 33 25 31 C29 31 28 36 24 37" stroke="#5ea04a" stroke-width="3" fill="none"/>
    <path d="M34 40 C42 32 52 35 52 35 C48 43 39 44 34 40Z" fill="#7bd36b"/>
    <circle cx="32" cy="19" r="9" fill="#8b6bb8"/><path d="M26 13 l3 3 M38 13 l-3 3" stroke="#5a3d84" stroke-width="2"/><circle cx="29" cy="20" r="1.8" fill="#ffe066"/><circle cx="35" cy="20" r="1.8" fill="#ffe066"/>`,
  mound: `<path d="M23 48 V28 a9 9 0 0 1 18 0 V48 Z" fill="#8d87a6"/><path d="M30 27 h4 M32 25 v8" stroke="#5f5a78" stroke-width="2"/>
    <path d="M6 59 Q32 36 58 59Z" fill="#4a321e"/><path d="M14 56 q4 -3 8 -1 M40 54 q5 -2 9 1" stroke="#6b4a2e" stroke-width="2" fill="none"/>`,
  hand: `<g fill="#8fc46a"><rect x="26" y="24" width="12" height="28" rx="4"/><rect x="24" y="12" width="4" height="15" rx="2"/><rect x="29" y="9" width="4" height="17" rx="2"/>
    <rect x="34" y="11" width="4" height="16" rx="2"/><rect x="38.5" y="20" width="4" height="11" rx="2" transform="rotate(25 40 25)"/></g>
    <path d="M27 36 h10" stroke="#5e8f45" stroke-width="2"/><path d="M6 60 Q32 40 58 60Z" fill="#4a321e"/><circle cx="18" cy="53" r="2" fill="#6b4a2e"/><circle cx="46" cy="54" r="2.5" fill="#6b4a2e"/>`,

  // ---------- Crops (spooky, friendly) ----------
  radish: `<ellipse cx="32" cy="34" rx="22" ry="26" fill="#ffffff" fill-opacity=".07"/>
    <path d="M26 21 Q20 7 26 4 Q27 13 31 19 Q32 5 39 5 Q35 13 37 20 Q44 10 48 13 Q42 18 39 22 Z" fill="#4fb39a"/>
    <path d="M19 23 Q32 15 45 23 L34 57 Q32 61 30 57 Z" fill="#ece6f7"/>
    <path d="M22 31 h5 M38 37 h4 M24 44 h4" stroke="#c4bad9" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="28" cy="29" rx="2.6" ry="3.6" fill="#2a2540"/><ellipse cx="36" cy="29" rx="2.6" ry="3.6" fill="#2a2540"/><ellipse cx="32" cy="37" rx="2.4" ry="3" fill="#2a2540"/>`,
  corn: `<ellipse cx="32" cy="29" rx="12" ry="21" fill="#6a3fb0"/>
    ${[[27,14],[32,12],[37,14],[25,21],[30,20],[35,20],[39,21],[25,43],[30,45],[35,45],[39,43]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.2" fill="#9b6be0"/>`).join('')}
    <ellipse cx="27" cy="28" rx="4" ry="4.5" fill="#ffe066"/><ellipse cx="37" cy="28" rx="4" ry="4.5" fill="#ffe066"/><circle cx="27.5" cy="29" r="2" fill="#2a1f1a"/><circle cx="37.5" cy="29" r="2" fill="#2a1f1a"/>
    <path d="M25 37 l3 3 l4 -3 l4 3 l3 -3" stroke="#2a1f1a" stroke-width="2" fill="none" stroke-linejoin="round"/>
    <path d="M19 58 Q11 32 25 13 Q22 36 32 59 Z" fill="#5c7a3a"/><path d="M45 58 Q53 32 39 13 Q42 36 32 59 Z" fill="#4a6630"/>`,
  pump: `<rect x="29" y="6" width="6" height="11" rx="2" fill="#4a6630" transform="rotate(10 32 12)"/><path d="M35 10 q10 -6 14 2" stroke="#5c7a3a" stroke-width="3" fill="none"/>
    <ellipse cx="20" cy="37" rx="13" ry="19" fill="#d9661f"/><ellipse cx="44" cy="37" rx="13" ry="19" fill="#d9661f"/><ellipse cx="32" cy="37" rx="14" ry="21" fill="#f08a38"/>
    <path d="M19 30 L26 23 L28 32 Z M45 30 L38 23 L36 32 Z" fill="#ffd94a"/>
    <path d="M16 40 Q32 54 48 40 L44 43 L41 39 L37 45 L32 40 L27 45 L23 39 L20 43 Z" fill="#ffd94a"/>`,
  egg: `<path d="M30 12 q-2 -7 6 -8 q-1 6 -4 9" fill="#5c7a3a"/><path d="M33 13 q9 -6 15 0 q-8 3 -15 1" fill="#7bd36b"/>
    <circle cx="32" cy="36" r="21" fill="#5a2e7a"/><ellipse cx="24" cy="28" rx="5" ry="7" fill="#7d4aa3"/>
    <path d="M22 37 q4 3 8 0 M34 37 q4 3 8 0" stroke="#f0e6ff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M27 46 q5 -3 10 0" stroke="#f0e6ff" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <ellipse cx="46" cy="44" rx="2" ry="3" fill="#8fd3ff"/>`,
  mush: `<rect x="23" y="34" width="18" height="22" rx="7" fill="#efe6d2"/><path d="M8 36 Q8 10 32 10 Q56 10 56 36 Z" fill="#9a3a6b"/>
    <circle cx="20" cy="26" r="4" fill="#f4dceb"/><circle cx="34" cy="18" r="3.5" fill="#f4dceb"/><circle cx="45" cy="28" r="4.5" fill="#f4dceb"/>
    <ellipse cx="28" cy="42" rx="2.2" ry="3" fill="#2a2540"/><ellipse cx="36" cy="42" rx="2.2" ry="3" fill="#2a2540"/><ellipse cx="32" cy="50" rx="2.5" ry="3.2" fill="#2a2540"/>`,

  // ---------- Zombies ----------
  shamb: `${shoulders('#4a6a9a')}<path d="M21 55 l4 6 l3 -5 l3 6" stroke="#2f4870" stroke-width="2" fill="none"/>
    <rect x="27" y="40" width="10" height="8" fill="#79ad57"/><rect x="15" y="10" width="34" height="34" rx="12" fill="#8fc46a"/>
    <path d="M15 21 Q17 8 32 8 Q47 8 49 21 L45 16 L41 20 L37 14 L32 19 L28 13 L24 19 L20 15Z" fill="#3b3a2a"/>
    <circle cx="25" cy="27" r="5.5" fill="#fff"/><circle cx="25.5" cy="27.5" r="2.2" fill="#222"/><circle cx="39" cy="28" r="3.6" fill="#fff"/><circle cx="39" cy="28.5" r="1.6" fill="#222"/>
    <path d="M23 37 Q32 33 41 38" stroke="#2d4a1f" stroke-width="2.6" fill="none"/><rect x="29" y="34.6" width="3.2" height="3.4" fill="#fff"/>
    <path d="M42 13 v8 M39 15 h6 M39 18.5 h6" stroke="#2d4a1f" stroke-width="1.5"/>`,
  sprint: `<g stroke="#a69fc0" stroke-width="3" stroke-linecap="round"><line x1="1" y1="22" x2="9" y2="22"/><line x1="3" y1="31" x2="12" y2="31"/><line x1="1" y1="40" x2="9" y2="40"/></g>
    <path d="M12 64 Q14 46 35 46 Q56 46 58 64Z" fill="#e8772e"/><path d="M35 47 V64" stroke="#fff" stroke-width="3"/>
    <rect x="30" y="39" width="10" height="9" fill="#62a886"/><ellipse cx="35" cy="27" rx="15" ry="17" fill="#7cc4a0"/>
    <path d="M20 22 Q22 9 35 9 Q48 9 50 22 Z" fill="#5a3a2a"/><rect x="19" y="17" width="32" height="6" rx="2" fill="#e04a4a"/>
    <path d="M20 19 l-9 -4 l2 6Z M20 21 l-10 3 l4 3Z" fill="#e04a4a"/>
    <path d="M27 28 l7 -1 M38 27 l7 1" stroke="#1d1a2b" stroke-width="3" stroke-linecap="round"/>
    <path d="M28 35 Q35 42 42 35Z" fill="#3a1a1a"/><rect x="31" y="35" width="3" height="2.5" fill="#fff"/>`,
  brute: `<path d="M1 64 Q3 41 32 41 Q61 41 63 64Z" fill="#7a5230"/><path d="M24 43 L32 60 L40 43" fill="#c9b48a"/>
    <path d="M32 9 C48 9 53 20 52 32 C51 42 44 47 32 47 C20 47 13 42 12 32 C11 20 16 9 32 9Z" fill="#8aa3b8"/>
    <path d="M20 14 Q24 6 30 10 Q33 4 38 9 Q44 6 45 14" stroke="#4a3a2a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="40" y="31" width="9" height="6" rx="2" fill="#efe8d6" transform="rotate(-15 44 34)"/>
    <circle cx="25" cy="27" r="3" fill="#fff"/><circle cx="38" cy="27" r="3" fill="#fff"/><circle cx="25" cy="27.5" r="1.4" fill="#222"/><circle cx="38" cy="27.5" r="1.4" fill="#222"/>
    <path d="M22 37 Q32 44 42 37" stroke="#3d5468" stroke-width="3" fill="none"/><path d="M26 38.5 l2.2 -4 l2.2 4.5Z M33.6 39 l2.2 -4.5 l2.2 4Z" fill="#fff"/>`,
  mummy: `${shoulders('#d8cba8')}<g stroke="#b8a880" stroke-width="2.4"><path d="M14 56 L50 52"/><path d="M12 62 L52 59"/></g>
    <path d="M48 24 q10 5 7 15" stroke="#e8dcc0" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <rect x="15" y="9" width="34" height="37" rx="14" fill="#e8dcc0"/>
    <g stroke="#b8a880" stroke-width="2.6" fill="none"><path d="M15 17 L49 21"/><path d="M15 38 L49 34"/><path d="M17 44 L47 42"/></g>
    <path d="M15 24 L49 23 L49 32 L15 33 Z" fill="#2a2540"/>
    <ellipse cx="25" cy="28" rx="3.5" ry="3" fill="#9cff6b"/><ellipse cx="39" cy="27.5" rx="2.2" ry="1.8" fill="#9cff6b"/>`,
  vamp: `<path d="M3 64 L9 33 L22 46 H42 L55 33 L61 64Z" fill="#2a1f3d"/><path d="M14 40 L22 48 H42 L50 40 L48 64 H16Z" fill="#9b2335"/>
    <path d="M25 47 L32 61 L39 47Z" fill="#f4f0ff"/><rect x="28" y="39" width="8" height="9" fill="#c9bfe0"/>
    <ellipse cx="32" cy="27" rx="14" ry="17" fill="#d9d0ee"/>
    <path d="M17 26 Q15 9 32 9 Q49 9 47 26 Q44 15 32 22 Q20 15 17 26Z" fill="#1a1426"/>
    <path d="M22 25 l7 2 M42 25 l-7 2" stroke="#1a1426" stroke-width="2.2" stroke-linecap="round"/>
    <ellipse cx="26" cy="30" rx="3" ry="2.3" fill="#e04a4a"/><ellipse cx="38" cy="30" rx="3" ry="2.3" fill="#e04a4a"/>
    <path d="M27 37 Q32 40.5 37 37" stroke="#5a3a6a" stroke-width="2" fill="none"/><path d="M28.6 38.2 l1.2 3.4 l1.2 -2.6Z M33 38.8 l1.2 2.8 l1.2 -3.4Z" fill="#fff"/>`,

  // ---------- Townsfolk ----------
  farmer: `<line x1="55" y1="64" x2="55" y2="16" stroke="#8a5a2b" stroke-width="3"/><path d="M49 19 V8 M55 19 V6 M61 19 V8 M49 19 H61" stroke="#b8bcc8" stroke-width="2.5" fill="none"/>
    ${shoulders('#c94a3a',21).replace(/32/g,'30')}<rect x="20" y="50" width="20" height="14" fill="#4a6ab0"/><path d="M21 50 L18 46 M39 50 L42 46" stroke="#4a6ab0" stroke-width="3"/>
    <circle cx="30" cy="31" r="13" fill="${skin}"/>${eyesDot(31,25,35)}<ellipse cx="30" cy="38" rx="2.2" ry="2.6" fill="#7a3a2a"/>
    <ellipse cx="30" cy="21" rx="21" ry="4.5" fill="#d9b44a"/><path d="M20 21 Q20 8 30 8 Q40 8 40 21Z" fill="#e8c860"/><rect x="20" y="16.5" width="20" height="3" fill="#c94a3a"/>`,
  farmhand: `${shoulders('#3f7d4a')}<path d="M18 52 H46 M16 58 H48 M24 47 V64 M40 47 V64" stroke="#2c5a35" stroke-width="2"/>
    <path d="M18 38 Q14 46 20 48" stroke="#8a5a2b" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="32" cy="31" r="13" fill="${skin}"/>${eyesDot(31,27,37)}<path d="M28 38 q4 -3 8 0" stroke="#7a3a2a" stroke-width="2" fill="none"/>
    <path d="M18 27 Q18 14 32 14 Q46 14 46 27 Z" fill="#e04a7a"/><circle cx="24" cy="21" r="1.5" fill="#fff"/><circle cx="34" cy="18" r="1.5" fill="#fff"/><circle cx="40" cy="23" r="1.5" fill="#fff"/>
    <path d="M45 25 l7 -3 l-2 7Z" fill="#e04a7a"/>`,
  dog: `<path d="M17 25 Q6 34 12 49 Q20 42 21 30Z" fill="#7a5230"/><path d="M47 25 Q58 34 52 49 Q44 42 43 30Z" fill="#7a5230"/>
    <ellipse cx="32" cy="35" rx="16" ry="16" fill="#b07a46"/><ellipse cx="32" cy="43" rx="9" ry="7" fill="#e0c49a"/>
    <ellipse cx="32" cy="39" rx="3.5" ry="2.6" fill="#2a1f1a"/><circle cx="25" cy="31" r="2.4" fill="#2a1f1a"/><circle cx="39" cy="31" r="2.4" fill="#2a1f1a"/>
    <path d="M32 42 v3 M28 45 q4 3 8 0" stroke="#2a1f1a" stroke-width="1.6" fill="none"/><ellipse cx="34" cy="49" rx="2.5" ry="3" fill="#e05a6a"/>
    <path d="M18 55 Q32 61 46 55 L46 60 Q32 66 18 60Z" fill="#c94a3a"/><circle cx="32" cy="61" r="2.5" fill="#ffcf4a"/>`,
  constable: `${shoulders('#2f4a8a')}<path d="M27 46 L32 54 L37 46" fill="#dfe6f5"/><circle cx="24" cy="54" r="2" fill="#ffcf4a"/><circle cx="40" cy="54" r="2" fill="#ffcf4a"/>
    <circle cx="32" cy="32" r="13" fill="${skin}"/>${eyesDot(32,27,37)}<path d="M27 38 h10" stroke="#7a3a2a" stroke-width="2"/>
    <path d="M18 24 Q18 13 32 13 Q46 13 46 24 Z" fill="#2f4a8a"/><rect x="16" y="22" width="32" height="5" rx="2" fill="#1d2f5c"/><circle cx="32" cy="18" r="3" fill="#ffcf4a"/>`,
  sheriff: `${shoulders('#e9dcc0')}<path d="M10 64 Q12 47 26 46 L28 64Z M54 64 Q52 47 38 46 L36 64Z" fill="#8a5a2b"/>
    <path d="M46 52 l1.6 3.2 l3.5 .5 l-2.5 2.4 l.6 3.5 l-3.2 -1.6 l-3.2 1.6 l.6 -3.5 l-2.5 -2.4 l3.5 -.5Z" fill="#ffcf4a"/>
    <circle cx="32" cy="32" r="13" fill="${skin}"/>${eyesDot(30,27,37)}<path d="M25 37 q7 -4 14 0 q-7 2 -14 0Z" fill="#5a3a2a"/>
    <path d="M8 22 Q32 30 56 22 Q52 27 32 27 Q12 27 8 22Z" fill="#6b4a2e"/><path d="M20 23 Q19 9 26 10 Q32 13 38 10 Q45 9 44 23Z" fill="#8a5a2b"/><rect x="20" y="19" width="24" height="3" fill="#3a2a1e"/>`,
  guard: `<line x1="56" y1="64" x2="56" y2="14" stroke="#8a5a2b" stroke-width="3"/><path d="M56 4 L60 16 H52Z" fill="#d6d9e6"/>
    ${shoulders('#b33a3a')}<rect x="20" y="49" width="24" height="15" fill="#d6d9e6"/><path d="M32 49 V64" stroke="#a0a6b8" stroke-width="2"/>
    <circle cx="32" cy="32" r="13" fill="${skin}"/>${eyesDot(33,27,37)}<path d="M28 39 h8" stroke="#7a3a2a" stroke-width="2"/>
    <path d="M17 29 Q17 14 32 14 Q47 14 47 29 Z" fill="#c4c9d6"/><rect x="30" y="27" width="4" height="9" fill="#c4c9d6"/><path d="M32 14 Q38 4 46 8 Q38 8 34 15Z" fill="#e04a4a"/>`,
  knight: `${shoulders('#8d93a6',24)}<rect x="17" y="12" width="30" height="34" rx="11" fill="#c4c9d6"/><rect x="20" y="25" width="24" height="4" rx="2" fill="#2a2540"/>
    <path d="M32 12 V46" stroke="#a0a6b8" stroke-width="2"/><circle cx="25" cy="36" r="1.2" fill="#2a2540"/><circle cx="28" cy="39" r="1.2" fill="#2a2540"/><circle cx="36" cy="39" r="1.2" fill="#2a2540"/><circle cx="39" cy="36" r="1.2" fill="#2a2540"/>
    <path d="M4 38 H24 V52 Q24 62 14 64 Q4 62 4 52 Z" fill="#3f6bb0" stroke="#d6d9e6" stroke-width="2"/><path d="M8 44 L14 50 L20 44" stroke="#ffcf4a" stroke-width="3" fill="none"/>`,
  wizard: `<line x1="56" y1="64" x2="56" y2="18" stroke="#6b4a2e" stroke-width="3"/><circle cx="56" cy="15" r="5" fill="#8fd3ff"/>
    ${shoulders('#3a3a8a')}<circle cx="32" cy="32" r="12" fill="${skin}"/>${eyesDot(30,27,37)}
    <path d="M20 34 Q32 66 44 34 Q38 40 32 39 Q26 40 20 34Z" fill="#f4f0ff"/>
    <path d="M14 24 L33 1 L48 24 Z" fill="#3f4fb0"/><ellipse cx="31" cy="24" rx="19" ry="4" fill="#2f3a8a"/>
    <path d="M30 11 l1 2.4 l2.6 .2 l-2 1.6 l.7 2.5 l-2.3 -1.4 l-2.3 1.4 l.7 -2.5 l-2 -1.6 l2.6 -.2Z" fill="#ffcf4a"/><circle cx="38" cy="17" r="1.5" fill="#ffcf4a"/>`,
  robot: `<line x1="32" y1="4" x2="32" y2="12" stroke="#a0a6b8" stroke-width="3"/><circle cx="32" cy="5" r="3.5" fill="#e04a4a"/>
    <rect x="6" y="46" width="52" height="18" rx="4" fill="#6f7690"/><rect x="24" y="50" width="16" height="8" rx="2" fill="#3a4058"/><circle cx="28" cy="54" r="1.6" fill="#7bd36b"/><circle cx="36" cy="54" r="1.6" fill="#ffcf4a"/>
    <rect x="14" y="12" width="36" height="32" rx="6" fill="#a0a6b8"/><rect x="18" y="20" width="28" height="9" rx="4" fill="#1d1a2b"/>
    <rect x="21" y="22.5" width="7" height="4" rx="2" fill="#5ef0ff"/><rect x="36" y="22.5" width="7" height="4" rx="2" fill="#5ef0ff"/>
    <path d="M22 35 H42 M22 39 H42 M27 33 V41 M32 33 V41 M37 33 V41" stroke="#5a6078" stroke-width="2"/>`,
};

window.art = (key, cls='') => `<svg class="ic ${cls}" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${ART[key]||''}</svg>`;
window.ART_KEYS = Object.keys(ART);
})();
