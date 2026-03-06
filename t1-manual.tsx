import { useState } from "react";

// ─── Section colors ───────────────────────────────────────────────────
const SEC = {
  SHAPE:  { c:"#5BA3C9", bg:"rgba(91,163,201,0.06)",  bd:"rgba(91,163,201,0.12)"  },
  GROOVE: { c:"#9A72C4", bg:"rgba(154,114,196,0.06)", bd:"rgba(154,114,196,0.12)" },
  TONAL:  { c:"#6AB870", bg:"rgba(106,184,112,0.06)", bd:"rgba(106,184,112,0.12)" },
  SETUP:  { c:"#C49042", bg:"rgba(196,144,66,0.06)",  bd:"rgba(196,144,66,0.12)"  },
};

// ─── 18 Knobs — c = col (1-indexed per section), r = row ─────────────
const KNOBS = [
  // SHAPE (7)
  { id:"STEPS",    p:"STEPS",    x:null,          s:"SHAPE",  c:1,r:1, desc:"Longueur de la séquence euclidienne. Chaque track peut avoir un nombre de steps différent → polyrythmie.", sc:[{k:"Turn (STEPS)",a:"Modifier le nombre de steps"},{k:"Press (STEPS)",a:"Afficher réglage sur les VBs"},{k:"Double-press (STEPS)",a:"Verrouiller l'affichage VBs"}] },
  { id:"PULSES",   p:"PULSES",   x:"ROTATE",      s:"SHAPE",  c:2,r:1, desc:"Pulses actifs dans le pattern euclidien. ROTATE : décale le point de départ du pattern.", sc:[{k:"Turn (PULSES)",a:"Modifier le nb de pulses"},{k:"[CTRL]+Turn (ROTATE)",a:"Décaler le point de départ"}] },
  { id:"CYCLES",   p:"CYCLES",   x:null,          s:"SHAPE",  c:3,r:1, desc:"Variations algorithmiques dans la séquence. Chaque cycle peut verrouiller un paramètre différent.", sc:[{k:"[CTRL]+Turn (CYCLES)",a:"Modifier le nb de cycles"},{k:"[CTRL]+(CYCLES)+[VBx]",a:"Sélectionner cycle VBx directement"},{k:"Vue cycle → [VBx] → [BANK] rouge → turn(param)",a:"Éditer les paramètres d'un cycle"},{k:"Vue cycle → [CTRL]+[BANK] → [CTRL]+[VBx] → turn(PITCH)",a:"Pitch par step dans le cycle"}] },
  { id:"DIVISION", p:"DIVISION", x:null,          s:"SHAPE",  c:4,r:1, desc:"Subdivision rythmique de chaque step dans le pattern euclidien. Contrôle l'intervalle de note.", sc:[{k:"Turn (DIVISION)",a:"Modifier la subdivision de note"}] },
  { id:"VELOCITY", p:"VELOCITY", x:"PROBABILITY", s:"SHAPE",  c:1,r:2, desc:"Vélocité de base des notes. PROBABILITY : filtre les notes selon une probabilité aléatoire (0–100%).", sc:[{k:"Turn (VELOCITY)",a:"Modifier la vélocité de base"},{k:"[CTRL]+Turn (PROBABILITY)",a:"Régler le filtre de probabilité"}] },
  { id:"SUSTAIN",  p:"SUSTAIN",  x:null,          s:"SHAPE",  c:2,r:2, desc:"Durée des notes. 100% = notes très longues, mais PAS un vrai latch.", sc:[{k:"Turn (SUSTAIN)",a:"Modifier la durée des notes"}], note:"Sustain 100% ≠ latch. Latch sur Hydrasynth : Arp TX=Off + [LATCH] T-1. Hold step = Hold [VBx] + tap [CLEAR]." },
  { id:"REPEATS",  p:"REPEATS",  x:"OFFSET",      s:"SHAPE",  c:3,r:2, desc:"Répétitions de note après chaque pulse. OFFSET : ramp de vélocité sur les répétitions.", sc:[{k:"Turn (REPEATS)",a:"Modifier le nb de répétitions"},{k:"[CTRL]+Turn (OFFSET)",a:"Ramp de vélocité sur les répétitions"}] },
  // GROOVE (3)
  { id:"TIME",     p:"TIME",     x:"PACE",        s:"GROOVE", c:1,r:1, desc:"Intervalle de temps des répétitions de note. PACE : règle l'accélération/décélération.", sc:[{k:"Turn (TIME)",a:"Modifier l'intervalle de temps"},{k:"[CTRL]+Turn (PACE)",a:"Régler accélération / décélération"}] },
  { id:"ACCENT",   p:"ACCENT",   x:"GROOVE",      s:"GROOVE", c:2,r:1, desc:"Variation de vélocité sur les notes. GROOVE : caractère de groove rythmique, 8 patterns prédéfinis.", sc:[{k:"Turn (ACCENT)",a:"Régler l'accent de vélocité"},{k:"[CTRL]+Turn (GROOVE)",a:"Sélectionner groove 1–8"}] },
  { id:"TIMING",   p:"TIMING",   x:"DELAY",       s:"GROOVE", c:1,r:2, desc:"Micro-timing asymétrique — étire les notes sur la grille. DELAY : offset +/− de la track entière.", sc:[{k:"Turn (TIMING)",a:"Régler le micro-timing"},{k:"[CTRL]+Turn (DELAY)",a:"Régler le delay offset +/−"}] },
  // TONAL (4)
  { id:"PITCH",    p:"PITCH",    x:"HARMONY",     s:"TONAL",  c:1,r:1, desc:"Transposition de pitch façon clavier dans la gamme. HARMONY : transpose harmoniquement les notes de l'accord.", sc:[{k:"Turn (PITCH)",a:"Transposer par step dans la gamme"},{k:"Double-press (PITCH)",a:"Verrouiller la vue clavier (VBs)"},{k:"[CTRL]+Turn (HARMONY)",a:"Transposer harmoniquement chaque note"},{k:"[CTRL]+[VB16] en keyboard view",a:"Octave −1"}], note:"Double-press (PITCH) verrouille la vue clavier → [CTRL]+[VB16] = −1 octave." },
  { id:"VOICING",  p:"VOICING",  x:"STYLE",       s:"TONAL",  c:2,r:1, desc:"Ordre des notes dans l'accord sur les octaves. STYLE : algorithme de jeu. 10 styles (Poly/Mono).", sc:[{k:"Turn (VOICING)",a:"Modifier l'ordre des voix (bipolaire)"},{k:"[CTRL]+(STYLE) → [VBx]",a:"Sélectionner le style de jeu"}], details:["VB1  PolyFixed","VB2  PolyRamp","VB3  PolyClimb","VB4  PolyUp/Down","VB5  PolyClimbUp/Down","VB9  MonoFixed","VB10 MonoRamp","VB11 MonoClimb","VB12 MonoUp/Down","VB13 MonoClimbUp/Down","VB8 = direction UP","VB16 = direction DOWN","⚠️  Sans notes dans Pitch = rien ne joue"] },
  { id:"RANGE",    p:"RANGE",    x:"PHRASE",      s:"TONAL",  c:1,r:2, desc:"Portée de la modulation de pitch (LFO / formes). PHRASE : sélectionne la forme de modulation, 8 cadences/LFO.", sc:[{k:"Turn (RANGE)",a:"Modifier la portée de modulation"},{k:"[CTRL]+Turn (PHRASE)",a:"Sélectionner la forme (cadence/LFO)"}] },
  { id:"SCALE",    p:"SCALE",    x:"ROOT",        s:"TONAL",  c:2,r:2, desc:"Gamme de la track. ROOT : note fondamentale. 8 gammes + 1 user-defined.", sc:[{k:"Turn (SCALE)",a:"Sélectionner la gamme"},{k:"[CTRL]+Turn (ROOT)",a:"Définir la note racine"}], details:["VB9   Chromatic","VB10  Major","VB11  Minor","VB12  Hira Tetra","VB13  Penta","VB14  Iwato","VB15  Major Penta","VB16  User"] },
  // SETUP (4)
  { id:"TEMPO",    p:"TEMPO",    x:null,          s:"SETUP",  c:1,r:1, desc:"BPM du clock interne (24–280 BPM, défaut 120). Source de clock master MIDI pour Hydrasynth + S-4.", sc:[{k:"Turn (TEMPO)",a:"Modifier le BPM"},{k:"[CTRL]+Turn (TEMPO)",a:"Régler la luminosité des LEDs"}], note:"Full-on psytrance : 148–152 BPM. [PLAY] orange = Ableton Link actif. Garder tempo inactif dans Bitwig pour préserver T-1 comme référence clock." },
  { id:"LENGTH",   p:"LENGTH",   x:"QUANTIZE",    s:"SETUP",  c:2,r:1, desc:"Longueur de la track et du loop. QUANTIZE : quantize le pattern courant par rapport au transport.", sc:[{k:"Turn (LENGTH)",a:"Modifier la longueur du loop"},{k:"[CTRL]+Turn (QUANTIZE)",a:"Quantizer le pattern par rapport au transport"}] },
  { id:"CHANNEL",  p:"CHANNEL",  x:"OUTPUT",      s:"SETUP",  c:1,r:2, desc:"Canal MIDI de la track (1–16). OUTPUT : sortie (non implémenté en v2).", sc:[{k:"Turn (CHANNEL)",a:"Modifier le canal MIDI (1–16)"}], note:"Config master T-1 : Ch.1=Hydrasynth · Ch.2–4=S-4 tracks. Config PolyBrute : S-4 sur Ch.16 pour éviter collisions notes." },
  { id:"RANDOM",   p:"RANDOM",   x:"RATE",        s:"SETUP",  c:2,r:2, desc:"Quantité de randomisation de la séquence sur presque tous les paramètres. RATE : taux de modulation séquentielle.", sc:[{k:"Turn (RANDOM)",a:"Régler la quantité de randomisation"},{k:"[CTRL]+Turn (RATE)",a:"Régler le taux de modulation séquentielle"}] },
];

