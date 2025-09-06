# Use Node 18 Alpine
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install procps for os-utils (required for CPU/RAM metrics)
RUN apk add --no-cache bash procps

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]
