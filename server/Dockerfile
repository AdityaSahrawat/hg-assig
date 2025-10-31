FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY prisma ./prisma

COPY . .

EXPOSE 3121

CMD npx prisma generate && npx prisma migrate deploy && pnpm start
