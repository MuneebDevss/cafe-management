# Use official Node.js LTS image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install app dependencies
RUN npm install


COPY . .

# Expose port
EXPOSE 3001

# Start the customer service
CMD ["node", "customer-service.js"]
