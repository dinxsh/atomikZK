# ZK Proof Generator using Cartesi Coprocessor

This project demonstrates a Zero-Knowledge Proof Generator implemented using the Cartesi Coprocessor and EigenLayer infrastructure. It allows for generating and verifying ZK proofs for arbitrary computations in a trusted environment.

## Features

- Generate ZK proofs for arbitrary inputs using Cartesi Machine
- Verify proofs on-chain using Groth16 verification
- Secure computation using EigenLayer's crypto-economic guarantees
- Linux-based proof generation environment
- Example implementation of hash preimage proof

## Prerequisites

- Node.js (v16 or later)
- Python 3.8+
- Docker and Docker Compose
- Cartesi Machine
- Access to Cartesi Testnet
- Circom (for circuit compilation)
- SnarkJS (for proof generation/verification)

## Installation

1. Install Cartesi Coprocessor CLI:
```bash
npm install -g @cartesi/cli
```

2. Clone the repository:
```bash
git clone <repository-url>
cd zk-proof-generator
```

3. Install dependencies:
```bash
npm install
```

4. Configure environment variables:
Create a `.env` file with the following variables:
```
CARTESI_TESTNET_URL="YOUR_TESTNET_URL"
PRIVATE_KEY="YOUR_PRIVATE_KEY"
CARTESI_COPROCESSOR_ADDRESS="COPROCESSOR_CONTRACT_ADDRESS"
DEPLOYED_ADDRESS="DEPLOYED_CONTRACT_ADDRESS" # After deployment
```

## Project Structure

```
├── cartesi/
│   ├── Dockerfile              # Cartesi Machine environment
│   ├── docker-compose.yml      # Local development setup
│   ├── proof_generator.py      # Main proof generation logic
│   └── requirements.txt        # Python dependencies
├── circuits/
│   └── hash_preimage.circom    # ZK circuit definition
├── contracts/
│   └── ZKProofGenerator.sol    # Main contract
├── scripts/
│   ├── deploy.ts              # Deployment script
│   ├── setup_circuit.ts       # Circuit setup script
│   └── example.ts             # Example usage script
├── test/
│   └── ZKProofGenerator.test.ts # Test cases
├── cartesi.config.json        # Cartesi Coprocessor configuration
├── hardhat.config.ts
└── package.json
```

## Development Workflow

1. Build the Cartesi Machine:
```bash
npm run cartesi:build
```

2. Set up the ZK circuit:
```bash
npm run setup:circuit
```

3. Start the Cartesi Coprocessor:
```bash
npm run cartesi:start
```

4. Deploy the contract:
```bash
npm run cartesi:deploy
```

5. Run tests:
```bash
npm run cartesi:test
```

6. For local development:
```bash
npm run start:dev
```

## Technical Details

### ZK Circuit

The project includes a sample circuit (`hash_preimage.circom`) that proves knowledge of a preimage for a Poseidon hash. You can modify or replace this circuit with your own computation requirements.

### Smart Contract

The `ZKProofGenerator` contract handles:
- Proof request submission
- Interaction with Cartesi Coprocessor
- Groth16 proof verification
- State management

### Cartesi Machine

The Python script in the Cartesi Machine:
- Compiles and sets up the circuit
- Generates ZK proofs using snarkjs
- Returns proof data to the smart contract

### Cartesi Coprocessor Integration

The project uses Cartesi Coprocessor to:
1. Run the ZK proof generation in a Linux environment
2. Handle communication between the blockchain and the Cartesi Machine
3. Ensure computation integrity through EigenLayer's security model

## Security

- All computations are verified through EigenLayer's security model
- ZK proofs ensure privacy of inputs
- Groth16 verification ensures proof validity
- Input data is hashed for privacy

## Example Usage

1. Submit a proof request:
```typescript
const input = {
    preimage: [123, 456] // Your secret input
};
await zkProofGenerator.submitProofRequest(JSON.stringify(input));
```

2. Wait for proof generation:
```typescript
const status = await zkProofGenerator.getProofStatus(inputHash);
// Check status.processed
```

3. Verify the proof:
```typescript
await zkProofGenerator.verifyProof(inputHash);
```

## Troubleshooting

1. If the Cartesi Machine fails to start:
```bash
npm run cartesi:stop
docker system prune -a
npm run cartesi:start
```

2. If proof generation fails:
```bash
docker logs zk-proof-generator
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

- Cartesi Team
- EigenLayer Team
- circom/SnarkJS Team 