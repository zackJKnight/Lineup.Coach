import type {Assignment,Input} from './model';
const INF=1e12;
// Minimum-cost perfect matching. Forbidden edges remain forbidden after matching.
function match(cost:number[][]):number[]{
 const n=cost.length,u=Array(n+1).fill(0),v=Array(n+1).fill(0),p=Array(n+1).fill(0),way=Array(n+1).fill(0);
 for(let i=1;i<=n;i++){p[0]=i;let j0=0;const min=Array(n+1).fill(INF),used=Array(n+1).fill(false);
  do{used[j0]=true;const i0=p[j0];let delta=INF,j1=0;
   for(let j=1;j<=n;j++)if(!used[j]){const cur=cost[i0-1][j-1]-u[i0]-v[j];if(cur<min[j]){min[j]=cur;way[j]=j0}if(min[j]<delta){delta=min[j];j1=j}}
   if(delta>=INF/2)throw new Error('No valid lineup fits the exclusions and locks. Adjust the conflicting choices.');
   for(let j=0;j<=n;j++)if(used[j]){u[p[j]]+=delta;v[j]-=delta}else min[j]-=delta;
   j0=j1;
  }while(p[j0]!==0);
  do{const j1=way[j0];p[j0]=p[j1];j0=j1}while(j0);
 }
 const result=Array(n).fill(-1);for(let j=1;j<=n;j++)result[p[j]-1]=j-1;
 if(result.some((j,i)=>cost[i][j]>=INF/2))throw new Error('No valid lineup fits these constraints.');return result;
}
function random(seed:number){let s=seed>>>0;return()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/4294967296}}
export function validate(input:Input,a:Assignment[]):string[]{
 const errors:string[]=[];const expected=input.players.length*input.periods;
 if(a.length!==expected)errors.push('Every present player must be assigned in every period.');
 for(let period=0;period<input.periods;period++){
  const rows=a.filter(x=>x.period===period);if(rows.length!==input.players.length||new Set(rows.map(x=>x.playerId)).size!==input.players.length)errors.push(`Period ${period+1}: duplicate or missing player.`);
  if(new Set(rows.map(x=>x.positionId)).size!==rows.length)errors.push(`Period ${period+1}: duplicate position.`);
  for(const pos of input.positions)if(!rows.some(x=>x.positionId===pos.id&&!x.bench))errors.push(`Period ${period+1}: missing ${pos.name}.`);
  for(const row of rows){const player=input.players.find(p=>p.id===row.playerId);if(!player)errors.push('An unavailable player is assigned.');else if(player.excluded.includes(row.positionId))errors.push(`${player.firstName} is assigned an excluded position.`);if(row.bench?!row.positionId.startsWith('__bench_'):!input.positions.some(p=>p.id===row.positionId))errors.push('Unknown position.');}
 }
 for(const lock of input.locks)if(!a.some(x=>x.period===lock.period&&x.positionId===lock.positionId&&x.playerId===lock.playerId))errors.push('A locked assignment changed.');
 return [...new Set(errors)];
}
export function audit(input:Input,a:Assignment[]){
 const counts=input.players.map(p=>a.filter(x=>x.playerId===p.id&&x.bench).length);let preference=0,consecutive=0,variety=0;
 for(const player of input.players){const rows=a.filter(x=>x.playerId===player.id).sort((x,y)=>x.period-y.period);variety+=new Set(rows.filter(x=>!x.bench).map(x=>x.positionId)).size;rows.forEach((x,i)=>{if(x.bench&&i&&rows[i-1].bench)consecutive++;const rank=player.ranking.indexOf(x.positionId);if(!x.bench&&rank>=0)preference+=player.ranking.length-rank})}
 return {benchSpread:counts.length?Math.max(...counts)-Math.min(...counts):0,benchSquares:counts.reduce((s,n)=>s+n*n,0),preference,consecutive,variety};
}
export function generate(input:Input):Assignment[]{
 const {players,positions,periods}=input,n=players.length;
 if(!n)throw new Error('Mark at least one player present.');if(!positions.length)throw new Error('Add at least one field position.');
 if(n<positions.length)throw new Error(`${positions.length} field positions need at least ${positions.length} present players; only ${n} are present.`);
 if(n>40||positions.length>22||!Number.isInteger(periods)||periods<1||periods>12)throw new Error('Use 1–40 players, 1–22 field positions and 1–12 periods.');
 if(new Set(players.map(p=>p.id)).size!==n||new Set(positions.map(p=>p.id)).size!==positions.length)throw new Error('Player and position IDs must be unique.');
 if(positions.some(p=>p.id.startsWith('__bench_')))throw new Error('Reserved position ID.');
 const slots=[...positions.map(p=>({id:p.id,bench:false})),...Array.from({length:n-positions.length},(_,i)=>({id:`__bench_${i}`,bench:true}))];
 const lockKeys=new Set<string>(),lockedPlayers=new Set<string>();
 for(const l of input.locks){const k=`${l.period}/${l.positionId}`,pk=`${l.period}/${l.playerId}`;
  if(!Number.isInteger(l.period)||l.period<0||l.period>=periods||!slots.some(s=>s.id===l.positionId)||!players.some(p=>p.id===l.playerId)||lockKeys.has(k)||lockedPlayers.has(pk))throw new Error('A lock is unavailable or conflicts with another lock. Unlock it before generating.');lockKeys.add(k);lockedPlayers.add(pk);
 }
 const rng=random(input.seed);let best:Assignment[]|undefined,bestTuple:number[]=[];
 // Bounded multistart matching: polynomial work per period; hard rules never traded for score.
 for(let attempt=0;attempt<24;attempt++){
  const benches=Array(n).fill(0),previous=Array(n).fill(false),visits=players.map(()=>new Map<string,number>()),rows:Assignment[]=[];
  for(let period=0;period<periods;period++){
   const locks=input.locks.filter(l=>l.period===period);
   const cost=players.map((player,i)=>slots.map(slot=>{
    if(player.excluded.includes(slot.id)||locks.some(l=>(l.playerId===player.id&&l.positionId!==slot.id)||(l.positionId===slot.id&&l.playerId!==player.id)))return INF;
    const rank=player.ranking.indexOf(slot.id);const pref=rank<0?0:player.ranking.length-rank;
    return slot.bench?benches[i]*100000+(previous[i]?1000:0)+rng()*100: -pref*30+(visits[i].get(slot.id)??0)*12+rng()*(attempt?60:0);
   }));
   const assignment=match(cost);assignment.forEach((j,i)=>{const s=slots[j];rows.push({period,positionId:s.id,playerId:players[i].id,bench:s.bench});if(s.bench)benches[i]++;else visits[i].set(s.id,(visits[i].get(s.id)??0)+1);previous[i]=s.bench});
  }
  const score=audit(input,rows),tuple=[score.benchSpread,score.benchSquares,score.consecutive,-score.preference,-score.variety];
  const better=!best||tuple.some((v,i)=>v<bestTuple[i]&&tuple.slice(0,i).every((x,j)=>x===bestTuple[j]));if(better){best=rows;bestTuple=tuple}
 }
 const errors=validate(input,best!);if(errors.length)throw new Error(errors.join(' '));return best!;
}
export function swap(input:Input,assignments:Assignment[],period:number,positionId:string,playerId:string):Assignment[]{
 const next=assignments.map(x=>({...x})),target=next.find(x=>x.period===period&&x.positionId===positionId),other=next.find(x=>x.period===period&&x.playerId===playerId);
 if(!target||!other)throw new Error('Both players must be present in this period.');[target.playerId,other.playerId]=[other.playerId,target.playerId];const errors=validate(input,next);if(errors.length)throw new Error(errors.join(' '));return next;
}
