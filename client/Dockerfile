FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

# Build-time environment variables for Next.js
ARG NEXT_PUBLIC_API
ENV NEXT_PUBLIC_API=$NEXT_PUBLIC_API

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
