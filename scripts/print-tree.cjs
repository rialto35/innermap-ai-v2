/* scripts/print-tree.js */
const { spawnSync } = require("child_process"); const fs=require("fs"); const path=require("path");
const ROOT=process.argv[2]||"."; const DEPTH=Number(process.argv[3]||3);
fs.mkdirSync("logs",{recursive:true}); const OUT=path.join("logs","tree.txt");
const hasTree=spawnSync(process.platform==="win32"?"where":"which",["tree"]).status===0;
let content=""; if(hasTree){
  content=spawnSync("tree",["-a","-L",String(DEPTH),"-I","node_modules|.git|.next|.vercel|.vscode|dist|build",ROOT],{encoding:"utf8"}).stdout||"";
}else{
  const cmd=`find '${ROOT}' -maxdepth ${DEPTH} \\( -path '*/node_modules/*' -o -path '*/.git/*' -o -path '*/.next/*' -o -path '*/.vercel/*' -o -path '*/.vscode/*' -o -path '*/dist/*' -o -path '*/build/*' \\) -prune -o -print | sort`;
  content=spawnSync(process.platform==="win32"?"powershell":"bash",[process.platform==="win32"?"-NoProfile -Command": "-lc",cmd],{encoding:"utf8"}).stdout||"";
}
fs.writeFileSync(OUT,content,"utf8");
const lines=content.split("\n").filter(Boolean);
console.log(lines.slice(-120).join("\n"));
console.log("<<<CURSOR_SENTINEL>>> "+JSON.stringify({ok:true,file:OUT,total_lines:lines.length,depth:DEPTH}));
process.exit(0);
