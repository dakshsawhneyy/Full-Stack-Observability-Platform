FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app .

EXPOSE 9000

CMD ["node", "index.js"]