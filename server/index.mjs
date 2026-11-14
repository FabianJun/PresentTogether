import {createServer} from 'node:http';import {openDatabase} from './database.mjs';import worker from '../dist/server/index.js';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const host=process.env.HOST||'127.0.0.1',port=Number(process.env.PORT||8787),database=openDatabase(process.env.DATABASE_PATH||'./data/control.sqlite');
const creates=new Map();
const server=createServer(async(req,res)=>{try{
 if(req.method==='GET'&&req.url?.startsWith('/assets/')){const filename=decodeURIComponent(req.url.split('?')[0].slice(8));if(!/^[A-Za-z0-9_.-]+$/.test(filename)){res.writeHead(404);res.end();return;}const file=path.join(fileURLToPath(new URL('../web/assets/',import.meta.url)),filename);if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}const ext=path.extname(file),type={'.jpg':'image/jpeg','.png':'image/png','.pdf':'application/pdf','.ttf':'font/ttf','.txt':'text/plain','.json':'application/json'}[ext]||'application/octet-stream';res.writeHead(200,{'content-type':type,'cache-control':'public,max-age=86400','x-content-type-options':'nosniff','content-length':fs.statSync(file).size});fs.createReadStream(file).pipe(res);return;}
 if(req.url==='/health'){res.writeHead(200,{'content-type':'application/json'});res.end('{"ok":true}');return;}
 const chunks=[];let bytes=0;for await(const c of req){bytes+=c.length;if(bytes>8192){res.writeHead(413);res.end('Request too large');return;}chunks.push(c);}
 if(req.url?.split('?')[0]==='/api/create'){
  const address=req.socket.remoteAddress==='127.0.0.1'||req.socket.remoteAddress==='::1'||req.socket.remoteAddress?.startsWith('::ffff:127.')?String(req.headers['x-forwarded-for']||req.socket.remoteAddress).split(',')[0]:req.socket.remoteAddress;
  const now=Date.now();for(const [k,v]of creates)if(now-v.start>3600000)creates.delete(k);const count=creates.get(address)||{start:now,n:0};count.n++;creates.set(address,count);if(count.n>20){res.writeHead(429,{'content-type':'application/json'});res.end('{"error":"Room creation limit reached. Try again later."}');return;}
 }
 const origin=process.env.PUBLIC_ORIGIN||'http://'+req.headers.host;
 const request=new Request(origin+req.url,{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body:Buffer.concat(chunks)})});
 const response=await worker.fetch(request,{DB:database.DB},{});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
}catch(e){console.error(new Date().toISOString(),e.message);res.writeHead(500,{'content-type':'application/json'});res.end('{"error":"Server error"}');}});
server.requestTimeout=15000;server.headersTimeout=10000;server.keepAliveTimeout=5000;
server.listen(port,host,()=>console.log('Control Council listening on '+host+':'+port+' with persistent SQLite storage'));
function stop(){server.close(()=>{database.close();process.exit(0);});setTimeout(()=>process.exit(1),10000).unref();}process.on('SIGTERM',stop);process.on('SIGINT',stop);
