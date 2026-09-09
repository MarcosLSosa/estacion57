"use client";

import { useEffect, useState } from "react";

type PublishedEvent = { title: string; date: string; description: string; image: string };

const events = [
  { date: "SÁB 08 AGO", title: "Brandub · August Muract", description: "Una noche de música y encuentro en la nueva estación de Villa Mercedes.", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=85" },
  { date: "SÁB 05 SEP", title: "Emi Llopiz b2b Lucas Roldán", description: "Dos sets, una pista y toda la energía de Estación 57.", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=85", ticketUrl: "https://alpogo.com/evento/emi-llopiz-b2b-lucas-roldan-de-hass-28750" },
  { date: "PRÓXIMAMENTE", title: "Marlene", description: "La noche sigue tomando forma. Atentos a nuestras próximas fechas.", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=85" },
];

export default function Home() {
  const [welcomeEvent, setWelcomeEvent] = useState<PublishedEvent | null>(null);

  useEffect(() => {
    const savedEvent = window.localStorage.getItem("estacion57:welcome-event");
    setWelcomeEvent(savedEvent ? JSON.parse(savedEvent) : events[1]);
  }, []);

  return <main>
    <header className="topbar"><div className="shell nav">
      <a className="brand" href="#inicio" aria-label="Estación 57"><span className="brand-mark"><span>EST</span><strong>57!</strong></span> ESTACIÓN 57</a>
      <nav className="nav-links" aria-label="Navegación principal"><a href="#eventos">Cartelera</a><a href="#ubicacion">Ubicación</a><a href="#contacto">Contacto</a></nav>
      <a className="admin-link" href="/admin">Panel de gestión</a>
    </div></header>
    <section className="hero" id="inicio"><video className="hero-video" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=85" aria-hidden="true"><source src="/images/fondo-pista.mp4" type="video/mp4" /></video><div className="shell hero-inner">
      <div className="live-status"><span className="live-dot" /> Estación abierta · Villa Mercedes</div>
      <h1>La noche tiene nueva estación.</h1>
      <p className="hero-copy">Un club dentro de un tren histórico. Música, encuentro y experiencias en el corazón de Calle Angosta.</p>
      <div className="actions"><a className="button" href="#eventos">Ver cartelera</a><a className="button button-secondary" href="#ubicacion">Cómo llegar</a></div>
    </div></section>
    <div className="ticker" aria-label="Información de Estación 57"><div className="ticker-track"><span>ESTACIÓN 57</span><i>✦</i><span>MÚSICA · CLUB · ENCUENTRO</span><i>✦</i><span>VILLA MERCEDES · SAN LUIS</span><i>✦</i><span>ESTACIÓN 57</span><i>✦</i><span>MÚSICA · CLUB · ENCUENTRO</span><i>✦</i></div></div>
    <section className="section" id="eventos"><div className="shell">
      <div className="section-heading"><div><p className="eyebrow">Agenda 2026</p><h2>Próximas estaciones</h2></div><p className="section-note">Elegí tu próxima noche. Actualizamos la cartelera cada semana.</p></div>
      <div className="events-grid">{events.map((event) => <article className="event-card" key={event.title}><div className="event-image"><img src={event.image} alt={event.title} onError={(image) => { image.currentTarget.src = events[0].image; }} /><span className="event-date">{event.date}</span></div><div className="event-content"><h3>{event.title}</h3><p>{event.description}</p><a className="event-link" href={event.ticketUrl ?? "#contacto"} target={event.ticketUrl ? "_blank" : undefined} rel={event.ticketUrl ? "noreferrer" : undefined}>{event.ticketUrl ? "Comprar entradas" : "Más información"} <span aria-hidden="true">→</span></a></div></article>)}</div>
    </div></section>
    <section className="section location" id="ubicacion"><div className="shell location-grid"><div><p className="eyebrow">Encontranos</p><h2>Donde la ciudad se encuentra.</h2><p>Av. Los Álamos y Calle Angosta<br />Villa Mercedes · San Luis</p><a className="button button-secondary" href="https://www.google.com/maps/search/Av.+Los+Alamos+y+Calle+Angosta+Villa+Mercedes+San+Luis" target="_blank" rel="noreferrer">Abrir en Maps</a></div><div className="map-frame" role="img" aria-label="Imagen del predio Calle Angosta"></div></div></section>
    <section className="instagram-section" aria-label="Instagram"><div className="shell instagram-inner"><div><p className="eyebrow">Seguí la estación</p><h2>@estacion57_vm</h2><p>Flyers, próximas fechas y todo lo que pasa en el club.</p></div><a className="button" href="https://www.instagram.com/estacion57_vm/" target="_blank" rel="noreferrer">Abrir Instagram ↗</a></div></section>
    <footer className="shell footer" id="contacto"><span>© 2026 Estación 57</span><span>Av. Los Álamos y Calle Angosta · Villa Mercedes</span><a href="https://www.instagram.com/estacion57_vm/" target="_blank" rel="noreferrer">Instagram · @estacion57_vm</a></footer>
    {welcomeEvent && <div className="welcome-backdrop" role="dialog" aria-modal="true" aria-label={`Flyer de ${welcomeEvent.title}`}><div className="welcome-popup"><button className="welcome-close" type="button" onClick={() => setWelcomeEvent(null)} aria-label="Cerrar flyer">×</button><div className="welcome-poster"><img src={welcomeEvent.image} alt={`Flyer de ${welcomeEvent.title}`} /></div><div className="welcome-copy"><p className="eyebrow">Próxima estación</p><h2>{welcomeEvent.title}</h2><p>{welcomeEvent.description || "La noche tiene nueva estación."}</p><p className="welcome-date">{welcomeEvent.date}</p><a className="button" href="#eventos" onClick={() => setWelcomeEvent(null)}>Ver evento</a></div></div></div>}
  </main>;
}
