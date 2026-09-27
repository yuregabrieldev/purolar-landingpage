const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.navlinks');
toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}));
document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>{document.querySelector('[name=service]').value=a.dataset.service;}));
const form=document.querySelector('#lead-form');
form?.addEventListener('submit',async e=>{e.preventDefault();const button=form.querySelector('button'),status=document.querySelector('#form-status');button.disabled=true;button.textContent='A guardar…';status.textContent='';
try{const d=Object.fromEntries(new FormData(form));d.consent=form.elements.consent.checked;const r=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});const type=r.headers.get('content-type')||'';const out=type.includes('application/json')?await r.json():{};if(!r.ok)throw Error(out.error||'Não foi possível enviar o pedido.');status.className='status status-success';status.innerHTML='<strong>Obrigado pelo seu pedido.</strong><span>Recebemos os seus dados e entraremos em contacto consigo em breve.</span>';form.reset();}catch(err){status.className='status status-error';status.textContent=err.message||'Sem ligação. Tente novamente.';}finally{button.disabled=false;button.textContent='Enviar pedido';}});

const accessParams=new URLSearchParams(location.search);
// Automatic review carousel. The controls stay intentionally out of the UI;
// published reviews come from Supabase and local files keep the demo content.
const reviews=document.querySelector('#avaliacoes');
if(reviews){
 const layout=reviews.querySelector('.reviews-layout');
 const fallback=[...layout.querySelectorAll('.review')].map(card=>({
  quote:card.querySelector('blockquote p').textContent,
  service:card.querySelector('.review-service')?.textContent||'Limpeza pós-obra',
  author:card.querySelector('figcaption strong')?.textContent||'Cliente PuroLar',
  location:card.querySelector('figcaption small')?.textContent?.replace(' · Depoimento ilustrativo','')||'Lisboa'
 }));
 fallback.push(
  {quote:'A mudança já tinha sido cansativa. Encontrar tudo limpo e pronto para arrumar ajudou-nos a começar com mais calma.',service:'Limpeza profunda',author:'Cliente PuroLar',location:'Cascais'},
  {quote:'Foi fácil explicar o que precisávamos e combinar o horário. Gostámos especialmente do cuidado com a cozinha.',service:'Limpeza residencial',author:'Cliente PuroLar',location:'Oeiras'},
  {quote:'Das caixilharias aos cantos, notámos a atenção ao que tínhamos pedido. Ficámos com o espaço pronto para a próxima etapa.',service:'Limpeza pós-obra',author:'Cliente PuroLar',location:'Lisboa'}
 );
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const start=(entries)=>{
  if(!entries.length){reviews.hidden=true;return;}
  const queue=Array.from({length:Math.max(3,entries.length)},(_,i)=>i%entries.length);
  let timer,animating=false,visible=false;
  layout.classList.add('reviews-carousel');
  layout.setAttribute('role','region');
  layout.setAttribute('aria-roledescription','carrossel');
  layout.setAttribute('aria-label','Avaliações de clientes');
  const make=(id,slot)=>{
   const entry=entries[id%entries.length];
   const card=document.createElement('figure');
   card.className='review review-slot-'+slot+(slot===0?' review-featured':'');
   card.dataset.entry=id;
   card.innerHTML='<span class="review-service"></span><blockquote><p></p></blockquote><figcaption><span class="review-avatar" aria-hidden="true">PL</span><span><strong></strong><small></small></span></figcaption>';
   card.querySelector('.review-service').textContent=entry.service||'PuroLar';
   card.querySelector('blockquote p').textContent=entry.quote;
   card.querySelector('figcaption strong').textContent=entry.author||'Cliente PuroLar';
   card.querySelector('figcaption small').textContent=entry.location||'Lisboa';
   return card;
  };
  let cards=[make(queue[0],0),make(queue[2],1),make(queue[1],2)];
  layout.replaceChildren(...cards);
  const schedule=()=>{clearTimeout(timer);if(visible&&!document.hidden&&!animating)timer=setTimeout(advance,6000);};
  async function advance(){
   if(animating)return;
   clearTimeout(timer);animating=true;
   const [outgoing,top,bottom]=cards;
   const before=new Map(cards.map(card=>[card,card.getBoundingClientRect()]));
   const origin=layout.getBoundingClientRect();
   queue.push(queue.shift());
   const incoming=make(queue[2],1);
   layout.append(incoming);
   const exitRect=before.get(outgoing);
   Object.assign(outgoing.style,{position:'absolute',left:(exitRect.left-origin.left)+'px',top:(exitRect.top-origin.top)+'px',width:exitRect.width+'px',height:exitRect.height+'px',margin:'0',zIndex:'3'});
   outgoing.setAttribute('aria-hidden','true');
   top.className='review review-slot-2';
   bottom.className='review review-slot-0 review-featured';
   cards=[bottom,incoming,top];
   const animations=[];
   if(!reduced.matches){
    const options={duration:1600,easing:'cubic-bezier(.4,0,.2,1)'};
    for(const card of [top,bottom]){
     const from=before.get(card),to=card.getBoundingClientRect();
     animations.push(card.animate([
      {transform:'translate('+(from.left-to.left)+'px,'+(from.top-to.top)+'px) scale('+(from.width/to.width)+','+(from.height/to.height)+')',backgroundColor:'#faf7f1',color:'#163a46'},
      {transform:'none',backgroundColor:card===bottom?'#163a46':'#faf7f1',color:card===bottom?'#f7f3eb':'#163a46'}
     ],options));
    }
    animations.push(outgoing.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(-32px)'}],{...options,duration:1200,fill:'forwards'}));
    animations.push(incoming.animate([{opacity:0,transform:'translateY(-28px)'},{opacity:1,transform:'none'}],{...options,duration:1350,delay:250,fill:'backwards'}));
   }
   try{await Promise.all(animations.map(a=>a.finished.catch(()=>{})));}
   finally{outgoing.remove();animating=false;schedule();}
  }
  document.addEventListener('visibilitychange',schedule);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();},{threshold:.2}).observe(layout);
 };
 (async()=>{
  if(location.protocol==='file:'){start(fallback);return;}
  try{
   const response=await fetch('/api/testimonials',{headers:{Accept:'application/json'},cache:'no-store'});
   const payload=await response.json();
   const entries=(payload.items||[]).slice(0,6).map(item=>({quote:item.quote,service:item.service,author:item.author_name,location:item.location||'Lisboa'}));
   start(entries);
  }catch(error){reviews.hidden=true;console.warn('Não foi possível carregar as avaliações.',error);}
 })();
}

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
