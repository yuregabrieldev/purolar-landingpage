const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.navlinks');
toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}));
document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>{document.querySelector('[name=service]').value=a.dataset.service;}));
const form=document.querySelector('#lead-form');
form?.addEventListener('submit',async e=>{e.preventDefault();const button=form.querySelector('button'),status=document.querySelector('#form-status');button.disabled=true;button.textContent='A guardar…';status.textContent='';
try{const d=Object.fromEntries(new FormData(form));d.consent=form.elements.consent.checked;const r=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});const type=r.headers.get('content-type')||'';const out=type.includes('application/json')?await r.json():{};if(!r.ok)throw Error(out.error||'Não foi possível enviar o pedido.');status.textContent=out.emailSent?'Pedido recebido. Enviámos os detalhes para a PuroLar.':'Pedido recebido e guardado. O aviso por e-mail ainda está a ser configurado.';form.reset();}catch(err){status.textContent=err.message||'Sem ligação. Tente novamente.';}finally{button.disabled=false;button.textContent='Enviar pedido';}});

const accessParams=new URLSearchParams(location.search);
if(accessParams.get('acesso')==='1'){
 const requestedPath=accessParams.get('voltar');
 const next=requestedPath&&requestedPath.startsWith('/')&&!requestedPath.startsWith('//')?requestedPath:'/recursos-purolar';
 const style=document.createElement('style');
 style.textContent='.access-dialog{position:fixed;z-index:30;inset:0;display:grid;place-items:center;padding:24px;background:#163a46b8}.access-card{width:min(430px,100%);padding:38px;background:#fffdf9;color:#163a46;box-shadow:0 24px 80px #0004}.access-card h2{margin:8px 0 12px;font-size:36px;letter-spacing:-.05em}.access-card p{color:#5c6a6d;line-height:1.6}.access-card label{display:grid;gap:6px;margin-top:16px;font-size:12px;font-weight:600}.access-card input{height:48px;padding:0 12px;border:1px solid #cfc4b6;font:inherit}.access-card .button{width:100%;margin-top:20px}.access-error{min-height:20px;color:#b84730;font-size:12px}.access-cancel{display:block;margin-top:20px;text-align:center;font-size:12px;color:#657073}';
 document.head.append(style);
 const dialog=document.createElement('div');
 dialog.className='access-dialog';
 dialog.innerHTML='<form class="access-card" id="access-form"><p class="eyebrow">Área reservada</p><h2>Entrar nos materiais.</h2><p>Use o seu acesso PuroLar para abrir a rota pedida.</p><label>E-mail<input id="access-email" type="email" autocomplete="username" required></label><label>Palavra-passe<input id="access-password" type="password" autocomplete="current-password" required></label><button class="button" id="access-submit" type="submit">Entrar <span aria-hidden="true">↗</span></button><p class="access-error" id="access-error" role="alert"></p><a class="access-cancel" href="/">Voltar ao site</a></form>';
 document.body.append(dialog);
 const setAccessCookie=token=>{document.cookie=`purolar-auth-token=${token}; Path=/; Max-Age=3600; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;};
 (async()=>{
  try{
   const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
   const client=createClient('https://iexionzhuymetllkwgkv.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleGlvbnpodXltZXRsbGt3Z2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTU4NDgsImV4cCI6MjEwNTY3MTg0OH0.Nv5yWm2ghH7CGgziJXtWYaOQK1Etdu3K08Oiocgezg8',{auth:{persistSession:true,autoRefreshToken:true}});
   const {data:{session}}=await client.auth.getSession();
   if(session){setAccessCookie(session.access_token);location.replace(next);return;}
   document.querySelector('#access-form').addEventListener('submit',async event=>{
    event.preventDefault();const error=document.querySelector('#access-error'),button=document.querySelector('#access-submit');error.textContent='';button.disabled=true;
    const {data,error:signInError}=await client.auth.signInWithPassword({email:document.querySelector('#access-email').value.trim(),password:document.querySelector('#access-password').value});
    if(signInError){error.textContent=/invalid login credentials/i.test(signInError.message)?'E-mail ou palavra-passe incorretos.':'Não foi possível iniciar a sessão.';button.disabled=false;return;}
    setAccessCookie(data.session.access_token);location.assign(next);
   });
  }catch(error){document.querySelector('#access-error').textContent='Não foi possível carregar o serviço de acesso.';console.error(error);}
 })();
}
