const $ = (id) => document.getElementById(id);
const COL = ["#9a3412", "#0f766e", "#1d4ed8", "#7e22ce", "#b45309", "#be123c"];
const HOMES = [
  { id: 1, t: "Sunny 2-bed apartment", c: "Cairo", ty: "Apartment", p: 120000, b: 2, a: 95, n: 6 }, { id: 2, t: "Garden villa with pool", c: "Alexandria", ty: "Villa", p: 380000, b: 4, a: 320, n: 5 },
  { id: 3, t: "Compact studio near metro", c: "Cairo", ty: "Studio", p: 54000, b: 1, a: 38, n: 4 }, { id: 4, t: "Sea view 3-bed apartment", c: "Alexandria", ty: "Apartment", p: 210000, b: 3, a: 150, n: 3 },
  { id: 5, t: "Family villa, quiet street", c: "Giza", ty: "Villa", p: 295000, b: 5, a: 380, n: 2 }, { id: 6, t: "Modern studio, new building", c: "Giza", ty: "Studio", p: 62000, b: 1, a: 42, n: 1 },
  { id: 7, t: "Bright 1-bed apartment", c: "Cairo", ty: "Apartment", p: 88000, b: 1, a: 60, n: 7 }, { id: 8, t: "Corner 3-bed apartment", c: "Giza", ty: "Apartment", p: 175000, b: 3, a: 140, n: 8 }];
let saved = []; try { saved = JSON.parse(localStorage.getItem("cedar-saved") || "[]").filter((x) => HOMES.some((h) => h.id === x)); } catch (e) {}
let onlySaved = false, cur = null;
$("city").innerHTML = '<option value="">Any</option>' + [...new Set(HOMES.map((h) => h.c))].map((c) => `<option>${c}</option>`).join("");
const fmt = (n) => "$" + n.toLocaleString("en");
function render() {
  let l = HOMES.filter((h) => (!$("city").value || h.c === $("city").value) && (!$("type").value || h.ty === $("type").value) && (+$("max").value === 0 || h.p <= +$("max").value) && h.b >= +$("bed").value && (!onlySaved || saved.includes(h.id)));
  const s = $("sort").value; l.sort((a, b) => s === "a" ? a.p - b.p : s === "d" ? b.p - a.p : b.n - a.n);
  $("grid").innerHTML = ""; l.forEach((h) => {
    const d = document.createElement("article"); d.className = "card";
    const pic = document.createElement("div"); pic.className = "pic"; pic.style.background = `linear-gradient(135deg,${COL[h.id % 6]},#292524)`; pic.textContent = h.ty; d.appendChild(pic);
    const b = document.createElement("div"); b.className = "body";
    const mk = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; e.textContent = txt; return e; };
    b.append(mk("div", "price", fmt(h.p)), mk("h3", "", h.t), mk("div", "meta", `${h.c} · ${h.b} bed · ${h.a} m²`));
    const a = document.createElement("div"); a.className = "acts";
    const sv = mk("button", "ghost", saved.includes(h.id) ? "Saved ♥" : "Save ♡"); sv.type = "button"; sv.setAttribute("aria-pressed", saved.includes(h.id)); sv.onclick = () => { saved = saved.includes(h.id) ? saved.filter((x) => x !== h.id) : [...saved, h.id]; try { localStorage.setItem("cedar-saved", JSON.stringify(saved)); } catch (e) {} render(); };
    const en = mk("button", "btn", "Enquire"); en.type = "button"; en.onclick = () => { cur = h; $("dt").textContent = "Enquire about: " + h.t; $("ok").hidden = true; $("enq").hidden = false; $("eerr").hidden = true; $("dlg").showModal(); };
    a.append(sv, en); b.appendChild(a); d.appendChild(b); $("grid").appendChild(d);
  });
  $("count").textContent = `${l.length} home${l.length === 1 ? "" : "s"} found`; $("none").hidden = l.length > 0; $("sc").textContent = saved.length;
  $("savedBtn").setAttribute("aria-pressed", onlySaved);
}
$("f").addEventListener("input", render); $("f").addEventListener("submit", (e) => e.preventDefault());
$("savedBtn").onclick = () => { onlySaved = !onlySaved; render(); };
$("cancel").onclick = () => $("dlg").close();
$("enq").addEventListener("submit", (e) => {
  e.preventDefault(); const n = $("en").value.trim(), c = $("ec").value.trim();
  if (n.length < 2 || !/^(\+?[\d\s-]{7,}|[^@\s]+@[^@\s]+\.[^@\s]+)$/.test(c)) { $("eerr").textContent = "Enter your name and a valid phone number or email."; $("eerr").hidden = false; return; }
  $("enq").hidden = true; $("ok").textContent = `Thanks ${n}. This is a demo, so nothing was sent.`; $("ok").hidden = false; setTimeout(() => $("dlg").close(), 1800);
});
render();
