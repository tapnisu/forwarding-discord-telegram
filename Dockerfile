# Base image with Node and Python (since pnpm and Python are both needed)
FROM node:18-bullseye as builder

# Set working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libffi-dev \
    libnacl-dev \
    libssl-dev \
    python3 \
    python3-pip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Clone the project from GitHub
RUN git clone https://github.com/tapnisu/forwarding-discord-telegram.git /app

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies with pnpm
RUN pnpm install

# Build the bot using pnpm
RUN pnpm build

# Final stage for runtime
FROM node:18-bullseye-slim

# Set working directory in the container
WORKDIR /app

# Copy only the necessary built files from the builder stage
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json

# Install pnpm globally
RUN npm install -g pnpm

# Run the bot via pnpm
CMD ["pnpm", "start"]
