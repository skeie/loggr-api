FROM node:7.5.0-alpine

RUN mkdir -p /src/src/app
WORKDIR /usr/src/app

ENV NODE_ENV production
COPY package.json /usr/src/app
RUN npm i && npm cache clean
COPY . /usr/src/app

EXPOSE 3000

RUN npm run build

CMD [ "npm", "run", "start" ]