FROM cartesi/python:3.10-slim-jammy

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (required for circom and snarkjs)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g circom@2.1.5 snarkjs@0.7.2

# Create app directory
WORKDIR /opt/cartesi/dapp

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the application
COPY . .

# Create directories for circuits and build
RUN mkdir -p /opt/cartesi/share/circuits
RUN mkdir -p /opt/cartesi/share/build

# Copy circuit files
COPY ../circuits/hash_preimage.circom /opt/cartesi/share/circuits/

# Make the script executable
RUN chmod +x proof_generator.py

ENTRYPOINT ["python3", "proof_generator.py"] 