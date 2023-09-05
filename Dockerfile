FROM node:current-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY --chown=node:node ./src/ /home/node/app/src
COPY --chown=node:node ./i18n/ /home/node/app/i18n

USER node

CMD [ "node", "src/main.js" ]
