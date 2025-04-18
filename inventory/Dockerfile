# Use official Node.js LTS image
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3004

CMD ["node", "inventory-service.js"]
