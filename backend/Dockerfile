FROM node:latest

WORKDIR /app

COPY package.json /app

RUN rm -rf node_modules/ && npm i

COPY . /app

CMD [ "npm", "start" ]