import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════ CONSTANTS ═══════════════════ */
const COLORS = ["red","green","blue","yellow","orange","purple"];
const CHX = {red:"#D94F4F",green:"#3EA55E",blue:"#4A90D9",yellow:"#E8C840",orange:"#E07830",purple:"#9055C8",pink:"#D98AAA"};
const CDK = {red:"#A03030",green:"#2A7A3A",blue:"#2A5A9A",yellow:"#AA8A10",orange:"#A05010",purple:"#6030A0"};

const NAMED_IDX = {
  8:{name:"Brother Adam",icon:"🍎",desc:"Total Depravity — in Adam all die."},
  24:{name:"John Knox",icon:"🔥",desc:"The Word preached is the means of grace."},
  42:{name:"Martin Luther",icon:"📜",desc:"Here I stand. Sola fide."},
  74:{name:"Augustine",icon:"📖",desc:"Doctor of Grace, hammer of Pelagius."},
  90:{name:"Lady Geneva",icon:"⛪",desc:"Calvin's city on a hill."},
  108:{name:"Queen Wisdom",icon:"👑",desc:"The fear of the Lord is the beginning."},
};
const DOT_IDX = {
  35:{color:"orange",name:"Slough of\nDespond",desc:"Need orange to escape."},
  65:{color:"blue",name:"Dark Night\nof the Soul",desc:"Need blue to escape."},
  98:{color:"green",name:"Valley of\nthe Shadow",desc:"Need green to escape."},
};
const SHORTCUT_IDX = {48:{to:60,name:"The Narrow Way"},85:{to:97,name:"Path of Election"}};
const LANDMARK_IDX = {
  17:{name:"Forest of\nScripture",icon:"🌲"},55:{name:"Mount\nSinai",icon:"⛰️"},
  70:{name:"The\nCloister",icon:"🏛️"},80:{name:"The Dark\nWood",icon:"🌑"},
  103:{name:"Sea of\nProvidence",icon:"🌊"},118:{name:"Castle of\nRome",icon:"🏰"},
  127:{name:"Celestial\nCity",icon:"✨"},
};

function buildSpaces(){
  return Array.from({length:134},(_,i)=>{
    const s={i,color:COLORS[i%6],type:"normal",special:null};
    if(NAMED_IDX[i]){s.type="named";s.special=NAMED_IDX[i];s.color="pink";}
    else if(DOT_IDX[i]){s.type="dot";s.special=DOT_IDX[i];s.color=DOT_IDX[i].color;}
    else if(SHORTCUT_IDX[i]){s.type="shortcut";s.special=SHORTCUT_IDX[i];}
    else if(LANDMARK_IDX[i]){s.type="landmark";s.special=LANDMARK_IDX[i];}
    if(i===133){s.type="final";s.special={name:"Glorification",icon:"✠"};}
    return s;
  });
}
const SPACES=buildSpaces();

/* ═══════════════════ PATH GEOMETRY ═══════════════════ */
const WAYPOINTS=[
  [75,1015],[160,1015],[280,1020],[400,1015],[520,1020],[640,1012],[760,1018],[840,1000],
  [860,940],[855,880],[830,830],[790,800],
  [700,790],[580,800],[460,810],[340,800],[240,785],[160,760],[110,710],[100,650],[120,595],
  [170,560],[250,540],[370,530],[480,540],[580,555],[670,540],[730,505],[750,450],[730,395],
  [680,360],[600,340],[490,330],[380,345],[280,360],[200,340],[150,295],[140,240],[170,190],
  [230,160],[320,145],[420,130],[480,105],[480,60],
];

function interpPath(wps,n){
  const segs=[];let total=0;
  for(let i=1;i<wps.length;i++){
    const dx=wps[i][0]-wps[i-1][0],dy=wps[i][1]-wps[i-1][1],l=Math.sqrt(dx*dx+dy*dy);
    segs.push(l);total+=l;
  }
  const sp=total/(n-1),pts=[[...wps[0]]];
  let si=0,dis=0,need=sp;
  while(pts.length<n&&si<segs.length){
    const rem=segs[si]-dis;
    if(rem>=need){
      dis+=need;const t=dis/segs[si];
      pts.push([wps[si][0]+t*(wps[si+1][0]-wps[si][0]),wps[si][1]+t*(wps[si+1][1]-wps[si][1])]);
      need=sp;
    }else{need-=rem;si++;dis=0;}
  }
  while(pts.length<n)pts.push([...wps[wps.length-1]]);
  return pts;
}

