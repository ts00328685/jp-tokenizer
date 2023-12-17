# Stage 1: Use a base image with tools to install Node.js
FROM debian:bullseye

# Update package lists and install necessary tools
RUN apt-get update && apt-get install -y curl
RUN apt-get install -y mecab 
RUN apt-get install -y libmecab-dev
RUN apt-get install -y mecab-ipadic-utf8
# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy your application files to the container
COPY . .

# Install app dependencies if needed (e.g., using package.json)
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]