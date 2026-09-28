// Offset esplicito: senza timezone la data verrebbe interpretata nell'ora locale
// del visitatore e il countdown sarebbe sfasato per chi si collega dall'estero.
// 22 maggio 2027 cade in ora legale italiana (CEST, UTC+2).
const WEDDING_DATE = new Date('2027-05-22T11:00:00+02:00');

function renderCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;

  const diff = WEDDING_DATE - new Date();
  if (diff <= 0) {
    el.innerHTML = '<p>È il grande giorno!</p>';
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  el.innerHTML = `
    <div>${days}<span>Giorni</span></div>
    <div>${hours}<span>Ore</span></div>
    <div>${minutes}<span>Minuti</span></div>
    <div>${seconds}<span>Secondi</span></div>
  `;
}

renderCountdown();
setInterval(renderCountdown, 1000);

const WEATHER_LAT = 41.2707914;
const WEATHER_LON = 16.441639;
const WMO_DESCRIPTIONS = {
  0: 'Cielo sereno', 1: 'Poco nuvoloso', 2: 'Parzialmente nuvoloso', 3: 'Nuvoloso',
  45: 'Nebbia', 48: 'Nebbia con brina',
  51: 'Pioviggine leggera', 53: 'Pioviggine', 55: 'Pioviggine intensa',
  61: 'Pioggia leggera', 63: 'Pioggia', 65: 'Pioggia intensa',
  71: 'Neve leggera', 73: 'Neve', 75: 'Neve intensa',
  80: 'Rovesci leggeri', 81: 'Rovesci', 82: 'Rovesci intensi',
  95: 'Temporale', 96: 'Temporale con grandine', 99: 'Temporale forte'
};

async function renderWeather() {
  const el = document.getElementById('weather');
  if (!el) return;
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_LAT}&longitude=${WEATHER_LON}&current_weather=true&timezone=Europe%2FRome`
    );
    const data = await res.json();
    const current = data.current_weather;
    const desc = WMO_DESCRIPTIONS[current.weathercode] || 'Condizioni variabili';
    el.innerHTML = `
      <p class="weather-now">${desc}, ${Math.round(current.temperature)}°C</p>
      <p class="weather-note">Meteo attuale sulla zona della cerimonia. La previsione per il 22 maggio 2027 sarà visibile qui a partire da circa due settimane prima del matrimonio.</p>
    `;
  } catch {
    el.innerHTML = '<p class="weather-note">Meteo non disponibile al momento.</p>';
  }
}

renderWeather();

const FORMSPREE_URL = 'https://formspree.io/f/mwlpqepb';

// Guardia: senza questo controllo un form assente solleva un'eccezione qui e
// l'IntersectionObserver più in basso non viene mai registrato, lasciando tutte
// le sezioni .fade-in a opacity 0.
const form = document.getElementById('rsvp-form');
if (form) form.addEventListener('submit', async (e) => {
  e.preventDefault();
  // Invio in parallelo a entrambi gli endpoint (Google Sheet + Formspree).
  // no-cors su Apps Script: risposta opaca, non leggibile dal browser.
  await Promise.allSettled([
    fetch(form.action, { method: 'POST', mode: 'no-cors', body: new FormData(form) }),
    fetch(FORMSPREE_URL, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
  ]);
  form.hidden = true;
  document.getElementById('rsvp-thanks').hidden = false;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
