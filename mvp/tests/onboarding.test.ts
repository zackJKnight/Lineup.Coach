import 'fake-indexeddb/auto';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Store,loadState,saveState} from '../src/storage';
test('normal onboarding is empty; demo is separate; edited legacy teams survive',async()=>{
 const normal=new Store('normal-'+crypto.randomUUID(),false),demo=new Store('demo-'+crypto.randomUUID(),true);
 assert.equal((await loadState(normal)).teams.length,0);
 assert.equal((await loadState(demo)).teams[0].players.length,9);
 assert.equal((await loadState(normal)).teams.length,0);
 const state=await loadState(demo);state.teams[0].name='My real team';state.revision++;await saveState(state,demo);
 demo.demo=false;
 assert.equal((await loadState(demo)).teams[0].name,'My real team');
 await normal.delete();await demo.delete();
});
test('used demo is archived away from main without removing a real team',async()=>{
 const store=new Store('legacy-'+crypto.randomUUID(),true);
 const s=await loadState(store);
 s.games[0].opponent='Edited demo game';s.revision++;await saveState(s,store);
 const real=structuredClone(s.teams[0]);real.id=crypto.randomUUID();real.name='My team';
 s.teams.push(real);s.revision++;await saveState(s,store);
 store.demo=false;
 const migrated=await loadState(store);
 assert.deepEqual(migrated.teams.map(t=>t.name),['My team']);
 const archived=JSON.parse((await store.settings.get('demo-archive'))!.value);
 assert.equal(archived.games[0].opponent,'Edited demo game');
 assert.equal((await loadState(store)).revision,migrated.revision);
 await store.delete();
});
