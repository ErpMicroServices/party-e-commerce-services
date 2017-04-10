FROM node:7.5

EXPOSE 80

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install --global nodemon babel-core babel-cli
RUN npm install
COPY . /usr/src/app


CMD [ "nodemon", "index.js", "--exec", "babel-node"]
