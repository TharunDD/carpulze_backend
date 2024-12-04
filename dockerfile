FROM node:18.20.5-bookworm-slim

WORKDIR /app

COPY package.json ./

RUN npm i

COPY . .

EXPOSE 3010

CMD [ "npm","start" ];