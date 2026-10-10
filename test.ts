import { chooseView } from "./planner.ts";
const base = [{date:"2026-10-01",value:10,unit:"ms"},{date:"2026-10-02",value:20,unit:"ms"},{date:"2026-10-03",value:15,unit:"ms"}];
let passed = 0;
function check(name: string, f: () => void) { f(); passed++; console.log("PASS " + name); }
function equal(actual: unknown, expected: unknown) { if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(JSON.stringify({actual, expected})); }
function error(input: unknown, expected: string) {
 let message = ""; try { chooseView(input); } catch(e) { message = (e as Error).message; } equal(message, expected);
}
check("complete series", () => equal(chooseView({rows:base}).component,"line-chart"));
check("zero is a value", () => equal(chooseView({rows:base.map(r=>({...r,value:0}))}).component,"line-chart"));
check("negative values", () => equal(chooseView({rows:base.map(r=>({...r,value:-1}))}).component,"line-chart"));
check("two points", () => equal(chooseView({rows:base.slice(0,2)}).reason,"too-few-points"));
check("mixed units", () => equal(chooseView({rows:base.map((r,i)=>({...r,unit:i===1?"USD":"ms"}))}).reason,"mixed-units"));
check("missing stays missing", () => { const rows=base.map((r,i)=>({...r,value:i===1?null:r.value})); const v=chooseView({rows}); equal(v.reason,"missing-values"); equal(v.rows,rows); });
check("descending dates", () => equal(chooseView({rows:[...base].reverse()}).reason,"not-strictly-chronological"));
check("duplicate dates", () => equal(chooseView({rows:[base[0],base[0],base[2]]}).reason,"not-strictly-chronological"));
check("irregular spacing", () => equal(chooseView({rows:[base[0],base[1],{...base[2],date:"2026-10-04"}]}).reason,"irregular-spacing"));
check("invalid calendar date", () => error({rows:[{...base[0],date:"2026-02-30"}]},"invalid-row"));
check("NaN rejected", () => error({rows:[{...base[0],value:NaN}]},"invalid-row"));
check("infinity rejected", () => error({rows:[{...base[0],value:Infinity}]},"invalid-row"));
check("empty rejected", () => error({rows:[]},"invalid-row-count"));
check("oversized rejected", () => error({rows:Array(101).fill(base[0])},"invalid-row-count"));
check("envelope rejected", () => error(null,"invalid-envelope"));
check("empty unit rejected", () => error({rows:[{...base[0],unit:" "}]},"invalid-row"));
check("extra markup excluded", () => equal(chooseView({rows:base.map(r=>({...r,html:"<script>bad()</script>"}))}).rows,base));
check("input not mutated", () => { const before=JSON.stringify(base); chooseView({rows:base}); equal(JSON.stringify(base),before); });
console.log(passed + "/18 checks passed");
for(const [name,rows] of [["complete",base],["missing",base.map((r,i)=>({...r,value:i===1?null:r.value}))]] as const) {
 const view=chooseView({rows}); console.log(name+": "+view.component+" ("+view.reason+")");
}
