# CafeHUD

Una aplicación full-stack para gestionar cafeterías con carrito de compra, reseñas y panel de administración.

## 🏗️ Estructura del Proyecto

```
cafehud/
├── backend/          # Node.js + Express API (puerto 4000)
├── frontend/         # React + React Router (puerto 3000)
├── docker-compose.yml
└── README.md
```

## 🚀 Inicio Rápido

### Requisitos
- Docker & Docker Compose
- Node.js 18+ (para desarrollo local)

### Arrancar con Docker

```bash
docker compose up --build -d
```

Servicios levantados:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **MongoDB**: localhost:27017

### Arrancar localmente

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📦 Stack Técnico

### Backend
- **Runtime**: Node.js 18-alpine
- **Framework**: Express
- **Base de datos**: MongoDB 7
- **Autenticación**: JWT
- **Documentación**: Swagger/OpenAPI

### Frontend
- **Runtime**: Node.js 24-alpine
- **Framework**: React 19 + React Router 7
- **Empaquetador**: Vite 8
- **Estilos**: Tailwind CSS 4 + PostCSS
- **Validación**: React Hook Form + Zod
- **Estado**: Zustand
- **HTTP Client**: Axios

## 🔧 Configuración

### Variables de Entorno

**Backend** (`.env`):
```
MONGODB_URI=mongodb://root:example@mongo:27017/cafe-spa?authSource=admin
NODE_ENV=production
PORT=3000
```

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:4000
```

## 📝 Scripts Disponibles

### Backend
```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon
npm test           # Tests
npm run lint       # ESLint
```

### Frontend
```bash
npm run dev        # Desarrollo con Vite HMR
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # ESLint
```

## 🐳 Docker Compose

El archivo `docker-compose.yml` configura:
- **mongo**: Base de datos
- **backend**: API Express
- **frontend**: App React

Todos los servicios están en la red `cafe_network`.

## 🛠️ Desarrollo

### Actualizar dependencias

Para regenerar `package-lock.json` compatible con Alpine:

```bash
docker run --rm -v "$(pwd)/frontend:/app" -w /app node:24-alpine npm install
```

### Ver logs

```bash
docker compose logs -f [backend|frontend|mongo]
```

### Detener servicios

```bash
docker compose down
```

## 📚 Rutas y Endpoints

- `/` - Página principal
- `/login` - Autenticación
- `/register` - Registro
- `/dashboard` - Panel de usuario
- `/admin` - Panel de administrador
- `/api/cafes` - CRUD de cafeterías
- `/api/reviews` - Reseñas
- `/api/favorites` - Favoritos

## 📄 Licencia

MIT