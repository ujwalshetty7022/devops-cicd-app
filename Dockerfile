
FROM nginx:alpine

LABEL org.opencontainers.image.title="DevOps Control Center"
LABEL org.opencontainers.image.description="Static website for a CI/CD learning project"

COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY script.js /usr/share/nginx/html/script.js

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
