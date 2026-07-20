# 🌍 Configuración de Entornos - Frontend

Este proyecto usa diferentes archivos de entorno para desarrollo y producción.

## 📁 Archivos de Entorno

- **`.env`** → Configuración por defecto (PRODUCCIÓN)
- **`.env.local`** → Configuración de DESARROLLO (localhost) - No se sube a git
- **`.env.production`** → Configuración de PRODUCCIÓN (Render) - Se sube a git

## 🚀 Cómo Funciona

### Desarrollo Local
```bash
npm start
```
- Usa automáticamente `.env.local`
- Backend: `http://localhost:8000`

### Build de Producción
```bash
npm run build
```
- Usa automáticamente `.env.production`
- Backend: `https://smart-investment-backend.onrender.com`

### Deploy en Firebase
```bash
npm run build
firebase deploy
```
- El build usa `.env.production`
- Firebase sirve el build que ya tiene la URL de producción

## ⚠️ IMPORTANTE

1. **NO** edites manualmente `.env` - se usa como fallback
2. Para desarrollo local, edita `.env.local`
3. Para producción, edita `.env.production`
4. Después de cambiar `.env.production`, haz commit y push a git
5. Luego haz build y deploy en Firebase

## 🔧 URLs Configuradas

### Producción (.env.production)
```
REACT_APP_BACKEND_URL=https://smart-investment-backend.onrender.com
```

### Desarrollo (.env.local)
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

## 📝 Notas

- React lee las variables de entorno en **tiempo de BUILD**, no en runtime
- Por eso necesitas hacer `npm run build` de nuevo si cambias las variables
- `.env.local` está en `.gitignore` (no se sube a git)
- `.env.production` SÍ se sube a git (para que Firebase lo use)
