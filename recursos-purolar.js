const gate=document.querySelector('#gate'),workspace=document.querySelector('#workspace'),form=document.querySelector('#gate-form'),error=document.querySelector('#gate-error'),logout=document.querySelector('#logout');
const ACCESS_HASH='67b4bc9a626050cfa583f9694b1be814a8881eb2d27493bb12f270ce6981e93e';
async function sha(value){const bytes=new TextEncoder().encode(value);const hash=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function openWorkspace(){gate.hidden=true;workspace.hidden=false;document.title='Biblioteca reservada · PuroLar'}
if(sessionStorage.getItem('purolar-resource-session')==='active')openWorkspace();
form?.addEventListener('submit',async event=>{event.preventDefault();error.textContent='';const value=new FormData(form).get('access-key');if(await sha(value)===ACCESS_HASH){sessionStorage.setItem('purolar-resource-session','active');openWorkspace()}else{error.textContent='Chave incorreta. Tente novamente.';form.reset();document.querySelector('#access-key').focus()}});
logout?.addEventListener('click',()=>{sessionStorage.removeItem('purolar-resource-session');workspace.hidden=true;gate.hidden=false;form.reset();document.querySelector('#access-key').focus()});
