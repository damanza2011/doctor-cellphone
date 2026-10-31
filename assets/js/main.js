/**
 * Doctor Cellphone - Main Application Script
 * Omar Dias · Servicio Técnico & Mantenimiento Especializado
 * Centro Comercial Miramar, Sótano Local 3, Barranquilla
 * WhatsApp: +57 304 4010187
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initCalculator();
  initOrderTracker();
  initFilterTabs();
  initCart();
  initDocBot();
  initFaqAccordion();
});

/* ============================================================
   1. HORARIO & STATUS EN VIVO DEL TALLER
   ============================================================ */
function initLiveClock() {
  const statusBadge = document.getElementById('workshop-status');
  if (!statusBadge) return;

  function updateStatus() {
    const now = new Date();
    // Hora Colombia (UTC-5)
    const options = { timeZone: 'America/Bogota', hour: 'numeric', minute: 'numeric', hour12: false, weekday: 'short' };
    const formatter = new Intl.DateTimeFormat([], options);
    const parts = formatter.formatToParts(now);
    
    let hour = 0;
    let day = now.getDay(); // 0 is Sunday, 1 is Monday...
    parts.forEach(p => {
      if (p.type === 'hour') hour = parseInt(p.value, 10);
    });

    const isSunday = (day === 0);
    const isOpen = !isSunday && hour >= 8 && hour < 17;

    if (isOpen) {
      statusBadge.innerHTML = `
        <span class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          Taller Abierto en C.C. Miramar · Atención Inmediata
        </span>
      `;
    } else {
      statusBadge.innerHTML = `
        <span class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
          Taller Cerrado · Abre a las 8:00 AM (Deja tu mensaje WhatsApp 24/7)
        </span>
      `;
    }
  }

  updateStatus();
  setInterval(updateStatus, 60000);
}

/* ============================================================
   2. COTIZADOR INTERACTIVO DE MANTENIMIENTO & REPARACIÓN
   ============================================================ */
