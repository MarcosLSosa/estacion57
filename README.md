# Estacion 57

Sitio web para Estacion 57, un club dentro de un tren historico ubicado en Villa Mercedes, San Luis. La experiencia publica presenta la identidad del club, su cartelera de eventos, la ubicacion y los canales de contacto.

## Contenido del sitio

### Sitio publico (`/`)

- Encabezado fijo con la marca Estacion 57.
- Navegacion interna hacia cartelera, ubicacion y contacto.
- Hero principal con el concepto:
  - "La noche tiene nueva estacion."
  - "Un club dentro de un tren historico."
- Botones para consultar la cartelera y como llegar.
- Seccion de proximas estaciones con tarjetas de eventos:
  - Brandub - August Muract.
  - Emi Llopiz b2b Lucas Roldan.
  - Marlene.
- Cada evento muestra fecha, titulo, descripcion, imagen y una accion.
- El evento de Emi Llopiz b2b Lucas Roldan incluye un enlace externo a Alpogo para comprar entradas.
- Seccion de ubicacion con la direccion:
  - Av. Los Alamos y Calle Angosta.
  - Villa Mercedes, San Luis.
- Boton para abrir la ubicacion en Google Maps.
- Seccion de Instagram con enlace a `@estacion57_vm`.
- Pie de pagina con la marca, direccion e Instagram.

### Panel de administracion (`/admin`)

El panel permite gestionar eventos reales en Supabase:

- Resumen de eventos publicados.
- Indicador de proxima fecha.
- Estado del sitio.
- Formulario para cargar un evento con titulo, fecha y descripcion.
- Area visual para seleccionar o arrastrar un flyer.
- Listado de eventos cargados.
- Eliminacion de eventos del listado.
- Navegacion para volver al sitio publico.
- Alta de eventos con fecha, descripcion y flyer.
- Listado y eliminacion de eventos persistidos.
- Acceso protegido por Supabase Auth y roles `admin` o `editor`.

## Identidad visual

La interfaz toma como referencia los flyers compartidos para los eventos:

- Paleta principal roja, negra y blanca.
- Contraste alto para titulares y llamadas a la accion.
- Tipografias `Cinzel` y `Poppins` cargadas desde Google Fonts.
- Composicion editorial con bloques grandes, bordes rectos y tarjetas de eventos.
- Diseño responsive para escritorio, tablet y celular.

## Tecnologias

- Next.js 16 con App Router.
- React.
- TypeScript.
- Tailwind CSS mediante PostCSS.
- Supabase preparado para persistencia de eventos y almacenamiento de flyers.
- Google Fonts: Cinzel y Poppins.

## Requisitos

- Node.js instalado.
- npm instalado.

## Instalacion

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

El panel esta disponible en [http://localhost:3000/admin](http://localhost:3000/admin).

## Scripts disponibles

| Comando | Funcion |
| --- | --- |
| `npm run dev` | Inicia Next.js en modo desarrollo con Turbopack. |
| `npm run build` | Genera la compilacion optimizada de produccion. |
| `npm run start` | Inicia la aplicacion compilada. |
| `npm run lint` | Ejecuta el lint configurado para el proyecto. |

## Estructura principal

```text
.
├── src/
│   └── app/
│       ├── admin/
│       │   └── page.tsx       # Panel de administracion conectado a Supabase
│       ├── globals.css         # Estilos globales e identidad visual
│       ├── layout.tsx          # Layout, metadata y fuentes globales
│       └── page.tsx            # Sitio publico y cartelera
├── supabase/
│   └── schema.sql              # Tabla de eventos y bucket de flyers
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Modelo de datos preparado

El archivo `supabase/schema.sql` define la tabla `public.eventos` con:

- `id`: identificador UUID.
- `titulo`: nombre del evento.
- `fecha`: fecha del evento.
- `descripcion`: informacion adicional.
- `flyer_url`: URL del flyer.
- `activo`: permite mostrar u ocultar eventos.
- `created_at`: fecha de creacion.

Tambien crea el bucket publico `flyers`, perfiles de usuarios y politicas RLS para que los eventos activos sean visibles publicamente y solo los usuarios con rol `admin` o `editor` puedan gestionarlos.

## Crear usuarios del panel

1. Ejecutar todo `supabase/schema.sql` desde el SQL Editor del proyecto Supabase.
2. Crear cada usuario desde **Authentication > Users > Add user**, con email y contraseña.
3. El trigger crea automáticamente su perfil. Para dar acceso al primer usuario, ejecutar:

```sql
update public.perfiles
set rol = 'admin'
where id = (select id from auth.users where email = 'admin@tudominio.com');
```

Usar `rol = 'editor'` para el resto del equipo. La URL y la clave pública deben estar configuradas como `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local` y en Vercel.

## Configuracion de variables

Crear `.env.local` con las credenciales publicas del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
```

## Verificacion

La aplicacion compila correctamente con:

```bash
npm run build
```
