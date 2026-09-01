# Stage 1: Build de la SPA con Angular
FROM node:20-alpine AS build

WORKDIR /app

# Copia los manifiestos de dependencias e instala
COPY package.json package-lock.json ./
RUN npm ci

# Copia el código fuente y compila
COPY . .
ARG API_URL=http://localhost:8080
RUN sed -i "s|apiUrl: '.*'|apiUrl: '${API_URL}'|" src/environments/environment.prod.ts
RUN npm run build:prod

# Stage 2: Servir con Nginx
FROM nginx:1.27-alpine

COPY --from=build /app/dist/parking-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
