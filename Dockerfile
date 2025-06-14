# --- Production stage ---
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular files
COPY dist/reboot-front/browser /usr/share/nginx/html

EXPOSE 80

