# VNSOW · Frontend

Interfaz web de la plataforma de inversión **VNSOW**: landing, autenticación, dashboard de usuario, billetera, referidos y panel de administración.

> React 19 · CRACO · Tailwind CSS + shadcn/ui · React Router 7

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| UI | React **19** |
| Tooling | `react-scripts` 5 sobre **CRACO** (`@craco/craco`) |
| Estilos | Tailwind CSS `3.4` + `tailwindcss-animate` |
| Componentes | **shadcn/ui** (estilo *new-york*) sobre Radix UI |
| Navegación | `react-router-dom` **7** |
| HTTP | `axios` |
| Formularios | `react-hook-form` + `zod` (`@hookform/resolvers`) |
| Iconos | `lucide-react` |
| Notificaciones | `sonner` |
| Extras | `embla-carousel`, `date-fns`, `cmdk`, `vaul`, `input-otp` |

## Características

- ✅ Landing page con calculadora de retornos
- ✅ Autenticación (Google OAuth + Email/Password)
- ✅ Dashboard de usuario con estadísticas
- ✅ Gestión de inversiones y planes
- ✅ Billetera interna con historial
- ✅ Sistema de referidos
- ✅ Panel de administración
- ✅ Diseño responsive

---

## Requisitos previos

- Node.js **≥ 18**
- El [backend de VNSOW](../vnsow-backend) corriendo y accesible

## Instalación local

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo de entorno
cp .env.example .env

# 3. Apuntar al backend (ver variables abajo) y arrancar
npm start
```

La app queda disponible en `http://localhost:3000`.

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `REACT_APP_BACKEND_URL` | URL base del backend | `http://localhost:8000` |

Flags opcionales de CRACO (ver `craco.config.js`), útiles en desarrollo:

| Variable | Efecto |
|---|---|
| `DISABLE_HOT_RELOAD` | Desactiva el hot-reload de webpack |
| `REACT_APP_ENABLE_VISUAL_EDITS` | Carga el plugin de edición visual (`plugins/visual-edits`) |
| `ENABLE_HEALTH_CHECK` | Expone endpoints de health-check (`plugins/health-check`) |

> **Importante:** en Create React App / CRACO solo se exponen al bundle las variables con prefijo `REACT_APP_`. Se compilan en el build, por lo que **no** deben contener secretos sensibles.

---

## Scripts disponibles

| Script | Acción |
|---|---|
| `npm start` | Servidor de desarrollo (`craco start`) en `:3000` |
| `npm run build` | Build de producción optimizado en `build/` (`craco build`) |
| `npm test` | Runner de tests en modo watch (`craco test`) |

---

## Estructura del proyecto

```
vnsow-frontend/
├── public/                # index.html, manifest, favicons (VNSOW)
├── src/
│   ├── assets/
│   │   ├── icons/         # Logos e isotipo VNSOW (SVG)
│   │   └── images/
│   ├── components/        # Componentes de la app
│   │   └── ui/            # Primitivos shadcn/ui
│   ├── context/           # React Context (estado global)
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilidades (cn, helpers)
│   └── utils/             # Funciones auxiliares
├── plugins/               # Plugins CRACO opcionales (visual-edits, health-check)
├── craco.config.js        # Override de webpack (alias @ → src)
├── tailwind.config.js     # Tema y paleta de marca
└── components.json        # Configuración de shadcn/ui
```

Alias de importación: `@/` → `src/` (definido en `craco.config.js`).

---

## Identidad visual

El color de marca está **centralizado** en `tailwind.config.js` bajo la paleta `brand`
(verde VNSOW `#3aaa35`, el mismo del isotipo):

| Token | Hex | Uso |
|---|---|---|
| `brand-50` | `#effbee` | Fondos suaves |
| `brand-500` | `#3aaa35` | **Color principal** |
| `brand-600` | `#2e922a` | Hover / énfasis |
| `brand-900` | `#1c4b1b` | Texto sobre claro |

Se usa con clases Tailwind estándar: `bg-brand-500`, `text-brand-600`, `border-brand-200`, etc.
Los verdes `green-*` se reservan para estados semánticos (éxito, WhatsApp) y **no** son color de marca.

**Assets de marca** (`src/assets/icons/`):

| Archivo | Descripción |
|---|---|
| `vnsow-logo.svg` | Logo horizontal, texto oscuro (fondos claros) |
| `vnsow-logo-white.svg` | Logo horizontal, texto blanco (fondos oscuros) |
| `vnsow-favicon.svg` | Isotipo (la "V") para icono |

Favicons rasterizados (`public/`): `favicon.ico`, `favicon.png`, `logo192.png`, `logo512.png`.

---

## Deploy (Firebase Hosting)

El proyecto incluye `firebase.json`. Para publicar el build:

```bash
npm run build
firebase deploy --only hosting
```

Configura el proyecto de Firebase en `.firebaserc` (ignorado en git) y define
`REACT_APP_BACKEND_URL` con la URL del backend de producción antes de hacer `build`.

## Licencia

Privado — **VNSOW**. Todos los derechos reservados.
