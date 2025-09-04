# Use Node.js 18 Alpine as base
FROM node:18-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Default command to start your app
# Change "dev" to "start" if you want production
CMD ["npm", "run", "dev"]
