FROM node:20-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN yarn

COPY . .

ARG START
ENV NODE_ENV=${START}

EXPOSE 5846

CMD [ "yarn", "startProd" ]
