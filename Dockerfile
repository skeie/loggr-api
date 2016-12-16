FROM mhart/alpine-node:7.1.0

ENV NODE_ENV production

RUN addgroup -S node && adduser -S -s /bin/bash node node

RUN mkdir -p /home/node/src
WORKDIR /home/node/src

# The shrinkwrap is optional
COPY package.json ./

# Make sure to be able to build native deps, and remove buildtools afterwards for slim image
# https://github.com/mhart/alpine-node/issues/47
RUN apk add --no-cache --virtual build-dependencies make gcc g++ python git && \
    npm install && \
    npm cache clean && \
    apk del build-dependencies

COPY . .

EXPOSE 8011

RUN chown -R node:node .
USER node

CMD ["sh", "server/run.sh"]
