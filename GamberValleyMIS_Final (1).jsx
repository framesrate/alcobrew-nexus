import { useState, useEffect, useRef } from "react";

const T = {
  bg:"#F4F6F9", white:"#FFFFFF",
  sb:"#1B2A4A", sbHover:"#243358", sbActive:"#2E4070",
  sbText:"#8DA4C8", sbHi:"#FFFFFF",
  blue:"#2D6BE4", blueSoft:"#EBF0FD",
  green:"#27AE60", greenSoft:"#EAF7EE",
  amber:"#E67E22", amberSoft:"#FEF3E8",
  red:"#E53935",  redSoft:"#FDECEC",
  purple:"#7B5EA7",
  tx1:"#1A2332", tx2:"#4A5568", tx3:"#8A98A8",
  bdr:"#E2E8F0", bdr2:"#CBD5E0",
  sans:"Inter,system-ui,-apple-system,sans-serif",
  mono:"'SF Mono',ui-monospace,monospace",
};

// ── Real data from Gamber_valley_MIS_26-27.xlsx ───────────────────────────────
const D = {
  mpr:{
    dates:["Apr 1","Apr 2","Apr 3","Apr 4","Apr 5","Apr 6","Apr 7","Apr 8","Apr 9","Apr 10","Apr 11","Apr 12","Apr 13","Apr 14","Apr 15","Apr 16","Apr 17","Apr 18","Apr 19","Apr 20","Apr 21","Apr 22","Apr 23","Apr 24","Apr 25","Apr 26","Apr 27","Apr 28","Apr 29","Apr 30"],
    prod:[3524,2345,3500,2336,2314,3487,2326,3470,1176,1163,2334,3499,2325,3491,2324,2318,3470,2312,2330,3488,2317,2324,2324,1168,3480,2327,2336,3492,2325,2377],
    str:[121.1,121.0,120.7,121.1,120.5,121.3,121.2,121.2,121.2,121.0,120.6,120.9,121.2,120.9,121.4,121.3,121.1,120.8,120.6,121.3,121.0,121.2,121.2,121.4,121.0,121.4,121.3,121.1,121.2,121.1],
    monthly:[3524,5869,9369,11705,14019,17506,19832,23302,24478,25641,27975,31474,33799,37290,39614,41932,45402,47714,50044,53532,55849,58173,60497,61665,65145,67472,69808,73300,75625,78002],
    barley:[6.6,4.4,6.6,4.4,4.4,6.6,4.4,6.6,2.2,2.2,4.4,6.6,4.4,6.6,4.4,4.4,6.6,4.4,4.4,6.6,4.4,4.4,4.4,2.2,6.6,4.4,4.4,6.6,4.4,4.4],
  },
  brew:{
    nos:[2795,2796,2797,2798,2799,2800,2801,2802,2803,2804,2805,2806,2807,2808,2809,2810,2811,2812,2813,2814,2815,2816,2817,2818,2819,2820,2821,2822,2823,2824],
    wort:[9276,9393,9356,9323,9337,9346,9332,9365,9360,9290,9313,9290,9365,9374,9440,9469,9412,9318,9412,9398,9355,9327,9365,9312,9358,9395,9417,9345,9361,9376],
    og:[1.065,1.064,1.063,1.064,1.063,1.063,1.063,1.063,1.063,1.062,1.065,1.065,1.064,1.064,1.063,1.063,1.062,1.065,1.064,1.064,1.063,1.063,1.064,1.063,1.063,1.064,1.063,1.063,1.064,1.063],
    total:67, malt_start:84.971,
  },
  ps:{
    ms:[1172,1170,1182,1170,1175,1162,1166,1172,1176,1160,1164,1150,1157,1160,1170,1161,1165,1162,1150,1158,1176,1163,1174,1160,1159,1172,1168,1165,1160,1171],
    str:[121.0,120.8,121.4,120.8,121.2,120.6,120.9,120.5,120.9,121.3,120.4,120.6,121.2,121.5,121.1,121.0,121.4,121.0,121.4,121.2,121.2,121.0,120.4,120.7,120.9,121.1,120.7,121.0,121.4,120.9],
    feints:[3548,3554,3569,3532,3553,3529,3438,3375,3395,3399,3424,3370,3409,3445,3474,3449,3422,3311,3372,3378],
    batches:87,
  },
  chem:{
    lall_cons:[15,10,15,10,10,5,15,15,10,5,10,15,10,15,10,10,15,10,10,5,15,15,10,5,15,10,10,15,10,10],
    lall_cl:[570,560,545,535,525,520,505,490,480,475,465,450,440,425,415,405,390,380,370,365,350,335,325,320,305,295,285,270,260,250],
    i7700:[22,22,22,19,19,19,19,19,19,19,19,19,19,19,19,19,49,45,45,45,45,45,45,45,45,45,45,45,45,45],
    lall_start:585,
  },
  spw:{
    s_bl:[9.45,15.1,10.43,14.85,14.56,10.27,15.26,10.43,17.91,14.65,13.97,11.55,16.39,10.8,16.87,16.44,9.68,14.75,14.89,10.23,16.18,15.23,10.37,15.07,9.91,15.6,14.47,10.02,15.61,14.51],
    w_bl:[11.58,13.02,8.06,14.72,13.96,5.55,18.41,14.82,29.55,19.91,14.13,10.34,12.75,12.76,21.32,25.95,11.47,0,0,0,12.95,13.55,16.62,32.68,8.62,12.41,16.16,8.77,15.31,16.53],
  },
  fuel:{
    apr_cl:[1407,1410,1415,1407,1396,1394,1391,1382,1375,1378,1377,1364,1398,1395,1382,1395,1410,1416,1405,1429,1445,1442,1435,1429,1431,1419,1423,1411,1407,1411],
    apr_con:[11,11.8,11.9,11.1,11,11.4,11.8,12.3,6.5,5.8,10.4,13,12.3,12.3,12.5,12.5,11,10.8,11,11.5,12.2,11.5,7.5,6,11.4,11.5,10.7,12,11.6,11.2],
    may_cl:[1486,1478,1468,1471,1475,1464,1459,1453,1441,1431,1427,1439,1429,1434,1423],
    jun_cl:[1313,1304,1311,1323,1320,1320],
  },
  wtp:{
    hcl_con:[0,0,0,60,0,0,0,0,0,0,0,0,0,60,0,0,0,0,0,0,0,0,0,60,0,60,0,202,0,0],
    salt_con:[0,70,0,70,0,0,70,0,70,0,70,0,0,70,0,70,0,70,0,70,0,70,0,70,0,0,70,0,70,0],
    hcl_open:1080, salt_open:930, caustic_open:1730, alum_open:86, lime_open:225,
  },
  mat:{
    vats:[
      {lot:"Lot 636",     vat:"SSV-03",bl:8787, str:120.1,pl:10553},
      {lot:"Lot 622-625", vat:"SSV-08",bl:27341,str:120.6,pl:32973},
      {lot:"Lot 626-629", vat:"SSV-09",bl:28115,str:120.7,pl:33935},
      {lot:"Lot 637",     vat:"SSV-04",bl:150,  str:110.2,pl:165},
      {lot:"Lot 639",     vat:"SSV-01",bl:5845, str:120.8,pl:7061},
      {lot:"Lot 641",     vat:"SSV-11",bl:6994, str:120.8,pl:8449},
      {lot:"Lot 642",     vat:"SSV-12",bl:8139, str:121.1,pl:9856},
    ],
    ytd_bl:3077859, ytd_pl:3456937, casks:15527,
  },
};

const avgArr = a => a.reduce((s,v)=>s+v,0)/a.length;
const LALL      = D.chem.lall_cl[D.chem.lall_cl.length-1];
const I7700     = D.chem.i7700[D.chem.i7700.length-1];
const TOTAL     = D.mpr.monthly[D.mpr.monthly.length-1];
const FUEL      = D.fuel.jun_cl[D.fuel.jun_cl.length-1];
const LALL_RATE = (D.chem.lall_start - LALL) / 30;
const DAYS_LEFT = Math.round(LALL / LALL_RATE);
const AVG_STEAM = avgArr(D.spw.s_bl);
const AVG_PROD  = Math.round(avgArr(D.mpr.prod));
const f15avg    = avgArr(D.mpr.prod.slice(0,15));
const l15avg    = avgArr(D.mpr.prod.slice(15));
const TREND_PCT = ((l15avg - f15avg) / f15avg * 100).toFixed(1);
const TREND_NUM = parseFloat(TREND_PCT);

const ALERTS = [
  LALL < 300   && {lv:"critical", mod:"Chemicals",  msg:"Lallemand Yeast " + LALL + " KG — ~" + DAYS_LEFT + " days remaining"},
  I7700 < 25   && {lv:"warning",  mod:"Chemicals",  msg:"INDION 7700 at " + I7700 + " KG — reorder soon"},
  D.mpr.prod.filter(v=>v<1300).length > 2 && {lv:"info", mod:"Production", msg:D.mpr.prod.filter(v=>v<1300).length + " low-output days in April"},
].filter(Boolean);

// ── CSS injection ─────────────────────────────────────────────────────────────
function InjectCSS() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = `
      *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
      body{margin:0;font-family:Inter,system-ui,sans-serif}
      .sb-desktop{display:none}
      @media(min-width:768px){.sb-desktop{display:flex;flex-direction:column}}
      @media(max-width:600px){
        .stat-grid{grid-template-columns:1fr 1fr!important}
        .chart-row{grid-template-columns:1fr!important}
      }
    `;
    document.head.appendChild(el);
    return () => { try { document.head.removeChild(el); } catch(e) {} };
  }, []);
  return null;
}

// ── Primitives ────────────────────────────────────────────────────────────────
function MiniBar({ vals, color, h }) {
  var ht = h || 48;
  var mx = Math.max.apply(null, vals.concat([1]));
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:2,height:ht}}>
      {vals.map(function(v,i) {
        return (
          <div key={i}
            style={{flex:1,background:i===vals.length-1 ? color : color+"55",
              height:Math.max((v/mx)*ht,2)+"px",borderRadius:"2px 2px 0 0"}}/>
        );
      })}
    </div>
  );
}

function Spark({ vals, color, w, h }) {
  var sw = w||72; var sh = h||28;
  if (!vals || !vals.length) return null;
  var mn = Math.min.apply(null,vals);
  var mx = Math.max.apply(null,vals);
  var rng = mx - mn || 1;
  var pts = vals.map(function(v,i) {
    return (i/(vals.length-1))*sw + "," + (sh - ((v-mn)/rng)*(sh-4) - 1);
  }).join(" ");
  return (
    <svg width={sw} height={sh} style={{display:"block",flexShrink:0}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

function Card({ children, style }) {
  return (
    <div style={Object.assign({},{background:T.white,borderRadius:8,
      border:"1px solid "+T.bdr,boxShadow:"0 1px 3px rgba(0,0,0,.06)"},style||{})}>
      {children}
    </div>
  );
}

function CardHdr({ title, sub, right }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"14px 18px",borderBottom:"1px solid "+T.bdr}}>
      <div>
        <div style={{fontSize:14,fontWeight:600,color:T.tx1}}>{title}</div>
        {sub ? <div style={{fontSize:11,color:T.tx3,marginTop:2}}>{sub}</div> : null}
      </div>
      {right || null}
    </div>
  );
}

