# File: api/Dockerfile

FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
# This caches dependencies and speeds up future builds
COPY package.json package-lock.json ./

COPY prisma ./prisma

# Install all dependencies (including devDependencies for nodemon)
RUN npm install


# This line is just to make the volume mount work correctly.
# The compose file will mount your local code over this.
COPY . .


# Expose the port your app runs on
EXPOSE 4000

# The default command to run in development
# This will be used by docker-compose
CMD [ "npm", "run", "dev" ]