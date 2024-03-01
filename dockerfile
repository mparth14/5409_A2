# Use the official Node.js 14 image as base
FROM node:14

# Set working directory within the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000 for Express server
EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]
