import { query } from "@/lib/gestion/db";
import { unseal } from "@/lib/gestion/vault";
import { receiveVercelEvent } from "@/lib/gestion/providers";
import { validVercelSignature } from "@/lib/gestion/vercel-events";
import { after } from "next/server";
import { processOwnerPublications } from "@/lib/gestion/owner-releases";
import projects from "../../../../../scripts/releases/projects.json";
export const runtime="nodejs";
export const maxDuration=180;
export async function POST(request:Request) {
  if(!/^[a-f0-9]{40}$/i.test(request.headers.get("x-vercel-signature")||""))return new Response(null,{status:401});
  if(Number(request.headers.get("content-length"))>262144) return new Response(null,{status:413});
  const reader=request.body?.getReader();if(!reader)return new Response(null,{status:400});
  const chunks:Uint8Array[]=[];let total=0;
  while(true){const {done,value}=await reader.read();if(done)break;total+=value.length;if(total>262144){await reader.cancel();return new Response(null,{status:413});}chunks.push(value);}
  const body=Buffer.concat(chunks);
  const hooks=(await query<{id:string;secret_cipher:string;config:{teamId:string}}>("SELECT id,secret_cipher,config FROM ops_integrations WHERE provider='vercel' AND revoked_at IS NULL")).rows;
  for(const hook of hooks){
    const secret=unseal(hook.secret_cipher,`${hook.id}:vercel`);
    if(!validVercelSignature(body,request.headers.get("x-vercel-signature"),secret))continue;
    try {const event=JSON.parse(body.toString("utf8"));const result=await receiveVercelEvent(event,hook.id,hook.config.teamId);
      const project=projects.projects.find(p=>p.id===event.payload?.project?.id);
      if(project&&["deployment.ready","deployment.succeeded"].includes(event.type))after(async()=>{try{await processOwnerPublications(`${projects.owner}/${project.repository}`,project.id);}catch{/* Existing pending requests remain visible. */}});
      return Response.json({received:true,...result},{headers:{"Cache-Control":"no-store"}});}
    catch{return Response.json({error:"Événement refusé."},{status:400});}
  }
  return new Response(null,{status:401});
}