function getAngle(pts,i){
  const a=i>0?i-1:0,b=i<pts.length-1?i+1:i;
  return Math.atan2(pts[b][1]-pts[a][1],pts[b][0]-pts[a][0]);
}

/* ═══════════════════ DECK ═══════════════════ */
function buildDeck(){
  const c=[];
  for(let r=0;r<10;r++)COLORS.forEach(cl=>c.push({type:"single",color:cl}));
  for(let r=0;r<2;r++)COLORS.forEach(cl=>c.push({type:"double",color:cl}));
  Object.entries(NAMED_IDX).forEach(([idx,n])=>c.push({type:"location",target:+idx,name:n.name,icon:n.icon}));
  for(let i=c.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[c[i],c[j]]=[c[j],c[i]];}
  return c;
}
function cardLabel(c){if(c.type==="location")return c.name;const n=c.color[0].toUpperCase()+c.color.slice(1);return c.type==="double"?`Double ${n}`:n;}
const FLAVORS={red:"The blood of the covenant.",green:"Common grace — rain on just and unjust.",blue:"Baptismal waters of the covenant.",yellow:"Light of divine illumination.",orange:"Tongues of fire at Pentecost.",purple:"Royal priesthood of believers."};
function findNext(pos,color,skip){let f=0;for(let i=pos+1;i<134;i++){if(SPACES[i].color===color){f++;if(f>skip)return i;}}return 133;}

