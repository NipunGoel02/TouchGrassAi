import {Mode} from "@/components/product"; export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <Mode id={decodeURIComponent(id)}/>}
