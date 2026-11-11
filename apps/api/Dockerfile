FROM node:22-alpine AS build
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate && npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl dumb-init
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package*.json ./
EXPOSE 4000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
