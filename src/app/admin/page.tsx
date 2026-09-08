"use client";

import { FormEvent, useState } from "react";

type EventItem = { id: number; title: string; date: string; status: string; image: string };

const initialEvents: EventItem[] = [
  { id: 1, title: "Fiesta Retro & Cumbia", date: "22 JUN 2026", status: "Publicado", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=240&q=80" },
  { id: 2, title: "Estación Electrónica", date: "28 JUN 2026", status: "Publicado", image: "https://images.unsplash.com/photo-1571266028243-d220c32d3f80?auto=format&fit=crop&w=240&q=80" },
];

export default function AdminPage() {
  const [events, setEvents] = useState(initialEvents);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [notice, setNotice] = useState("");

  function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title || !date) return;
    const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
    const flyer = "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=85";
    const publishedEvent = { title, date: formattedDate, description, image: flyer };
    setEvents((current) => [{ id: Date.now(), title, date: formattedDate, status: "Publicado", image: flyer }, ...current]);
    window.localStorage.setItem("estacion57:welcome-event", JSON.stringify(publishedEvent));
    setTitle(""); setDate(""); setDescription(""); setNotice("Evento publicado. Ahora aparece como bienvenida en el sitio público.");
  }

  return <main className="admin-page"><header className="admin-header"><a className="brand" href="/"><span className="brand-mark"><span>57</span></span> ESTACIÓN 57</a><span className="admin-user">ADMINISTRACIÓN <strong>● ONLINE</strong></span></header><div className="admin-layout"><aside className="admin-sidebar"><p className="eyebrow">Panel de control</p><h1>Buenas noches,<br /><em>Estación.</em></h1><nav><a className="active" href="#resumen">Resumen</a><a href="#eventos">Eventos</a><a href="#configuracion">Configuración</a></nav><a href="/" className="back-link">← Ver sitio público</a></aside><section className="admin-content" id="resumen"><div className="admin-title"><div><p className="eyebrow">Martes 08 de septiembre, 2026</p><h2>Resumen general</h2></div><span className="connection">● Modo demo activo</span></div><div className="stats"><div><span>Eventos publicados</span><strong>{events.length}</strong><small>+2 este mes</small></div><div><span>Próxima fecha</span><strong>22 <small>JUN</small></strong><small>Fiesta Retro & Cumbia</small></div><div><span>Estado del sitio</span><strong className="live">Activo</strong><small>Última actualización ahora</small></div></div><div className="admin-columns"><div className="panel" id="eventos"><div className="panel-heading"><div><p className="eyebrow">Nueva publicación</p><h3>Cargar evento</h3></div><span className="step">01 / 02</span></div><form onSubmit={publish}><label>Título del evento<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ej. Noche de Reinas" required /></label><label>Fecha<input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label><label>Descripción<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Contale a la ciudad qué va a pasar..." rows={4} /></label><label>Flyer del evento<div className="dropzone"><span>+</span><strong>Arrastrá una imagen aquí</strong><small>JPG, PNG o WEBP · Máximo 5MB</small></div></label><button className="button" type="submit">Publicar evento <span>→</span></button>{notice && <p className="notice">{notice}</p>}</form></div><div className="panel"><div className="panel-heading"><div><p className="eyebrow">Cartelera actual</p><h3>Eventos activos</h3></div><span className="count">{events.length}</span></div><div className="event-list">{events.map((item) => <div className="admin-event" key={item.id}><img src={item.image} alt="" /><div><strong>{item.title}</strong><span>{item.date}</span></div><button aria-label={`Eliminar ${item.title}`} onClick={() => setEvents((current) => current.filter((event) => event.id !== item.id))}>×</button></div>)}</div><a className="manage-link" href="#eventos">Gestionar cartelera <span>→</span></a></div></div></section></div></main>;
}
