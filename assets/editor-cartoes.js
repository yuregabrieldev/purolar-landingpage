const cardTemplates=[{"front":"<div class=\"business center\"><span class=\"logo\"><img src=\"../purolar-simbolo-estudo-02-invertido.svg\" alt=\"\"><span><b contenteditable=\"plaintext-only\" class=\"editable\" data-key=\"brand\">PuroLar</b><small contenteditable=\"plaintext-only\" class=\"editable\" data-key=\"descriptor\">Limpeza profissional & pós-obras</small></span></span></div>","back":"<div class=\"business cream\"><img class=\"bigmark\" src=\"../purolar-simbolo-estudo-02.svg\" alt=\"\"><div class=\"tag editable\" contenteditable=\"plaintext-only\" data-key=\"message\">O seu espaço,<br>pronto para o que vem a seguir.</div><div class=\"card-info\"><b contenteditable=\"plaintext-only\" class=\"editable\" data-key=\"person\">Yure Santana</b><br><span class=\"editable\" contenteditable=\"plaintext-only\" data-key=\"phone\">+351 932 434 589</span><br><span class=\"editable\" contenteditable=\"plaintext-only\" data-key=\"email\">contacto@purolarlimpezas.com</span><br><span class=\"editable\" contenteditable=\"plaintext-only\" data-key=\"site\">purolarlimpezas.com</span></div><img class=\"qr-placeholder\" id=\"qr\" src=\"../assets/whatsapp-qr.svg\" alt=\"QR para WhatsApp PuroLar\" style=\"border:0;width:94px;height:94px;background:white\"></div>"},{"front":"<div class=\"business sand\"><span class=\"logo\"><img src=\"../purolar-simbolo-estudo-02.svg\" alt=\"\"><span><b contenteditable=\"plaintext-only\" class=\"editable\" data-key=\"brand\">PuroLar</b><small contenteditable=\"plaintext-only\" class=\"editable\" data-key=\"descriptor\">Limpeza profissional & pós-obras</small></span></span><div class=\"tag editable\" contenteditable=\"plaintext-only\" data-key=\"frontMessage\">Espaços limpos.<br>Pessoas mais leves.</div><img src=\"../purolar-simbolo-estudo-02.svg\" alt=\"\" class=\"warm-mark\"></div>","back":"<div class=\"business cream warm-back\"><img class=\"bigmark\" src=\"../purolar-simbolo-estudo-02.svg\" alt=\"\"><div class=\"tag editable\" contenteditable=\"plaintext-only\" data-key=\"message\">O seu espaço,<br>pronto para o que vem a seguir.</div><div class=\"card-info\"><b contenteditable=\"plaintext-only\" class=\"editable\" data-key=\"person\">Yure Santana</b><br><span class=\"editable\" contenteditable=\"plaintext-only\" data-key=\"phone\">+351 932 434 589</span><br><span class=\"editable\" contenteditable=\"plaintext-only\" data-key=\"email\">contacto@purolarlimpezas.com</span><br><span class=\"editable\" contenteditable=\"plaintext-only\" data-key=\"site\">purolarlimpezas.com</span></div><img class=\"qr-placeholder\" id=\"qr\" src=\"../assets/whatsapp-qr.svg\" alt=\"QR para WhatsApp PuroLar\" style=\"border:0;width:94px;height:94px;background:white\"></div>"}];
let renderedModel='';
const defaults={version:1,model:'essential',format:'bleed',qrmode:'whatsapp',custom:'',brand:'PuroLar',descriptor:'Limpeza profissional & pós-obras',frontMessage:'Espaços limpos.\nPessoas mais leves.',message:'O seu espaço,\npronto para o que vem a seguir.',person:'Yure Santana',phone:'+351 932 434 589',email:'contacto@purolarlimpezas.com',site:'purolarlimpezas.com',serviceLine:'Limpeza residencial e pós-obra'};
const labels={brand:'Nome da empresa',descriptor:'Assinatura',frontMessage:'Mensagem da frente (modelo Próximo)',message:'Mensagem do verso',person:'Nome do colaborador',phone:'Telefone',email:'E-mail',site:'Site'};
let state={...defaults},qrSequence=0,qrPending=false;
try{const embedded=JSON.parse(document.querySelector('#embedded-project').textContent);state={...defaults,...(embedded||JSON.parse(localStorage.getItem('purolar-cards-exact-v2')||'null'))};}catch{}
function clean(data){if(!data||typeof data!=='object')throw Error('Ficheiro de projeto inválido.');const result={...defaults};for(const k of Object.keys(defaults)){if(k==='version')continue;if(typeof data[k]==='string')result[k]=data[k].slice(0,400);}if(!['essential','warm'].includes(result.model)||!['bleed','trim'].includes(result.format)||!['site','whatsapp','custom'].includes(result.qrmode))throw Error('Formato de projeto inválido.');return result;}
state=clean(state);
if(state.person==='Vamos conversar.')state.person=defaults.person;
const status=document.querySelector('#editor-status');
document.querySelector('#fields').replaceChildren();
for(const [key,label]of Object.entries(labels)){const el=document.createElement('label');el.textContent=label;const input=document.createElement(['message','frontMessage'].includes(key)?'textarea':'input');input.dataset.field=key;input.maxLength=180;input.addEventListener('input',()=>{state[key]=input.value;render(false);});el.append(input);document.querySelector('#fields').append(el);}
function destination(){if(state.qrmode==='whatsapp'){const number=state.phone.replace(/\D/g,'');if(number.length<9||number.length>15)throw Error('Confirme o número de WhatsApp.');return 'https://wa.me/'+number;}let url=state.qrmode==='custom'?state.custom:state.site;if(!/^https?:\/\//i.test(url))url='https://'+url;const parsed=new URL(url);if(!['http:','https:'].includes(parsed.protocol)||!parsed.hostname.includes('.'))throw Error('Introduza um endereço completo e válido.');return parsed.href;}
async function updateQR(){const sequence=++qrSequence;qrPending=true;document.querySelector('#print').disabled=true;try{const url=destination();const image=await QRCode.toDataURL(url,{width:600,margin:4,errorCorrectionLevel:'M',color:{dark:'#163A46',light:'#FFFFFF'}});if(sequence!==qrSequence)return;document.querySelector('#qr').src=image;const link=document.querySelector('#qr-link');link.textContent=url;link.href=url;status.textContent='';qrPending=false;document.querySelector('#print').disabled=false;checkOverflow();}catch(e){if(sequence===qrSequence){document.querySelector('#qr').removeAttribute('src');status.textContent=e.message;qrPending=true;}}}
function checkOverflow(){let bad=false;document.querySelectorAll('.editable').forEach(el=>{const overflow=el.scrollWidth>el.clientWidth+2||el.scrollHeight>el.clientHeight+2;el.classList.toggle('overfull',overflow);bad ||= overflow;});if(bad)status.textContent='Algum texto ultrapassa o espaço. Encurte-o antes de exportar.';return bad;}
function render(sync=true){if(renderedModel!==state.model){const t=cardTemplates[state.model==='warm'?1:0];document.querySelector('#front .art').innerHTML=t.front;document.querySelector('#back .art').innerHTML=t.back;renderedModel=state.model;if(document.body.dataset.portable){document.querySelectorAll('.art img:not(#qr)').forEach(img=>{img.src=img.getAttribute('src').includes('invertido')?document.body.dataset.lightSymbol:document.body.dataset.darkSymbol;});}}document.body.classList.toggle('warm',state.model==='warm');document.body.classList.toggle('trim',state.format==='trim');document.querySelectorAll('[data-key]').forEach(el=>{if(el!==document.activeElement)el.textContent=state[el.dataset.key];});document.querySelectorAll('[data-field]').forEach(el=>{if(sync||el!==document.activeElement)el.value=state[el.dataset.field];});['model','format','qrmode','custom'].forEach(id=>document.getElementById(id).value=state[id]);document.querySelector('#custom-label').hidden=state.qrmode!=='custom';document.querySelector('#print-size').textContent='@page{size:'+(state.format==='bleed'?'91mm 61mm':'85mm 55mm')+';margin:0}';try{localStorage.setItem('purolar-cards-exact-v2',JSON.stringify(state));}catch{}updateQR();}
document.querySelector('.workspace').addEventListener('input',e=>{const el=e.target.closest('[data-key]');if(el){state[el.dataset.key]=el.innerText.slice(0,180);render();}});
document.querySelector('.workspace').addEventListener('paste',e=>{const el=e.target.closest('[data-key]');if(!el)return;e.preventDefault();el.textContent=e.clipboardData.getData('text/plain').slice(0,180);state[el.dataset.key]=el.textContent;render();});
['model','format','qrmode','custom'].forEach(id=>document.getElementById(id).addEventListener('change',e=>{state[id]=e.target.value;render();}));
function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
document.querySelector('#save').onclick=()=>download('purolar-cartao-'+state.model+'.json',JSON.stringify(state,null,2),'application/json');
document.querySelector('#load').onchange=async e=>{try{state=clean(JSON.parse(await e.target.files[0].text()));render();status.textContent='Projeto aberto.';}catch(err){status.textContent=err.message;}e.target.value='';};
document.querySelector('#reset').onclick=()=>{if(confirm('Repor os dados oficiais neste projeto?')){state={...defaults};render();}};
document.querySelector('#print').onclick=async()=>{await document.fonts.ready;if(qrPending){status.textContent='Corrija o destino do QR antes de exportar.';return;}if(checkOverflow())return;window.print();};
async function dataURI(url){const response=await fetch(url);if(!response.ok)throw Error('Não foi possível incorporar um recurso.');const blob=await response.blob();return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});}
document.querySelector('#portable').onclick=async()=>{const button=document.querySelector('#portable');button.disabled=true;try{
if(document.body.dataset.portable){const clone=document.documentElement.cloneNode(true);clone.querySelector('#portable').disabled=false;clone.querySelector('#embedded-project').textContent=JSON.stringify(state).replace(/</g,'\\u003c');download('PuroLar-cartao-editavel.html','<!doctype html>'+clone.outerHTML,'text/html');status.textContent='Documento guardado.';return;}
const [css,js,engine,font,semi,dark,light]=await Promise.all([fetch('editor-cartoes.css').then(r=>r.text()),fetch('editor-cartoes.js').then(r=>r.text()),fetch('qr-engine.js').then(r=>r.text()),dataURI('manrope-regular.woff2'),dataURI('manrope-semibold.woff2'),dataURI('../purolar-simbolo-estudo-02.svg'),dataURI('../purolar-simbolo-estudo-02-invertido.svg')]);
const clone=document.documentElement.cloneNode(true);clone.querySelectorAll('script[src],link[rel=stylesheet]').forEach(el=>el.remove());const style=document.createElement('style');style.textContent=css.replaceAll('manrope-regular.woff2',font).replaceAll('manrope-semibold.woff2',semi);clone.querySelector('head').append(style);clone.querySelector('body').dataset.portable='true';clone.querySelector('body').dataset.darkSymbol=dark;clone.querySelector('body').dataset.lightSymbol=light;clone.querySelectorAll('.art img:not(#qr)').forEach(img=>{img.src=img.getAttribute('src').includes('invertido')?light:dark;});clone.querySelector('#embedded-project').textContent=JSON.stringify(state).replace(/</g,'\\u003c');for(const code of [engine,js]){const script=document.createElement('script');script.textContent=code;clone.querySelector('body').append(script);}clone.querySelector('#portable').disabled=false;download('PuroLar-cartao-editavel.html','<!doctype html>'+clone.outerHTML,'text/html');status.textContent='Documento editável guardado. Funciona offline, incluindo o QR e a fonte.';
}catch(err){status.textContent='Erro ao guardar: '+err.message;}finally{button.disabled=false;}};
function syncModelButtons(){document.querySelectorAll('[data-model]').forEach(button=>{button.setAttribute('aria-pressed',String(button.dataset.model===state.model));});document.querySelector('#current-model').textContent=state.model==='essential'?'A editar 01 · Essencial — frente azul e verso claro.':'A editar 02 · Próximo — frente areia e verso com faixa terracota.';}
document.querySelectorAll('[data-model]').forEach(button=>button.addEventListener('click',()=>{state.model=button.dataset.model;render();syncModelButtons();}));
document.querySelector('#model').addEventListener('change',syncModelButtons);
const originalRender=render;
render=function(sync=true){originalRender(sync);syncModelButtons();};
const requestedModel=new URLSearchParams(location.search).get('modelo');
if(['essential','warm'].includes(requestedModel))state.model=requestedModel;
render();

