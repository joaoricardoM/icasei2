# Base image
FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Ensure public files are in the dist folder
RUN mkdir -p dist/public
COPY ./src/public/index.html dist/public/index.html
COPY ./src/public/styles.css dist/public/styles.css
COPY ./src/public/app.js dist/public/app.js

# Expose port
EXPOSE 3003

# Start the application
CMD ["npm", "start"]
