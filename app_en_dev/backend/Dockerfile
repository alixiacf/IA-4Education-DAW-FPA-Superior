FROM node:18-alpine

WORKDIR /app

# Install tools for healthchecks, network debugging and diagnostics
RUN apk --no-cache add curl iputils bind-tools net-tools procps jq

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# Create pdfs directory if it doesn't exist
RUN mkdir -p /app/pdfs

# Make entrypoint script executable
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3000

# Use the entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "server.js"]