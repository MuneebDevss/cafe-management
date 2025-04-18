# Use official Node.js LTS image
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3002

CMD ["node", "order-service.js"]
