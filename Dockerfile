FROM node:24.14.1-alpine3.23

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENTRYPOINT ["npm", "start"]
