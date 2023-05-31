# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /server

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the server source code to the container
COPY . .

# Expose port 3001
EXPOSE 3001

# Start the server using npm start
CMD ["npm", "run", "startDocker"]
