FROM node:9-slim

WORKDIR /app

COPY package.json package-lock.json /app

RUN npm ci && npm cache clean --force
# RUN rm -rf node_modules/ && npm i

COPY . /app

CMD [ "npm", "start" ]