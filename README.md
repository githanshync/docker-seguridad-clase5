# Blog Simple con Seguridad (Clase 5)

## Mejoras aplicadas
- **Escaneo con Trivy**: se detectaron vulnerabilidades menores, corregidas actualizando a `node:20-alpine`.
- **Multi-stage builds**: backend reducido de ~300MB a ~80MB.
- **Usuario no root**: verificado con `docker exec backend id`, muestra `uid=1000(node)`.
- **Secretos**: credenciales de MongoDB se inyectan vía Docker secrets (`secrets/mongo_uri.txt`).
- **Imágenes minimalistas**: todas basadas en `alpine`.

## Pruebas
- `trivy image blog-backend:latest`  reporte de vulnerabilidades.
- `docker exec backend id`  confirma usuario `node`.
- `docker compose up -d`  servicios levantan correctamente con secretos.
