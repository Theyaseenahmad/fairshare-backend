# Use Node.js 18 Alpine (lightweight Linux image)
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Start the app
CMD ["npm", "start"]