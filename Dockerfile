FROM node:20-alpine as builder

WORKDIR /app

COPY package.json .
RUN npm install
COPY . .

ENV NODE_ENV production

RUN npm run build

FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
ENV PORT 5173
EXPOSE $PORT
