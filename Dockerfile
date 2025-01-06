FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# install required libraries
RUN apt-get update && apt-get install -y libcurl4

# Copy only package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code, excluding node_modules
COPY . .

# Expose port
EXPOSE 3000