const PRICE_TABLE = {
  'iphone': {
    name: 'Apple iPhone',
    'mantenimiento-preventivo': { price: 45000, time: '40 - 50 min', desc: 'Limpieza ultrasónica, descontaminación de puerto Lightning/USB-C, microcepillado de mallas y sello hermético.' },
    'pantalla': { price: 160000, time: '45 min', desc: 'Cambio de pantalla OLED / Calidad Original con programación True Tone y calibración táctil.' },
    'bateria': { price: 110000, time: '35 min', desc: 'Reemplazo de batería grado A+, ciclo cero con condición de salud al 100% garantizada.' },
    'mojado': { price: 85000, time: '2 - 4 horas', desc: 'Baño químico en tina ultrasónica, remoción de óxido, reconstrucción de pistas y secado dieléctrico.' },
    'placa': { price: 180000, time: '24 - 48 horas', desc: 'Microsoldadura Nivel 3, diagnóstico con cámara térmica, cambio de IC de carga (Tristar/Hydra) o corto en línea VCC.' },
    'puerto': { price: 65000, time: '45 min', desc: 'Reemplazo o reconstrucción de flex de carga, micrófono y antena de señal inferior.' }
  },
  'samsung': {
    name: 'Samsung Galaxy (Serie S, Z, A)',
    'mantenimiento-preventivo': { price: 40000, time: '40 min', desc: 'Limpieza de conector USB-C, parlantes estéreo, micrófono ambiental y reacondicionamiento de sellos.' },
    'pantalla': { price: 180000, time: '50 min', desc: 'Módulo de pantalla Super AMOLED / Dynamic AMOLED 120Hz original con marco.' },
    'bateria': { price: 95000, time: '35 min', desc: 'Batería original Samsung con calibración de ciclos y protección de sobretensión.' },
    'mojado': { price: 80000, time: '2 - 3 horas', desc: 'Descontaminación por sales o cloro en tina ultrasónica y tratamiento anticorrosivo.' },
    'placa': { price: 160000, time: '24 horas', desc: 'Reparación de PMIC de carga, problemas de temperatura o falla de imagen/encendido.' },
    'puerto': { price: 55000, time: '40 min', desc: 'Reemplazo de placa sub-board con conector Type-C de carga súper rápida 25W/45W.' }
  },
  'xiaomi': {
    name: 'Xiaomi / Redmi / POCO',
    'mantenimiento-preventivo': { price: 35000, time: '35 min', desc: 'Limpieza profunda de ventilación, conector de carga y filtros de audio estéreo.' },
    'pantalla': { price: 130000, time: '45 min', desc: 'Pantalla AMOLED/IPS de alta tasa de refresco, ensamble perfecto sin filos levantados.' },
    'bateria': { price: 85000, time: '30 min', desc: 'Batería nueva de alta densidad con soporte de carga turbo 33W/67W/120W.' },
    'mojado': { price: 75000, time: '2 - 3 horas', desc: 'Tratamiento desoxidante y verificación bajo microscopio de componentes pasivos SMD.' },
    'placa': { price: 140000, time: '24 horas', desc: 'Solución a CPU bootloop / reballing en modelos POCO y cortos de línea principal.' },
    'puerto': { price: 50000, time: '35 min', desc: 'Cambio de placa de carga original con soporte de datos OTG y carga rápida.' }
  },
  'motorola': {
    name: 'Motorola (Moto G, Edge)',
    'mantenimiento-preventivo': { price: 35000, time: '35 min', desc: 'Limpieza profunda de circuito, conector USB y ajuste de sellado de chasis.' },
    'pantalla': { price: 125000, time: '45 min', desc: 'Instalación de display completo con alta fidelidad de color y respuesta táctil.' },
    'bateria': { price: 80000, time: '35 min', desc: 'Batería nueva para máxima autonomía y rendimiento continuo sin reinicios.' },
    'mojado': { price: 75000, time: '2 - 3 horas', desc: 'Lavado en alcohol isopropílico 99.9% y reemplazo de puntos de prueba sulfatados.' },
    'placa': { price: 135000, time: '24 horas', desc: 'Diagnóstico de placa y reparación de pistas de voltaje de encendido.' },
    'puerto': { price: 50000, time: '35 min', desc: 'Repuesto de flex y conector con aislamiento térmico.' }
  },
  'mac': {
    name: 'Apple MacBook (Air / Pro / M1 / M2 / M3 / Intel)',
    'mantenimiento-preventivo': { price: 85000, time: '1.5 horas', desc: 'Mantenimiento térmico prémium: desarme completo, limpieza de turbinas de disipación, cambio de pasta térmica de alto rendimiento Artic MX-4/Thermal Grizzly y limpieza de teclado/puertos MagSafe/Thunderbolt.' },
    'pantalla': { price: 450000, time: '24 horas', desc: 'Reemplazo de ensamble completo de pantalla Retina con sensor True Tone y cámara FaceTime.' },
    'bateria': { price: 240000, time: '2 horas', desc: 'Cambio de paquete de celdas de batería con preservación del sensor SMC y calibración térmica.' },
    'mojado': { price: 190000, time: '24 - 48 horas', desc: 'Tratamiento intensivo de placa lógica por derrame de café/agua, desoldadura de blindajes y reconstrucción de pistas en microscopio.' },
    'placa': { price: 290000, time: '48 horas', desc: 'Reparación de circuito de carga USB-C CD3215/CD3217, chips puente T2/M1 y líneas PPBUS_G3H.' },
    'puerto': { price: 110000, time: '2 horas', desc: 'Reemplazo o mantenimiento de puertos Thunderbolt USB-C y jack de audio.' }
  },
  'pc-laptop': {
    name: 'Computador Portátil / PC Gamer (Asus, HP, Dell, Lenovo, Acer)',
    'mantenimiento-preventivo': { price: 65000, time: '1 - 2 horas', desc: 'Mantenimiento preventivo integral: limpieza física profunda, desincrustación de ventiladores, cambio de pasta térmica en CPU/GPU (-15°C a -25°C garantizados) y lubricación de rodamientos.' },
    'pantalla': { price: 220000, time: '2 horas', desc: 'Reemplazo de panel LED/IPS Full HD o 144Hz para laptops gamer y de oficina.' },
    'bateria': { price: 150000, time: '1 hora', desc: 'Batería interna de repuesto original para extender la autonomía al máximo.' },
    'mojado': { price: 120000, time: '24 horas', desc: 'Descontaminación con secado infrarrojo de placa base y limpieza de teclado.' },
    'placa': { price: 195000, time: '24 - 48 horas', desc: 'Reparación de MOSFETs en corto, conector jack de alimentación roto y reprogramación de BIOS.' },
    'puerto': { price: 70000, time: '1 hora', desc: 'Reparación de puerto de carga DC Jack, HDMI o USB 3.0 flojo.' }
  },
  'ipad': {
    name: 'Apple iPad & Tablets',
    'mantenimiento-preventivo': { price: 50000, time: '1 hora', desc: 'Mantenimiento de conector de carga, limpieza acústica de altavoces cuádruples y revisión de curvatura.' },
    'pantalla': { price: 210000, time: '2 horas', desc: 'Reemplazo de cristal digitalizador o pantalla completa con soporte de Apple Pencil.' },
    'bateria': { price: 160000, time: '2 horas', desc: 'Batería nueva de polímero de litio con larga duración para trabajo y estudio.' },
    'mojado': { price: 110000, time: '24 horas', desc: 'Extracción de corrosión en placa y descontaminación de flex de pantalla.' },
    'placa': { price: 190000, time: '48 horas', desc: 'Microsoldadura en controlador de encendido y líneas secundarias.' },
    'puerto': { price: 80000, time: '1.5 horas', desc: 'Sustitución de puerto Lightning o USB-C soldado a placa madre.' }
  }
};

