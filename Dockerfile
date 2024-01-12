# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Create a directory for Prisma output with correct permissions
RUN mkdir -p /usr/src/app/prisma
RUN chown -R node:node /usr/src/app/prisma

# Set environment variable for database connection
#Create .env file to store DATABASE_URL_ENV (postress url)
ENV DATABASE_URL=DATABASE_URL_ENV

# Copy prisma directory
COPY prisma prisma/

# Apply database migrations
RUN npx prisma db push

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Specify the command to run your app
CMD ["npm", "start"]
