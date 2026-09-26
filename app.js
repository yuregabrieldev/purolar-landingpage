const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.navlinks');
toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}));
document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>{document.querySelector('[name=service]').value=a.dataset.service;}));
const form=document.querySelector('#lead-form');
form?.addEventListener('submit',async e=>{e.preventDefault();const button=form.querySelector('button'),status=document.querySelector('#form-status');button.disabled=true;button.textContent='A guardar…';status.textContent='';
try{const d=Object.fromEntries(new FormData(form));d.consent=form.elements.consent.checked;const r=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});const out=await r.json();if(!r.ok)throw Error(out.error||'Não foi possível enviar.');status.textContent='Pedido guardado com sucesso. Referência: '+out.id.slice(0,8)+'.';form.reset();}catch(err){status.textContent=err.message||'Sem ligação. Tente novamente.';}finally{button.disabled=false;button.textContent='Enviar pedido';}});

