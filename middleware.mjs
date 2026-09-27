const SUPABASE_URL='https://iexionzhuymetllkwgkv.supabase.co';
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleGlvbnpodXltZXRsbGt3Z2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTU4NDgsImV4cCI6MjEwNTY3MTg0OH0.Nv5yWm2ghH7CGgziJXtWYaOQK1Etdu3K08Oiocgezg8';

const publicAsset=/\.(?:css|js|mjs|png|jpe?g|svg|webp|woff2?|ico|txt|webmanifest)$/i;
const getCookie=(request,name)=>request.headers.get('cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith(name+'='))?.slice(name.length+1);

function loginRedirect(request){
 const url=new URL('/',request.url);
 const original=new URL(request.url);
 url.searchParams.set('acesso','1');
 url.searchParams.set('voltar',original.pathname+original.search);
 return new Response(null,{status:307,headers:{Location:url.toString(),'Cache-Control':'no-store'}});
}

export default async function middleware(request){
 const url=new URL(request.url);
 if(url.pathname==='/'||url.pathname==='/api/leads'||publicAsset.test(url.pathname))return;
 const token=getCookie(request,'purolar-auth-token');
 if(!token)return loginRedirect(request);
 try{
  const response=await fetch(SUPABASE_URL+'/auth/v1/user',{headers:{apikey:SUPABASE_ANON_KEY,Authorization:'Bearer '+token},cache:'no-store'});
  if(response.ok)return;
 }catch{}
 const response=loginRedirect(request);
 response.headers.append('Set-Cookie','purolar-auth-token=; Path=/; Max-Age=0; SameSite=Lax');
 return response;
}
