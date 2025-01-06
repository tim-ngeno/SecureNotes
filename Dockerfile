FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy only package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code, excluding node_modules
COPY . .


# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