function initCalculator() {
  const brandSelect = document.getElementById('calc-brand');
  const serviceSelect = document.getElementById('calc-service');
  const priceDisplay = document.getElementById('calc-price');
  const timeDisplay = document.getElementById('calc-time');
  const descDisplay = document.getElementById('calc-desc');
  const deviceNameDisplay = document.getElementById('calc-device-name');
  const whatsappBtn = document.getElementById('calc-whatsapp-btn');

  if (!brandSelect || !serviceSelect) return;

  function recalculate() {
    const brand = brandSelect.value;
    const service = serviceSelect.value;

    const brandData = PRICE_TABLE[brand] || PRICE_TABLE['iphone'];
    const serviceData = brandData[service] || brandData['mantenimiento-preventivo'];

    if (deviceNameDisplay) deviceNameDisplay.textContent = brandData.name;
    if (priceDisplay) {
      priceDisplay.textContent = `$${serviceData.price.toLocaleString('es-CO')} COP`;
    }
    if (timeDisplay) timeDisplay.textContent = serviceData.time;
    if (descDisplay) descDisplay.textContent = serviceData.desc;

    if (whatsappBtn) {
      const msg = `Hola Omar (Doctor Cellphone), coticé en la web para mi *${brandData.name}* el servicio de *${service.toUpperCase()}* (Estimado: $${serviceData.price.toLocaleString('es-CO')} COP). ¿Puedo llevarlo hoy a su local 3 en el sótano del C.C. Miramar?`;
      whatsappBtn.href = `https://wa.me/573044010187?text=${encodeURIComponent(msg)}`;
    }
  }

  brandSelect.addEventListener('change', recalculate);
  serviceSelect.addEventListener('change', recalculate);
  recalculate();
}

/* ============================================================
   3. RASTREADOR DE ORDEN DE SERVICIO EN VIVO (DOC-XXXX)
   ============================================================ */
