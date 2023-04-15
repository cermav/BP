# Specify the base image
FROM node:16.13.0-alpine3.14

# Set the working directory
WORKDIR /

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the source code to the container
COPY . .

RUN npm run build

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Expose the port
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]