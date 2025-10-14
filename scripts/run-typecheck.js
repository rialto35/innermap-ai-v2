/* scripts/run-typecheck.js */
const { spawn } = require("child_process");
const p = spawn(process.platform==="win32"?"npx.cmd":"npx", ["tsc","--noEmit","--pretty","false"], {
  env: { ...process.env, CI:"1", FORCE_COLOR:"0", PAGER:"cat", GIT_PAGER:"cat" },
});
let out=""; p.stdout.on("data",d=>{process.stdout.write(d); out+=d});
let err=""; p.stderr.on("data",d=>{process.stderr.write(d); err+=d});
p.on("close",(code)=>{
  const text=(out+err); const m=/Found\s+(\d+)\s+errors?\s+in\s+(\d+)\s+files?/i.exec(text);
  const summary={ ok: code===0, exitCode:code, errors:m?+m[1]:null, files:m?+m[2]:null };
  console.log("<<<CURSOR_SENTINEL>>> "+JSON.stringify(summary)); process.exit(code);
});
