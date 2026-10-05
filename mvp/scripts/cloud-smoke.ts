import 'fake-indexeddb/auto';
import assert from 'node:assert/strict';
import {Store,loadState,sync,syncKey,DEFAULT_API,records,saveState} from '../src/storage';
import {generate} from '../src/engine';
import {inputFor} from '../src/model';
const store=new Store('live-verification-'+crypto.randomUUID());
const key=await syncKey(store);
const headers={Authorization:'Bearer '+key};
let expected=new Map();
try{
 const state=await loadState(store);
 state.games[0].assignments=generate(inputFor(state.teams[0],state.games[0]));
 state.revision++;await saveState(state,store);
 expected=records(state);
 let status='';await sync(DEFAULT_API,s=>status=s,store);
 assert.equal(status,'synced');assert.equal(await store.pending.count(),0);
 for(const collection of ['teams','players','positions','games','periods','lineups']){
  const response=await fetch(`${DEFAULT_API}/${collection}`,{headers});assert.equal(response.status,200);
  const actual=await response.json();
  assert.equal(actual.length,[...expected.values()].filter(r=>r.collection===collection).length);
  for(const record of actual)assert.deepEqual(record,expected.get(`${collection}/${record.id}`).body);
 }
 state.teams[0].name='Live verified update';state.revision++;await saveState(state,store);
 await sync(DEFAULT_API,()=>{},store,async()=>new Response('',{status:503}));
 assert.ok(await store.pending.count()>0);
 await sync(DEFAULT_API,s=>status=s,store);assert.equal(status,'synced');
 const updated=await fetch(`${DEFAULT_API}/teams/${state.teams[0].id}`,{headers});
 assert.equal((await updated.json()).name,'Live verified update');
 console.log(`PASS: ${expected.size} generated-game records round-tripped; failed upload retained and retried.`);
}finally{
 for(const row of expected.values()){const response=await fetch(`${DEFAULT_API}/${row.collection}/${row.id}`,{method:'DELETE',headers});assert.ok(response.status===204||response.status===404)}
 await store.delete();
}
