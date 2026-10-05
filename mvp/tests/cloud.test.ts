import 'fake-indexeddb/auto';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Store, loadState, initializeApi, DEFAULT_API, sync, syncKey } from '../src/storage';
test('cloud initialization preserves state and uses a stable device-only capability', async()=>{
 const store=new Store('test-'+crypto.randomUUID());
 const before=await loadState(store);
 assert.equal(await initializeApi(store),DEFAULT_API);
 const after=await loadState(store);
 assert.deepEqual(after.teams,before.teams);
 const key=await syncKey(store);
 assert.match(key,/^[a-f0-9]{64}$/);
 assert.equal(await syncKey(store),key);
 await sync(DEFAULT_API,()=>{},store,async(_url,init)=>{
   assert.equal(init?.method,'POST');
   assert.match(String(_url),/\/(teams|players|positions|games|periods|lineups)$/);
   assert.equal((init?.headers as Record<string,string>).Authorization,'Bearer '+key);
   return Response.json(JSON.parse(String(init?.body)));
 });
 assert.equal(await store.pending.count(),0);
 await store.settings.put({key:'api',value:''});
 assert.equal(await initializeApi(store),'');
 await store.delete();
});
