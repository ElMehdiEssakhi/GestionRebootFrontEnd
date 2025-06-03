# --- Build stage ---
FROM node:22.14.0-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g @angular/cli
RUN ng build --configuration production

# --- Production stage ---
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/reboot-front/browser /usr/share/nginx/html
EXPOSE 80
