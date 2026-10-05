export interface Player {id:string;firstName:string;lastName:string;ranking:string[];excluded:string[]}
export interface Position {id:string;name:string}
export interface Team {id:string;name:string;players:Player[];positions:Position[]}
export interface Assignment {period:number;positionId:string;playerId:string;bench:boolean}
export interface Lock {period:number;positionId:string;playerId:string}
export interface Game {id:string;teamId:string;opponent:string;date:string;time?:string;periods:number;minutes:number;attendance:Record<string,boolean>;assignments:Assignment[];locks:Lock[];generatedAt?:string;elapsedMs?:number;seed:number}
export interface State {id:'main';revision:number;selectedTeamId:string;selectedGameId:string;teams:Team[];games:Game[]}
export interface Input {players:Player[];positions:Position[];periods:number;locks:Lock[];seed:number}
export const uid=()=>crypto.randomUUID();
export const emptyState=():State=>({id:'main',revision:0,selectedTeamId:'',selectedGameId:'',teams:[],games:[]});
export function newGame(team:Team,opponent='New game'):Game {return {id:uid(),teamId:team.id,opponent,date:new Date().toISOString().slice(0,10),periods:4,minutes:12,attendance:Object.fromEntries(team.players.map(p=>[p.id,true])),assignments:[],locks:[],seed:42}}
export function seedState():State {const positions=['Goalkeeper','Left defender','Right defender','Left midfield','Right midfield','Striker'].map(name=>({id:uid(),name}));const team:Team={id:uid(),name:'Demo · U10 Eagles',positions,players:['Alex Morgan','Jordan Lee','Taylor Brooks','Casey Reed','Riley Quinn','Sam Parker','Jamie Ellis','Avery Blake','Drew Lane'].map((name,i)=>({id:uid(),firstName:name.split(' ')[0],lastName:name.split(' ')[1],ranking:[positions[i%6].id,positions[(i+2)%6].id,positions[(i+4)%6].id],excluded:[]}))};const game=newGame(team,'Saturday friendly');return {id:'main',revision:0,teams:[team],games:[game],selectedTeamId:team.id,selectedGameId:game.id}}
export function inputFor(team:Team,game:Game):Input{return {players:team.players.filter(p=>game.attendance[p.id]!==false),positions:team.positions,periods:game.periods,locks:game.locks,seed:game.seed}}
