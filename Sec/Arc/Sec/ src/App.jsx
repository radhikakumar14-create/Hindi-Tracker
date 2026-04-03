import { useState } from “react”;

const CATEGORIES = [“Words”, “Phrases”, “Songs & Rhymes”];
const MASTERY = [“Introduced”, “Practicing”, “Mastered”];

const PALETTE = {
Introduced: { bg: “#E6F1FB”, text: “#185FA5”, border: “#378ADD”, dot: “#378ADD” },
Practicing:  { bg: “#FAEEDA”, text: “#854F0B”, border: “#EF9F27”, dot: “#EF9F27” },
Mastered:    { bg: “#EAF3DE”, text: “#3B6D11”, border: “#639922”, dot: “#639922” },
};

const CAT_COLORS = {
“Words”:          { fill: “#534AB7”, text: “#fff” },
“Phrases”:        { fill: “#D85A30”, text: “#fff” },
“Songs & Rhymes”: { fill: “#0F6E56”, text: “#fff” },
};

const SAMPLE = {
Words: [
{ id: 1, item: “पानी (paani) — water”,   mastery: “Mastered”,   date: “2025-03-15” },
{ id: 2, item: “खाना (khaana) — food”,    mastery: “Mastered”,   date: “2025-03-20” },
{ id: 3, item: “माँ (maa) — mom”,          mastery: “Mastered”,   date: “2025-02-01” },
{ id: 4, item: “कुत्ता (kutta) — dog”,     mastery: “Practicing”, date: “2025-03-28” },
{ id: 5, item: “फूल (phool) — flower”,    mastery: “Introduced”, date: “2025-04-01” },
],
“Phrases”: [
{ id: 6, item: “धन्यवाद — thank you”,      mastery: “Practicing”, date: “2025-03-22” },
{ id: 7, item: “कहाँ है? — where is it?”,  mastery: “Introduced”, date: “2025-04-01” },
],
“Songs & Rhymes”: [
{ id: 8, item: “मछली जल की रानी है”,       mastery: “Mastered”,   date: “2025-03-10” },
{ id: 9, item: “नानी तेरी मोरनी”,          mastery: “Practicing”, date: “2025-03-25” },
],
};

const NOTES_INIT = [
{ id: 1, text: “She repeated ‘paani’ unprompted today!”, date: “2025-04-01” },
];

function DonutChart({ data, size = 110 }) {
const total = data.reduce((s, d) => s + d.value, 0);
if (total === 0) return <div style={{ width: size, height: size, borderRadius: “50%”, background: “#eee” }} />;
let angle = -90;
const cx = size / 2, cy = size / 2, r = size * 0.38, ir = size * 0.22;
const slices = data.map(d => {
const sweep = (d.value / total) * 360;
const start = angle;
angle += sweep;
return { …d, start, sweep };
});
function arc(cx, cy, r, startDeg, sweepDeg) {
const s = (startDeg * Math.PI) / 180;
const e = ((startDeg + sweepDeg) * Math.PI) / 180;
const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
const large = sweepDeg > 180 ? 1 : 0;
return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}
return (
<svg width={size} height={size}>
{slices.map((s, i) => {
if (s.sweep < 0.5) return null;
const outerPath = arc(cx, cy, r, s.start, s.sweep);
const innerPath = arc(cx, cy, ir, s.start + s.sweep, -s.sweep);
return (
<path key={i}
d={`${outerPath} L ${cx + ir * Math.cos(((s.start + s.sweep) * Math.PI) / 180)} ${cy + ir * Math.sin(((s.start + s.sweep) * Math.PI) / 180)} ${innerPath} Z`}
fill={s.color} opacity={0.9} />
);
})}
<text x={cx} y={cy + 1} textAnchor=“middle” dominantBaseline=“middle”
style={{ fontSize: size * 0.18, fontWeight: 600, fill: “#1a1a1a” }}>{total}</text>
<text x={cx} y={cy + size * 0.16} textAnchor=“middle” dominantBaseline=“middle”
style={{ fontSize: size * 0.1, fill: “#888” }}>total</text>
</svg>
);
}

function BarMini({ items }) {
const total = items.length || 1;
const counts = { Introduced: 0, Practicing: 0, Mastered: 0 };
items.forEach(i => counts[i.mastery]++);
return (
<div style={{ display: “flex”, height: 8, borderRadius: 99, overflow: “hidden”, gap: 1 }}>
{MASTERY.map(m => counts[m] > 0 && (
<div key={m} style={{ flex: counts[m] / total, background: PALETTE[m].dot }} />
))}
</div>
);
}

export default function App() {
const [tab, setTab] = useState(“Dashboard”);
const [activeCategory, setActiveCategory] = useState(“Words”);
const [data, setData] = useState(SAMPLE);
const [newItem, setNewItem] = useState(””);
const [newMastery, setNewMastery] = useState(“Introduced”);
const [notes, setNotes] = useState(NOTES_INIT);
const [newNote, setNewNote] = useState(””);
const [filter, setFilter] = useState(“All”);

const allItems = Object.values(data).flat();
const masteryCount = m => allItems.filter(i => i.mastery === m).length;
const donutData = MASTERY.map(m => ({ value: masteryCount(m), color: PALETTE[m].dot, label: m }));

function addItem() {
if (!newItem.trim()) return;
setData(prev => ({ …prev, [activeCategory]: [{ id: Date.now(), item: newItem.trim(), mastery: newMastery, date: new Date().toISOString().slice(0,10) }, …prev[activeCategory]] }));
setNewItem(””);
}
function updateMastery(cat, id, mastery) {
setData(prev => ({ …prev, [cat]: prev[cat].map(i => i.id === id ? { …i, mastery } : i) }));
}
function removeItem(cat, id) {
setData(prev => ({ …prev, [cat]: prev[cat].filter(i => i.id !== id) }));
}
function addNote() {
if (!newNote.trim()) return;
setNotes(prev => [{ id: Date.now(), text: newNote.trim(), date: new Date().toISOString().slice(0,10) }, …prev]);
setNewNote(””);
}

const tabs = [“Dashboard”, “Track”, “Notes”];

return (
<div style={{ fontFamily: “-apple-system, BlinkMacSystemFont, ‘Segoe UI’, sans-serif”, maxWidth: 640, margin: “0 auto”, padding: “1.5rem 1rem”, color: “#1a1a1a” }}>

```
  <div style={{ background: "linear-gradient(135deg, #534AB7 0%, #D85A30 100%)", borderRadius: 16, padding: "1.25rem 1.5rem", marginBottom: "1.5rem", color: "#fff" }}>
    <p style={{ margin: 0, fontSize: 12, opacity: 0.8, letterSpacing: 1 }}>हिन्दी · HINDI</p>
    <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 500 }}>Learning Tracker</h1>
    <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.75 }}>Track your toddler's Hindi journey</p>
  </div>

  <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", background: "#f0efea", borderRadius: 12, padding: 4 }}>
    {tabs.map(t => (
      <button key={t} onClick={() => setTab(t)} style={{
        flex: 1, padding: "7px 0", borderRadius: 9, fontSize: 13, cursor: "pointer",
        border: "none",
        background: tab === t ? "#fff" : "transparent",
        fontWeight: tab === t ? 500 : 400,
        color: tab === t ? "#1a1a1a" : "#666",
        boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
      }}>{t}</button>
    ))}
  </div>

  {tab === "Dashboard" && (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: "1.5rem", alignItems: "center", background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 16, padding: "1.25rem" }}>
        <DonutChart data={donutData} size={110} />
        <div style={{ flex: 1 }}>
          {MASTERY.map(m => (
            <div key={m} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: PALETTE[m].dot, flexShrink: 0 }} />
              <span style={{ fontSize: 13, flex: 1, color: "#666" }}>{m}</span>
              <span style={{ fontSize: 18, fontWeight: 500 }}>{masteryCount(m)}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 11, fontWeight: 500, marginBottom: 10, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>By category</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10, marginBottom: "1.5rem" }}>
        {CATEGORIES.map(cat => {
          const items = data[cat];
          const mastered = items.filter(i => i.mastery === "Mastered").length;
          const c = CAT_COLORS[cat];
          return (
            <div key={cat} onClick={() => { setTab("Track"); setActiveCategory(cat); }}
              style={{ background: c.fill, borderRadius: 14, padding: "1rem 0.875rem", cursor: "pointer" }}>
              <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: 0.5 }}>{cat}</p>
              <p style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 600, color: "#fff" }}>{items.length}</p>
              <BarMini items={items} />
              <p style={{ margin: "6px 0 0", fontSize: 11, color: "rgba(255,255,255,0.75)" }}>{mastered} mastered</p>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: 11, fontWeight: 500, marginBottom: 10, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>Recent additions</p>
      {allItems.sort((a,b) => b.date.localeCompare(a.date)).slice(0,5).map(i => (
        <div key={i.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}>
          <span style={{ fontSize: 14 }}>{i.item}</span>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: PALETTE[i.mastery].bg, color: PALETTE[i.mastery].text, border: `0.5px solid ${PALETTE[i.mastery].border}`, whiteSpace: "nowrap", marginLeft: 8 }}>{i.mastery}</span>
        </div>
      ))}
    </div>
  )}

  {tab === "Track" && (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {CATEGORIES.map(c => {
          const col = CAT_COLORS[c];
          const active = activeCategory === c;
          return (
            <button key={c} onClick={() => setActiveCategory(c)} style={{
              padding: "6px 14px", borderRadius: 99, fontSize: 12, cursor: "pointer",
              border: active ? "none" : "0.5px solid rgba(0,0,0,0.15)",
              background: active ? col.fill : "transparent",
              color: active ? "#fff" : "#666", fontWeight: active ? 500 : 400
            }}>{c} <span style={{ opacity: 0.7 }}>({data[c].length})</span></button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === "Enter" && addItem()}
          placeholder={activeCategory === "Songs & Rhymes" ? "Song name..." : "Hindi word or phrase..."}
          style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: "0.5px solid rgba(0,0,0,0.15)", fontSize: 14, outline: "none" }} />
        <select value={newMastery} onChange={e => setNewMastery(e.target.value)}
          style={{ padding: "9px 8px", borderRadius: 10, border: "0.5px solid rgba(0,0,0,0.15)", fontSize: 13 }}>
          {MASTERY.map(m => <option key={m}>{m}</option>)}
        </select>
        <button onClick={addItem} style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: CAT_COLORS[activeCategory].fill, cursor: "pointer", fontSize: 18, color: "#fff", lineHeight: 1 }}>+</button>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: "1rem" }}>
        {["All", ...MASTERY].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "3px 10px", borderRadius: 99, fontSize: 11, cursor: "pointer",
            border: filter === f ? `1px solid ${f !== "All" ? PALETTE[f]?.border : "rgba(0,0,0,0.3)"}` : "0.5px solid rgba(0,0,0,0.12)",
            background: f !== "All" && filter === f ? PALETTE[f]?.bg : "transparent",
            color: f !== "All" && filter === f ? PALETTE[f]?.text : filter === f ? "#1a1a1a" : "#888"
          }}>{f}</button>
        ))}
      </div>

      {data[activeCategory].filter(i => filter === "All" || i.mastery === filter).map(i => (
        <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTE[i.mastery].dot, flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: 14 }}>{i.item}</div>
          <select value={i.mastery} onChange={e => updateMastery(activeCategory, i.id, e.target.value)}
            style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, border: `0.5px solid ${PALETTE[i.mastery].border}`, background: PALETTE[i.mastery].bg, color: PALETTE[i.mastery].text, cursor: "pointer" }}>
            {MASTERY.map(m => <option key={m}>{m}</option>)}
          </select>
          <button onClick={() => removeItem(activeCategory, i.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#bbb", lineHeight: 1, padding: "0 2px" }}>×</button>
        </div>
      ))}
      {data[activeCategory].filter(i => filter === "All" || i.mastery === filter).length === 0 && (
        <p style={{ fontSize: 13, color: "#888", textAlign: "center", padding: "2rem 0" }}>Nothing here yet — add something above.</p>
      )}
    </div>
  )}

  {tab === "Notes" && (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem" }}>
        <input value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => e.key === "Enter" && addNote()}
          placeholder="Log a milestone, funny moment, or observation..."
          style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: "0.5px solid rgba(0,0,0,0.15)", fontSize: 14, outline: "none" }} />
        <button onClick={addNote} style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: "#534AB7", cursor: "pointer", fontSize: 13, color: "#fff", fontWeight: 500 }}>Add</button>
      </div>
      {notes.map((n, idx) => (
        <div key={n.id} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: idx % 2 === 0 ? "#EEEDFE" : "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, color: idx % 2 === 0 ? "#534AB7" : "#0F6E56" }}>✦</div>
          <div>
            <p style={{ margin: 0, fontSize: 14 }}>{n.text}</p>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#999" }}>{n.date}</p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
```

);
}