/* ═══════════════════ SVG BOARD ═══════════════════ */
function SVGBoard({spaces,players,cur,pts}){
  const svgRef=useRef(null);
  const cp=players[cur];

  useEffect(()=>{
    if(!svgRef.current||!cp)return;
    const cont=svgRef.current.parentElement;
    const py=pts[cp.position][1];
    const svgH=1080,contH=cont.clientHeight;
    const scale=cont.clientWidth/920;
    const scrollTo=Math.max(0,py*scale-contH/2);
    cont.scrollTo({top:scrollTo,behavior:"smooth"});
  },[cp,pts]);

  /* background trees */
  const trees=useMemo(()=>{
    const t=[];
    const seed=[30,120,180,290,380,500,620,710,800,870,50,150,250,350,450,550,650,750,850,400,200,600,100,300,700,160,440,560,680,820];
    seed.forEach((x,i)=>{
      const y=200+i*28+Math.sin(i*3)*40;
      if(y>180&&y<1040)t.push({x,y:y+10,h:18+i%12,c:i%3===0?"#1a3a1a":i%3===1?"#1a2a15":"#0f2a1a"});
    });
    return t;
  },[]);

  /* mountains */
  const mtns=useMemo(()=>[
    {x:700,y:520,w:120,h:80,c:"#2a2035"},{x:760,y:540,w:90,h:60,c:"#352540"},
    {x:140,y:680,w:100,h:70,c:"#1a2520"},{x:80,y:700,w:80,h:50,c:"#1a3025"},
    {x:400,y:300,w:140,h:100,c:"#2a1a30"},{x:480,y:320,w:100,h:70,c:"#352040"},
  ],[]);

  const pathD=useMemo(()=>{
    let d=`M ${pts[0][0]} ${pts[0][1]}`;
    for(let i=1;i<pts.length;i++)d+=` L ${pts[i][0]} ${pts[i][1]}`;
    return d;
  },[pts]);

  return(
    <svg ref={svgRef} viewBox="0 0 920 1080" style={{width:"100%",height:"auto"}}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0a2a"/>
          <stop offset="30%" stopColor="#1a1530"/>
          <stop offset="60%" stopColor="#15201a"/>
          <stop offset="100%" stopColor="#0a1510"/>
        </linearGradient>
        <radialGradient id="glow" cx="480" cy="50" r="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#daa520" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#daa520" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="startglow" cx="75" cy="1015" r="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8b0000" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#8b0000" stopOpacity="0"/>
        </radialGradient>
        <filter id="softshadow"><feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.5"/></filter>
        <filter id="bigglow"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>

      {/* Background */}
      <rect width="920" height="1080" fill="url(#sky)"/>
      <rect x="0" y="0" width="920" height="300" fill="url(#glow)"/>
      <circle cx="75" cy="1015" r="80" fill="url(#startglow)"/>

      {/* Stars */}
      {[...Array(40)].map((_,i)=><circle key={i} cx={20+i*23} cy={10+Math.sin(i*7)*60+Math.cos(i*3)*30} r={0.5+i%3*0.5} fill="#f0e6d3" opacity={0.15+i%4*0.1}/>)}

      {/* Mountains */}
      {mtns.map((m,i)=><polygon key={i} points={`${m.x},${m.y+m.h} ${m.x+m.w/2},${m.y} ${m.x+m.w},${m.y+m.h}`} fill={m.c} opacity="0.5"/>)}

      {/* Trees */}
      {trees.map((t,i)=><g key={i} opacity="0.3">
        <rect x={t.x-1.5} y={t.y} width="3" height={t.h*0.4} fill="#2a1a0a"/>
        <polygon points={`${t.x},${t.y-t.h} ${t.x-t.h*0.45},${t.y} ${t.x+t.h*0.45},${t.y}`} fill={t.c}/>
      </g>)}

      {/* Castle at top */}
      <g transform="translate(440,15)" opacity="0.9">
        <rect x="-25" y="10" width="50" height="40" fill="#8a7520" rx="2"/>
        <rect x="-30" y="42" width="60" height="8" fill="#6a5510"/>
        <rect x="-20" y="0" width="12" height="15" fill="#8a7520"/>
        <rect x="8" y="0" width="12" height="15" fill="#8a7520"/>
        <polygon points="-14,0 -8,-10 -2,0" fill="#daa520"/>
        <polygon points="14,0 20,-10 26,0" fill="#daa520"/>
        <rect x="-5" y="28" width="10" height="14" fill="#3a2a00" rx="5" ry="5"/>
        <text x="0" y="-14" textAnchor="middle" fontSize="14" fill="#daa520">✠</text>
      </g>

      {/* Church at Geneva area */}
      <g transform="translate(50,560)" opacity="0.4">
        <rect x="0" y="10" width="30" height="25" fill="#3a3020"/>
        <polygon points="0,10 15,-5 30,10" fill="#4a3a20"/>
        <rect x="12" y="20" width="6" height="15" fill="#1a1510"/>
        <line x1="15" y1="-3" x2="15" y2="-12" stroke="#daa520" strokeWidth="1.5"/>
        <line x1="11" y1="-7" x2="19" y2="-7" stroke="#daa520" strokeWidth="1.5"/>
      </g>

      {/* Cross near start */}
      <g transform="translate(40,980)" opacity="0.3">
        <line x1="0" y1="-20" x2="0" y2="5" stroke="#5a3a2a" strokeWidth="3"/>
        <line x1="-8" y1="-12" x2="8" y2="-12" stroke="#5a3a2a" strokeWidth="3"/>
      </g>

      {/* Path shadow */}
      <path d={pathD} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Path outline */}
      <path d={pathD} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Individual spaces */}
      {pts.map((p,i)=>{
        const sp=spaces[i];
        const ang=getAngle(pts,i);
        const bg=sp.color==="pink"?CHX.pink:sp.type==="final"?"#daa520":CHX[sp.color]||"#555";
        const r=sp.type==="normal"?8:sp.type==="dot"?9:sp.type==="final"?11:9;
        const here=players.filter(pl=>pl.position===i);

        return <g key={i}>
          {/* Space circle */}
          <circle cx={p[0]} cy={p[1]} r={r+1} fill="rgba(0,0,0,0.3)"/>
          <circle cx={p[0]} cy={p[1]} r={r} fill={bg}
            stroke={sp.type==="dot"?"#fff":sp.type==="final"?"#f5d76e":sp.type==="shortcut"?"rgba(255,255,255,0.6)":"rgba(0,0,0,0.25)"}
            strokeWidth={sp.type==="dot"?2.5:sp.type==="final"?2:sp.type==="shortcut"?1.5:0.8}
            strokeDasharray={sp.type==="shortcut"?"3,2":"none"}
          />

          {/* Dot indicator */}
          {sp.type==="dot"&&<circle cx={p[0]} cy={p[1]} r={3} fill="#fff"/>}

          {/* Start label */}
          {i===0&&<text x={p[0]} y={p[1]-16} textAnchor="middle" fontSize="10" fontWeight="700" fill="#c0392b" fontFamily="'EB Garamond',Georgia,serif">START</text>}

          {/* Final */}
          {sp.type==="final"&&<text x={p[0]} y={p[1]+4} textAnchor="middle" fontSize="12" fill="#3a2a00">✠</text>}

          {/* Named location labels */}
          {sp.type==="named"&&<g>
            <circle cx={p[0]} cy={p[1]} r={14} fill="rgba(217,138,170,0.2)" stroke="#D98AAA" strokeWidth="1" strokeDasharray="2,2"/>
            <text x={p[0]} y={p[1]-20} textAnchor="middle" fontSize="16">{sp.special.icon}</text>
            {sp.special.name.split(" ").length <= 2 ? (
              <text x={p[0]} y={p[1]+26} textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#f0e6d3" fontFamily="'EB Garamond',Georgia,serif">{sp.special.name}</text>
            ) : (
              sp.special.name.split(" ").map((w,wi)=>(
                <text key={wi} x={p[0]} y={p[1]+24+wi*10} textAnchor="middle" fontSize="8" fontWeight="600" fill="#f0e6d3" fontFamily="'EB Garamond',Georgia,serif">{w}</text>
              ))
            )}
          </g>}

          {/* Landmark labels */}
          {sp.type==="landmark"&&<g>
            <text x={p[0]} y={p[1]-14} textAnchor="middle" fontSize="12">{sp.special.icon}</text>
            {sp.special.name.split("\n").map((line,li)=>(
              <text key={li} x={p[0]} y={p[1]+20+li*9} textAnchor="middle" fontSize="7" fill="#9a8a7a" fontFamily="'EB Garamond',Georgia,serif">{line}</text>
            ))}
          </g>}

          {/* Dot space labels */}
          {sp.type==="dot"&&<g>
            {sp.special.name.split("\n").map((line,li)=>(
              <text key={li} x={p[0]} y={p[1]+18+li*9} textAnchor="middle" fontSize="7" fontWeight="600" fill="#f0e6d3" fontFamily="'EB Garamond',Georgia,serif">{line}</text>
            ))}
          </g>}

          {/* Shortcut indicators */}
          {sp.type==="shortcut"&&<g>
            <text x={p[0]} y={p[1]+18} textAnchor="middle" fontSize="7" fill="#daa520" fontFamily="'EB Garamond',Georgia,serif">{sp.special.name}</text>
            {/* Draw line to destination */}
            <line x1={p[0]} y1={p[1]} x2={pts[sp.special.to][0]} y2={pts[sp.special.to][1]}
              stroke="#daa520" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5"/>
          </g>}

          {/* Player tokens */}
          {here.map((pl,pi)=>(
            <g key={pl.id}>
              <circle cx={p[0]-6+pi*12} cy={p[1]-12-pi*4} r={8}
                fill={pl.color} stroke={cur===pl.id?"#fff":"rgba(0,0,0,0.4)"}
                strokeWidth={cur===pl.id?2.5:1.5} filter="url(#softshadow)"/>
              <text x={p[0]-6+pi*12} y={p[1]-9-pi*4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fff">{pl.id+1}</text>
            </g>
          ))}
        </g>;
      })}

      {/* Title at top */}
      <text x="460" y="78" textAnchor="middle" fontSize="10" letterSpacing="3" fill="#daa520" fontFamily="'EB Garamond',Georgia,serif" opacity="0.7">GLORIFICATION</text>
    </svg>
  );
}

