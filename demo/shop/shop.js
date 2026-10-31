// Navi Shop: encabezado, carrito y piezas comunes. DEMO: el carrito vive en este navegador.
const NAVI_MOVIL = 'https://www.navimovil.com/demo/';
const mxn = n => '$' + n.toLocaleString('es-MX');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const catOf = id => SHOP_CATS.find(c => c.id === id);
const prod = id => SHOP_PRODUCTS.find(p => p.id === id);
// ilustración de referencia por categoría (el diseño aún no tiene fotos de cada modelo)
const imgOf = p => `../assets/${catOf(p.cat).img}.svg`;
const stockPill = p => p.stock <= 1 ? '<span class="stk low">Última pieza</span>'
  : `<span class="stk ${p.stock <= 4 ? 'low' : ''}">${p.stock} disponibles</span>`;

const Cart = (() => {
  const KEY = 'navishop.cart';
  const all = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const save = l => { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch {} paintCount(); };
  const key = (id, color) => id + '|' + (color || '');
  return {
    all,
    count: () => all().reduce((s, i) => s + i.qty, 0),
    add: (id, qty = 1, color = '') => {
      const l = all(), p = prod(id), k = key(id, color), it = l.find(i => key(i.id, i.color) === k);
      if (it) it.qty = Math.min(p.stock, it.qty + qty); else l.push({ id, color, qty: Math.min(p.stock, qty) });
      save(l);
    },
    set: (id, color, qty) => { const l = all(); const it = l.find(i => key(i.id, i.color) === key(id, color)); if (it) it.qty = Math.max(1, Math.min(prod(id).stock, qty)); save(l); },
    remove: (id, color) => save(all().filter(i => key(i.id, i.color) !== key(id, color))),
    clear: () => save([]),
  };
})();
function paintCount() { const n = Cart.count(); document.querySelectorAll('[data-cartcount]').forEach(e => { e.textContent = n; e.hidden = !n; }); }

function shopChrome() {
  document.body.insertAdjacentHTML('afterbegin', `
  <div class="sections"><div class="wrap">
    <nav><a href="${NAVI_MOVIL}">📱 Navi Móvil →</a><a href="../index.html">🔧 Navi Repair Center →</a><a class="on" href="index.html">🛍️ Navi Shop · estás aquí</a></nav></div></div>
  <header class="main"><div class="wrap">
    <a class="logo" href="index.html"><img src="../assets/navi-logo.png" alt="Navi"><small>SHOP</small></a>
    <nav class="menu">
      <a href="index.html#audifonos">Audífonos</a><a href="index.html#bocinas">Bocinas</a><a href="index.html#celulares">Celulares</a><a href="index.html#pro">Audio profesional</a><a href="index.html#ofertas">Ofertas</a>
    </nav>
    <div class="hdr-icons"><a href="index.html#buscar" aria-label="Buscar">⌕</a><a href="../acceso.html" aria-label="Mi cuenta">👤</a>
      <a href="carrito.html" class="cartlink" aria-label="Carrito">🛒<b data-cartcount hidden></b></a></div>
  </div></header>`);
  document.body.insertAdjacentHTML('beforeend', '<span class="demo-tag">DEMO</span><div class="toast" id="toast" role="status"></div>');
  paintCount();
}
const toast = t => { const e = document.getElementById('toast'); e.textContent = t; e.classList.add('show'); clearTimeout(e.t); e.t = setTimeout(() => e.classList.remove('show'), 2400); };

// tarjeta de producto (catálogo y "también te puede interesar")
const card = p => `<article class="pc">
  <a class="ph" href="producto.html#${p.id}"><img src="${imgOf(p)}" alt="" loading="lazy">${stockPill(p)}</a>
  <div class="pd"><small>${esc(p.brand)}${p.cond === 'Liberado' ? ' · LIBERADO' : ''}</small>
    <a href="producto.html#${p.id}"><b>${esc(p.name)}</b></a>
    <span class="col">${p.colors.length ? esc(p.colors.join(' · ')) : '&nbsp;'}</span>
    <span class="pr">${mxn(p.price)}</span>
    <button class="btn btn-ink btn-block" data-add="${p.id}">Agregar al carrito</button></div>
</article>`;
document.addEventListener('click', e => {
  const b = e.target.closest('[data-add]'); if (!b) return;
  const p = prod(b.dataset.add); Cart.add(p.id, 1, p.colors[0] || ''); toast(`Agregaste ${p.name} al carrito`);
});