const DEMO_ORDERS = {
  'DOC-8921': {
    code: 'DOC-8921',
    client: 'Carlos V. (Barranquilla - Riomar)',
    device: 'iPhone 14 Pro Max 256GB Deep Purple',
    entryDate: '30 Octubre 2026 · 10:15 AM',
    service: 'Mantenimiento Preventivo Quirúrgico + Cambio de Batería 100% Original + Sellado IP68',
    status: 'Listo para Entrega',
    step: 5,
    tech: 'Omar Dias (Técnico Titular)',
    notes: 'Batería instalada con condición de salud al 100% sin mensajes del sistema. Sello de agua y polvo presurizado al vacío. Limpieza ultrasónica de mallas de altavoz culminada. Equipo probado con 15 puntos de control superados.',
    benchPhoto: 'assets/img/doctor-cellphone-logo.png',
    voltage: '5.18V / 2.1A (Carga Rápida Normal)',
    temp: '27.8°C'
  },
  'DOC-5042': {
    code: 'DOC-5042',
    client: 'María Alejandra Gómez (Villa Santos)',
    device: 'Apple MacBook Pro 14" M1 Pro 512GB Space Gray',
    entryDate: '30 Octubre 2026 · 02:40 PM',
    service: 'Mantenimiento Térmico de Alto Rendimiento (Pasta Artic MX-4) + Limpieza de Turbinas y Teclado',
    status: 'Control de Calidad y Pruebas Térmicas',
    step: 4,
    tech: 'Omar Dias (Técnico Titular)',
    notes: 'Disipador desmontado. Se retiró pasta térmica reseca original. Aplicada pasta térmica de alta conductividad Artic MX-4. Turbinas desobstruidas de microfibras. Temperatura en reposo bajó de 68°C a 41°C. En prueba final de estrés Geekbench.',
    benchPhoto: 'assets/img/doctor-cellphone-logo.png',
    voltage: '20.0V / 3.25A (Carga MagSafe Estable)',
    temp: '41.2°C (Excelente)'
  },
  'DOC-1105': {
    code: 'DOC-1105',
    client: 'Andrés Felipe M. (C.C. Miramar)',
    device: 'Samsung Galaxy S23 Ultra Phantom Black',
    entryDate: '31 Octubre 2026 · 08:30 AM',
    service: 'Rescate por Mojado / Inmersión Marina + Descontaminación Ultrasónica de Placa',
    status: 'En Banco de Trabajo / Microsoldadura',
    step: 3,
    tech: 'Omar Dias (Técnico Titular)',
    notes: 'Ingresó apagado tras caída accidental en agua de mar. Batería desconectada inmediatamente. Tina ultrasónica aplicada por 2 ciclos de 20 min con químico dieléctrico. Reconstruida línea condensadora C204 en corto. En proceso de prueba de pantalla.',
    benchPhoto: 'assets/img/doctor-cellphone-logo.png',
    voltage: 'Oscilando 4.2V a 5.0V',
    temp: '29.5°C'
  }
};

