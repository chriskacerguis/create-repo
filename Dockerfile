# Use the official Node.js 18 image as the base image
FROM node:20

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Ensure the create-repo.js script is executable
RUN chmod +x create-repo.js

# Set the entrypoint to the create-repo.js script
ENTRYPOINT ["./create-repo.js"]