// ─── Buttons ──────────────────────────────────────────────────────────
const BTNS = [
  { id:"PLAY",    label:"PLAY",    sub:"STOP",   col:"#3DAA6A",
    desc:"Démarre/arrête le pattern. Clignote blanc à chaque quarter note quand actif. Orange = Ableton Link actif.",
    sc:[{k:"[PLAY]",a:"Démarrer / arrêter le transport"},{k:"[CTRL]+[PLAY]",a:"Play isolé (sans MIDI/Link/reset analog)"},{k:"[CLEAR]+[PLAY]",a:"Tuer toutes les notes MIDI bloquées"}],
    note:"Workflow Bitwig : armer track → Global Record (clignote) → [PLAY] T-1 → enregistrement simultané." },
  { id:"BANK",    label:"BANK",    sub:"SAVE",   col:"#E8750A",
    desc:"Sélectionne le bank actif (1–16). En tout mode : retour à la vue home (tracks). SAVE = seul niveau de sauvegarde T-1.",
    sc:[{k:"[BANK]+[VBx]",a:"Sélectionner bank VBx"},{k:"[CTRL]+[SAVE]+[VBx]",a:"Sauvegarder le bank"},{k:"Hold [BANK]+[VBx] 1sec",a:"Recharger bank (flash vert = OK)"},{k:"[CLEAR]+[BANK]+[VBx] ×2",a:"Effacer bank"},{k:"Hold [CTRL]+[COPY]+[BANK]+[src→dst]",a:"Copier bank"},{k:"Démarrer T-1 en tenant [BANK]",a:"Full reload complet"}],
    note:"⚠️ Sauvegarde UNIQUEMENT au niveau BANK. Pas de save par track ou pattern seul. Non sauvegardé = perdu au redémarrage." },
  { id:"PATTERN", label:"PATTERN", sub:"SELECT", col:"#E8750A",
    desc:"Sélectionne le pattern actif (1–16). SELECT (secondaire) : sélection silencieuse sans interrompre le jeu.",
    sc:[{k:"[PATTERN]+[VBx]",a:"Sélectionner pattern"},{k:"[CTRL]+[PATTERN]+[VBx]",a:"Sélection silencieuse"},{k:"[CLEAR]+[PATTERN]+[VBx]",a:"Effacer pattern"},{k:"Hold [CTRL]+[COPY]+[PATTERN]+[src→dst]",a:"Copier pattern"}] },
  { id:"CTRL",    label:"CTRL",    sub:null,     col:"#5BA3C9",
    desc:"Modificateur principal. Tenir pour accéder aux fonctions secondaires (labels gris) sur tous les boutons et knobs.",
    sc:[{k:"Hold [CTRL]+(knob)",a:"Accéder à la fonction secondaire du knob"},{k:"Hold [CTRL]+[bouton]",a:"Accéder à la fonction secondaire"},{k:"[CTRL]+double-tap",a:"Assigner statut MAGENTA (FX track)"},{k:"[CTRL]+[VB16] en keyboard view",a:"Octave −1"},{k:"[CTRL]+Turn (TEMPO)",a:"Luminosité LEDs"},{k:"[CTRL]+[PLAY]",a:"Play isolé sans MIDI/Link"},{k:"[CTRL]+[SAVE]+[VBx]",a:"Sauvegarder bank"}] },
  { id:"CLEAR",   label:"CLEAR",   sub:"COPY",   col:"#CC4444",
    desc:"Efface l'élément ciblé selon la combinaison. COPY (secondaire) via [CTRL]. Double confirmation pour les banks.",
    sc:[{k:"[CLEAR]+[VBx]",a:"Effacer track"},{k:"[CLEAR]+[BANK]+[VBx] ×2",a:"Effacer bank"},{k:"[CLEAR]+[PATTERN]+[VBx]",a:"Effacer pattern"},{k:"Hold [CTRL]+[COPY]+[src→dst]",a:"Copier track"},{k:"Hold [CTRL]+[COPY]+[BANK]+[src→dst]",a:"Copier bank"},{k:"Hold [CTRL]+[COPY]+[PATTERN]+[src→dst]",a:"Copier pattern"},{k:"Hold [VBx]+tap [CLEAR]",a:"Mode Hold step (latch)"}] },
  { id:"TEMP",    label:"TEMP",    sub:null,     col:"#E09930", perf:true,
    desc:"Performance : tenir TEMP + tourner un knob pour modifier sa valeur temporairement. Relâcher = retour à la valeur d'origine.",
    sc:[{k:"Hold [TEMP]+Turn (param)",a:"Modifier temporairement un paramètre"}] },
  { id:"MUTE",    label:"MUTE",    sub:null,     col:"#E09930", perf:true,
    desc:"Performance : tenir MUTE + VBx pour muter/démuter instantanément la track sélectionnée.",
    sc:[{k:"Hold [MUTE]+[VBx]",a:"Muter / démuter la track VBx"}] },
  { id:"VB",      label:"VB 1–16", sub:null,     col:"#888",
    desc:"16 boutons multifonction. Illumination colorée = indicateur visuel du mode actif. Par défaut : sélection des tracks.",
    sc:[{k:"Mode BANK → [VBx]",a:"Sélectionner bank 1–16"},{k:"Mode PATTERN → [VBx]",a:"Sélectionner pattern 1–16"},{k:"Mode TRACK → [VBx]",a:"Sélectionner track 1–16"},{k:"Mode PITCH (keyboard view)",a:"Jouer / sélectionner notes dans la gamme"},{k:"VB8",a:"Direction UP (voicing)"},{k:"VB16",a:"Direction DOWN · [CTRL]+VB16 = Octave −1"},{k:"Hold [VBx]+tap [CLEAR]",a:"Mode Hold step (latch)"}] },
];

