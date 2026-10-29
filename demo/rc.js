// Navi Repair Center: encabezado común, datos de demostración y sesión.
// DEMO: tickets y sesión viven en este navegador; en producción los entrega el sistema de servicio.

const NAVI_MOVIL = 'https://www.navimovil.com/demo/';
const NAVI_SHOP = 'https://www.figma.com/proto/gVPCzk4YxUzBBllPbeZhnj/Navi-Repair-Center-%E2%80%93-Sitio-web?node-id=15-474&starting-point-node-id=15-474';

// cliente de demostración: entra con el ticket 560 (o el folio completo) y su correo
const RC_CLIENTS = [{
  name: 'Mariana', last: 'López', email: 'mariana.lopez@gmail.com', ticket: '560', folio: 'W20260907171032_560',
}];
const RC_TICKETS0 = [
  { folio: 'W20260907171032_560', ticket: '560', fecha: '07/10/2026', equipo: 'Audífonos inalámbricos', img: 'audifonos', marca: 'BOSE', modelo: 'QuietComfort', serie: 'QC45-8821-MX', modalidad: 'uw', servicio: 'REPARACIÓN', estatus: 'En reparación', paso: 4,
    pasos: ['07 oct', '09 oct', '09 oct', '10 oct', 'En curso', '—'], nota: 'El técnico está trabajando en tu equipo. Cuando termine, generamos tu guía de regreso y te avisamos por correo.', act: '14 oct 2026, 11:20', recibido: '09 oct 2026' },
  { folio: 'W20260512094410_418', ticket: '418', fecha: '12/05/2026', equipo: 'Cafetera espresso automática', img: 'cafetera', marca: "De'Longhi", modalidad: 'oow', servicio: 'REPARACIÓN', estatus: 'Entregado' },
  { folio: 'W20251120160233_302', ticket: '302', fecha: '20/11/2025', equipo: 'Bocina portátil', img: 'bocina', marca: 'BOSE', modalidad: 'uw', servicio: 'SWAP', estatus: 'Entregado' },
  { folio: 'W20250803112045_211', ticket: '211', fecha: '03/08/2025', equipo: 'Barra de sonido', img: 'barra', marca: 'BOSE', modalidad: 'oow', servicio: 'REPARACIÓN', estatus: 'Entregado' },
];
const RC_STEPS = ['Ticket creado', 'Recibido', 'Validación', 'Diagnóstico', 'Reparación', 'Enviado'];

const RC = (() => {
  const KEY = 'navirc.session', TK = 'navirc.tickets';
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  return {
    find: (ticket, email) => {
      const t = String(ticket).trim().toUpperCase(), e = String(email).trim().toLowerCase();
      return RC_CLIENTS.find(c => (c.ticket === t || c.folio.toUpperCase() === t) && c.email === e) || null;
    },
    login: c => put(KEY, { email: c.email, at: Date.now() }),
    logout: () => { try { localStorage.removeItem(KEY); } catch {} },
    current: () => { const s = get(KEY, null); return s ? RC_CLIENTS.find(c => c.email === s.email) || null : null; },
    tickets: () => [...get(TK, []), ...RC_TICKETS0],
    addTicket: t => put(TK, [t, ...get(TK, [])]),
  };
})();

const modalidad = m => m === 'uw' ? '<span class="pill">CON GARANTÍA | UW</span>' : '<span class="pill oow">SIN GARANTÍA | OOW</span>';
const estatusPill = s => `<span class="pill ${s === 'Entregado' ? 'done' : ''}">${s}</span>`;
const maskEmail = e => e.replace(/^(..)[^@]*/, (m, a) => a + '•'.repeat(6));

// encabezado y barra de secciones iguales en todas las páginas
function rcChrome(active) {
  const user = RC.current();
  document.body.insertAdjacentHTML('afterbegin', `
  <div class="sections"><div class="wrap"><span>⌂ Todo Navi</span>
    <nav><a href="${NAVI_MOVIL}">📱 Navi Móvil →</a><a class="on" href="index.html">🔧 Navi Repair Center · estás aquí</a><a href="${NAVI_SHOP}" target="_blank" rel="noopener">🛍️ Navi Shop →</a></nav></div></div>
  <header class="main"><div class="wrap">
    <a class="logo" href="index.html"><img src="assets/navi-logo.png" alt="Navi"><small>REPAIR CENTER</small></a>
    <nav class="menu">
      <a href="${user ? 'cuenta.html' : 'acceso.html'}" class="${active === 'centro' ? 'on' : ''}">🔧 Centro de servicio</a>
      <a href="${user ? 'cuenta.html#historial' : 'acceso.html'}" class="${active === 'rastrear' ? 'on' : ''}">Rastrear mi servicio</a>
      <a href="index.html#ayuda" class="${active === 'ayuda' ? 'on' : ''}">Ayuda</a>
    </nav>
    <div class="hdr-icons"><a href="index.html#ayuda" aria-label="Buscar">⌕</a><a href="${user ? 'cuenta.html' : 'acceso.html'}" aria-label="Mi cuenta">👤</a></div>
  </div></header>`);
  document.body.insertAdjacentHTML('beforeend', '<span class="demo-tag">DEMO</span>');
}
