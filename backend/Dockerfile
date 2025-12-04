# Multi-stage build para reducir superficie de ataque
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY src ./src

# Imagen final minimalista
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app .
# Ejecutar como usuario no root
USER node
EXPOSE 5000
CMD ["node", "src/server.js"]
