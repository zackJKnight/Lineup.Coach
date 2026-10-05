import{readdir,readFile,writeFile,mkdir,copyFile}from'node:fs/promises';import{createHash}from'node:crypto';
await mkdir('dist/demo',{recursive:true});await copyFile('dist/index.html','dist/demo/index.html');
const files=(await readdir('dist',{recursive:true})).filter(f=>/\.(html|js|css|svg|webmanifest)$/.test(f)&&f!=='sw.js');const hash=createHash('sha256');for(const f of files)hash.update(await readFile('dist/'+f));const version='lineup-'+hash.digest('hex').slice(0,12);
await writeFile('dist/sw.js',`const CACHE=${JSON.stringify(version)},FILES=${JSON.stringify(files.map(f=>'/'+f))};
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('lineup-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin)return;if(e.request.mode==='navigate')e.respondWith(fetch(e.request).catch(()=>caches.match('/index.html')));else if(FILES.includes(u.pathname))e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});`);