/* ═══════════════════ CARD COMPONENT ═══════════════════ */
function CardView({card,drawn,onDraw,stuckColor}){
  if(!drawn)return(
    <button onClick={onDraw} style={{width:"100%",maxWidth:"190px",minHeight:"150px",background:"linear-gradient(135deg,#1a0a1a,#2a1a2a)",border:"2px solid #4a3a42",borderRadius:"12px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"6px",boxShadow:"0 4px 12px rgba(0,0,0,0.5)",fontFamily:"'EB Garamond',Georgia,serif",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,opacity:0.05,background:"repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(218,165,32,0.3) 8px,rgba(218,165,32,0.3) 9px)"}}/>
      <span style={{fontSize:"26px",color:"#daa520"}}>✠</span>
      <span style={{fontSize:"11px",color:"#8a7a6a",letterSpacing:"2px",textTransform:"uppercase"}}>Draw Card</span>
      <span style={{fontSize:"9px",color:"#5a4a3a",fontStyle:"italic"}}>Submit to Providence</span>
      {stuckColor&&<span style={{fontSize:"10px",color:CHX[stuckColor],fontWeight:600}}>Need {stuckColor} to escape</span>}
    </button>
  );
  const bg=card.type==="location"?CHX.pink:CHX[card.color]||"#555";
  return(
    <div style={{width:"100%",maxWidth:"190px",minHeight:"150px",background:`linear-gradient(160deg,${bg}33,#0a0a0a,${bg}22)`,border:`2px solid ${bg}aa`,borderRadius:"12px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"14px 10px",gap:"6px",boxShadow:`0 4px 12px ${bg}33`,fontFamily:"'EB Garamond',Georgia,serif",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,opacity:0.04,background:"repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(218,165,32,0.3) 8px,rgba(218,165,32,0.3) 9px)"}}/>
      {card.type==="location"?(
        <><span style={{fontSize:"24px"}}>{card.icon}</span><span style={{fontSize:"14px",fontWeight:700,color:"#f0e6d3",textAlign:"center"}}>{card.name}</span><span style={{fontSize:"10px",color:"#9a8a7a",fontStyle:"italic"}}>Go to {card.name}</span></>
      ):(
        <><div style={{display:"flex",gap:"5px"}}><div style={{width:"24px",height:"24px",borderRadius:"4px",background:bg,border:"2px solid rgba(255,255,255,0.3)"}}/>{card.type==="double"&&<div style={{width:"24px",height:"24px",borderRadius:"4px",background:bg,border:"2px solid rgba(255,255,255,0.3)"}}/>}</div><span style={{fontSize:"14px",fontWeight:700,color:"#f0e6d3"}}>{cardLabel(card)}</span><span style={{fontSize:"10px",color:"#9a8a7a",fontStyle:"italic",textAlign:"center"}}>{FLAVORS[card.color]}</span><span style={{fontSize:"10px",color:"#bbb"}}>{card.type==="double"?"2nd next "+card.color:"Next "+card.color}</span></>
      )}
    </div>
  );
}

/* ═══════════════════ MAIN GAME ═══════════════════ */
const PC=["#c0392b","#2874a6","#1e8449","#b7950b"];
const PN=["The Elect","The Pilgrim","The Saint","The Vessel"];

export default function App(){
  const pts=useMemo(()=>interpPath(WAYPOINTS,134),[]);
  const[phase,setPhase]=useState("setup");
  const[numP,setNumP]=useState(2);
  const[players,setPlayers]=useState([]);
  const[deck,setDeck]=useState([]);
  const[di,setDi]=useState(0);
  const[cur,setCur]=useState(0);
  const[card,setCard]=useState(null);
  const[ts,setTs]=useState("draw");
  const[msg,setMsg]=useState("");
  const[stuck,setStuck]=useState({});
  const[log,setLog]=useState([]);
  const[winner,setWinner]=useState(null);
  const lr=useRef(null);
  useEffect(()=>{if(lr.current)lr.current.scrollTop=lr.current.scrollHeight;},[log]);

  const start=()=>{
    const p=Array.from({length:numP},(_,i)=>({id:i,position:0,color:PC[i],name:PN[i]}));
    setPlayers(p);setDeck(buildDeck());setDi(0);setCur(0);setCard(null);setTs("draw");setStuck({});setWinner(null);setPhase("play");
    setMsg(`The deck is shuffled. The outcome is fixed. ${PN[0]}, submit to Providence.`);
    setLog([{text:"⸭ The decree is sealed. ⸭",type:"system"}]);
  };

  const draw=useCallback(()=>{
    if(ts!=="draw"||di>=deck.length)return;
    const c=deck[di];setDi(v=>v+1);setCard(c);
    const p=players[cur],sc=stuck[cur];
    if(sc){
      if(c.type==="location"||c.color!==sc){
        setMsg(`${p.name} draws ${cardLabel(c)} — needs ${sc}. Still trapped.`);
        setLog(v=>[...v,{text:`${p.name}: ${cardLabel(c)} — stuck (need ${sc})`,type:"stuck",color:p.color}]);
        setTs("next");return;
      }
      setStuck(v=>{const n={...v};delete n[cur];return n;});
      setLog(v=>[...v,{text:`${p.name}: ${c.color} — freed!`,type:"advance",color:p.color}]);
    }
    let np=p.position;
    if(c.type==="location"){
      np=c.target;
      const dir=np>p.position?"forward":np<p.position?"BACKWARD":"nowhere";
      setLog(v=>[...v,{text:`${p.name}: ${c.name} → ${dir} to #${np}`,type:dir==="BACKWARD"?"setback":"advance",color:p.color}]);
    }else{
      np=findNext(p.position,c.color,c.type==="double"?1:0);
      if(!sc)setLog(v=>[...v,{text:`${p.name}: ${cardLabel(c)} → #${np}`,type:"advance",color:p.color}]);
    }
    np=Math.max(0,Math.min(133,np));
    setPlayers(v=>{const u=[...v];u[cur]={...u[cur],position:np};return u;});
    if(np>=133){
      setWinner({...p,position:133});setPhase("end");
      setMsg(`${p.name} reaches Glorification! SOLI DEO GLORIA.`);
      setLog(v=>[...v,{text:`✦ ${p.name} reaches GLORIFICATION ✦`,type:"victory"}]);
      setTs("done");return;
    }
    const landed=SPACES[np];
    if(landed.type==="shortcut"&&c.type!=="location"){
      const dest=landed.special.to;
      setPlayers(v=>{const u=[...v];u[cur]={...u[cur],position:dest};return u;});
      setMsg(`${p.name} finds "${landed.special.name}" — shortcut to #${dest}!`);
      setLog(v=>[...v,{text:`  ↗ ${landed.special.name} → #${dest}`,type:"shortcut"}]);
      setTs("next");return;
    }
    if(landed.type==="dot"){
      setStuck(v=>({...v,[cur]:landed.special.color}));
      setMsg(`${p.name} trapped! "${landed.special.name.replace(/\n/g," ")}" — need ${landed.special.color}.`);
      setTs("next");return;
    }
    const nm=landed.special?.name?.replace(/\n/g," ")||`space #${np}`;
    const desc=landed.special?.desc||"";
    setMsg(`${p.name} → ${nm}. ${desc}`);
    setTs("next");
  },[ts,di,deck,cur,players,stuck]);

  const next=()=>{
    if(phase==="end")return;
    if(di>=deck.length-2){setDeck(buildDeck());setDi(0);setLog(v=>[...v,{text:"⸭ Deck reshuffled. ⸭",type:"system"}]);}
    const n=(cur+1)%players.length;setCur(n);setCard(null);setTs("draw");
    setMsg(`${PN[n]}, the decree awaits.${stuck[n]?` (stuck — need ${stuck[n]})`:""}`);
  };

  /* ─── SETUP ─── */
  if(phase==="setup")return(
    <div style={{minHeight:"100vh",background:"linear-gradient(170deg,#0a0608,#1a0e16,#0a0a12)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 16px",fontFamily:"'EB Garamond',Georgia,serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet"/>
      <div style={{textAlign:"center",maxWidth:"500px",width:"100%"}}>
        <div style={{fontSize:"42px",color:"#daa520",marginBottom:"4px"}}>✠</div>
        <h1 style={{fontSize:"clamp(24px,5vw,36px)",color:"#f0e6d3",fontWeight:700,lineHeight:1.1,margin:"0 0 4px"}}>The Pilgrim's<br/>Predestined Path</h1>
        <p style={{fontSize:"12px",color:"#daa520",letterSpacing:"3px",textTransform:"uppercase",margin:"0 0 18px"}}>A Game of Reformed Theology</p>
        <div style={{background:"rgba(255,255,255,0.03)",borderRadius:"10px",border:"1px solid rgba(218,165,32,0.15)",padding:"16px",marginBottom:"14px",textAlign:"left"}}>
          <p style={{color:"#c4a85a",fontSize:"13px",fontStyle:"italic",lineHeight:1.6,margin:"0 0 6px"}}>"God preordained, for his own glory and the display of His attributes of mercy and justice, a part of the human race, without any merit of their own, to eternal salvation, and another part, in just punishment of their sin, to eternal damnation."</p>
          <p style={{color:"#6a5a4a",fontSize:"10px",margin:0,textAlign:"right"}}>— Calvin, Institutes III.21.5</p>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.06)",padding:"14px",marginBottom:"14px",textAlign:"left"}}>
          <h3 style={{color:"#daa520",fontSize:"12px",letterSpacing:"2px",textTransform:"uppercase",margin:"0 0 8px"}}>How to Play</h3>
          <p style={{color:"#9a8a7a",fontSize:"11px",lineHeight:1.6,margin:"0 0 6px"}}>Draw a card. Move to the next space of that color. Double cards skip to the <em>second</em> next. Character cards teleport you — forward <em>or backward</em>.</p>
          <p style={{color:"#9a8a7a",fontSize:"11px",lineHeight:1.6,margin:"0 0 6px"}}>Land on a <strong>● dot space</strong> and you're trapped until you draw its color. Two shortcuts exist for those Providence favors.</p>
          <p style={{color:"#7a6a5a",fontSize:"10px",lineHeight:1.6,margin:0,fontStyle:"italic"}}>There are no decisions. The deck was shuffled before you sat down. You merely discover what was always ordained.</p>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.06)",padding:"10px 14px",marginBottom:"14px",textAlign:"left"}}>
          <p style={{color:"#7a6a5a",fontSize:"10px",lineHeight:1.8,margin:0}}>
            <b style={{color:"#9a8a7a"}}>T</b> — Total Depravity: You cannot choose your path.<br/>
            <b style={{color:"#9a8a7a"}}>U</b> — Unconditional Election: The deck chose you.<br/>
            <b style={{color:"#9a8a7a"}}>L</b> — Limited Atonement: Not every pilgrim reaches Glory.<br/>
            <b style={{color:"#9a8a7a"}}>I</b> — Irresistible Grace: When drawn forward, you must go.<br/>
            <b style={{color:"#9a8a7a"}}>P</b> — Perseverance: The elect cannot fall away.
          </p>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",marginBottom:"14px"}}>
          <span style={{color:"#9a8a7a",fontSize:"12px"}}>Pilgrims:</span>
          {[2,3,4].map(n=>(
            <button key={n} onClick={()=>setNumP(n)} style={{width:"38px",height:"38px",borderRadius:"50%",background:numP===n?"rgba(218,165,32,0.2)":"rgba(255,255,255,0.03)",border:numP===n?"2px solid #daa520":"1px solid rgba(255,255,255,0.1)",color:numP===n?"#daa520":"#6a5a4a",fontSize:"15px",fontFamily:"'EB Garamond',Georgia,serif",cursor:"pointer",fontWeight:600}}>{n}</button>
          ))}
        </div>
        <button onClick={start} style={{padding:"11px 32px",borderRadius:"8px",background:"linear-gradient(135deg,#daa520,#c49520)",border:"none",cursor:"pointer",fontFamily:"'EB Garamond',Georgia,serif",fontSize:"14px",fontWeight:700,color:"#1a0a0a",letterSpacing:"2px",textTransform:"uppercase",boxShadow:"0 4px 12px rgba(218,165,32,0.3)"}}>Submit to Providence</button>
      </div>
    </div>
  );

  /* ─── PLAY/END ─── */
  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(170deg,#0a0608,#1a0e16,#0a0a12)",fontFamily:"'EB Garamond',Georgia,serif",padding:"8px",display:"flex",flexDirection:"column",gap:"6px"}}>
      <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet"/>
      <div style={{textAlign:"center"}}>
        <h1 style={{fontSize:"15px",color:"#f0e6d3",margin:0}}>✠ The Pilgrim's Predestined Path ✠</h1>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:"6px",flexWrap:"wrap"}}>
        {players.map(p=>(
          <div key={p.id} style={{display:"flex",alignItems:"center",gap:"4px",padding:"3px 8px",borderRadius:"14px",background:cur===p.id?`${p.color}22`:"transparent",border:cur===p.id?`1px solid ${p.color}66`:"1px solid rgba(255,255,255,0.04)"}}>
            <div style={{width:"9px",height:"9px",borderRadius:"50%",background:p.color}}/>
            <span style={{fontSize:"10px",color:cur===p.id?"#f0e6d3":"#5a4a3a"}}>{p.name}</span>
            <span style={{fontSize:"8px",color:"#3a2a1a"}}>#{p.position}</span>
            {stuck[p.id]&&<span style={{fontSize:"8px",color:CHX[stuck[p.id]]}}>●</span>}
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:"10px",flex:1,flexWrap:"wrap",justifyContent:"center",alignItems:"flex-start"}}>
        {/* Board */}
        <div style={{flex:"1 1 400px",maxWidth:"560px",minWidth:"300px",maxHeight:"calc(100vh - 140px)",overflowY:"auto",overflowX:"hidden",borderRadius:"12px",border:"1px solid rgba(218,165,32,0.12)",background:"rgba(0,0,0,0.2)"}}>
          <SVGBoard spaces={SPACES} players={players} cur={cur} pts={pts}/>
        </div>

        {/* Controls */}
        <div style={{flex:"0 1 210px",display:"flex",flexDirection:"column",gap:"8px",alignItems:"center",minWidth:"190px"}}>
          <div style={{background:"rgba(255,255,255,0.03)",borderRadius:"8px",border:"1px solid rgba(218,165,32,0.1)",padding:"7px 10px",width:"100%",boxSizing:"border-box"}}>
            <p style={{color:"#c4a85a",fontSize:"10px",fontStyle:"italic",margin:0,lineHeight:1.4,textAlign:"center"}}>{msg}</p>
          </div>

          {phase==="play"&&<>
            <CardView card={card} drawn={!!card} onDraw={ts==="draw"?draw:undefined} stuckColor={stuck[cur]||null}/>
            {ts==="next"&&<button onClick={next} style={{padding:"7px 20px",borderRadius:"6px",background:"rgba(218,165,32,0.15)",border:"1px solid rgba(218,165,32,0.3)",cursor:"pointer",fontFamily:"'EB Garamond',Georgia,serif",fontSize:"11px",color:"#daa520",letterSpacing:"1px"}}>Next Pilgrim →</button>}
          </>}

          {phase==="end"&&winner&&(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"30px",color:"#daa520",marginBottom:"4px"}}>✦</div>
              <p style={{color:"#daa520",fontSize:"15px",fontWeight:700,margin:"0 0 4px"}}>SOLI DEO GLORIA</p>
              <p style={{color:"#9a8a7a",fontSize:"11px",fontStyle:"italic",margin:"0 0 3px"}}>{winner.name} has reached Glorification.</p>
              <p style={{color:"#6a5a4a",fontSize:"10px",margin:"0 0 10px"}}>This was determined before the first card was drawn.<br/>The others were never going to arrive.</p>
              <button onClick={()=>setPhase("setup")} style={{padding:"8px 18px",borderRadius:"6px",background:"linear-gradient(135deg,#daa520,#c49520)",border:"none",cursor:"pointer",fontFamily:"'EB Garamond',Georgia,serif",fontSize:"11px",fontWeight:700,color:"#1a0a0a",letterSpacing:"1px"}}>Play Again (as if you had a choice)</button>
            </div>
          )}

          <div ref={lr} style={{width:"100%",flex:1,minHeight:"80px",maxHeight:"150px",background:"rgba(0,0,0,0.3)",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.05)",padding:"5px",overflowY:"auto",boxSizing:"border-box"}}>
            <div style={{fontSize:"8px",color:"#4a3a2a",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"3px"}}>Book of Life</div>
            {log.map((e,i)=>(
              <div key={i} style={{fontSize:"9px",lineHeight:1.4,color:e.type==="victory"?"#daa520":e.type==="system"?"#6a5a4a":e.type==="setback"?"#c0392b":e.type==="stuck"?"#8a6a4a":e.type==="shortcut"?"#daa520":e.color?`${e.color}cc`:"#7a6a5a",fontStyle:e.type==="system"?"italic":"normal"}}>{e.text}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
