# Use Ubuntu 20.04 as base
FROM ubuntu:20.04

# Create non-root user
RUN useradd -ms /bin/bash sandbox

# Set working directory
WORKDIR /home/sandbox/app

# Install dependencies
RUN apt update && apt upgrade -y
RUN apt install -y curl nano

# Install Node.js 22
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt install -y nodejs

# Set bash prompt
RUN echo "PS1='\\w$ '" >> /home/sandbox/.bashrc

# Copy backend files into container
COPY . .

# Install project dependencies
RUN npm install

# Default command
CMD ["bash"]
