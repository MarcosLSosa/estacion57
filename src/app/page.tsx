const events = [
  { date: "SÁB 22 JUN", title: "Fiesta Retro & Cumbia", description: "Una noche de clásicos, pista encendida y DJs invitados.", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=85" },
  { date: "VIE 28 JUN", title: "Estación Electrónica", description: "Frecuencias profundas y visuales inmersivas hasta el amanecer.", image: "https://images.unsplash.com/photo-1571266028243-d220c32d3f80?auto=format&fit=crop&w=800&q=85" },
  { date: "SÁB 06 JUL", title: "Noche de Reinas", description: "El escenario de Calle Angosta recibe una celebración inolvidable.", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=85" },
];

export default function Home() {
  return <main>
    <header className="topbar"><div className="shell nav">
      <a className="brand" href="#inicio"><span className="brand-mark"><span>57</span></span> ESTACIÓN 57</a>
      <nav className="nav-links" aria-label="Navegación principal"><a href="#eventos">Cartelera</a><a href="#ubicacion">Ubicación</a><a href="#contacto">Contacto</a></nav>
      <a className="admin-link" href="/admin">Panel de gestión</a>
    </div></header>
    <section className="hero" id="inicio"><div className="shell hero-inner">
      <p className="eyebrow">Calle Angosta · Villa Mercedes, San Luis</p>
      <h1>El pulso de la noche.</h1>
      <p className="hero-copy">Música, encuentro y experiencias en el corazón del predio Calle Angosta. La estación donde siempre pasa algo.</p>
      <div className="actions"><a className="button" href="#eventos">Ver cartelera</a><a className="button button-secondary" href="#ubicacion">Cómo llegar</a></div>
    </div></section>
    <section className="section" id="eventos"><div className="shell">
      <div className="section-heading"><div><p className="eyebrow">Agenda 2026</p><h2>Próximas estaciones</h2></div><p className="section-note">Elegí tu próxima noche. Actualizamos la cartelera cada semana.</p></div>
      <div className="events-grid">{events.map((event) => <article className="event-card" key={event.title}><div className="event-image"><img src={event.image} alt={event.title} /><span className="event-date">{event.date}</span></div><div className="event-content"><h3>{event.title}</h3><p>{event.description}</p><a className="event-link" href="#contacto">Entradas y reservas <span aria-hidden="true">→</span></a></div></article>)}</div>
    </div></section>
    <section className="section location" id="ubicacion"><div className="shell location-grid"><div><p className="eyebrow">Encontranos</p><h2>Donde la ciudad se encuentra.</h2><p>Estamos en el predio Calle Angosta, Villa Mercedes, San Luis. Vení temprano, quedate hasta tarde.</p><a className="button button-secondary" href="https://www.google.com/maps/search/Calle+Angosta+Villa+Mercedes+San+Luis" target="_blank" rel="noreferrer">Abrir en Maps</a></div><div className="map-frame" role="img" aria-label="Imagen del predio Calle Angosta"></div></div></section>
    <footer className="shell footer" id="contacto"><span>© 2026 Estación 57</span><span>Predio Calle Angosta · Villa Mercedes · San Luis</span><span>Instagram · WhatsApp</span></footer>
  </main>;
}
