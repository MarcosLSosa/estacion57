"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type EventItem = { id: string; titulo: string; fecha: string; descripcion: string | null; flyer_url: string | null; activo: boolean };

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}

export default function AdminPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [flyer, setFlyer] = useState<File | null>(null);
  const [notice, setNotice] = useState("Cargando eventos...");
  const [saving, setSaving] = useState(false);

  async function loadEvents() {
    const supabase = createClient();
    const { data, error } = await supabase.from("eventos").select("id, titulo, fecha, descripcion, flyer_url, activo").order("fecha", { ascending: true });
    if (error) { setNotice("No se pudieron cargar los eventos."); return; }
    setEvents(data as EventItem[]);
    setNotice("");
  }

  useEffect(() => { void loadEvents(); }, []);

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();
    setSaving(true); setNotice("");
    let flyerUrl: string | null = null;
    if (flyer) {
      const filename = `${crypto.randomUUID()}-${flyer.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
      const upload = await supabase.storage.from("flyers").upload(filename, flyer, { upsert: false });
      if (upload.error) { setSaving(false); setNotice("No se pudo subir el flyer."); return; }
      flyerUrl = supabase.storage.from("flyers").getPublicUrl(filename).data.publicUrl;
    }
    const { error } = await supabase.from("eventos").insert({ titulo: title, fecha: date, descripcion: description || null, flyer_url: flyerUrl });
    setSaving(false);
    if (error) { setNotice("No se pudo guardar el evento."); return; }
    setTitle(""); setDate(""); setDescription(""); setFlyer(null);
    setNotice("Evento publicado correctamente.");
    await loadEvents();
  }

  async function removeEvent(eventItem: EventItem) {
    if (!window.confirm(`¿Eliminar "${eventItem.titulo}"?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("eventos").delete().eq("id", eventItem.id);
    if (error) { setNotice("No se pudo eliminar el evento."); return; }
    setEvents((current) => current.filter((item) => item.id !== eventItem.id));
    setNotice("Evento eliminado.");
  }

  async function logout() { await createClient().auth.signOut(); window.location.href = "/admin/login"; }

  const nextEvent = events.find((event) => event.activo && event.fecha >= new Date().toISOString().slice(0, 10));
  return <main className="admin-page"><header className="admin-header"><a className="brand" href="/"><span className="brand-mark"><span>57</span></span> ESTACIÓN 57</a><span className="admin-user">ADMINISTRACIÓN <strong>● ONLINE</strong> <button type="button" onClick={logout}>Salir</button></span></header><div className="admin-layout"><aside className="admin-sidebar"><p className="eyebrow">Panel de control</p><h1>Buenas noches,<br /><em>Estación.</em></h1><nav><a className="active" href="#resumen">Resumen</a><a href="#eventos">Eventos</a></nav><a href="/" className="back-link">← Ver sitio público</a></aside><section className="admin-content" id="resumen"><div className="admin-title"><div><p className="eyebrow">Gestión de cartelera</p><h2>Resumen general</h2></div><span className="connection">● Supabase conectado</span></div><div className="stats"><div><span>Eventos publicados</span><strong>{events.length}</strong><small>Persistidos en Supabase</small></div><div><span>Próxima fecha</span><strong>{nextEvent ? new Date(`${nextEvent.fecha}T12:00:00`).getDate() : "--"} <small>{nextEvent ? new Date(`${nextEvent.fecha}T12:00:00`).toLocaleDateString("es-AR", { month: "short" }).toUpperCase() : ""}</small></strong><small>{nextEvent?.titulo || "Sin eventos próximos"}</small></div><div><span>Estado del sitio</span><strong className="live">Activo</strong><small>Cartelera pública sincronizada</small></div></div><div className="admin-columns"><div className="panel" id="eventos"><div className="panel-heading"><div><p className="eyebrow">Nueva publicación</p><h3>Cargar evento</h3></div><span className="step">01 / 02</span></div><form onSubmit={publish}><label>Título del evento<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ej. Noche de Reinas" required /></label><label>Fecha<input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label><label>Descripción<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Contale a la ciudad qué va a pasar..." rows={4} /></label><label>Flyer del evento<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFlyer(event.target.files?.[0] || null)} /></label><button className="button" type="submit" disabled={saving}>{saving ? "Guardando..." : "Publicar evento →"}</button>{notice && <p className="auth-error">{notice}</p>}</form></div><div className="panel event-list"><div className="panel-heading"><div><p className="eyebrow">Cartelera actual</p><h3>Eventos publicados</h3></div><span className="step">02 / 02</span></div>{events.length === 0 ? <p>No hay eventos cargados todavía.</p> : events.map((event) => <article className="event-row" key={event.id}>{event.flyer_url ? <img src={event.flyer_url} alt="" /> : <div className="event-placeholder">57</div>}<div><strong>{event.titulo}</strong><span>{formatDate(event.fecha)}</span></div><button type="button" onClick={() => void removeEvent(event)} aria-label={`Eliminar ${event.titulo}`}>×</button></article>)}</div></div></section></div></main>;
}