function initOrderTracker() {
  const searchInput = document.getElementById('order-input');
  const searchBtn = document.getElementById('order-search-btn');
  const resultCard = document.getElementById('order-result');

  if (!searchInput || !searchBtn || !resultCard) return;

  function searchOrder(code) {
    const trimmed = (code || searchInput.value || '').trim().toUpperCase();
    if (!trimmed) {
      showToast('Por favor ingresa un código de orden (ej: DOC-8921)');
      return;
    }

    const order = DEMO_ORDERS[trimmed] || {
      code: trimmed,
      client: 'Cliente Registrado en Taller',
      device: 'Dispositivo en Proceso de Diagnóstico',
      entryDate: 'Ingreso Registrado',
      service: 'Mantenimiento y Diagnóstico Electrónico Especializado',
      status: 'En Diagnóstico Inicial',
      step: 2,
      tech: 'Omar Dias (Doctor Cellphone)',
      notes: 'Tu dispositivo se encuentra en la fila prioritaria de nuestro banco de trabajo en el local 3 del C.C. Miramar. Omar Dias está realizando las mediciones con multímetro y fuente regulada.',
      benchPhoto: 'assets/img/doctor-cellphone-logo.png',
      voltage: '5.0V Estándar',
      temp: '28.0°C'
    };

    renderOrderResult(order);
  }

  function renderOrderResult(o) {
    const steps = [
      { num: 1, title: 'Recepción & Registro', desc: 'Inventario físico y apertura de orden' },
      { num: 2, title: 'Diagnóstico en Banco', desc: 'Mediciones de voltaje y microscopio' },
      { num: 3, title: 'Mantenimiento / Reparación', desc: 'Microsoldadura, piezas o limpieza' },
      { num: 4, title: 'Control de Calidad (QA)', desc: '15 pruebas funcionales rigurosas' },
      { num: 5, title: 'Listo para Entrega', desc: 'Entrega en Local 3 Sótano Miramar' }
    ];

    let stepsHtml = steps.map((s, idx) => {
      const isDone = s.num < o.step;
      const isCurrent = s.num === o.step;
      const bg = isDone 
        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400' 
        : (isCurrent ? 'bg-amber-400 text-slate-950 font-extrabold ring-4 ring-amber-400/30' : 'bg-slate-800 text-slate-400 border-slate-700');
      const textCol = isDone ? 'text-emerald-400' : (isCurrent ? 'text-amber-300 font-bold' : 'text-slate-400');
      
      return `
        <div class="flex items-start gap-4 mb-4 relative last:mb-0">
          <div class="w-8 h-8 rounded-full ${bg} flex items-center justify-center shrink-0 z-10 text-xs shadow-md">
            ${isDone ? '<i class="fas fa-check"></i>' : s.num}
          </div>
          <div class="flex-1 pb-2">
            <p class="text-sm ${textCol}">${s.title} ${isCurrent ? '<span class="ml-2 text-xs uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 animate-pulse">En curso</span>' : ''}</p>
            <p class="text-xs text-slate-400">${s.desc}</p>
          </div>
        </div>
      `;
    }).join('');

    resultCard.innerHTML = `
      <div class="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-400/40 shadow-2xl animate-fadeIn">
        <div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div class="flex items-center gap-3">
              <span class="text-xs font-mono font-bold tracking-widest px-3 py-1 rounded bg-amber-400 text-slate-950 uppercase">${o.code}</span>
              <span class="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 font-medium">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> ${o.status}
              </span>
            </div>
            <h3 class="text-xl md:text-2xl font-bold text-white mt-2 font-tech tracking-wide">${o.device}</h3>
            <p class="text-xs text-slate-400 mt-1"><i class="fas fa-user-circle text-amber-400 mr-1"></i> Titular: ${o.client} · <i class="fas fa-clock text-amber-400 ml-2 mr-1"></i> Ingreso: ${o.entryDate}</p>
          </div>
          <a href="https://wa.me/573044010187?text=${encodeURIComponent('Hola Omar, estoy consultando mi orden ' + o.code + ' de ' + o.device + '. ¿Tiene alguna novedad adicional?')}" target="_blank" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-600/30">
            <i class="fab fa-whatsapp text-sm"></i> Chatear con Omar Dias
          </a>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <!-- Timeline -->
          <div class="lg:col-span-6 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
            <h4 class="text-xs font-mono uppercase text-amber-400 font-bold mb-4 tracking-wider flex items-center gap-2">
              <i class="fas fa-microchip"></i> Estado del Proceso en Laboratorio
            </h4>
            <div class="relative pl-1">
              ${stepsHtml}
            </div>
          </div>

          <!-- Notes & Live Telemetry -->
          <div class="lg:col-span-6 flex flex-col justify-between gap-4">
            <div class="bg-slate-950/60 p-5 rounded-xl border border-slate-800">
              <h4 class="text-xs font-mono uppercase text-sky-400 font-bold mb-2 tracking-wider flex items-center gap-2">
                <i class="fas fa-stethoscope"></i> Dictamen y Notas de Omar Dias
              </h4>
              <p class="text-sm text-slate-300 leading-relaxed font-sans">${o.notes}</p>
              <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span><i class="fas fa-id-badge text-amber-400 mr-1"></i> Especialista: <strong>${o.tech}</strong></span>
                <span><i class="fas fa-map-marker-alt text-amber-400 mr-1"></i> Local 3 Sótano Miramar</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span class="text-[10px] uppercase font-mono text-slate-400 block">Lectura de Voltaje</span>
                <span class="text-sm font-bold text-amber-400 font-mono flex items-center gap-1.5 mt-0.5">
                  <i class="fas fa-bolt text-xs"></i> ${o.voltage}
                </span>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span class="text-[10px] uppercase font-mono text-slate-400 block">Temperatura Banco</span>
                <span class="text-sm font-bold text-sky-400 font-mono flex items-center gap-1.5 mt-0.5">
                  <i class="fas fa-temperature-low text-xs"></i> ${o.temp}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    resultCard.classList.remove('hidden');
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  searchBtn.addEventListener('click', () => searchOrder());
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchOrder();
  });

  // Botones de demostración rápida
  document.querySelectorAll('.demo-order-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const code = btn.getAttribute('data-code');
      searchInput.value = code;
      searchOrder(code);
    });
  });
}

/* ============================================================
   4. FILTROS DE CATEGORÍAS DE SERVICIOS
   ============================================================ */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.service-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter || (filter === 'mantenimiento' && card.classList.contains('is-mantenimiento'))) {
          card.style.display = 'block';
          card.classList.add('animate-fadeIn');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ============================================================
   5. TIENDA DE ACCESORIOS & CARRITO INTERACTIVO
   ============================================================ */
let cart = [];

function initCart() {
  const cartBadge = document.getElementById('cart-badge');
  const cartModal = document.getElementById('cart-modal');
  const openCartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartCheckoutBtn = document.getElementById('cart-checkout-btn');

  // Load from local storage
  try {
    const saved = localStorage.getItem('dr_cell_cart');
    if (saved) cart = JSON.parse(saved);
  } catch(e) {}

  function updateCartUI() {
    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="py-12 text-center text-slate-400">
          <i class="fas fa-shopping-bag text-4xl mb-3 text-slate-600"></i>
          <p class="text-sm">Tu carrito de tecnología está vacío.</p>
          <p class="text-xs text-slate-500 mt-1">Agrega cargadores, cables o vidrios de alto impacto.</p>
        </div>
      `;
      if (cartSubtotal) cartSubtotal.textContent = '$0 COP';
      if (cartCheckoutBtn) {
        cartCheckoutBtn.disabled = true;
        cartCheckoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
      }
      return;
    }

    let subtotal = 0;
    cartItemsContainer.innerHTML = cart.map((item, index) => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;
      return `
        <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div class="flex-1">
            <h5 class="text-xs font-bold text-white">${item.name}</h5>
            <span class="text-xs text-amber-400 font-mono font-semibold">$${item.price.toLocaleString('es-CO')} COP</span>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="changeQty(${index}, -1)" class="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center text-xs">-</button>
            <span class="text-xs font-bold font-mono text-white w-5 text-center">${item.qty}</span>
            <button onclick="changeQty(${index}, 1)" class="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center text-xs">+</button>
            <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-300 text-xs ml-2">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toLocaleString('es-CO')} COP`;
    if (cartCheckoutBtn) {
      cartCheckoutBtn.disabled = false;
      cartCheckoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      
      const orderLines = cart.map(i => `• ${i.qty}x ${i.name} ($${(i.price * i.qty).toLocaleString('es-CO')} COP)`).join('%0A');
      const checkoutMsg = `Hola Omar (Doctor Cellphone), deseo comprar los siguientes accesorios:%0A%0A${orderLines}%0A%0A*Total: $${subtotal.toLocaleString('es-CO')} COP*%0A¿Tienen disponibilidad en el Local 3 Sótano Miramar para entrega inmediata o domicilio en Barranquilla?`;
      cartCheckoutBtn.href = `https://wa.me/573044010187?text=${checkoutMsg}`;
    }

    try {
      localStorage.setItem('dr_cell_cart', JSON.stringify(cart));
    } catch(e) {}
  }

  window.addToCart = function(name, price) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    updateCartUI();
    showToast(`✓ Agregado: ${name}`);
  };

  window.changeQty = function(index, delta) {
    if (!cart[index]) return;
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    updateCartUI();
  };

  window.removeFromCart = function(index) {
    if (!cart[index]) return;
    const item = cart[index];
    cart.splice(index, 1);
    updateCartUI();
    showToast(`Eliminado: ${item.name}`);
  };

  if (openCartBtn && cartModal) {
    openCartBtn.addEventListener('click', () => {
      cartModal.classList.remove('hidden');
      updateCartUI();
    });
  }

  if (closeCartBtn && cartModal) {
    closeCartBtn.addEventListener('click', () => {
      cartModal.classList.add('hidden');
    });
  }

  updateCartUI();
}

