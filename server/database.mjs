import {DatabaseSync} from 'node:sqlite';import fs from 'node:fs';import path from 'node:path';
export function openDatabase(filename=':memory:'){
 if(filename!==':memory:')fs.mkdirSync(path.dirname(filename),{recursive:true});
 const sqlite=new DatabaseSync(filename);sqlite.exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');if(filename!==':memory:')sqlite.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL;');
 sqlite.exec('CREATE TABLE IF NOT EXISTS _control_migrations (name TEXT PRIMARY KEY)');
 const migrations=fs.readdirSync(new URL('../drizzle/',import.meta.url)).filter(x=>x.endsWith('.sql')).sort();for(const file of migrations){const migration=file.replace(/\.sql$/,'');if(!sqlite.prepare('SELECT name FROM _control_migrations WHERE name=?').get(migration)){sqlite.exec('BEGIN');try{sqlite.exec(fs.readFileSync(new URL('../drizzle/'+file,import.meta.url),'utf8'));sqlite.prepare('INSERT INTO _control_migrations(name) VALUES(?)').run(migration);sqlite.exec('COMMIT');}catch(e){sqlite.exec('ROLLBACK');throw e;}}}
 class Statement{constructor(sql,args=[]){this.sql=sql;this.args=args;}bind(...args){return new Statement(this.sql,args);}async first(){return sqlite.prepare(this.sql).get(...this.args)||null;}async all(){return {results:sqlite.prepare(this.sql).all(...this.args)};}runNow(){const r=sqlite.prepare(this.sql).run(...this.args);return {meta:{changes:Number(r.changes)}};}async run(){return this.runNow();}}
 return {DB:{prepare:sql=>new Statement(sql),async batch(statements){sqlite.exec('BEGIN');try{const result=statements.map(s=>s.runNow());sqlite.exec('COMMIT');return result;}catch(e){sqlite.exec('ROLLBACK');throw e;}}},close:()=>sqlite.close()};
}
