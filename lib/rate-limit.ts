const requests=new Map<string,{count:number;until:number}>();
export function allowRequest(key:string,limit=12,windowMs=60_000){const now=Date.now();const current=requests.get(key);if(!current||current.until<now){requests.set(key,{count:1,until:now+windowMs});return true}if(current.count>=limit)return false;current.count++;return true}