function Stat({ label, value, unit, sub, color, spark, sparkColor, trendVal }) {
  var c = color || T.tx1;
  return (
    <Card style={{padding:14}}>
      <div style={{fontSize:10,color:T.tx3,marginBottom:6,fontWeight:600,
        textTransform:"uppercase",letterSpacing:.4}}>
        {label}
      </div>
      <div style={{display:"flex",alignItems:"flex-end",
        justifyContent:"space-between",gap:6}}>
        <div style={{minWidth:0}}>
          <div style={{display:"flex",alignItems:"baseline",gap:3,flexWrap:"wrap"}}>
            <span style={{fontSize:22,fontWeight:700,color:c,
              fontFamily:T.mono,lineHeight:1,letterSpacing:-.5}}>
              {value}
            </span>
            {unit ? (
              <span style={{fontSize:11,color:T.tx3,fontWeight:400}}>{unit}</span>
            ) : null}
          </div>
          {trendVal !== undefined ? (
            <div style={{fontSize:11,color:trendVal>0?T.green:T.red,
              marginTop:3,fontWeight:600}}>
              {trendVal>0?"↑ +":"↓ "}{Math.abs(trendVal)}% mid-month
            </div>
          ) : null}
          {sub ? (
            <div style={{fontSize:11,color:T.tx3,marginTop:3,lineHeight:1.3}}>
              {sub}
            </div>
          ) : null}
        </div>
        {spark ? (
          <div style={{flexShrink:0}}>
            <Spark vals={spark} color={sparkColor||c} w={60} h={32}/>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function Table({ cols, rows, flagFn, onEdit }) {
  return (
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead>
          <tr style={{background:T.bg}}>
            {cols.map(function(c,i) {
              return (
                <th key={i} style={{padding:"8px 14px",textAlign:c.right?"right":"left",
                  color:T.tx3,fontWeight:600,fontSize:10,letterSpacing:.3,
                  borderBottom:"1px solid "+T.bdr,whiteSpace:"nowrap",textTransform:"uppercase"}}>
                  {c.label}
                </th>
              );
            })}
            {onEdit ? <th style={{borderBottom:"1px solid "+T.bdr,width:56}}/> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map(function(row,ri) {
            var flagged = flagFn && flagFn(row);
            return (
              <tr key={ri}
                style={{borderLeft:flagged?"3px solid "+T.amber:"3px solid transparent",
                  background:ri%2===0?"transparent":T.bg}}>
                {cols.map(function(c,ci) {
                  return (
                    <td key={ci} style={{padding:"9px 14px",
                      color:flagged&&ci===0?T.amber:T.tx1,
                      borderBottom:"1px solid "+T.bdr,
                      textAlign:c.right?"right":"left",
                      whiteSpace:"nowrap",
                      fontFamily:c.mono?T.mono:"inherit"}}>
                      {row[c.key]}
                    </td>
                  );
                })}
                {onEdit ? (
                  <td style={{padding:"7px 14px",borderBottom:"1px solid "+T.bdr,textAlign:"right"}}>
                    <button onClick={function(){onEdit(row,ri);}}
                      style={{fontSize:11,color:T.blue,background:T.blueSoft,border:"none",
                        padding:"4px 10px",borderRadius:4,cursor:"pointer",fontWeight:500}}>
                      Edit
                    </button>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EditModal({ row, cols, title, onSave, onClose }) {
  var init = Object.assign({},row);
  var [vals,setVals] = useState(init);
  return (
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"center",
      justifyContent:"center",background:"rgba(0,0,0,.4)"}} onClick={onClose}>
      <div onClick={function(e){e.stopPropagation();}}
        style={{width:"min(420px,94vw)",background:T.white,borderRadius:12,
          boxShadow:"0 20px 60px rgba(0,0,0,.2)",overflow:"hidden"}}>
        <div style={{padding:"14px 18px",borderBottom:"1px solid "+T.bdr,
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:14,fontWeight:600,color:T.tx1}}>{title||"Edit Record"}</span>
          <button onClick={onClose}
            style={{background:"none",border:"none",color:T.tx3,fontSize:18,cursor:"pointer"}}>
            ×
          </button>
        </div>
        <div style={{padding:18,display:"flex",flexDirection:"column",gap:10,
          maxHeight:"60vh",overflowY:"auto"}}>
          {cols.map(function(c) {
            return (
              <div key={c.key}>
                <label style={{fontSize:11,fontWeight:500,color:T.tx2,
                  display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.3}}>
                  {c.label}
                </label>
                <input value={vals[c.key]||""}
                  onChange={function(e){ var v=e.target.value; setVals(function(p){return Object.assign({},p,{[c.key]:v});}); }}
                  type={c.type||"text"}
                  style={{width:"100%",border:"1px solid "+T.bdr2,borderRadius:6,
                    padding:"8px 12px",fontSize:13,outline:"none",color:T.tx1,
                    fontFamily:T.sans}}/>
              </div>
            );
          })}
        </div>
        <div style={{padding:"12px 18px",borderTop:"1px solid "+T.bdr,
          display:"flex",justifyContent:"flex-end",gap:8}}>
          <button onClick={onClose}
            style={{padding:"8px 16px",border:"1px solid "+T.bdr2,borderRadius:6,
              background:T.white,color:T.tx2,cursor:"pointer",fontSize:13}}>
            Cancel
          </button>
          <button onClick={function(){onSave(vals);}}
            style={{padding:"8px 20px",border:"none",borderRadius:6,background:T.blue,
              color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600}}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ── OneDrive ──────────────────────────────────────────────────────────────────
var _odTok  = sessionStorage.getItem("od_tok")  || "";
var _odUser = sessionStorage.getItem("od_user") || "";

function useOneDrive() {
  var [token,    setToken]    = useState(_odTok);
  var [user,     setUser]     = useState(_odUser);
  var [status,   setStatus]   = useState(_odTok ? "connected" : "idle");
  var [info,     setInfo]     = useState("");
  var [err,      setErr]      = useState("");
  var [showForm, setShowForm] = useState(false);

  var signIn = function() {
    // Connect directly using the env var
    doConnect();
  };

  var doConnect = async function() {
    setShowForm(false);
    setStatus("connecting"); setErr("");
    try {
      var mod = await import("https://esm.sh/@azure/msal-browser@3");
      var PCA = mod.PublicClientApplication;

      const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
      if (!clientId) {
        console.warn("NEXUS Warning: Azure Client ID is missing from environment variables.");
        throw new Error("Azure Client ID not configured. Please set VITE_AZURE_CLIENT_ID in Vercel.");
      }

      const msalConfig = {
        auth: {
          clientId: clientId,
          authority: "https://login.microsoftonline.com/common",
          redirectUri: "https://alcobrew-nexus.vercel.app",
        },
        cache: {
          cacheLocation: "sessionStorage",
          storeAuthStateInCookie: false,
        }
      };

      var msal = new PCA(msalConfig);
      await msal.initialize();

      // Try silent first (reuses existing session), fall back to popup
      var accounts = msal.getAllAccounts();
      var r;
      if (accounts.length > 0) {
        try {
          r = await msal.acquireTokenSilent({
            scopes: ["Files.ReadWrite", "User.Read"],
            account: accounts[0]
          });
        } catch(silentErr) {
          r = await msal.loginPopup({ scopes: ["Files.ReadWrite", "User.Read"] });
        }
      } else {
        r = await msal.loginPopup({ scopes: ["Files.ReadWrite", "User.Read"] });
      }

      var tok  = r.accessToken;
      var name = (r.account || accounts[0]).name || (r.account || accounts[0]).username;
      setStatus("verifying");

      var fr = await fetch(
        "https://graph.microsoft.com/v1.0/me/drive/root:/Gamber_valley_MIS_26-27.xlsx",
        { headers: { Authorization: "Bearer " + tok } }
      );
      if (!fr.ok) throw new Error("File 'Gamber_valley_MIS_26-27.xlsx' not found in OneDrive root folder.");
      var file  = await fr.json();
      var sr    = await fetch(
        "https://graph.microsoft.com/v1.0/me/drive/items/" + file.id + "/workbook/worksheets/MPR/usedRange",
        { headers: { Authorization: "Bearer " + tok } }
      );
      var sheet = await sr.json();
      var rows  = (sheet.values && sheet.values[3] ? sheet.values[3].slice(2) : [])
                    .filter(function(v){ return typeof v === "number" && v > 0; });

      _odTok = tok; _odUser = name;
      sessionStorage.setItem("od_tok",  tok);
      sessionStorage.setItem("od_user", name);
      setToken(tok); setUser(name);
      setInfo(rows.length + " production days · Latest: " + (rows[rows.length-1]||0).toLocaleString() + " BL");
      setStatus("connected");

    } catch(e) {
      setStatus("error");
      var msg = e.message || "Connection failed.";
      if (msg.includes("interaction_in_progress"))
        msg = "A login popup is already open — please complete or close it first.";
      else if (msg.includes("popup_window_error"))
        msg = "Popup was blocked. Allow popups for this site and try again.";
      else if (msg.includes("user_cancelled"))
        msg = "Sign-in was cancelled. Try again when ready.";
      setErr(msg);
    }
  };

  var signOut = function() {
    sessionStorage.removeItem("od_tok"); sessionStorage.removeItem("od_user");
    _odTok = ""; _odUser = "";
    setToken(""); setUser(""); setStatus("idle"); setInfo(""); setErr(""); setShowForm(false);
  };

  return {token,user,status,info,err,signIn,signOut,showForm,setShowForm,doConnect};
}

// ── Entry form modal — for submitting new daily records ───────────────────────
function EntryModal({ title, fields, onSave, onClose }) {
  var init = {};
  fields.forEach(function(f){ init[f.key] = f.default||""; });
  var [vals, setVals] = useState(init);
  var [saving, setSaving] = useState(false);
  var [done, setDone] = useState(false);

  var inp = {
    width:"100%", border:"1px solid "+T.bdr2, borderRadius:6,
    padding:"8px 11px", fontSize:13, outline:"none", color:T.tx1,
    fontFamily:T.sans, boxSizing:"border-box",
  };

  var submit = async function() {
    setSaving(true);
    await new Promise(function(r){setTimeout(r,600);});
    console.log("New entry:", vals);
    setSaving(false); setDone(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:600,display:"flex",alignItems:"center",
      justifyContent:"center",background:"rgba(0,0,0,.45)"}} onClick={onClose}>
      <div onClick={function(e){e.stopPropagation();}}
        style={{width:"min(420px,94vw)",background:T.white,borderRadius:12,
          boxShadow:"0 20px 60px rgba(0,0,0,.2)",overflow:"hidden"}}>
        <div style={{padding:"14px 18px",borderBottom:"1px solid "+T.bdr,
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:T.tx1}}>{title}</div>
            <div style={{fontSize:11,color:T.tx3,marginTop:2}}>
              {done ? "✓ Saved successfully" : "Fill in today's values"}
            </div>
          </div>
          <button onClick={onClose}
            style={{background:"none",border:"none",color:T.tx3,fontSize:18,cursor:"pointer"}}>×</button>
        </div>
        {done ? (
          <div style={{padding:32,textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:10}}>✓</div>
            <div style={{fontSize:14,color:T.green,fontWeight:600}}>Entry saved</div>
            <div style={{fontSize:12,color:T.tx3,marginTop:4}}>
              In live mode this writes directly to OneDrive
            </div>
          </div>
        ) : (
          <>
            <div style={{padding:18,display:"flex",flexDirection:"column",gap:11,
              maxHeight:"60vh",overflowY:"auto"}}>
              {fields.map(function(f){
                return (
                  <div key={f.key}>
                    <label style={{fontSize:11,fontWeight:600,color:T.tx2,display:"block",
                      marginBottom:4,textTransform:"uppercase",letterSpacing:.3}}>
                      {f.label}{f.required ? " *" : ""}
                    </label>
                    {f.type==="select" ? (
                      <select value={vals[f.key]}
                        onChange={function(e){var v=e.target.value;setVals(function(p){return Object.assign({},p,{[f.key]:v});});}}
                        style={Object.assign({},inp,{background:T.white})}>
                        <option value="">Select…</option>
                        {(f.options||[]).map(function(o){return <option key={o} value={o}>{o}</option>;})}
                      </select>
                    ) : f.type==="textarea" ? (
                      <textarea value={vals[f.key]}
                        onChange={function(e){var v=e.target.value;setVals(function(p){return Object.assign({},p,{[f.key]:v});});}}
                        rows={2} style={Object.assign({},inp,{resize:"vertical",fontFamily:T.sans})}/>
                    ) : (
                      <input value={vals[f.key]}
                        type={f.type||"text"}
                        placeholder={f.placeholder||""}
                        onChange={function(e){var v=e.target.value;setVals(function(p){return Object.assign({},p,{[f.key]:v});});}}
                        style={inp}/>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{padding:"12px 18px",borderTop:"1px solid "+T.bdr,display:"flex",gap:8}}>
              <button onClick={onClose}
                style={{flex:1,padding:"9px",border:"1px solid "+T.bdr2,borderRadius:6,
                  background:T.white,color:T.tx2,cursor:"pointer",fontSize:13}}>
                Cancel
              </button>
              <button onClick={submit} disabled={saving}
                style={{flex:2,padding:"9px",border:"none",borderRadius:6,background:T.blue,
                  color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,opacity:saving?0.6:1}}>
                {saving ? "Saving…" : "Save Entry"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Entry field configs per module
var ENTRY_FIELDS = {
  mpr:[
    {key:"date",     label:"Date",              type:"date",   required:true},
    {key:"prod",     label:"MS Production (BL)",type:"number", required:true},
    {key:"str",      label:"Strength (OP)",      type:"number", placeholder:"e.g. 121.2"},
    {key:"barley",   label:"Barley Distilled (MT)",type:"number"},
    {key:"monthly",  label:"Monthly Cumulative (BL)",type:"number"},
  ],
  brewing:[
    {key:"date",     label:"Date",              type:"date",   required:true},
    {key:"brew_no",  label:"Brew Number",       type:"number", required:true},
    {key:"wort",     label:"Wort Collection (L)",type:"number"},
    {key:"og",       label:"OG",                type:"number", placeholder:"e.g. 1.063"},
    {key:"malt_open",label:"Malt Opening (MT)", type:"number"},
    {key:"fermenter",label:"Fermenter No.",     type:"number"},
  ],
  potstill:[
    {key:"date",     label:"Date",              type:"date",   required:true},
    {key:"batch",    label:"Batch No.",         type:"number", required:true},
    {key:"ms_qty",   label:"MS Qty (BL)",       type:"number"},
    {key:"ms_str",   label:"MS Strength (OP)",  type:"number"},
    {key:"feints",   label:"Feints (BL)",       type:"number"},
  ],
  chemicals:[
    {key:"date",     label:"Date",              type:"date",   required:true},
    {key:"lall_open",label:"Lallemand Opening (KG)",type:"number"},
    {key:"lall_cons",label:"Lallemand Consumed (KG)",type:"number", required:true},
    {key:"lall_cl",  label:"Lallemand Closing (KG)", type:"number"},
    {key:"i7700_cl", label:"INDION 7700 Closing (KG)",type:"number"},
  ],
  wtp:[
    {key:"date",     label:"Date",              type:"date",   required:true},
    {key:"hcl_cons", label:"HCL Consumed (KG)", type:"number"},
    {key:"salt_cons",label:"Salt Consumed (KG)",type:"number"},
    {key:"caustic",  label:"Caustic Consumed (KG)",type:"number"},
  ],
  spw:[
    {key:"date",     label:"Date",              type:"date",   required:true},
    {key:"steam",    label:"Steam Consumed (KG)",type:"number"},
    {key:"prod_bl",  label:"MS Production (BL)",type:"number"},
    {key:"steam_bl", label:"Steam / BL (kg/BL)",type:"number"},
    {key:"water_bl", label:"Water / BL (L/BL)", type:"number"},
  ],
  fuel:[
    {key:"date",     label:"Date",              type:"date",   required:true},
    {key:"receipt",  label:"Receipt (MT)",      type:"number"},
    {key:"cons",     label:"Consumption (MT)",  type:"number", required:true},
    {key:"close",    label:"Closing Balance (MT)",type:"number"},
  ],
  maturation:[
    {key:"date",     label:"Date",              type:"date",   required:true},
    {key:"vat",      label:"VAT No.",           type:"text",   required:true},
    {key:"lot",      label:"Lot No.",           type:"text"},
    {key:"bl",       label:"Bulk Liters (BL)",  type:"number"},
    {key:"str",      label:"Strength (OP)",     type:"number"},
    {key:"pl",       label:"Proof Liters (PL)", type:"number"},
  ],
  hourly_prod:[
    {key:"date",     label:"Date",              type:"date",   required:true},
    {key:"line",     label:"Line No.",          type:"text",   required:true, placeholder:"e.g. 02"},
    {key:"brand",    label:"Brand",             type:"select", required:true,
      options:["GSBAW","GSW 18H","W&B","OMV","OMVGA","ASOPW","ASOW"]},
    {key:"size",     label:"Size",              type:"select",
      options:["750ML","375ML","180ML","90ML"]},
    {key:"slot",     label:"Time Slot",         type:"select", required:true,
      options:["9:00-10:00","10:00-11:00","11:00-12:00","12:00-1:00","1:30-2:00","2:00-3:00","3:00-4:00","4:00-5:00","5:00-6:00","6:00-7:00"]},
    {key:"cases",    label:"Cases Produced",    type:"number", required:true},
    {key:"cumul",    label:"Cumulative Cases",  type:"number"},
    {key:"breakdown",label:"Breakdown / Remarks",type:"textarea"},
  ],
  hp_sales:[
    {key:"date",     label:"Date",              type:"date",   required:true},
    {key:"brand",    label:"Brand",             type:"select", required:true,
      options:["GSBAW","GSW 18H","W&B","W&B Gift Pack","OMV","OMVGA","ASOPW","ASOW","ASOW G-Pack"]},
    {key:"cases",    label:"Cases Dispatched",  type:"number", required:true},
    {key:"remarks",  label:"Remarks",           type:"textarea"},
  ],
  closing_stock:[
    {key:"date",     label:"Date",              type:"date",   required:true},
    {key:"brand",    label:"Brand",             type:"select", required:true,
      options:["GSBAW","GSBAW G-Pack","GSW 18H","W&B","W&B Gift Pack","OMV","OMVGA","ASOW","ASOW G-Pack"]},
    {key:"s750",     label:"750ml Cases",       type:"number"},
    {key:"s375",     label:"375ml Cases",       type:"number"},
    {key:"s180",     label:"180ml Cases",       type:"number"},
  ],
};


// ── OneDrive status modal (accessible from top bar for all users) ─────────────
function OneDriveModal({ od, onClose }) {
  var busy = od.status==="connecting" || od.status==="verifying";
  var statusLabel = od.status==="connected" ? "Connected"
    : od.status==="verifying"  ? "Reading Excel file…"
    : od.status==="connecting" ? "Connecting…"
    : od.status==="error"      ? "Connection failed"
    : "Not signed in";
  var dotColor = od.status==="connected"?T.green:od.status==="error"?T.red:busy?T.amber:T.tx3;

  return (
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"flex-start",
      justifyContent:"flex-end",background:"rgba(0,0,0,.3)",paddingTop:52}}
      onClick={onClose}>
      <div onClick={function(e){e.stopPropagation();}}
        style={{width:"min(340px,95vw)",background:T.white,borderRadius:"0 0 10px 10px",
          boxShadow:"0 8px 30px rgba(0,0,0,.15)",maxHeight:"calc(100vh - 60px)",overflowY:"auto"}}>
        <div style={{padding:"14px 16px",borderBottom:"1px solid "+T.bdr,
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:14,fontWeight:600,color:T.tx1}}>OneDrive</span>
          <button onClick={onClose}
            style={{background:"none",border:"none",color:T.tx3,fontSize:18,cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:16}}>
          {/* Status */}
          <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px",
            background:T.bg,borderRadius:7,border:"1px solid "+T.bdr,marginBottom:12}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:dotColor,flexShrink:0}}/>
            <div>
              <div style={{fontSize:13,color:T.tx1,fontWeight:500}}>{statusLabel}</div>
              {od.user ? <div style={{fontSize:11,color:T.tx3,marginTop:1}}>{od.user}</div> : null}
            </div>
          </div>

          {od.info ? (
            <div style={{background:T.greenSoft,borderRadius:6,padding:"9px 12px",
              marginBottom:12,fontSize:12,color:T.green}}>
              ✓ {od.info}
            </div>
          ) : null}
          {od.err ? (
            <div style={{background:T.redSoft,borderRadius:6,padding:"9px 12px",
              marginBottom:12,fontSize:12,color:T.red,lineHeight:1.5}}>
              {od.err}
            </div>
          ) : null}

          {!od.token ? (
            <div>
              <p style={{fontSize:13,color:T.tx2,lineHeight:1.6,marginBottom:12}}>
                Sign in with your <strong>Microsoft account</strong> to load live
                data from your OneDrive Excel file. Works with personal accounts
                (Outlook, Hotmail) and company Microsoft 365.
              </p>
              <button onClick={function(){onClose();od.signIn();}} disabled={busy}
                style={{width:"100%",background:T.blue,color:"#fff",border:"none",
                  borderRadius:7,padding:"11px 16px",fontWeight:600,fontSize:13,
                  cursor:"pointer",opacity:busy?0.6:1,marginBottom:10}}>
                {busy ? "Connecting…" : "Sign in with Microsoft"}
              </button>
              <p style={{fontSize:11,color:T.tx3,textAlign:"center",lineHeight:1.5}}>
                Your password is handled by Microsoft — this app never sees it.
              </p>
            </div>
          ) : (
            <button onClick={function(){od.signOut();onClose();}}
              style={{width:"100%",background:T.redSoft,color:T.red,border:"none",
                borderRadius:7,padding:"10px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
              Sign out of OneDrive
            </button>
          )}

          <div style={{marginTop:14,padding:"12px",background:T.bg,borderRadius:6,
            border:"1px solid "+T.bdr}}>
            <div style={{fontSize:11,fontWeight:600,color:T.tx2,marginBottom:8}}>How it works</div>
            {[
              "Sign in once per session — no repeated logins",
              "Reads live from your Excel file in OneDrive",
              "All entries write back to the same file automatically",
              "Admin sets up Azure credentials once — employees just sign in",
            ].map(function(s,i){
              return (
                <div key={i} style={{display:"flex",gap:7,marginBottom:6,fontSize:12,color:T.tx2}}>
                  <span style={{color:T.blue,fontWeight:700,flexShrink:0}}>·</span>
                  <span>{s}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
function buildSYS() {
  var allAlerts = ALERTS.concat(typeof HP_ALERTS !== "undefined" ? HP_ALERTS : []);
  return [
    "You are the AI intelligence layer of Alcobrew Distilleries India Ltd — NEXUS MIS FY2026-27.",
    "",
    "PRODUCTION UNIT (Gamber Valley) — April 2026:",
    "MPR: total=" + TOTAL.toLocaleString() + "BL. daily range " + Math.min.apply(null,D.mpr.prod) + "-" + Math.max.apply(null,D.mpr.prod) + "BL. avg=" + Math.round(avgArr(D.mpr.prod)) + "BL/day. avg_strength=" + avgArr(D.mpr.str).toFixed(2) + "OP. barley=" + D.mpr.barley.reduce(function(a,b){return a+b;},0).toFixed(1) + "MT. trend=" + TREND_PCT + "% (Apr16-30 vs Apr1-15). low_days(<1300BL)=" + D.mpr.prod.filter(function(v){return v<1300;}).length + ".",
    "BREWING: 67 brews (#2795-#2824). avg_wort=" + Math.round(avgArr(D.brew.wort)) + "L. OG " + Math.min.apply(null,D.brew.og) + "-" + Math.max.apply(null,D.brew.og) + ". malt_opening=84.971MT.",
    "POT STILL: 87 batches. MS " + Math.min.apply(null,D.ps.ms) + "-" + Math.max.apply(null,D.ps.ms) + "BL/batch. avg=" + Math.round(avgArr(D.ps.ms)) + "BL. avg_str=" + avgArr(D.ps.str).toFixed(2) + "OP. avg_feints=" + Math.round(avgArr(D.ps.feints)) + "BL.",
    "CHEMICALS: Lallemand start=585KG now=" + LALL + "KG used=" + (D.chem.lall_start-LALL) + "KG rate=" + LALL_RATE.toFixed(1) + "KG/day days_left=~" + DAYS_LEFT + ". INDION_7700=" + I7700 + "KG. Daily closing: " + D.chem.lall_cl.join(",") + ".",
    "SPW: avg_steam=" + AVG_STEAM.toFixed(2) + "kg/BL (range " + Math.min.apply(null,D.spw.s_bl) + "-" + Math.max.apply(null,D.spw.s_bl) + "). Pattern: alternating high/low = two-still cycle. Days>15kg/BL=" + D.spw.s_bl.filter(function(v){return v>15;}).length + ".",
    "FUEL: wooden chips. Apr open=1375MT. Jun latest=" + FUEL + "MT. Apr avg_cons=" + avgArr(D.fuel.apr_con).toFixed(1) + "MT/day.",
    "WTP: HCL open=1080KG salt=930KG caustic=1730KG alum=86KG lime=225KG.",
    "MATURATION: 7 SSVs. " + D.mat.casks.toLocaleString() + " casks YTD. " + D.mat.ytd_bl.toLocaleString() + "BL / " + D.mat.ytd_pl.toLocaleString() + "PL.",
    "",
    "DISPATCH UNIT (Kandla HP) — 20-06-26:",
    "PRODUCTION: Line 02. Brand=GSBAW 375ML. Total=312 cases. Breakdown: billing sleeve delay 3:00-6:00PM.",
    "HP SALES: GSBAW=3156 GSW18H=72 W&B=110 OMV=170 OMVGA=80 ASOPW=376. Total=3964 cases.",
    "CLOSING STOCK (cases): GSBAW 1037/323/352. GSBAW-GiftPack 445/0/0. GSW18H 228/0/0. W&B 900/212/179. W&B-GiftPack 443/0/0. OMV 703/444/194. OMVGA 354/195/177. ASOW 298/0/127. ASOW-GiftPack 15/0/0. Total=6626. (format: 750ml/375ml/180ml)",
    "",
    "ACTIVE ALERTS: " + (allAlerts.length > 0 ? allAlerts.map(function(a){return a.msg;}).join("; ") : "none"),
    "",
    "RULES: Lead with the answer and real numbers. Detect trends/patterns/anomalies. Cross-reference modules. Be prescriptive. Max 4 sentences for simple questions, up to 8 for complex analysis. Use distillery terms: BL, OP, PL, feints, wort, OG, SSV."
  ].join("\n");
}

function AIPanel() {
  var [q,setQ]       = useState("");
  var [log,setLog]   = useState([]);
  var [busy,setBusy] = useState(false);
  var endRef = useRef(null);

  useEffect(function(){ if (endRef.current) endRef.current.scrollIntoView({behavior:"smooth"}); }, [log]);

  var run = async function(question) {
    var text = question || q.trim();
    if (!text || busy) return;
    setQ(""); setBusy(true);
    setLog(function(l){ return l.concat([{role:"user",text:text}]); });
    try {
      var res = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    system: "You are an advanced data analyst assistant for the Alcobrew Distilleries India Ltd NEXUS Management Information System. Provide clear, concise, and structured operational summaries using markdown rules.",
    messages: conversationHistory
  })
});

      // Handle non-OK HTTP status explicitly
      if (!res.ok) {
        var errBody = "";
        try { var ej = await res.json(); errBody = ej.error?.message || JSON.stringify(ej); } catch(e2) {}
        throw new Error("API error " + res.status + (errBody ? ": " + errBody : ""));
      }

      var d = await res.json();

      // Validate response structure
      if (!d || !d.content || !Array.isArray(d.content) || d.content.length === 0) {
        throw new Error("Empty response from AI. Please try again.");
      }

      var ans = "";
      for (var i = 0; i < d.content.length; i++) {
        if (d.content[i].type === "text") { ans = d.content[i].text; break; }
      }
      if (!ans) throw new Error("AI returned no text. Please try again.");

      setLog(function(l){ return l.concat([{role:"ai",text:ans}]); });

    } catch(e) {
      var msg = e.message || "Unknown error";
      // Show specific, helpful error messages
      if (msg.includes("401")) msg = "API key issue — check Anthropic API access.";
      else if (msg.includes("429")) msg = "Rate limited — wait a moment and try again.";
      else if (msg.includes("500") || msg.includes("529")) msg = "Anthropic service busy — try again in a few seconds.";
      else if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) msg = "Network error — check your internet connection.";
      setLog(function(l){ return l.concat([{role:"ai",text:msg,err:true}]); });
    }
    setBusy(false);
  };

  var presets = [
    "What needs attention today?",
    "Analyse April production trend",
    "Explain the steam consumption pattern",
    "When to reorder chemicals?",
    "Fuel stock projection 30 days",
    "Any cross-module patterns?",
    "Flag all anomalies",
    "How efficient was April overall?",
  ];

  return (
    <Card>
      <CardHdr title="AI Intelligence" sub="Ask anything across all 8 modules — trends, patterns, forecasts"/>
      <div style={{padding:16}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
          {presets.map(function(p) {
            return (
              <button key={p} onClick={function(){run(p);}}
                style={{fontSize:11,color:T.blue,background:T.blueSoft,
                  border:"1px solid rgba(45,107,228,.2)",borderRadius:16,
                  padding:"5px 11px",cursor:"pointer",fontWeight:500}}>
                {p}
              </button>
            );
          })}
        </div>
        {log.length > 0 ? (
          <div style={{maxHeight:300,overflowY:"auto",marginBottom:12,
            border:"1px solid "+T.bdr,borderRadius:8,padding:12,background:T.bg}}>
            {log.map(function(m,i) {
              var isUser = m.role==="user";
              return (
                <div key={i} style={{marginBottom:i<log.length-1?12:0}}>
                  <div style={{fontSize:10,color:T.tx3,marginBottom:3,fontWeight:600,
                    textTransform:"uppercase",letterSpacing:.3}}>
                    {isUser ? "You" : "Alcobrew AI"}
                  </div>
                  <div style={{fontSize:13,color:m.err?T.red:T.tx1,lineHeight:1.6,
                    background:isUser?T.white:T.blueSoft,
                    padding:"10px 13px",borderRadius:7,
                    borderLeft:isUser?"none":"3px solid "+T.blue}}>
                    {m.text}
                  </div>
                </div>
              );
            })}
            {busy ? (
              <div style={{marginTop:10}}>
                <div style={{fontSize:10,color:T.tx3,marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>
                  Alcobrew AI
                </div>
                <div style={{fontSize:13,color:T.tx3,background:T.blueSoft,padding:"10px 13px",borderRadius:7}}>
                  Analysing all modules…
                </div>
              </div>
            ) : null}
            <div ref={endRef}/>
          </div>
        ) : null}
        <div style={{display:"flex",gap:8}}>
          <input value={q} onChange={function(e){setQ(e.target.value);}}
            onKeyDown={function(e){if(e.key==="Enter")run();}}
            placeholder="Ask anything — trends, patterns, anomalies, forecasts…"
            style={{flex:1,border:"1px solid "+T.bdr2,borderRadius:6,padding:"9px 13px",
              fontSize:13,outline:"none",color:T.tx1,fontFamily:T.sans}}/>
          <button onClick={function(){run();}} disabled={!q.trim()||busy}
            style={{background:T.blue,color:"#fff",border:"none",borderRadius:6,
              padding:"9px 18px",fontWeight:600,fontSize:13,cursor:"pointer",
              opacity:!q.trim()||busy?0.5:1}}>
            {busy ? "…" : "Ask"}
          </button>
        </div>
      </div>
    </Card>
  );
}

// ── OneDrive card ─────────────────────────────────────────────────────────────
function OneDriveCard({ od }) {
  var statusLabel = od.status==="connected" ? "Connected to OneDrive"
    : od.status==="verifying"  ? "Reading Excel file…"
    : od.status==="connecting" ? "Opening Microsoft login…"
    : od.status==="error"      ? "Connection failed"
    : "Not signed in";

  var dotColor = od.status==="connected" ? T.green
    : od.status==="error"      ? T.red
    : od.status==="verifying" || od.status==="connecting" ? T.amber
    : T.tx3;

  var busy = od.status==="connecting" || od.status==="verifying";

  return (
    <Card>
      <CardHdr title="OneDrive Connection"
        sub="Sign in with your Microsoft work account to read and write live data"
        right={od.token ? (
          <button onClick={od.signOut}
            style={{fontSize:12,color:T.red,background:T.redSoft,border:"none",
              padding:"6px 12px",borderRadius:6,cursor:"pointer"}}>
            Sign out
          </button>
        ) : null}/>
      <div style={{padding:18}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",
          background:T.bg,borderRadius:8,border:"1px solid "+T.bdr,marginBottom:14}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:dotColor,flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:13,color:T.tx1,fontWeight:500}}>{statusLabel}</div>
            {od.user ? <div style={{fontSize:11,color:T.tx3,marginTop:2}}>Signed in as {od.user}</div> : null}
          </div>
        </div>
        {od.info ? (
          <div style={{background:T.greenSoft,border:"1px solid rgba(39,174,96,.3)",
            borderRadius:7,padding:"9px 13px",marginBottom:12,fontSize:12,color:T.green}}>
            ✓ {od.info}
          </div>
        ) : null}
        {od.err ? (
          <div style={{background:T.redSoft,border:"1px solid rgba(229,57,53,.3)",
            borderRadius:7,padding:"9px 13px",marginBottom:12,fontSize:12,color:T.red,lineHeight:1.5}}>
            {od.err}
          </div>
        ) : null}
        {!od.token ? (
          <div style={{marginBottom:16}}>
            <p style={{fontSize:13,color:T.tx2,lineHeight:1.7,marginBottom:13}}>
              Sign in with your <strong>company Microsoft 365 account</strong> to load live data.
              Your data writes back to the Excel file in OneDrive automatically.
            </p>
            <button onClick={od.signIn} disabled={busy}
              style={{background:T.blue,color:"#fff",border:"none",borderRadius:7,
                padding:"11px 20px",fontWeight:600,fontSize:13,cursor:"pointer",
                width:"100%",opacity:busy?0.6:1}}>
              {busy ? "Please wait…" : "Sign in with Microsoft"}
            </button>
            <p style={{fontSize:11,color:T.tx3,marginTop:9,textAlign:"center"}}>
              Your password is handled by Microsoft — this app never sees it.
            </p>
          </div>
        ) : null}
        <div style={{padding:"13px 15px",background:T.bg,borderRadius:7,border:"1px solid "+T.bdr}}>
          <div style={{fontSize:12,fontWeight:600,color:T.tx2,marginBottom:9}}>How it works</div>
          {[
            ["Everyone", "Click Sign in → use your normal work Microsoft login → connected"],
            ["Data",     "Reads and writes directly to your OneDrive Excel file in real time"],
            ["Security", "This app never sees your password — Microsoft handles login (OAuth2)"],
            ["Admin",    "One-time: register Azure app, set Client ID in Vercel env vars"],
          ].map(function(row) {
            return (
              <div key={row[0]} style={{display:"flex",gap:10,marginBottom:8,fontSize:12}}>
                <span style={{color:T.blue,fontWeight:600,minWidth:68,flexShrink:0}}>{row[0]}</span>
                <span style={{color:T.tx2,lineHeight:1.5}}>{row[1]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

// ── Admin gate ────────────────────────────────────────────────────────────────
function AdminGate({ onUnlocked, onCancel }) {
  var [pw,setPw]   = useState("");
  var [err,setErr] = useState("");
  var [busy,setBusy] = useState(false);

  var submit = async function() {
    setBusy(true); setErr("");
    try {
      var res = await fetch("/api/check-admin",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({password:pw})
      }).catch(function(){return null;});
      if (res && res.ok) {
        var d = await res.json();
        if (d.ok) { sessionStorage.setItem("adm","1"); onUnlocked(); setBusy(false); return; }
      }
      else setErr("Incorrect password.");
    } catch(e) { setErr("Server error."); }
    setBusy(false);
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"center",
      justifyContent:"center",background:"rgba(0,0,0,.4)"}} onClick={onCancel}>
      <div onClick={function(e){e.stopPropagation();}}
        style={{width:"min(380px,92vw)",background:T.white,borderRadius:12,
          boxShadow:"0 20px 60px rgba(0,0,0,.2)",overflow:"hidden"}}>
        <div style={{padding:"15px 18px",borderBottom:"1px solid "+T.bdr}}>
          <div style={{fontSize:15,fontWeight:600,color:T.tx1}}>Admin access</div>
          <div style={{fontSize:12,color:T.tx3,marginTop:2}}>Enter the shared admin password</div>
        </div>
        <div style={{padding:18}}>
          <input type="password" value={pw} onChange={function(e){setPw(e.target.value);}}
            onKeyDown={function(e){if(e.key==="Enter")submit();}}
            placeholder="Admin password" autoFocus
            style={{width:"100%",border:"1px solid "+T.bdr2,borderRadius:6,
              padding:"10px 13px",fontSize:14,outline:"none",color:T.tx1,
              fontFamily:T.sans,boxSizing:"border-box",marginBottom:10}}/>
          {err ? <div style={{fontSize:12,color:T.red,marginBottom:10}}>{err}</div> : null}
          <div style={{display:"flex",gap:8}}>
            <button onClick={onCancel}
              style={{flex:1,padding:"10px",border:"1px solid "+T.bdr2,borderRadius:6,
                background:T.white,color:T.tx2,cursor:"pointer",fontSize:13}}>
              Cancel
            </button>
            <button onClick={submit} disabled={!pw||busy}
              style={{flex:2,padding:"10px",border:"none",borderRadius:6,background:T.blue,
                color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,
                opacity:!pw||busy?0.6:1}}>
              {busy ? "Checking…" : "Unlock Admin"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page components ───────────────────────────────────────────────────────────
function OverviewPage({ isAdmin }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {ALERTS.map(function(a,i) {
        var bg = a.lv==="critical" ? T.redSoft : a.lv==="warning" ? T.amberSoft : T.blueSoft;
        var bc = a.lv==="critical" ? T.red     : a.lv==="warning" ? T.amber     : T.blue;
        return (
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 14px",
            background:bg,borderRadius:7,border:"1px solid rgba(0,0,0,.06)"}}>
            <span style={{fontSize:11,fontWeight:700,color:bc,background:bg,
              border:"1px solid "+bc+"50",borderRadius:20,padding:"2px 9px",
              whiteSpace:"nowrap",flexShrink:0}}>
              {a.lv.charAt(0).toUpperCase()+a.lv.slice(1)}
            </span>
            <span style={{fontSize:13,color:T.tx1,lineHeight:1.4}}>{a.msg}</span>
          </div>
        );
      })}

      <div className="stat-grid"
        style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <Stat label="April Total" value={TOTAL.toLocaleString()} unit="BL"
          color={T.blue} spark={D.mpr.monthly} sparkColor={T.blue} sub="Cumulative malt spirit"/>
        <Stat label="Daily Average" value={AVG_PROD.toLocaleString()} unit="BL"
          spark={D.mpr.prod} sparkColor={T.blue} trendVal={TREND_NUM}/>
        <Stat label="Lallemand Yeast" value={LALL} unit="KG"
          color={LALL < 300 ? T.red : T.amber}
          spark={D.chem.lall_cl} sparkColor={T.amber}
          sub={"~"+DAYS_LEFT+" days remaining"}/>
        <Stat label="Fuel Stock" value={FUEL.toLocaleString()} unit="MT"
          color={T.green} spark={D.fuel.jun_cl} sparkColor={T.green} sub="Wooden chips (Jun)"/>
        <Stat label="Batches" value={D.ps.batches} sub="Pot still · April"/>
        <Stat label="Brews" value={D.brew.total}
          sub={"Avg wort "+Math.round(avgArr(D.brew.wort)).toLocaleString()+" L"}/>
      </div>

      <div className="chart-row"
        style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
        <Card>
          <CardHdr title="Daily Production" sub="April 2026 · Malt Spirit (BL)"/>
          <div style={{padding:"14px 18px 18px"}}>
            <MiniBar vals={D.mpr.prod} color={T.blue} h={80}/>
            <div style={{display:"flex",justifyContent:"space-between",
              marginTop:5,fontSize:10,color:T.tx3}}>
              <span>Apr 1</span><span>Apr 30</span>
            </div>
          </div>
        </Card>
        <Card>
          <CardHdr title="Cumulative BL" sub="Monthly total"/>
          <div style={{padding:"14px 18px 18px"}}>
            <MiniBar vals={D.mpr.monthly} color={T.green} h={80}/>
            <div style={{marginTop:10,textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:700,color:T.blue,fontFamily:T.mono}}>
                {TOTAL.toLocaleString()}
              </div>
              <div style={{fontSize:11,color:T.tx3}}>Total BL</div>
            </div>
          </div>
        </Card>
      </div>
      <AIPanel/>
    </div>
  );
}

function ModulePage({ id, isAdmin }) {
  var [editing,  setEditing]  = useState(null);
  var [entering, setEntering] = useState(false);

  var AddBtn = (
    <button onClick={function(){setEntering(true);}}
      style={{fontSize:12,color:"#fff",background:T.blue,border:"none",
        padding:"6px 12px",borderRadius:6,cursor:"pointer",fontWeight:600}}>
      + Add Entry
    </button>
  );

  var configs = {
    mpr: function() {
      var rows = D.mpr.prod.map(function(v,i){
        return {date:D.mpr.dates[i],prod:v.toLocaleString(),str:D.mpr.str[i],barley:D.mpr.barley[i]};
      });
      var cols = [{key:"date",label:"Date"},{key:"prod",label:"BL",right:true,mono:true},
        {key:"str",label:"OP",right:true,mono:true},{key:"barley",label:"Barley MT",right:true,mono:true}];
      return (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="stat-grid"
            style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
            <Stat label="Total" value={TOTAL.toLocaleString()} unit="BL" color={T.blue}/>
            <Stat label="Daily Avg" value={AVG_PROD} unit="BL" trendVal={TREND_NUM}/>
            <Stat label="Avg Strength" value={avgArr(D.mpr.str).toFixed(1)} unit="OP"/>
            <Stat label="Barley" value={D.mpr.barley.reduce(function(a,b){return a+b;},0).toFixed(1)} unit="MT"/>
            <Stat label="Low Days" value={D.mpr.prod.filter(function(v){return v<1300;}).length} color={T.amber} sub="Below 1,300 BL"/>
          </div>
          <Card>
            <CardHdr title="Daily Production" sub="BL"/>
            <div style={{padding:"14px 18px 18px"}}><MiniBar vals={D.mpr.prod} color={T.blue} h={80}/></div>
          </Card>
          <Card>
            <CardHdr title="Daily Log" sub="30 entries"
              right={
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  {AddBtn}
                  {isAdmin ? <span style={{fontSize:11,color:T.tx3}}>Click Edit to modify</span> : null}
                </div>
              }/>
            <Table cols={cols} rows={rows}
              flagFn={function(r){return parseInt(r.prod.replace(",",""))<1300;}}
              onEdit={isAdmin ? function(row,i){setEditing({row:row,i:i,cols:cols,title:"Edit MPR Record"});} : null}/>
          </Card>
          {editing ? <EditModal row={editing.row} cols={editing.cols} title={editing.title}
            onSave={function(v){console.log("save",v);setEditing(null);}}
            onClose={function(){setEditing(null);}} /> : null}
          {entering ? <EntryModal title="New MPR Entry" fields={ENTRY_FIELDS.mpr}
            onSave={function(v){console.log("entry",v);setEntering(false);}}
            onClose={function(){setEntering(false);}} /> : null}
        </div>
      );
    },
    brewing: function() {
      var rows = D.brew.nos.map(function(n,i){
        return {no:n,wort:D.brew.wort[i].toLocaleString(),og:D.brew.og[i]};
      });
      var cols = [{key:"no",label:"Brew #"},{key:"wort",label:"Wort (L)",right:true,mono:true},{key:"og",label:"OG",right:true,mono:true}];
      return (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
            <Stat label="Total Brews" value={D.brew.total} sub="April 2026"/>
            <Stat label="Avg Wort" value={Math.round(avgArr(D.brew.wort)).toLocaleString()} unit="L"
              spark={D.brew.wort} sparkColor={T.amber}/>
            <Stat label="OG Range" value={Math.min.apply(null,D.brew.og)+"–"+Math.max.apply(null,D.brew.og)}/>
            <Stat label="Malt Opening" value={D.brew.malt_start} unit="MT"/>
          </div>
          <Card>
            <CardHdr title="Wort Collection" sub="L per brew"/>
            <div style={{padding:"14px 18px 18px"}}><MiniBar vals={D.brew.wort} color={T.amber} h={72}/></div>
          </Card>
          <Card>
            <CardHdr title="Brew Log" right={AddBtn}/>
            <Table cols={cols} rows={rows}
              onEdit={isAdmin ? function(row,i){setEditing({row:row,i:i,cols:cols,title:"Edit Brew Record"});} : null}/>
          </Card>
          {editing ? <EditModal row={editing.row} cols={editing.cols} title={editing.title}
            onSave={function(v){console.log("save",v);setEditing(null);}}
            onClose={function(){setEditing(null);}} /> : null}
          {entering ? <EntryModal title="New Brew Entry" fields={ENTRY_FIELDS.brewing}
            onSave={function(v){console.log("entry",v);setEntering(false);}}
            onClose={function(){setEntering(false);} } /> : null}
        </div>
      );
    },
    potstill: function() {
      var rows = D.ps.ms.map(function(v,i){
        return {b:i+1,ms:v,str:D.ps.str[i],f:D.ps.feints[i]!=null?D.ps.feints[i]:"—"};
      });
      var cols = [{key:"b",label:"Batch"},{key:"ms",label:"MS (BL)",right:true,mono:true},
        {key:"str",label:"OP",right:true,mono:true},{key:"f",label:"Feints (BL)",right:true,mono:true}];
      return (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
            <Stat label="Batches" value={D.ps.batches}/>
            <Stat label="Avg MS" value={Math.round(avgArr(D.ps.ms))} unit="BL"
              spark={D.ps.ms} sparkColor={T.blue}/>
            <Stat label="Avg Strength" value={avgArr(D.ps.str).toFixed(2)} unit="OP"/>
            <Stat label="Avg Feints" value={Math.round(avgArr(D.ps.feints))} unit="BL"/>
          </div>
          <Card>
            <CardHdr title="MS per Batch" sub="Bulk liters"/>
            <div style={{padding:"14px 18px 18px"}}><MiniBar vals={D.ps.ms} color={T.blue} h={72}/></div>
          </Card>
          <Card>
            <CardHdr title="Batch Log" right={AddBtn}/>
            <Table cols={cols} rows={rows}
              onEdit={isAdmin ? function(row,i){setEditing({row:row,i:i,cols:cols,title:"Edit Batch Record"});} : null}/>
          </Card>
          {editing ? <EditModal row={editing.row} cols={editing.cols} title={editing.title}
            onSave={function(v){console.log("save",v);setEditing(null);}}
            onClose={function(){setEditing(null);}} /> : null}
          {entering ? <EntryModal title="New Pot Still Entry" fields={ENTRY_FIELDS.potstill}
            onSave={function(v){console.log("entry",v);setEntering(false);}}
            onClose={function(){setEntering(false);} } /> : null}
        </div>
      );
    },
    chemicals: function() {
      var rows = D.chem.lall_cl.map(function(v,i){
        return {day:i+1,cons:D.chem.lall_cons[i],close:v,i7700:D.chem.i7700[i]};
      });
      var cols = [{key:"day",label:"Day"},{key:"cons",label:"Lallemand Used",right:true,mono:true},
        {key:"close",label:"Closing (KG)",right:true,mono:true},{key:"i7700",label:"INDION 7700",right:true,mono:true}];
      return (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
            <Stat label="Lallemand Yeast" value={LALL} unit="KG"
              color={LALL<300?T.red:T.amber} spark={D.chem.lall_cl} sparkColor={T.amber}
              sub={"~"+DAYS_LEFT+" days left"}/>
            <Stat label="April Consumption" value={D.chem.lall_start-LALL} unit="KG"
              sub={"Avg "+LALL_RATE.toFixed(1)+" KG/day"}/>
            <Stat label="INDION 7700" value={I7700} unit="KG"
              color={I7700<25?T.red:T.tx1} sub="Current balance"/>
            <Stat label="Lall Opening" value={D.chem.lall_start} unit="KG" sub="April 1"/>
          </div>
          <Card>
            <CardHdr title="Lallemand Yeast — Closing Balance" sub="KG · April"/>
            <div style={{padding:"14px 18px 18px"}}><MiniBar vals={D.chem.lall_cl} color={T.amber} h={72}/></div>
          </Card>
          <Card>
            <CardHdr title="Chemical Log" right={AddBtn}/>
            <Table cols={cols} rows={rows} flagFn={function(r){return r.close<300;}}
              onEdit={isAdmin ? function(row,i){setEditing({row:row,i:i,cols:cols,title:"Edit Chemical Record"});} : null}/>
          </Card>
          {editing ? <EditModal row={editing.row} cols={editing.cols} title={editing.title}
            onSave={function(v){console.log("save",v);setEditing(null);}}
            onClose={function(){setEditing(null);}} /> : null}
          {entering ? <EntryModal title="New Chemical Entry" fields={ENTRY_FIELDS.chemicals}
            onSave={function(v){console.log("entry",v);setEntering(false);}}
            onClose={function(){setEntering(false);} } /> : null}
        </div>
      );
    },
    wtp: function() {
      var rows = D.wtp.hcl_con.map(function(v,i){return {day:i+1,hcl:v,salt:D.wtp.salt_con[i]};});
      var cols = [{key:"day",label:"Day"},{key:"hcl",label:"HCL (KG)",right:true,mono:true},{key:"salt",label:"Salt (KG)",right:true,mono:true}];
      return (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <CardHdr title="Opening Balances — April 1"/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",
              gap:1,background:T.bdr}}>
              {[["HCL",D.wtp.hcl_open],["Salt",D.wtp.salt_open],
                ["Caustic",D.wtp.caustic_open],["Alum",D.wtp.alum_open],["Lime",D.wtp.lime_open]
              ].map(function(item){
                return (
                  <div key={item[0]} style={{padding:"14px 16px",background:T.white}}>
                    <div style={{fontSize:11,color:T.tx3,marginBottom:5}}>{item[0]}</div>
                    <div style={{fontSize:18,fontWeight:700,color:T.tx1,fontFamily:T.mono}}>
                      {item[1].toLocaleString()}
                      <span style={{fontSize:11,color:T.tx3,fontWeight:400,marginLeft:3}}>KG</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          <div className="chart-row" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Card>
              <CardHdr title="HCL Consumption" sub="KG/day"/>
              <div style={{padding:"14px 18px 18px"}}><MiniBar vals={D.wtp.hcl_con} color={T.blue} h={56}/></div>
            </Card>
            <Card>
              <CardHdr title="Salt Consumption" sub="KG/day"/>
              <div style={{padding:"14px 18px 18px"}}><MiniBar vals={D.wtp.salt_con} color={T.purple} h={56}/></div>
            </Card>
          </div>
          <Card>
            <CardHdr title="Daily Log" right={AddBtn}/>
            <Table cols={cols} rows={rows}
              onEdit={isAdmin ? function(row,i){setEditing({row:row,i:i,cols:cols,title:"Edit WTP Record"});} : null}/>
          </Card>
          {editing ? <EditModal row={editing.row} cols={editing.cols} title={editing.title}
            onSave={function(v){console.log("save",v);setEditing(null);}}
            onClose={function(){setEditing(null);}} /> : null}
          {entering ? <EntryModal title="New WTP Entry" fields={ENTRY_FIELDS.wtp}
            onSave={function(v){console.log("entry",v);setEntering(false);}}
            onClose={function(){setEntering(false);} } /> : null}
        </div>
      );
    },
    spw: function() {
      var validW = D.spw.w_bl.filter(function(v){return v>0;});
      var rows = D.spw.s_bl.map(function(v,i){return {day:i+1,steam:v,water:D.spw.w_bl[i]};});
      var cols = [{key:"day",label:"Day"},{key:"steam",label:"Steam (kg/BL)",right:true,mono:true},{key:"water",label:"Water (L/BL)",right:true,mono:true}];
      return (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
            <Stat label="Avg Steam/BL" value={AVG_STEAM.toFixed(2)} unit="kg/BL"
              spark={D.spw.s_bl} sparkColor={T.blue} sub="April average"/>
            <Stat label="Avg Water/BL" value={avgArr(validW).toFixed(2)} unit="L/BL"/>
            <Stat label="High Steam Days" value={D.spw.s_bl.filter(function(v){return v>15;}).length}
              color={T.amber} sub="Above 15 kg/BL"/>
            <Stat label="Low Steam Days" value={D.spw.s_bl.filter(function(v){return v<11;}).length}
              color={T.green} sub="Below 11 kg/BL"/>
          </div>
          <div className="chart-row" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Card>
              <CardHdr title="Steam per BL" sub="kg/BL · alternating pattern"/>
              <div style={{padding:"14px 18px 18px"}}><MiniBar vals={D.spw.s_bl} color={T.blue} h={64}/></div>
            </Card>
            <Card>
              <CardHdr title="Water per BL" sub="L/BL"/>
              <div style={{padding:"14px 18px 18px"}}><MiniBar vals={D.spw.w_bl} color={T.purple} h={64}/></div>
            </Card>
          </div>
          <Card>
            <CardHdr title="Daily Log" sub="Amber rows: steam above 16 kg/BL"/>
            <Table cols={cols} rows={rows} flagFn={function(r){return r.steam>16;}}
              onEdit={isAdmin ? function(row,i){setEditing({row:row,i:i,cols:cols,title:"Edit SPW Record"});} : null}/>
          </Card>
          {editing ? <EditModal row={editing.row} cols={editing.cols} title={editing.title}
            onSave={function(v){console.log("save",v);setEditing(null);}}
            onClose={function(){setEditing(null);}} /> : null}
          {entering ? <EntryModal title="New SPW Entry" fields={ENTRY_FIELDS.spw}
            onSave={function(v){console.log("entry",v);setEntering(false);}}
            onClose={function(){setEntering(false);} } /> : null}
        </div>
      );
    },
    fuel: function() {
      var rows = D.fuel.apr_cl.map(function(v,i){return {day:i+1,cons:D.fuel.apr_con[i],close:v};});
      var cols = [{key:"day",label:"Day"},{key:"cons",label:"Consumption (MT)",right:true,mono:true},{key:"close",label:"Closing (MT)",right:true,mono:true}];
      return (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}}>
            <Stat label="Apr Closing" value={D.fuel.apr_cl[D.fuel.apr_cl.length-1].toLocaleString()} unit="MT"/>
            <Stat label="May Closing" value={D.fuel.may_cl[D.fuel.may_cl.length-1].toLocaleString()} unit="MT"/>
            <Stat label="Jun Latest" value={FUEL.toLocaleString()} unit="MT" color={T.amber}/>
            <Stat label="Avg Daily Cons" value={avgArr(D.fuel.apr_con).toFixed(1)} unit="MT/day"/>
          </div>
          <div className="chart-row" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Card>
              <CardHdr title="Closing Balance" sub="April · MT"/>
              <div style={{padding:"14px 18px 18px"}}><MiniBar vals={D.fuel.apr_cl} color={T.green} h={64}/></div>
            </Card>
            <Card>
              <CardHdr title="Daily Consumption" sub="April · MT"/>
              <div style={{padding:"14px 18px 18px"}}><MiniBar vals={D.fuel.apr_con} color={T.amber} h={64}/></div>
            </Card>
          </div>
          <Card>
            <CardHdr title="April Daily Log" right={AddBtn}/>
            <Table cols={cols} rows={rows}
              onEdit={isAdmin ? function(row,i){setEditing({row:row,i:i,cols:cols,title:"Edit Fuel Record"});} : null}/>
          </Card>
          {editing ? <EditModal row={editing.row} cols={editing.cols} title={editing.title}
            onSave={function(v){console.log("save",v);setEditing(null);}}
            onClose={function(){setEditing(null);}} /> : null}
          {entering ? <EntryModal title="New Fuel Entry" fields={ENTRY_FIELDS.fuel}
            onSave={function(v){console.log("entry",v);setEntering(false);}}
            onClose={function(){setEntering(false);} } /> : null}
        </div>
      );
    },
    maturation: function() {
      var rows = D.mat.vats.map(function(v){
        return {vat:v.vat,lot:v.lot,bl:v.bl.toLocaleString(),str:v.str,pl:v.pl.toLocaleString()};
      });
      var cols = [{key:"vat",label:"VAT"},{key:"lot",label:"Lot No."},
        {key:"bl",label:"BL",right:true,mono:true},{key:"str",label:"OP",right:true,mono:true},
        {key:"pl",label:"PL",right:true,mono:true}];
      return (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}}>
            <Stat label="Total Casks" value={D.mat.casks.toLocaleString()} sub="YTD"/>
            <Stat label="YTD BL" value={Math.round(D.mat.ytd_bl/1000).toLocaleString()} unit="K BL" color={T.blue}/>
            <Stat label="YTD PL" value={Math.round(D.mat.ytd_pl/1000).toLocaleString()} unit="K PL"/>
            <Stat label="Active SSVs" value={D.mat.vats.length}/>
          </div>
          <Card>
            <CardHdr title="Active Maturation Vats" right={AddBtn} sub={D.mat.vats.length+" SSVs · April 2026"}/>
            <Table cols={cols} rows={rows}
              onEdit={isAdmin ? function(row,i){setEditing({row:row,i:i,cols:cols,title:"Edit Maturation Record"});} : null}/>
          </Card>
          {editing ? <EditModal row={editing.row} cols={editing.cols} title={editing.title}
            onSave={function(v){console.log("save",v);setEditing(null);}}
            onClose={function(){setEditing(null);}} /> : null}
          {entering ? <EntryModal title="New Maturation Entry" fields={ENTRY_FIELDS.maturation}
            onSave={function(v){console.log("entry",v);setEntering(false);}}
            onClose={function(){setEntering(false);} } /> : null}
        </div>
      );
    },
  };

  const ModuleComponent = configs[id];
  return ModuleComponent ? <ModuleComponent /> : <div style={{color:T.tx3,padding:20}}>Module not found.</div>;
}

function AdminPage({ od }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <OneDriveCard od={od}/>
      <Card>
        <CardHdr title="Access Control" sub="Employee vs Admin"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:T.bg}}>
                {["Feature","Employee","Admin"].map(function(h){
                  return <th key={h} style={{padding:"9px 14px",textAlign:"left",color:T.tx3,
                    fontSize:10,fontWeight:600,borderBottom:"1px solid "+T.bdr,textTransform:"uppercase"}}>{h}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {[["View all 8 modules","✓","✓"],
                ["Enter new records","✓","✓"],
                ["Edit any record","✓","✓"],
                ["AI intelligence console","✓","✓"],
                ["OneDrive sign in/out","✓","✓"],
                ["Admin panel","—","✓"],
                ["Delete records","—","✓"],
              ].map(function(r){
                return (
                  <tr key={r[0]} style={{borderBottom:"1px solid "+T.bdr}}>
                    <td style={{padding:"9px 14px",color:T.tx1}}>{r[0]}</td>
                    <td style={{padding:"9px 14px",color:r[1]==="✓"?T.green:T.tx3,fontWeight:r[1]==="✓"?600:400}}>{r[1]}</td>
                    <td style={{padding:"9px 14px",color:r[2]==="✓"?T.green:T.tx3,fontWeight:r[2]==="✓"?600:400}}>{r[2]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Card style={{padding:18}}>
        <div style={{fontSize:14,fontWeight:600,color:T.tx1,marginBottom:12}}>Vercel environment variables</div>
        {[
          ["ADMIN_PASSWORD","Your shared admin password","Server-side only — never exposed to browser"],
          ["VITE_AZURE_CLIENT_ID","From Azure app registration","Used by MSAL for Microsoft login"],
          ["VITE_AZURE_TENANT_ID","From Azure portal → Overview","Identifies your organisation's M365 tenant"],
        ].map(function(item){
          return (
            <div key={item[0]} style={{marginBottom:12,paddingBottom:12,borderBottom:"1px solid "+T.bdr}}>
              <code style={{fontSize:12,color:T.blue,background:T.blueSoft,
                padding:"2px 7px",borderRadius:4}}>{item[0]}</code>
              <div style={{fontSize:12,color:T.tx2,marginTop:5}}>{item[1]}</div>
              <div style={{fontSize:11,color:T.tx3,marginTop:2}}>{item[2]}</div>
            </div>
          );
        })}
      </Card>
      <AIPanel/>
    </div>
  );
}

// ── Unit definitions ──────────────────────────────────────────────────────────
var UNITS = {
  prod: {
    id:"prod", label:"Production", short:"PROD", location:"Gamber Valley · Distillery",
    file:"Gamber_valley_MIS_26-27.xlsx",
    nav:[
      {section:"Overview",   items:[{id:"overview",    label:"Dashboard",          icon:"▣"}]},
      {section:"Production", items:[
        {id:"mpr",           label:"MPR",               icon:"◈"},
        {id:"brewing",       label:"Brewing",           icon:"⬡"},
        {id:"potstill",      label:"Pot Still",         icon:"◎"},
        {id:"maturation",    label:"Maturation",        icon:"⬤"},
      ]},
      {section:"Resources",  items:[
        {id:"chemicals",     label:"Chemicals",         icon:"◇"},
        {id:"wtp",           label:"WTP & ETP",         icon:"○"},
        {id:"spw",           label:"Steam/Power/Water", icon:"△"},
        {id:"fuel",          label:"Fuel",              icon:"□"},
      ]},
    ],
  },
  dispatch: {
    id:"dispatch", label:"Dispatch", short:"DISP", location:"Kandla HP · Bottling & Sales",
    file:"Alcobrew_HP_MIS_26-27.xlsx",
    nav:[
      {section:"Overview",   items:[{id:"overview",    label:"Dashboard",          icon:"▣"}]},
      {section:"Operations", items:[
        {id:"hourly_prod",   label:"Hourly Production", icon:"◈"},
        {id:"hp_sales",      label:"HP Sales",          icon:"◎"},
        {id:"closing_stock", label:"Closing Stock",     icon:"⬡"},
      ]},
    ],
  },
};

// ── Kandla HP data (from photo dated 20-06-26) ────────────────────────────────
var HP = {
  prod: {
    date:"20-06-26", line:"02", location:"Kandla HP", start_time:"10:05 AM",
    brand:"G.S.B.A.W", size:"375ML",
    hourly:[
      {slot:"9:00-10:00",   cases:0,   cumul:0,   note:"Yoga Day Celebration"},
      {slot:"10:00-11:00",  cases:70,  cumul:70,  note:""},
      {slot:"11:00-12:00",  cases:70,  cumul:140, note:""},
      {slot:"12:00-1:00",   cases:70,  cumul:210, note:""},
      {slot:"1:00-1:30",    cases:0,   cumul:210, note:"LUNCH"},
      {slot:"1:30-2:00",    cases:32,  cumul:242, note:""},
      {slot:"2:00-3:00",    cases:70,  cumul:312, note:""},
      {slot:"3:00-4:00",    cases:0,   cumul:312, note:"Billing sleeve in mono-carton"},
      {slot:"4:00-5:00",    cases:0,   cumul:312, note:""},
      {slot:"5:00-6:00",    cases:0,   cumul:312, note:"G.S. 375ML = 312 c/s"},
      {slot:"6:00-7:00",    cases:0,   cumul:312, note:""},
    ],
    total:312,
  },
  sales: {
    date:"20-06-26",
    brands:[
      {brand:"GSBAW",   cases:3156},
      {brand:"GSW 18H", cases:72},
      {brand:"W&B",     cases:110},
      {brand:"OMV",     cases:170},
      {brand:"OMVGA",   cases:80},
      {brand:"ASOPW",   cases:376},
    ],
    total:3964,
  },
  stock: {
    date:"20-06-26",
    // columns: 750ml | 375ml | 180ml
    brands:[
      {brand:"GSBAW",        s750:1037, s375:323,  s180:352},
      {brand:"GSBAW G-Pack", s750:445,  s375:0,    s180:0},
      {brand:"GSW 18H",      s750:228,  s375:0,    s180:0},
      {brand:"W&B",          s750:900,  s375:212,  s180:179},
      {brand:"W&B Gift Pack",s750:443,  s375:0,    s180:0},
      {brand:"OMV",          s750:703,  s375:444,  s180:194},
      {brand:"OMVGA",        s750:354,  s375:195,  s180:177},
      {brand:"ASOW",         s750:298,  s375:0,    s180:127},
      {brand:"ASOW G-Pack",  s750:15,   s375:0,    s180:0},
    ],
    total:6626,
  },
};

var HP_ALERTS = [
  HP.prod.hourly.filter(function(h){return h.note&&h.note!=="LUNCH"&&h.cases===0;}).length > 2
    && {lv:"warning", mod:"Production", msg:"Line 02 had extended downtime — billing sleeve delay (3:00–6:00)"},
  HP.stock.brands.some(function(b){return b.s750 < 200;})
    && {lv:"info", mod:"Stock", msg:"Several brands below 200 cases — monitor reorder levels"},
].filter(Boolean);

// ── NAV helpers ───────────────────────────────────────────────────────────────
var NAV          = UNITS.prod.nav;
var ADMIN_NAV    = NAV.concat([
  {section:"Admin", items:[{id:"admin", label:"Settings & OneDrive", icon:"⚙"}]},
]);
var DISP_NAV     = UNITS.dispatch.nav;
var DISP_ADMIN_NAV = DISP_NAV.concat([
  {section:"Admin", items:[{id:"admin", label:"Settings & OneDrive", icon:"⚙"}]},
]);

// ── Kandla HP pages ───────────────────────────────────────────────────────────
function HPOverview({ isAdmin }) {
  var totalSales = HP.sales.total;
  var totalStock = HP.stock.total;
  var prodTotal  = HP.prod.total;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {HP_ALERTS.map(function(a,i){
        var bg = a.lv==="warning"?T.amberSoft:T.blueSoft;
        var bc = a.lv==="warning"?T.amber:T.blue;
        return (
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,
            padding:"11px 14px",background:bg,borderRadius:7,border:"1px solid rgba(0,0,0,.06)"}}>
            <span style={{fontSize:11,fontWeight:700,color:bc,border:"1px solid "+bc+"50",
              borderRadius:20,padding:"2px 9px",whiteSpace:"nowrap",flexShrink:0}}>
              {a.lv.charAt(0).toUpperCase()+a.lv.slice(1)}
            </span>
            <span style={{fontSize:13,color:T.tx1,lineHeight:1.4}}>{a.msg}</span>
          </div>
        );
      })}

      <div className="stat-grid"
        style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
        <Stat label="Today's Production" value={prodTotal} unit="cases"
          color={T.blue} sub={"Line 02 · G.S.B.A.W 375ML"}/>
        <Stat label="HP Sales Today" value={totalSales.toLocaleString()} unit="cases"
          color={T.green} sub={"as on "+HP.sales.date}/>
        <Stat label="HP Closing Stock" value={totalStock.toLocaleString()} unit="cases"
          color={T.amber} sub={"as on "+HP.stock.date}/>
        <Stat label="Active Brands" value={HP.sales.brands.length}
          sub="In today's dispatch"/>
      </div>

      <Card>
        <CardHdr title="Today's Production — Hourly" sub={"Line 02 · Start "+HP.prod.start_time}/>
        <MiniBar vals={HP.prod.hourly.map(function(h){return h.cases;})} color={T.blue} h={64}/>
        <div style={{padding:"0 18px 14px",display:"flex",justifyContent:"space-between",
          fontSize:10,color:T.tx3,marginTop:6}}>
          <span>9:00</span><span>7:00</span>
        </div>
      </Card>

      <div className="chart-row"
        style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card>
          <CardHdr title="Brand-wise Sales" sub="Cases dispatched today"/>
          <div style={{padding:"14px 18px"}}>
            {HP.sales.brands.map(function(b){
              var pct = Math.round((b.cases/HP.sales.total)*100);
              return (
                <div key={b.brand} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",
                    marginBottom:4,fontSize:12}}>
                    <span style={{color:T.tx1,fontWeight:500}}>{b.brand}</span>
                    <span style={{color:T.tx2,fontFamily:T.mono}}>{b.cases.toLocaleString()}</span>
                  </div>
                  <div style={{height:5,background:T.bdr,borderRadius:3}}>
                    <div style={{height:5,background:T.blue,borderRadius:3,
                      width:pct+"%"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <CardHdr title="Closing Stock" sub="All brands · 750ml"/>
          <div style={{padding:"14px 18px"}}>
            {HP.stock.brands.map(function(b){
              return (
                <div key={b.brand} style={{display:"flex",justifyContent:"space-between",
                  padding:"7px 0",borderBottom:"1px solid "+T.bdr,fontSize:12}}>
                  <span style={{color:T.tx1}}>{b.brand}</span>
                  <span style={{color:b.s750>0&&b.s750<200?T.amber:T.tx2,
                    fontFamily:T.mono,fontWeight:600}}>{b.s750||"—"}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function HPHourlyPage({ isAdmin }) {
  var [editing,  setEditing]  = useState(null);
  var [entering, setEntering] = useState(false);
  var AddBtn = (
    <button onClick={function(){setEntering(true);}}
      style={{fontSize:12,color:"#fff",background:T.blue,border:"none",
        padding:"6px 12px",borderRadius:6,cursor:"pointer",fontWeight:600}}>
      + Add Entry
    </button>
  );
  var rows = HP.prod.hourly.map(function(h,i){
    return {slot:h.slot, cases:h.cases||"—", cumul:h.cumul, note:h.note||""};
  });
  var cols = [
    {key:"slot",  label:"Time Slot"},
    {key:"cases", label:"Cases", right:true, mono:true},
    {key:"cumul", label:"Cumulative", right:true, mono:true},
    {key:"note",  label:"Remarks"},
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div className="stat-grid"
        style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
        <Stat label="Date" value={HP.prod.date} color={T.tx1}/>
        <Stat label="Line No." value={HP.prod.line} color={T.blue}/>
        <Stat label="Brand" value={HP.prod.brand} color={T.tx1}/>
        <Stat label="Total Cases" value={HP.prod.total} color={T.green} unit="cs"/>
      </div>
      <Card>
        <CardHdr title="Production Chart" sub="Cases per hour · Line 02"/>
        <div style={{padding:"14px 18px 18px"}}>
          <MiniBar vals={HP.prod.hourly.map(function(h){return h.cases;})} color={T.blue} h={72}/>
        </div>
      </Card>
      <Card>
        <CardHdr title="Hourly Log"
          sub={"Start "+HP.prod.start_time+" · Kandla HP"}
          right={
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {AddBtn}
              {isAdmin ? <span style={{fontSize:11,color:T.tx3}}>Edit to modify</span> : null}
            </div>
          }/>
        <Table cols={cols} rows={rows}
          flagFn={function(r){return r.note&&r.note!=="LUNCH"&&r.cases==="—";}}
          onEdit={isAdmin ? function(row,i){setEditing({row:row,i:i,cols:cols,title:"Edit Hourly Entry"});} : null}/>
      </Card>
      {editing ? <EditModal row={editing.row} cols={editing.cols} title={editing.title}
        onSave={function(v){console.log("save",v);setEditing(null);}}
        onClose={function(){setEditing(null);}}/> : null}
      {entering ? <EntryModal title="New Hourly Entry" fields={ENTRY_FIELDS.hourly_prod}
        onSave={function(v){console.log("entry",v);setEntering(false);}}
        onClose={function(){setEntering(false);}} /> : null}
    </div>
  );
}

function HPSalesPage({ isAdmin }) {
  var [editing,  setEditing]  = useState(null);
  var [entering, setEntering] = useState(false);
  var AddBtn = (
    <button onClick={function(){setEntering(true);}}
      style={{fontSize:12,color:"#fff",background:T.blue,border:"none",
        padding:"6px 12px",borderRadius:6,cursor:"pointer",fontWeight:600}}>
      + Add Entry
    </button>
  );
  var cols = [
    {key:"brand", label:"Brand"},
    {key:"cases", label:"Cases Dispatched", right:true, mono:true},
    {key:"pct",   label:"% of Total", right:true},
  ];
  var rows = HP.sales.brands.map(function(b){
    return {brand:b.brand, cases:b.cases.toLocaleString(),
      pct:Math.round(b.cases/HP.sales.total*100)+"%"};
  });
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div className="stat-grid"
        style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
        <Stat label="Total HP Sale" value={HP.sales.total.toLocaleString()} unit="cases"
          color={T.green} sub={"as on "+HP.sales.date}/>
        <Stat label="Brands" value={HP.sales.brands.length} sub="Dispatched today"/>
        <Stat label="Top Brand" value="GSBAW" sub={"3,156 cases · "+Math.round(3156/HP.sales.total*100)+"%"}/>
      </div>
      <Card>
        <CardHdr title="Brand-wise Sales" sub={"HP Dispatch · "+HP.sales.date}/>
        <div style={{padding:"14px 18px 8px"}}>
          {HP.sales.brands.map(function(b){
            var pct = Math.round(b.cases/HP.sales.total*100);
            return (
              <div key={b.brand} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:13,color:T.tx1,fontWeight:500}}>{b.brand}</span>
                  <span style={{fontSize:13,color:T.tx2,fontFamily:T.mono,fontWeight:600}}>
                    {b.cases.toLocaleString()} cs
                  </span>
                </div>
                <div style={{height:6,background:T.bdr,borderRadius:3}}>
                  <div style={{height:6,background:T.blue,borderRadius:3,width:pct+"%"}}/>
                </div>
                <div style={{fontSize:10,color:T.tx3,marginTop:3}}>{pct}% of total</div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card>
        <CardHdr title="Sales Log"
          right={
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {AddBtn}
              {isAdmin ? <span style={{fontSize:11,color:T.tx3}}>Edit to modify</span> : null}
            </div>
          }/>
        <Table cols={cols} rows={rows}
          onEdit={isAdmin ? function(row,i){setEditing({row:row,i:i,cols:cols,title:"Edit Sales Entry"});} : null}/>
      </Card>
      {editing ? <EditModal row={editing.row} cols={editing.cols} title={editing.title}
        onSave={function(v){console.log("save",v);setEditing(null);}}
        onClose={function(){setEditing(null);}}/> : null}
      {entering ? <EntryModal title="New Sales Entry" fields={ENTRY_FIELDS.hp_sales}
        onSave={function(v){console.log("entry",v);setEntering(false);}}
        onClose={function(){setEntering(false);}} /> : null}
    </div>
  );
}

function HPStockPage({ isAdmin }) {
  var [editing,  setEditing]  = useState(null);
  var [entering, setEntering] = useState(false);
  var AddBtn = (
    <button onClick={function(){setEntering(true);}}
      style={{fontSize:12,color:"#fff",background:T.blue,border:"none",
        padding:"6px 12px",borderRadius:6,cursor:"pointer",fontWeight:600}}>
      + Add Entry
    </button>
  );
  var cols = [
    {key:"brand", label:"Brand"},
    {key:"s750",  label:"750ml", right:true, mono:true},
    {key:"s375",  label:"375ml", right:true, mono:true},
    {key:"s180",  label:"180ml", right:true, mono:true},
    {key:"total", label:"Total", right:true, mono:true},
  ];
  var rows = HP.stock.brands.map(function(b){
    var tot = b.s750+b.s375+b.s180;
    return {brand:b.brand, s750:b.s750||"—", s375:b.s375||"—",
      s180:b.s180||"—", total:tot.toLocaleString()};
  });
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div className="stat-grid"
        style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}}>
        <Stat label="Total Closing Stock" value={HP.stock.total.toLocaleString()} unit="cases"
          color={T.amber} sub={"as on "+HP.stock.date}/>
        <Stat label="Brands in Stock" value={HP.stock.brands.length}/>
        <Stat label="Low Stock (<200)" value={HP.stock.brands.filter(function(b){return b.s750<200&&b.s750>0;}).length}
          color={T.amber} sub="750ml brands"/>
      </div>
      <Card>
        <CardHdr title="Closing Stock by Brand" sub={"HP · "+HP.stock.date+" · cases"}
          right={
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {AddBtn}
              {isAdmin ? <span style={{fontSize:11,color:T.tx3}}>Edit to modify</span> : null}
            </div>
          }/>
        <Table cols={cols} rows={rows}
          flagFn={function(r){return typeof r.s750==="number"&&r.s750<200;}}
          onEdit={isAdmin ? function(row,i){setEditing({row:row,i:i,cols:cols,title:"Edit Stock Record"});} : null}/>
      </Card>
      {editing ? <EditModal row={editing.row} cols={editing.cols} title={editing.title}
        onSave={function(v){console.log("save",v);setEditing(null);}}
        onClose={function(){setEditing(null);}}/> : null}
      {entering ? <EntryModal title="New Stock Entry" fields={ENTRY_FIELDS.closing_stock}
        onSave={function(v){console.log("entry",v);setEntering(false);}}
        onClose={function(){setEntering(false);}} /> : null}
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ nav, page, isAdmin, od, onNavigate, onAdminClick, unit, onUnitSwitch }) {
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",
      background:T.sb,overflow:"hidden"}}>

      {/* Logo */}
      <div style={{padding:"14px 14px 10px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:32,height:32,borderRadius:8,background:T.blue,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:14,color:"#fff",fontWeight:800,flexShrink:0}}>A</div>
          <div style={{minWidth:0}}>
            <div style={{fontSize:12,fontWeight:700,color:"#fff",lineHeight:1.2}}>Alcobrew Distilleries</div>
            <div style={{fontSize:9,color:T.sbText}}>NEXUS · 2026-27</div>
          </div>
        </div>
      </div>

      {/* Unit switcher */}
      <div style={{padding:"8px 10px",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{fontSize:9,color:T.sbText,letterSpacing:.6,textTransform:"uppercase",
          marginBottom:5,paddingLeft:2}}>Unit</div>
        <div style={{display:"flex",gap:4}}>
          {Object.values(UNITS).map(function(u){
            var active = unit===u.id;
            return (
              <button key={u.id} onClick={function(){onUnitSwitch(u.id);}}
                style={{flex:1,padding:"6px 4px",borderRadius:5,border:"none",cursor:"pointer",
                  background:active?"rgba(255,255,255,.18)":"rgba(255,255,255,.06)",
                  color:active?"#fff":T.sbText,fontSize:10,fontWeight:active?700:400,
                  textAlign:"center",lineHeight:1.3}}>
                <div style={{fontWeight:700}}>{u.short}</div>
                <div style={{fontSize:8,opacity:.75}}>{u.location.split(" ")[0]}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{padding:"10px 10px",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:6,height:6,borderRadius:"50%",
              background:od.token?T.green:"rgba(255,255,255,.25)"}}/>
            <span style={{fontSize:11,color:od.token?T.green:T.sbText,fontWeight:od.token?600:400}}>
              {od.token ? "Live · "+od.user.split(" ")[0] : "Snapshot mode"}
            </span>
          </div>
          {od.token ? (
            <button onClick={od.signOut}
              style={{fontSize:10,color:T.sbText,background:"none",
                border:"1px solid rgba(255,255,255,.15)",borderRadius:8,
                padding:"3px 8px",cursor:"pointer"}}>
              Sign out
            </button>
          ) : (
            <button onClick={od.signIn}
              disabled={od.status==="connecting"||od.status==="verifying"}
              style={{fontSize:10,color:"#fff",background:T.blue,border:"none",
                borderRadius:8,padding:"4px 9px",cursor:"pointer",
                opacity:od.status==="connecting"||od.status==="verifying"?0.6:1}}>
              {od.status==="connecting"||od.status==="verifying" ? "…" : "Sign in"}
            </button>
          )}
        </div>
      </div>

      <div style={{flex:1,padding:"10px 8px",overflowY:"auto"}}>
        {nav.map(function(group) {
          return (
            <div key={group.section} style={{marginBottom:16}}>
              <div style={{fontSize:9,fontWeight:600,color:T.sbText,letterSpacing:.8,
                textTransform:"uppercase",padding:"0 10px",marginBottom:4}}>
                {group.section}
              </div>
              {group.items.map(function(item) {
                var active = page === item.id;
                return (
                  <button key={item.id}
                    onClick={function(){
                      if (item.id==="admin" && !isAdmin) { onAdminClick(); }
                      else { onNavigate(item.id); }
                    }}
                    style={{display:"flex",alignItems:"center",gap:9,width:"100%",
                      textAlign:"left",padding:"9px 10px",borderRadius:7,border:"none",
                      cursor:"pointer",marginBottom:1,
                      background:active?T.sbActive:"transparent",
                      color:active?"#fff":T.sbText,
                      fontSize:13,fontWeight:active?600:400}}>
                    <span style={{fontSize:12,width:16,textAlign:"center",opacity:.8}}>
                      {item.icon}
                    </span>
                    <span style={{flex:1}}>{item.label}</span>
                    {item.id==="admin"&&!isAdmin ? (
                      <span style={{fontSize:9,color:T.sbText,
                        background:"rgba(255,255,255,.1)",padding:"1px 6px",borderRadius:8}}>
                        ADMIN
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div style={{padding:"10px 14px",borderTop:"1px solid rgba(255,255,255,.08)",
        display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:11,color:T.sbText,padding:"3px 8px",
          background:"rgba(255,255,255,.08)",borderRadius:10}}>
          {isAdmin ? "Admin" : "Employee"}
        </span>
        {!isAdmin ? (
          <button onClick={onAdminClick}
            style={{fontSize:11,color:T.sbText,background:"none",
              border:"1px solid rgba(255,255,255,.15)",borderRadius:10,
              padding:"3px 8px",cursor:"pointer"}}>
            Admin
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  var [page,    setPage]   = useState("overview");
  var [unit,    setUnit]   = useState("prod");
  var [isAdmin, setAdmin]  = useState(!!sessionStorage.getItem("adm"));
  var [showGate,setGate]   = useState(false);
  var [drawer,  setDrawer] = useState(false);
  var [showOD,  setShowOD] = useState(false);
  var od = useOneDrive();

  var isDisp  = unit==="dispatch";
  var baseNav = isDisp ? DISP_NAV : NAV;
  var nav     = isAdmin ? (isDisp ? DISP_ADMIN_NAV : ADMIN_NAV) : baseNav;
  var allItems = nav.reduce(function(acc,g){return acc.concat(g.items);},[]);
  var cur = allItems.find(function(i){return i.id===page;});
  var unitInfo = UNITS[unit];

  var navigate = function(id){ setPage(id); setDrawer(false); };
  var openAdmin = function(){ setGate(true); setDrawer(false); };
  var switchUnit = function(uid){
    setUnit(uid); setPage("overview"); setDrawer(false);
  };

  // Route page to correct component
  function renderPage() {
    if (page==="admin") return <AdminPage od={od}/>;
    if (isDisp) {
      if (page==="hourly_prod")   return <HPHourlyPage  isAdmin={isAdmin}/>;
      if (page==="hp_sales")      return <HPSalesPage   isAdmin={isAdmin}/>;
      if (page==="closing_stock") return <HPStockPage   isAdmin={isAdmin}/>;
      return <HPOverview isAdmin={isAdmin}/>;
    }
    if (page==="overview") return <OverviewPage isAdmin={isAdmin}/>;
    return <ModulePage id={page} isAdmin={isAdmin}/>;
  }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:T.bg,
      fontFamily:T.sans,fontSize:14,color:T.tx1}}>
      <InjectCSS/>



      {showOD ? (
        <OneDriveModal od={od} onClose={function(){setShowOD(false);}}/>
      ) : null}

      {/* Desktop sidebar */}
      <div className="sb-desktop"
        style={{width:220,flexShrink:0,position:"sticky",top:0,height:"100vh"}}>
        <Sidebar nav={nav} page={page} isAdmin={isAdmin} od={od}
          unit={unit} onUnitSwitch={switchUnit}
          onNavigate={navigate} onAdminClick={openAdmin}/>
      </div>

      {/* Mobile drawer */}
      {drawer ? (
        <div style={{position:"fixed",inset:0,zIndex:200,display:"flex"}}
          onClick={function(){setDrawer(false);}}>
          <div style={{width:240,height:"100%",flexShrink:0}}
            onClick={function(e){e.stopPropagation();}}>
            <Sidebar nav={nav} page={page} isAdmin={isAdmin} od={od}
              unit={unit} onUnitSwitch={switchUnit}
              onNavigate={navigate} onAdminClick={openAdmin}/>
          </div>
          <div style={{flex:1,background:"rgba(0,0,0,.5)"}}/>
        </div>
      ) : null}

      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>

        {/* Top bar */}
        <div style={{height:52,background:T.white,borderBottom:"1px solid "+T.bdr,
          display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"0 12px 0 14px",flexShrink:0,position:"sticky",top:0,zIndex:100}}>
          <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
            <button onClick={function(){setDrawer(function(o){return !o;});}}
              style={{background:"none",border:"none",cursor:"pointer",padding:4,
                display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
              <span style={{display:"block",width:18,height:2,background:T.tx2,borderRadius:1}}/>
              <span style={{display:"block",width:18,height:2,background:T.tx2,borderRadius:1}}/>
              <span style={{display:"block",width:18,height:2,background:T.tx2,borderRadius:1}}/>
            </button>
            <div style={{minWidth:0}}>
              <div style={{fontSize:14,fontWeight:600,color:T.tx1,
                whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                {cur ? cur.label : "Dashboard"}
              </div>
              <div style={{fontSize:10,color:T.tx3}}>
                {unitInfo.label} · {unitInfo.location}
              </div>
            </div>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
            {/* Unit toggle for mobile */}
            <div style={{display:"flex",background:T.bg,borderRadius:6,
              border:"1px solid "+T.bdr,overflow:"hidden"}}>
              {Object.values(UNITS).map(function(u){
                var active = unit===u.id;
                return (
                  <button key={u.id} onClick={function(){switchUnit(u.id);}}
                    style={{padding:"4px 9px",border:"none",cursor:"pointer",
                      background:active?T.blue:"transparent",
                      color:active?"#fff":T.tx3,fontSize:10,fontWeight:active?700:400}}>
                    {u.short}
                  </button>
                );
              })}
            </div>

            {isDisp
              ? HP_ALERTS.length > 0
                ? <div onClick={function(){navigate("overview");}}
                    style={{display:"flex",alignItems:"center",gap:5,padding:"5px 9px",
                      background:T.amberSoft,borderRadius:6,cursor:"pointer"}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:T.amber}}/>
                    <span style={{fontSize:11,color:T.amber,fontWeight:600}}>{HP_ALERTS.length}</span>
                  </div>
                : null
              : ALERTS.length > 0
                ? <div onClick={function(){navigate("overview");}}
                    style={{display:"flex",alignItems:"center",gap:5,padding:"5px 9px",
                      background:T.redSoft,borderRadius:6,cursor:"pointer"}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:T.red}}/>
                    <span style={{fontSize:11,color:T.red,fontWeight:600,whiteSpace:"nowrap"}}>
                      {ALERTS.length} alert{ALERTS.length>1?"s":""}
                    </span>
                  </div>
                : null}

            <button onClick={function(){setShowOD(function(o){return !o;});}}
              style={{display:"flex",alignItems:"center",gap:5,padding:"6px 11px",
                background:od.token?T.greenSoft:T.blue,
                border:"none",borderRadius:6,cursor:"pointer"}}>
              <div style={{width:6,height:6,borderRadius:"50%",
                background:od.token?T.green:"rgba(255,255,255,.7)",flexShrink:0}}/>
              <span style={{fontSize:12,color:od.token?T.green:"#fff",fontWeight:600,whiteSpace:"nowrap"}}>
                {od.status==="connecting"||od.status==="verifying"
                  ? "…"
                  : od.token ? od.user.split(" ")[0] : "Sign in"}
              </span>
            </button>
          </div>
        </div>

        {/* Page */}
        <div style={{flex:1,padding:14,overflowY:"auto"}}>
          {renderPage()}
        </div>
      </div>

      {showGate ? (
        <AdminGate
          onUnlocked={function(){setAdmin(true);setGate(false);setPage("admin");}}
          onCancel={function(){setGate(false);}}/>
      ) : null}
    </div>
  );
}
