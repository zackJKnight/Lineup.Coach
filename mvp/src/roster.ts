export function parseRoster(text:string):{firstName:string;lastName:string}[]{
 return text.split(/\r?\n/).filter(line=>line.trim()).map(line=>{
  const columns=line.split('\t').map(value=>value.trim());
  if(columns.length>1)return {firstName:columns[0],lastName:columns.slice(1).filter(Boolean).join(' ')};
  const [firstName,...rest]=line.trim().split(/\s+/);return {firstName,lastName:rest.join(' ')};
 });
}
export function duplicateNames(rows:{firstName:string;lastName:string}[]):Set<string>{
 const seen=new Set<string>(),duplicates=new Set<string>();
 for(const row of rows){const key=nameKey(row);if(key&&seen.has(key))duplicates.add(key);seen.add(key)}return duplicates;
}
export const nameKey=(row:{firstName:string;lastName:string})=>`${row.firstName} ${row.lastName}`.trim().replace(/\s+/g,' ').toLocaleLowerCase();
