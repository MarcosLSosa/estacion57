"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { createClient } from "@/lib/supabase/client";

type Validation = { ok: boolean; estado: string; nombre?: string };

export default function EntryPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Validation | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;
    scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 240, height: 240 } }, (decoded) => {
      setCode(decoded);
      void validate(decoded);
      scanner.stop().catch(() => undefined);
    }, () => undefined).catch(() => undefined);
    return () => { scanner.stop().catch(() => undefined); };
  }, []);

  async function validate(value = code) {
    if (!value.trim()) return;
    const supabase = createClient();
    const { data, error } = await supabase.rpc("validar_entrada", { codigo_entrada: value.trim() });
    if (error) {
      setResult({ ok: false, estado: "error" });
      return;
    }
    setResult(data as Validation);
  }

  return <main className="checkin-page"><div className="checkin-shell"><a className="brand" href="/"><span className="brand-mark"><span>EST</span><strong>57!</strong></span> ESTACIÓN 57</a><div className="checkin-heading"><p className="eyebrow">Control de acceso</p><h1>Entrada QR.</h1><p>Escaneá el código de la entrada para validar el ingreso.</p></div><div className="checkin-grid"><div className="scanner-panel"><div id="qr-reader" /><p className="scanner-help">Permití el acceso a la cámara para escanear.</p></div><form className="code-panel" onSubmit={(event) => { event.preventDefault(); void validate(); }}><label>Código manual<input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Pegá el código de entrada" /></label><button className="button" type="submit">Validar entrada</button>{result && <div className={`validation-result ${result.ok ? "is-valid" : "is-invalid"}`}><strong>{result.ok ? "Ingreso autorizado" : result.estado === "usada" ? "Entrada ya utilizada" : "Entrada no válida"}</strong>{result.nombre && <span>{result.nombre}</span>}</div>}</form></div></div></main>;
}