/* ============================================================
   6. DOCBOT IA - ASISTENTE TÉCNICO VIRTUAL (OMAR DIAS IA)
   ============================================================ */
function initDocBot() {
  const launcher = document.getElementById('chat-launcher');
  const chatWindow = document.getElementById('chat-window');
  const closeChat = document.getElementById('close-chat');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const quickChips = document.querySelectorAll('.chat-chip');

  if (!launcher || !chatWindow) return;

  launcher.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden') && chatInput) {
      chatInput.focus();
    }
  });

  if (closeChat) {
    closeChat.addEventListener('click', () => chatWindow.classList.add('hidden'));
  }

  const KNOWLEDGE_BASE = [
    {
      keywords: ['mantenimiento', 'limpieza', 'polvo', 'pasta termica', 'prevenir', 'sucio'],
      answer: '¡El mantenimiento preventivo es nuestra especialidad número uno! 🛠️ En teléfonos incluye limpieza ultrasónica de circuitos, desobstrucción de puertos de carga, limpieza de mallas de altavoz y sellado nuevo de protección. En computadores (Mac y PC) desarmamos, cambiamos la pasta térmica por Artic MX-4 de alta gama y eliminamos toda mota de polvo de las turbinas para bajar la temperatura hasta 25°C. ¿Para qué equipo lo necesitas?'
    },
    {
      keywords: ['mojado', 'agua', 'piscina', 'mar', 'salgar', 'puerto colombia', 'arroz', 'liquido'],
      answer: '⚠️ **¡ALERTA DE EQUIPO MOJADO!** 1) NO lo conectes al cargador. 2) NO uses secador ni lo metas en arroz (el arroz no quita el óxido interno). 3) Tráelo de inmediato a Doctor Cellphone en el Sótano del C.C. Miramar (Local 3). Desconectaremos la batería y le daremos un baño químico en nuestra tina ultrasónica para evitar que los circuitos se sulfaten. ¡El tiempo es vital!'
    },
    {
      keywords: ['pantalla', 'display', 'vidrio', 'tactil', 'oled', 'tinta', 'quebrada', 'rota'],
      answer: 'Cambiamos pantallas para todas las marcas: iPhone (conservando True Tone y función táctil original), Samsung (Super AMOLED y Dynamic AMOLED 120Hz), Xiaomi, Motorola, MacBooks y laptops. La instalación tarda un promedio de 45 a 60 minutos con garantía escrita.'
    },
    {
      keywords: ['bateria', 'salud', '100%', 'descarga', 'se apaga', 'duracion'],
      answer: 'Instalamos baterías nuevas Grado A+ ciclo cero. En iPhones calibramos para que marque el 100% de condición de salud sin molestos avisos de pieza desconocida. ¿Qué modelo de celular tienes?'
    },
    {
      keywords: ['direccion', 'donde', 'ubicacion', 'llegar', 'miramar', 'mapa', 'barranquilla'],
      answer: '📍 Estamos ubicados en: **Tv. 43 #Calle 99-50, Sótano Local 3, Centro Comercial Miramar, Barranquilla, Atlántico**. Cuenta con parqueadero cubierto vigilado y aire acondicionado. Puedes dejar tu equipo mientras haces tus compras o diligencias.'
    },
    {
      keywords: ['horario', 'hora', 'dias', 'abierto', 'sabado', 'domingo'],
      answer: '⏰ Atendemos de **Lunes a Sábado de 8:00 AM a 5:00 PM** en jornada continua. Por WhatsApp (+57 304 4010187) puedes dejar tu consulta o cotización a cualquier hora y te responderemos a primera hora.'
    },
    {
      keywords: ['omar', 'experto', 'tecnico', 'quien', 'experiencia'],
      answer: '👨‍🔧 **Omar Dias** es técnico especialista en microelectrónica y reparación de telefonía celular y computadores, con más de una década de experiencia diagnosticando placas lógicas, microsoldadura y rescate de equipos que otros talleres dan por perdidos.'
    },
    {
      keywords: ['precio', 'costo', 'cotizar', 'cuanto', 'valor'],
      answer: 'Nuestros mantenimientos preventivos inician desde **$35,000 COP** para Android, **$45,000 COP** para iPhone y **$65,000 - $85,000 COP** para laptops y Mac con pasta térmica prémium. Puedes usar el cotizador interactivo de esta web para ver el valor exacto.'
    }
  ];

  function getBotResponse(userMsg) {
    const clean = userMsg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some(k => clean.includes(k))) {
        return item.answer;
      }
    }
    return `Gracias por tu mensaje. Para un diagnóstico personalizado de tu equipo o agendar tu mantenimiento, escríbenos directamente al WhatsApp de Omar Dias: **+57 304 4010187** o visítanos en el Sótano Local 3 del C.C. Miramar. ¡Con gusto te atenderemos!`;
  }

  function appendMessage(sender, text) {
    const isUser = sender === 'user';
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex gap-2.5 mb-3 ${isUser ? 'justify-end' : 'justify-start'}`;

    msgDiv.innerHTML = `
      ${!isUser ? '<div class="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 text-xs font-bold font-mono">DR</div>' : ''}
      <div class="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs ${isUser ? 'bg-amber-400 text-slate-950 font-medium rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-none'} shadow">
        <p class="leading-relaxed whitespace-pre-line">${text}</p>
      </div>
    `;

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleSend(text) {
    const query = text || (chatInput ? chatInput.value.trim() : '');
    if (!query) return;

    appendMessage('user', query);
    if (chatInput) chatInput.value = '';

    // Simulate typing
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex gap-2 items-center text-xs text-amber-400 font-mono mb-2';
    typingDiv.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span> Omar Dias / DocBot está escribiendo...';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      typingDiv.remove();
      const response = getBotResponse(query);
      appendMessage('bot', response);
    }, 600);
  }

  if (sendBtn) sendBtn.addEventListener('click', () => handleSend());
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt') || chip.textContent;
      handleSend(prompt);
    });
  });
}

/* ============================================================
   7. FAQ ACCORDION
   ============================================================ */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');
      
      // Close all others
      items.forEach(other => {
        const otherContent = other.querySelector('.faq-content');
        const otherIcon = other.querySelector('.faq-icon');
        if (otherContent) otherContent.classList.add('hidden');
        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ============================================================
   8. UTILIDADES (TOASTS)
   ============================================================ */
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fas fa-microchip text-amber-400"></i>
    <span class="text-xs font-semibold">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s';
    setTimeout(() => toast.remove(), 400);
  }, 2800);
}
