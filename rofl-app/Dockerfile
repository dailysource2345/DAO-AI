FROM node:20-alpine

LABEL org.opencontainers.image.title="DAO AI ROFL App"
LABEL org.opencontainers.image.description="Confidential identity linking for DAO AI"

RUN apk add --no-cache ca-certificates curl

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev 2>&1

COPY src/server.js ./src/

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

USER node

CMD ["node", "src/server.js"]
