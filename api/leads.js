const SUPABASE_URL=process.env.PUROLAR_SUPABASE_URL||'https://iexionzhuymetllkwgkv.supabase.co';
const SUPABASE_KEY=process.env.PUROLAR_SUPABASE_ANON_KEY||'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleGlvbnpodXltZXRsbGt3Z2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTU4NDgsImV4cCI6MjEwNTY3MTg0OH0.Nv5yWm2ghH7CGgziJXtWYaOQK1Etdu3K08Oiocgezg8';
const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Método não permitido.'});
 const body=req.body||{},name=typeof body.name==='string'?body.name.trim():'',contact=typeof body.contact==='string'?body.contact.trim():'';
 const service=typeof body.service==='string'?body.service.trim().slice(0,100):'Ainda não sei',area=typeof body.area==='string'?body.area.trim().slice(0,100):'',message=typeof body.message==='string'?body.message.trim().slice(0,3000):'';
 if(name.length<2||name.length>100||contact.length<3||contact.length>160||body.consent!==true)return res.status(400).json({error:'Confirme o nome, contacto e autorização de contacto.'});
 if(!/^\+?[\d\s().-]{9,30}$/.test(contact)&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact))return res.status(400).json({error:'Introduza um telefone ou e-mail válido.'});
 try{
  const saved=await fetch(SUPABASE_URL+'/rest/v1/purolar_leads',{method:'POST',headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({name,contact,service,area,message,consent:true,source:'purolar-website'})});
  if(!saved.ok){console.error('Supabase leads:',saved.status,await saved.text());return res.status(502).json({error:'Não foi possível guardar o pedido.'});}
  let emailSent=false;
  if(process.env.RESEND_API_KEY){
   const email=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.RESEND_FROM||'PuroLar <onboarding@resend.dev>',to:process.env.PUROLAR_LEADS_EMAIL||'contacto@purolarlimpezas.com',subject:`Novo pedido PuroLar · ${name}`,html:`<h2>Novo pedido de orçamento</h2><p><strong>Nome:</strong> ${escapeHtml(name)}</p><p><strong>Contacto:</strong> ${escapeHtml(contact)}</p><p><strong>Serviço:</strong> ${escapeHtml(service)}</p><p><strong>Localidade:</strong> ${escapeHtml(area||'Não indicada')}</p><p><strong>Detalhes:</strong><br>${escapeHtml(message||'Não indicados').replace(/\n/g,'<br>')}</p>`})});
   emailSent=email.ok;if(!email.ok)console.error('Resend:',email.status,await email.text());
  }
  return res.status(201).json({ok:true,emailSent});
 }catch(error){console.error(error);return res.status(502).json({error:'Não foi possível contactar o serviço de pedidos.'});}
}
