import type { Adventure } from "@/lib/adventures";
export type JournalEntry={id:string;adventure:Adventure;completedAt:string;reflection:string;observations:string};
export const KEYS={saved:"tg:saved",recent:"tg:recent",active:"tg:active",journal:"tg:journal",theme:"tg:theme"};
export function read<T>(key:string,fallback:T):T{if(typeof window==="undefined")return fallback;try{return JSON.parse(localStorage.getItem(key)||"") as T}catch{return fallback}}
export function write<T>(key:string,value:T){if(typeof window!=="undefined")localStorage.setItem(key,JSON.stringify(value))}
export function exportData(){if(typeof window==="undefined")return;const data=Object.fromEntries(Object.values(KEYS).map(k=>[k,localStorage.getItem(k)]));const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.download="touchgrass-journal.json";a.click();URL.revokeObjectURL(a.href)}
