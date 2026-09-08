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
- Seccion de Instagram con enlace a `@estacion57`.
- Pie de pagina con la marca, direccion e Instagram.

### Panel de administracion (`/admin`)

El panel funciona actualmente como una demostracion visual y de interaccion:

- Resumen de eventos publicados.
- Indicador de proxima fecha.
- Estado del sitio.
- Formulario para cargar un evento con titulo, fecha y descripcion.
- Area visual para seleccionar o arrastrar un flyer.
- Listado de eventos cargados.
- Eliminacion de eventos del listado demo.
- Navegacion para volver al sitio publico.

Los eventos agregados desde el panel se guardan solamente en el estado del navegador. Al recargar la pagina se recuperan los datos iniciales porque la conexion con Supabase todavia no esta implementada.

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
│       │   └── page.tsx       # Panel de administracion demo
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

Tambien crea el bucket publico `flyers` y politicas RLS para que los eventos activos sean visibles publicamente y los usuarios autenticados puedan gestionarlos.

## Estado actual y proximos pasos

La base visual y las interacciones principales ya estan implementadas. Para convertir el panel en un CMS real seria necesario:

1. Configurar las variables de entorno de Supabase.
2. Reemplazar los datos estaticos de `page.tsx` por consultas a `public.eventos`.
3. Conectar el formulario del panel con Supabase.
4. Implementar la carga real de flyers al bucket `flyers`.
5. Agregar autenticacion y proteger la ruta `/admin`.
6. Reemplazar las imagenes de muestra por los flyers definitivos de cada evento.

## Verificacion

La aplicacion compila correctamente con:

```bash
npm run build
```
