/* ===== Pixel Selva · script.js ===== */

/* 1. Modo oscuro (recuerda la elección del visitante) */
const btnTema = document.getElementById('btnTema');
try {
  if (localStorage.getItem('tema') === 'dark') document.documentElement.dataset.theme = 'dark';
} catch (e) { /* sin almacenamiento: se usa el modo claro */ }

btnTema.addEventListener('click', () => {
  const oscuro = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = oscuro ? 'light' : 'dark';
  try { localStorage.setItem('tema', oscuro ? 'light' : 'dark'); } catch (e) {}
  btnTema.textContent = oscuro ? '🌙 Oscuro' : '☀️ Claro';
});
btnTema.textContent = document.documentElement.dataset.theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro';

/* 2. Menú móvil */
document.getElementById('btnMenu').addEventListener('click', () => {
  document.getElementById('menu').classList.toggle('abierto');
});

/* 3. Planta interactiva (Inicio): cada riego la hace crecer */
const planta = document.getElementById('planta');
if (planta) {
  const etapas = [
    'Una semilla. Toda web empieza así: con una idea.',
    'Brotó. Ya hay estructura: el HTML está listo.',
    'Aparecen las primeras hojas: llega el diseño.',
    'Más hojas, más vida: se suman las animaciones.',
    '¡Floreció! Así crece tu proyecto con nosotros.'
  ];
  const tallo = document.getElementById('tallo');
  const hojas = planta.querySelectorAll('.hojaSVG');
  const flor = document.getElementById('flor');
  const mensaje = document.getElementById('mensajePlanta');
  const boton = document.getElementById('btnRegar');
  let nivel = 0;

  boton.addEventListener('click', () => {
    nivel = (nivel + 1) % etapas.length; // al terminar, vuelve a empezar
    tallo.style.transform = `scaleY(${0.12 + nivel * 0.22})`;
    hojas.forEach((h, i) => h.classList.toggle('visible', nivel > i));
    flor.style.opacity = nivel === 4 ? 1 : 0;
    mensaje.textContent = etapas[nivel];
    boton.textContent = nivel === 4 ? 'Plantar otra semilla' : '💧 Regar';
  });
}

/* 4. Filtro del portafolio */
const filtros = document.querySelectorAll('.filtro');
filtros.forEach(f => f.addEventListener('click', () => {
  filtros.forEach(x => x.classList.remove('activo'));
  f.classList.add('activo');
  document.querySelectorAll('.proyecto').forEach(p => {
    const ver = f.dataset.cat === 'todos' || p.dataset.cat === f.dataset.cat;
    p.classList.toggle('oculto', !ver);
  });
}));

/* 5. Cotizador (Servicios): calcula el precio en tiempo real */
const cotizador = document.getElementById('cotizador');
if (cotizador) {
  const formato = n => '$' + n.toLocaleString('es-CO') + ' COP';
  const calcular = () => {
    let total = Number(document.getElementById('tipo').value);
    total += (Number(document.getElementById('paginas').value) - 1) * 150000;
    cotizador.querySelectorAll('.extra:checked').forEach(c => total += Number(c.value));
    document.getElementById('paginasValor').textContent = document.getElementById('paginas').value;
    document.getElementById('total').textContent = formato(total);
  };
  cotizador.addEventListener('input', calcular);
  calcular();
}

/* 6. Validación del formulario de contacto */
const form = document.getElementById('formContacto');
if (form) {
  const reglas = {
    nombre: v => v.trim().length >= 3 || 'Escribe tu nombre (mínimo 3 letras).',
    correo: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Escribe un correo válido, por ejemplo nombre@correo.com.',
    mensaje: v => v.trim().length >= 10 || 'Cuéntanos un poco más (mínimo 10 caracteres).'
  };

  const validar = campo => {
    const resultado = reglas[campo.name](campo.value);
    const ok = resultado === true;
    campo.classList.toggle('invalido', !ok);
    document.getElementById('error-' + campo.name).textContent = ok ? '' : resultado;
    return ok;
  };

  form.querySelectorAll('input, textarea').forEach(c =>
    c.addEventListener('blur', () => validar(c)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const todoBien = [...form.querySelectorAll('input, textarea')].map(validar).every(Boolean);
    if (todoBien) {
      const nombre = form.nombre.value.trim().split(' ')[0];
      const ok = document.getElementById('exito');
      ok.textContent = `Gracias, ${nombre}. Recibimos tu mensaje y te respondemos pronto.`;
      ok.classList.add('visible');
      form.reset();
    }
  });
}