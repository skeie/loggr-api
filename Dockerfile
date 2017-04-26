FROM node:7.9.0-alpine

RUN mkdir -p /src/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm i && npm cache clean
COPY . /usr/src/app

EXPOSE 3000

RUN npm run build

CMD [ "npm", "run", "start" ]