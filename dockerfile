FROM node:18.20.7-alpine3.20

WORKDIR /app

COPY package.json ./

RUN npm i

COPY . .

EXPOSE 3010

CMD [ "npm","start" ];