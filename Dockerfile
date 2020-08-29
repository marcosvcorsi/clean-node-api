FROM node:12

WORKDIR /usr/src/clean-node-api

COPY package.json .

RUN yarn install --production