// Export native SVG shapes and text using the preview's actual layout.
const xml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
async function exportCard(side){
  const sheet=document.getElementById(side), box=sheet.getBoundingClientRect();
  const business=sheet.querySelector('.business'), b=business.getBoundingClientRect();
  const bg=side==='front'?(state.model==='warm'?'#dcc3a6':'#163a46'):'#fffdf9';
  let content=`<rect width="${box.width}" height="${box.height}" fill="${bg}"/>`;
  if(side==='back'&&state.model==='warm')content+=`<rect width="${b.left-box.left+parseFloat(getComputedStyle(business).borderLeftWidth)}" height="${box.height}" fill="#c65a3f"/>`;
  content+=`<svg x="${b.left-box.left}" y="${b.top-box.top}" width="${b.width}" height="${b.height}" viewBox="0 0 ${b.width} ${b.height}" overflow="hidden">`;
  for(const img of business.querySelectorAll('img')){
    const r=img.getBoundingClientRect(), css=getComputedStyle(img);
    const src=img.src.startsWith('data:')?img.src:await dataURI(img.src);
    content+=`<image x="${r.left-b.left}" y="${r.top-b.top}" width="${r.width}" height="${r.height}" opacity="${css.opacity}" href="${xml(src)}"/>`;
  }
  for(const el of business.querySelectorAll('[data-key]')){
    const css=getComputedStyle(el), walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    let node;
    while(node=walker.nextNode())for(let i=0;i<node.length;i++){
      const char=node.textContent[i];if(char==='\n')continue;
      const range=document.createRange();range.setStart(node,i);range.setEnd(node,i+1);
      const r=range.getBoundingClientRect();if(!r.width)continue;
      content+=`<text x="${r.left-b.left}" y="${r.top-b.top+r.height/2}" dominant-baseline="central" font-family="Manrope" font-size="${css.fontSize}" font-weight="${css.fontWeight}" fill="${css.color}">${xml(css.textTransform==='uppercase'?char.toUpperCase():char)}</text>`;
    }
  }
  return {content:content+'</svg>',width:box.width,height:box.height};
}
async function exportFonts(){
  let css='';
  for(const sheet of document.styleSheets)for(const rule of sheet.cssRules)if(rule.type===CSSRule.FONT_FACE_RULE){
    let text=rule.cssText;
    const match=text.match(/url\(["']?([^"')]+)["']?\)/);
    if(match&&!match[1].startsWith('data:'))text=text.replace(match[1],await dataURI(new URL(match[1],sheet.href||location.href).href));
    css+=text;
  }
  return css;
}
async function saveArtwork(side,type){
  await document.fonts.ready;
  if(qrPending)throw Error('Confirme o destino do QR e aguarde a atualização.');
  if(checkOverflow())throw Error('Encurte os textos assinalados antes de exportar.');
  const mmW=state.format==='bleed'?91:85, mmH=state.format==='bleed'?61:55;
  const px=96/25.4, both=side==='both';
  const width=both?mmW+20:mmW,height=both?mmH*2+30:mmH;
  const sides=both?['front','back']:[side];
  let body=both?`<rect width="100%" height="100%" fill="white"/>`:'';
  for(let i=0;i<sides.length;i++){
    const card=await exportCard(sides[i]), x=both?10*px:0,y=both?(10+i*(mmH+10))*px:0;
    body+=`<svg x="${x}" y="${y}" width="${mmW*px}" height="${mmH*px}" viewBox="0 0 ${card.width} ${card.height}">${card.content}</svg>`;
    if(both){
      const bleed=state.format==='bleed'?3:0;
      for(const cx of [bleed,mmW-bleed])for(const cy of [bleed,mmH-bleed]){
        const xx=x+cx*px,yy=y+cy*px,dx=cx<mmW/2?-1:1,dy=cy<mmH/2?-1:1;
        body+=`<path d="M ${xx+dx*4*px} ${yy} h ${dx*2*px} M ${xx} ${yy+dy*4*px} v ${dy*2*px}" stroke="#555" stroke-width="0.4" fill="none"/>`;
      }
    }
  }
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}mm" height="${height}mm" viewBox="0 0 ${width*px} ${height*px}"><defs><style>${await exportFonts()}</style></defs>${body}</svg>`;
  const name=`PuroLar-${state.model}-${both?'frente-e-verso':side==='front'?'frente':'verso'}-${state.format}`;
  if(type==='svg')download(name+'.svg',svg,'image/svg+xml');
  else{
    const image=new Image(),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
    try{
      await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(Error('Não foi possível gerar o PNG.'));image.src=url;});
      const canvas=document.createElement('canvas');canvas.width=Math.round(width/25.4*300);canvas.height=Math.round(height/25.4*300);
      canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
      if(!blob)throw Error('Não foi possível gerar o PNG.');
      download(name+'-300ppp.png',blob,'image/png');
    }finally{URL.revokeObjectURL(url);}
  }
}
document.querySelectorAll('[data-export]').forEach(button=>button.addEventListener('click',async()=>{
  button.disabled=true;
  try{await saveArtwork(...button.dataset.export.split(':'));status.textContent='Arte guardada. Imprima a 100% para manter o tamanho real.';}
  catch(error){status.textContent=error.message;}finally{button.disabled=false;}
}));