// ─── Component ───────────────────────────────────────────────────────
export default function T1Manual() {
  const [sel, setSel] = useState(null); // [type:"k"|"b", id]

  const pick = (t, id) => setSel(s => s?.[0]===t && s?.[1]===id ? null : [t,id]);
  const info = sel ? (sel[0]==="k" ? KNOBS.find(x=>x.id===sel[1]) : BTNS.find(x=>x.id===sel[1])) : null;
  const ic = info ? (info.s ? SEC[info.s].c : info.col) : "#888";

  const buildGrid = (sec, cols) => {
    const g = Array(2).fill(0).map(()=>Array(cols).fill(null));
    KNOBS.filter(k=>k.s===sec).forEach(k=>{ g[k.r-1][k.c-1]=k; });
    return g.flat();
  };

  const Knob = ({ d }) => {
    const on = sel?.[0]==="k" && sel?.[1]===d.id;
    const { c } = SEC[d.s];
    return (
      <div onClick={()=>pick("k",d.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",userSelect:"none",width:50}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:on?`${c}18`:"#0f0f0f",border:`2px solid ${on?c:"#282828"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:on?`0 0 14px ${c}44`:"none",transition:"all .15s",gap:2}}>
          <div style={{width:2,height:7,borderRadius:1,background:on?c:"#333"}}/>
          <div style={{width:3,height:3,borderRadius:"50%",background:on?c+"88":"#222"}}/>
        </div>
        <span style={{fontSize:7,fontWeight:700,letterSpacing:.8,color:on?c:"#555",textAlign:"center",lineHeight:1.2}}>{d.p}</span>
        <span style={{fontSize:6,letterSpacing:.5,color:on?`${c}77`:"#282828",textAlign:"center",minHeight:8}}>{d.x||""}</span>
      </div>
    );
  };

  const SecBox = ({ sec, cols }) => {
    const cells = buildGrid(sec, cols);
    const { c, bg, bd } = SEC[sec];
    return (
      <div style={{background:bg,border:`1px solid ${bd}`,borderRadius:8,padding:"9px 10px 11px",flexShrink:0}}>
        <div style={{fontSize:7,color:c,letterSpacing:3,fontWeight:700,marginBottom:8,opacity:.8}}>{sec}</div>
        <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},50px)`,gap:5}}>
          {cells.map((d,i)=>d?<Knob key={d.id} d={d}/>:<div key={i} style={{width:50}}/>)}
        </div>
      </div>
    );
  };

  const Btn = ({ d }) => {
    const on = sel?.[0]==="b" && sel?.[1]===d.id;
    return (
      <button onClick={()=>pick("b",d.id)} style={{background:on?`${d.col}18`:"transparent",border:`1.5px solid ${on?d.col:d.col+"2e"}`,color:on?d.col:`${d.col}66`,borderRadius:5,padding:"5px 12px",fontSize:8,fontWeight:700,letterSpacing:.9,cursor:"pointer",fontFamily:"monospace",transition:"all .15s",boxShadow:on?`0 0 10px ${d.col}33`:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:1,minWidth:54}}>
        <span>{d.label}</span>
        {d.sub&&<span style={{fontSize:6,opacity:.5}}>{d.sub}</span>}
      </button>
    );
  };

  const VBPad = ({ n }) => {
    const on = sel?.[0]==="b" && sel?.[1]==="VB";
    return (
      <div style={{width:33,height:33,borderRadius:4,background:on?"#181818":"#0a0a0a",border:`1px solid ${on?"#E8750A22":"#161616"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:on?"#444":"#1e1e1e",fontWeight:700,transition:"all .15s"}}>{n}</div>
    );
  };

  return (
    <div style={{minHeight:"100vh",background:"#060606",color:"#ccc",fontFamily:"'SF Mono',ui-monospace,monospace"}}>
      {/* Header */}
      <div style={{padding:"9px 18px",borderBottom:"1px solid #121212",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:7,height:7,borderRadius:"50%",background:"#E8750A",boxShadow:"0 0 7px #E8750A88"}}/>
        <span style={{color:"#e0e0e0",fontWeight:700,fontSize:12,letterSpacing:4}}>TORSO T-1</span>
        <span style={{color:"#1c1c1c",fontSize:8,letterSpacing:2}}>MANUEL INTERACTIF</span>
        <div style={{flex:1}}/>
        <span style={{color:"#1a1a1a",fontSize:8}}>{sel?"clique à nouveau = fermer":"← clique sur un élément"}</span>
      </div>

      <div style={{padding:13,display:"flex",flexDirection:"column",gap:10}}>

        {/* ── Device ── */}
        <div style={{background:"#131313",border:"2px solid #1e1e1e",borderRadius:14,padding:"13px 14px",display:"flex",flexDirection:"column",gap:10,overflowX:"auto"}}>

          {/* Knob sections */}
          <div style={{display:"flex",gap:5,alignItems:"flex-start",minWidth:"min-content"}}>
            <SecBox sec="SHAPE"  cols={4}/>
            <SecBox sec="GROOVE" cols={2}/>
            <SecBox sec="TONAL"  cols={2}/>
            <SecBox sec="SETUP"  cols={2}/>
          </div>

          {/* Buttons */}
          <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap",paddingTop:2}}>
            {BTNS.filter(b=>!b.perf&&b.id!=="VB").map(b=><Btn key={b.id} d={b}/>)}
            <div style={{flex:1}}/>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{fontSize:6,color:"#1e1e1e",letterSpacing:1.5}}>PERF</span>
              {BTNS.filter(b=>b.perf).map(b=><Btn key={b.id} d={b}/>)}
            </div>
          </div>

          {/* Value Buttons */}
          <div onClick={()=>pick("b","VB")} style={{cursor:"pointer"}}>
            <div style={{fontSize:6,color:"#191919",letterSpacing:2,marginBottom:5}}>VALUE BUTTONS</div>
            {[[1,2,3,4,5,6,7,8],[9,10,11,12,13,14,15,16]].map((row,ri)=>(
              <div key={ri} style={{display:"flex",gap:3,marginBottom:ri<1?3:0}}>
                {row.map(n=><VBPad key={n} n={n}/>)}
              </div>
            ))}
          </div>
        </div>

        {/* ── Info panel ── */}
        {info && (
          <div style={{background:"#0d0d0d",border:`1px solid ${ic}18`,borderRadius:10,padding:14,display:"flex",flexDirection:"column",gap:10}}>
            {/* Tags */}
            <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
              <span style={{background:`${ic}12`,border:`1px solid ${ic}44`,color:ic,borderRadius:4,padding:"3px 11px",fontSize:11,fontWeight:700,letterSpacing:1.5}}>{info.p||info.label}</span>
              {(info.x||info.sub)&&<span style={{color:"#222",fontSize:9}}>secondaire : <span style={{color:`${ic}99`,fontWeight:600}}>{info.x||info.sub}</span></span>}
              {info.s&&<span style={{background:`${SEC[info.s].c}12`,color:SEC[info.s].c,border:`1px solid ${SEC[info.s].c}33`,borderRadius:20,padding:"2px 9px",fontSize:7,letterSpacing:2}}>{info.s}</span>}
              {info.perf&&<span style={{color:"#E0993040",fontSize:7,letterSpacing:2}}>PERFORMANCE</span>}
            </div>
            {/* Desc */}
            <p style={{color:"#888",fontSize:11,margin:0,lineHeight:1.85}}>{info.desc}</p>
            {/* Shortcuts */}
            {info.sc?.length>0&&<>
              <div style={{color:"#1e1e1e",fontSize:7,letterSpacing:2}}>RACCOURCIS</div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {info.sc.map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                    <code style={{background:"#050505",border:"1px solid #161616",borderRadius:3,padding:"2px 7px",fontSize:9,color:"#5BA3C9",whiteSpace:"nowrap",flexShrink:0}}>{s.k}</code>
                    <span style={{color:"#555",fontSize:10,paddingTop:2}}>→ {s.a}</span>
                  </div>
                ))}
              </div>
            </>}
            {/* Details */}
            {info.details?.length>0&&<>
              <div style={{color:"#1e1e1e",fontSize:7,letterSpacing:2}}>DÉTAILS</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>
                {info.details.map((d,i)=>(
                  <div key={i} style={{color:"#4a4a4a",fontSize:9,paddingLeft:8,borderLeft:`2px solid ${ic}30`,lineHeight:1.9}}>{d}</div>
                ))}
              </div>
            </>}
            {/* Note */}
            {info.note&&<div style={{background:"#0b0800",border:"1px solid #221600",borderRadius:5,padding:"8px 12px",color:"#A07830",fontSize:10,lineHeight:1.75}}>{info.note}</div>}
          </div>
        )}

        {/* ── Cheat sheet ── */}
        <details style={{background:"#0b0b0b",border:"1px solid #161616",borderRadius:8}}>
          <summary style={{padding:"9px 13px",cursor:"pointer",fontSize:8,color:"#202020",letterSpacing:2,userSelect:"none",listStyle:"none"}}>▸ CHEAT SHEET — SAVE / RELOAD / CLEAR / COPY</summary>
          <div style={{padding:"4px 13px 13px",display:"flex",flexDirection:"column",gap:4}}>
            {[
              ["BANK – Save",     "[CTRL]+[SAVE]+[VBx]"],
              ["BANK – Reload",   "Hold [BANK]+[VBx] 1sec  →  flash vert = OK"],
              ["BANK – Clear",    "[CLEAR]+[BANK]+[VBx] ×2"],
              ["BANK – Copy",     "Hold [CTRL]+[COPY]+[BANK]+[src→dst]"],
              ["PATTERN – Clear", "[CLEAR]+[PATTERN]+[VBx]"],
              ["PATTERN – Copy",  "Hold [CTRL]+[COPY]+[PATTERN]+[src→dst]"],
              ["TRACK – Clear",   "[CLEAR]+[VBx]"],
              ["TRACK – Copy",    "Hold [CTRL]+[COPY]+[src→dst]"],
              ["CYCLE – Clear",   "[CLEAR]+[VBx] ou (Knob)"],
              ["CYCLE – Copy",    "Hold [CTRL]+[COPY]+[src→dst]"],
              ["Full reload",     "Démarrer T-1 en tenant [BANK]"],
            ].map(([l,c],i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"center",paddingBottom:4,borderBottom:"1px solid #0f0f0f"}}>
                <span style={{color:"#323232",fontSize:9,minWidth:130,flexShrink:0}}>{l}</span>
                <code style={{background:"#050505",border:"1px solid #161616",borderRadius:3,padding:"2px 7px",fontSize:8,color:"#4A9ECA"}}>{c}</code>
              </div>
            ))}
          </div>
        </details>

        {/* ── MIDI Setup ── */}
        <details style={{background:"#0b0b0b",border:"1px solid #161616",borderRadius:8}}>
          <summary style={{padding:"9px 13px",cursor:"pointer",fontSize:8,color:"#202020",letterSpacing:2,userSelect:"none",listStyle:"none"}}>▸ MIDI SETUP — T-1 MASTER</summary>
          <div style={{padding:"4px 13px 13px",display:"flex",flexDirection:"column",gap:7}}>
            {[
              ["Config T-1 master",  "T-1 MIDI Out → Hydra MIDI In → Hydra MIDI Thru → S-4 MIDI In"],
              ["Clock / Transport",  "T-1 = master clock + Start/Stop. Hydra Clock Sync=MIDI In. S-4 : SYNC IN=ON, START/STOP=ON"],
              ["Canaux",             "Ch.1 = Hydrasynth  ·  Ch.2–4 = S-4 tracks"],
              ["Config PolyBrute",   "PB MIDI Out → Hydra → S-4. S-4 sur Ch.16 pour éviter collisions notes PB"],
              ["Ableton Link",       "T-1 via WiFi. Bitwig : laisser tempo inactif. [PLAY] orange = Link actif"],
              ["Hydra MIDI Thru",    "Relaie uniquement le MIDI In physique — pas l'USB. Bitwig USB → Hydra Thru → S-4 ne passe PAS le transport"],
              ["Bitwig Record",      "Global Record clignote = pré-armé. [PLAY] T-1 → transport + record démarrent simultanément"],
            ].map(({0:t,1:v},i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",borderBottom:"1px solid #0f0f0f",paddingBottom:6}}>
                <span style={{color:"#2e2e2e",fontSize:8,minWidth:120,flexShrink:0,paddingTop:1}}>{t}</span>
                <span style={{color:"#484848",fontSize:9,lineHeight:1.65}}>{v}</span>
              </div>
            ))}
          </div>
        </details>

      </div>
    </div>
  );
}
