# Blog simple con microservicios (Clase 4)

Arquitectura: Nginx (gateway), Backend Node.js, Redis cache, MongoDB, Frontend Nginx.

## Diagrama ASCII

[Client] --> (8080) Nginx Gateway --> /api --> Backend (5000) --> Redis (6379) \-> / --> Frontend (Nginx) \-> MongoDB (27017)

## Servicios

- Gateway: Nginx, puerto 8080
- Backend: Node.js, puerto 5000
- Redis: caché, puerto 6379
- DB: MongoDB, puerto 27017
- Frontend: Nginx estático

## Uso

1. docker compose up -d
2. Abrir http://localhost:8080
3. Health: /gateway/health, /api/health

## Endpoints

- GET /api/posts
- GET /api/posts/:id
- POST /api/posts

Respuestas incluyen `source: "cache"` o `source: "database"` para demostrar HIT/MISS.

## Pruebas

- Primer GET /api/posts: source=database (MISS)
- Segundo GET: source=cache (HIT)
- POST /api/posts: invalida cache de listado
- Persistencia: reiniciar contenedores y verificar datos
- Routing: /gateway/health y /api/health retornan ok

