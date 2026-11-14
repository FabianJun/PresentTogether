import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {openDatabase} from '../server/database.mjs';
test('Persistent rooms survive a database restart and migrations run once',async()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'control-db-')),file=path.join(dir,'game.sqlite');let db;try{db=openDatabase(file);await db.DB.prepare('INSERT INTO rooms(code,host_hash,created) VALUES(?,?,?)').bind('ABCDEF','hash',Date.now()).run();db.close();db=openDatabase(file);assert.equal((await db.DB.prepare('SELECT code FROM rooms').first()).code,'ABCDEF');assert.equal((await db.DB.prepare('SELECT COUNT(*) AS n FROM _control_migrations').first()).n,6);}finally{db?.close();for(const f of fs.readdirSync(dir))fs.unlinkSync(path.join(dir,f));fs.rmdirSync(dir);}});

test('SQLite adapter rolls back failed batches atomically',async()=>{const db=openDatabase();try{await assert.rejects(()=>db.DB.batch([db.DB.prepare('INSERT INTO rooms(code,host_hash,created) VALUES(?,?,?)').bind('ABCDEF','hash',1),db.DB.prepare('INSERT INTO members(id,room,team,created) VALUES(?,?,?,?)').bind('id','MISSING','A',1)]));assert.equal((await db.DB.prepare('SELECT COUNT(*) AS n FROM rooms').first()).n,0);}finally{db.close();}});

test('Removed poll migration remaps slides once and preserves histories and room keys',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'control-slides-')),file=path.join(dir,'game.sqlite');let db;
 try{
  db=openDatabase(file);
  await db.DB.prepare("DELETE FROM _control_migrations WHERE name='0005_inline_game_debrief'").run();
  const cases=[['AAAAAA',9,[],9],['BBBBBB',10,[{index:0},{index:1},{index:2},{index:3}],9],['CCCCCC',10,[],10],['DDDDDD',11,[],10],['EEEEEE',12,[],11],['FFFFFF',15,[],14]];
  for(const [code,slide,history]of cases)await db.DB.prepare('INSERT INTO rooms(code,host_hash,created,slide,history) VALUES(?,?,?,?,?)').bind(code,'private-'+code,1,slide,JSON.stringify(history)).run();
  db.close();db=openDatabase(file);
  for(const [code,,history,slide]of cases){const row=await db.DB.prepare('SELECT slide,history,host_hash,outcome_view,revealed FROM rooms WHERE code=?').bind(code).first();assert.equal(row.slide,slide);assert.equal(row.history,JSON.stringify(history));assert.equal(row.host_hash,'private-'+code);if(code==='BBBBBB'){assert.equal(row.outcome_view,'summary');assert.equal(row.revealed,1);}}
  db.close();db=openDatabase(file);
  assert.equal((await db.DB.prepare("SELECT slide FROM rooms WHERE code='FFFFFF'").first()).slide,14);
 }finally{db?.close();for(const f of fs.readdirSync(dir))fs.unlinkSync(path.join(dir,f));fs.rmdirSync(dir);}
});
