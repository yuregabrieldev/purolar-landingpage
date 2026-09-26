(() => {
  'use strict';
  const form = document.querySelector('#symbol-controls');
  if (!form) return;
  const preview = document.querySelector('#symbol-preview');
  const status = document.querySelector('#symbol-status');
  // Exact paths from the approved SVG; only the fills change.
  const topPath = 'M0 0H70C101 0 122 21 122 52V104H64L80 88C89 79 92 69 92 56V52C92 37 84 30 70 30H0Z';
  const basePath = 'M0 59H42V123H108C117 123 122 129 122 137V162H0Z';
  const color = name => form.elements.namedItem(name).value;
  function svg(forExport = false) {
    const shape = color('shape');
    const bg = color('background');
    const background = shape === 'circle' ? `<circle cx="120" cy="120" r="120" fill="${bg}"/>` : shape === 'transparent' ? '' : `<rect width="240" height="240" rx="${shape === 'rounded' ? 58 : 0}" fill="${bg}"/>`;
    // Match the original SVG artboards; keep the square canvas for preview/PNG.
    const tight = forExport && shape === 'transparent';
    const viewBox = tight ? '0 0 122 162' : '0 0 240 240';
    const dimensions = forExport ? '' : ' width="240" height="240"';
    const transform = tight ? '' : ' transform="translate(59 39)"';
    return `<svg xmlns="http://www.w3.org/2000/svg"${dimensions} viewBox="${viewBox}"><title>Símbolo PuroLar personalizado</title>${background}<g${transform}><path fill="${color('top')}" d="${topPath}"/><path fill="${color('base')}" d="${basePath}"/><circle cx="69" cy="58" r="11.7" fill="${color('dot')}"/></g></svg>`;
  }
  function render() {
    preview.innerHTML = svg();
    const transparent = color('shape') === 'transparent';
    form.elements.background.disabled = transparent;
    form.querySelector('[data-hex="background"]').disabled = transparent;
  }
  form.addEventListener('input', event => {
    const input = event.target;
    if (input.dataset.hex) {
      if (!/^#[0-9a-f]{6}$/i.test(input.value)) return;
      form.elements.namedItem(input.dataset.hex).value = input.value;
    } else if (input.type === 'color') {
      form.querySelector(`[data-hex="${input.name}"]`).value = input.value.toUpperCase();
    }
    status.textContent = '';
    render();
  });
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('reset', () => setTimeout(() => { render(); status.textContent = 'Cores originais repostas.'; }, 0));
  function download(blob, extension) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `purolar-simbolo-${color('shape')}.${extension}`;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
  document.querySelector('#export-symbol-svg').addEventListener('click', () => {
    if (!form.reportValidity()) return;
    download(new Blob([svg(true)], {type: 'image/svg+xml;charset=utf-8'}), 'svg');
    status.textContent = 'SVG preparado com as cores escolhidas.';
  });
  document.querySelector('#export-symbol-png').addEventListener('click', async event => {
    if (!form.reportValidity()) return;
    const button = event.currentTarget;
    button.disabled = true;
    const url = URL.createObjectURL(new Blob([svg()], {type: 'image/svg+xml'}));
    try {
      const img = new Image();
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = Number(color('size'));
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('PNG indisponível');
      download(blob, 'png');
      status.textContent = `PNG preparado: ${canvas.width} × ${canvas.height} px.`;
    } catch { status.textContent = 'Não foi possível exportar. Tente novamente.'; }
    finally { URL.revokeObjectURL(url); button.disabled = false; }
  });
  render();
})();
