import Dexie,{type Table} from 'dexie';
import {seedState,emptyState,type State} from './model';
export interface Change {key:string;collection:string;id:string;body:Record<string,unknown>|null;revision:number}
export class Store extends Dexie {state!:Table<State,string>;pending!:Table<Change,string>;settings!:Table<{key:string;value:string},string>;constructor(name='lineup-coach-mvp',public demo=true){super(name);this.version(1).stores({state:'id',pending:'key',settings:'key'})}}
export const isDemo=typeof location!=='undefined'&&/^\/demo\/?$/.test(location.pathname);
export const db=new Store(isDemo?'lineup-coach-demo':'lineup-coach-mvp',isDemo);
export const DEFAULT_API='https://lineup-coach-api.vercel.app';
export async function syncKey(store=db){return store.transaction('rw',store.settings,async()=>{const old=await store.settings.get('sync-key');if(old)return old.value;const value=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');await store.settings.put({key:'sync-key',value});return value})}
export async function initializeApi(store=db){const existing=await store.settings.get('api');if(existing)return existing.value;const base=store===db&&isDemo?'':DEFAULT_API;await configureApi(base,store);return base}
export function records(state:State):Map<string,{collection:string;id:string;body:Record<string,unknown>}>{const result=new Map<string,{collection:string;id:string;body:Record<string,unknown>}>();const add=(collection:string,id:string,body:Record<string,unknown>)=>result.set(`${collection}/${id}`,{collection,id,body:{id,...body}});
 for(const t of state.teams){add('teams',t.id,{name:t.name,playerIds:t.players.map(p=>p.id),positionIds:t.positions.map(p=>p.id)});for(const p of t.players)add('players',p.id,{firstName:p.firstName,lastName:p.lastName,teamId:t.id,positionPreferenceRank:{ranking:p.ranking},excludedPositionIds:p.excluded,startingPositionIds:[],benchIds:[]});for(const p of t.positions)add('positions',p.id,{name:p.name,teamId:t.id})}
 for(const g of state.games){for(const bench of new Set(g.assignments.filter(a=>a.bench).map(a=>a.positionId)))add('positions',`${g.id}${bench}`,{name:'Bench',gameId:g.id,isBench:true});add('games',g.id,{opponent:g.opponent,time:g.time??'',datetime:g.date?`${g.date}T12:00:00Z`:null,teamId:g.teamId,attendance:g.attendance,minutes:g.minutes,periodCount:g.periods,locks:g.locks,seed:g.seed});for(let i=0;i<g.periods;i++){const id=`${g.id}-period-${i}`;add('periods',id,{gameId:g.id,number:i+1});const rows=g.assignments.filter(a=>a.period===i);if(rows.length)add('lineups',`${g.id}-lineup-${i}`,{teamId:g.teamId,gameId:g.id,periodId:id,assignments:Object.fromEntries(rows.map(a=>[a.bench?`${g.id}${a.positionId}`:a.positionId,a.playerId]))})}}return result;
}
export async function saveState(next:State,store=db){await store.transaction('rw',store.state,store.pending,async()=>{const old=await store.state.get('main');if(old&&old.revision!==next.revision-1)throw new Error('This game changed in another tab. Reload before editing.');const before=old?records(old):new Map(),after=records(next);
 for(const [key,row]of after)if(JSON.stringify(before.get(key)?.body)!==JSON.stringify(row.body))await store.pending.put({...row,key,revision:next.revision});
 for(const [key,row]of before)if(!after.has(key))await store.pending.put({...row,key,body:null,revision:next.revision});await store.state.put(next)});}
export async function loadState(store=db){
 let archived:State|undefined;
 if(store===db&&isDemo){const main=new Store('lineup-coach-mvp',false);try{const row=await main.settings.get('demo-archive');if(row)archived=JSON.parse(row.value)}finally{main.close()}}
 return store.transaction('rw',store.state,store.pending,store.settings,async()=>{
  const old=await store.state.get('main');
  if(store.demo&&archived&&!(await store.settings.get('demo-imported'))){
   const imported=old?structuredClone(old):{...emptyState(),revision:-1};
   for(const team of archived.teams)if(!imported.teams.some(t=>t.id===team.id))imported.teams.push(team);
   for(const game of archived.games)if(!imported.games.some(g=>g.id===game.id))imported.games.push(game);
   imported.selectedTeamId=archived.selectedTeamId;imported.selectedGameId=archived.selectedGameId;imported.revision++;
   await saveState(imported,store);await store.settings.put({key:'demo-imported',value:'true'});return imported;
  }
  if(old){
   const demoIds=new Set(!store.demo?old.teams.filter(t=>t.name==='Demo · U10 Eagles').map(t=>t.id):[]);
   if(demoIds.size){
    const archive={...old,teams:old.teams.filter(t=>demoIds.has(t.id)),games:old.games.filter(g=>demoIds.has(g.teamId))};archive.selectedTeamId=archive.teams[0].id;archive.selectedGameId=archive.games.find(g=>g.teamId===archive.selectedTeamId)!.id;
    await store.settings.put({key:'demo-archive',value:JSON.stringify(archive)});
    const clean={...old,revision:old.revision+1,teams:old.teams.filter(t=>!demoIds.has(t.id)),games:old.games.filter(g=>!demoIds.has(g.teamId))};
    if(demoIds.has(clean.selectedTeamId)){clean.selectedTeamId=clean.teams[0]?.id??'';clean.selectedGameId=clean.games.find(g=>g.teamId===clean.selectedTeamId)?.id??''}
    await saveState(clean,store);return clean;
   }return old;
  }
  const state=store.demo?seedState():emptyState();await saveState(state,store);return state;
 });
}
export type SyncStatus='local'|'offline'|'syncing'|'synced'|'error';
let running=false;
export async function sync(base:string,notify:(s:SyncStatus)=>void,store=db,request:typeof fetch=fetch){if(!base){notify('local');return}if(typeof navigator!=='undefined'&&navigator.onLine===false){notify('offline');return}if(running)return;running=true;notify('syncing');
 try{const headers:Record<string,string>={'Content-Type':'application/json'};if(base.replace(/\/$/,'')===DEFAULT_API)headers.Authorization=`Bearer ${await syncKey(store)}`;const pending=await store.pending.toArray();const order=['teams','players','positions','games','periods','lineups'];pending.sort((a,b)=>order.indexOf(a.collection)-order.indexOf(b.collection));for(const row of pending){const upsert=!!row.body&&base.replace(/\/$/,'')===DEFAULT_API;const url=`${base.replace(/\/$/,'')}/${row.collection}${upsert?'':'/'+encodeURIComponent(row.id)}`;let response=await request(url,{method:row.body?(upsert?'POST':'PUT'):'DELETE',headers,body:row.body?JSON.stringify(row.body):undefined,signal:AbortSignal.timeout(10000)});
 if(row.body&&response.status===404)response=await request(`${base.replace(/\/$/,'')}/${row.collection}`,{method:'POST',headers,body:JSON.stringify(row.body),signal:AbortSignal.timeout(10000)});
 if(!response.ok&&!(row.body===null&&response.status===404))throw new Error(`Sync failed: ${response.status}`);
 if(row.body){const body=await response.json();if(body.id!==row.id)throw new Error('API returned a different record ID.');}
 await store.transaction('rw',store.pending,async()=>{const current=await store.pending.get(row.key);if(current?.revision===row.revision)await store.pending.delete(row.key)});
 }notify(await store.pending.count()?'local':'synced');}catch{notify('error')}finally{running=false}}

export async function configureApi(base:string,store=db){return store.transaction('rw',store.state,store.pending,store.settings,async()=>{const old=await store.settings.get('api');const state=await store.state.get('main');if(!state)throw new Error('No local state.');if(old?.value!==base){state.revision++;for(const change of await store.pending.toArray())await store.pending.put({...change,revision:state.revision});for(const[key,row]of records(state))await store.pending.put({...row,key,revision:state.revision});await store.state.put(state)}await store.settings.put({key:'api',value:base});return state})}
