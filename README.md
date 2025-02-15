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
- Hardhat
- Cartesi Machine
- Access to Cartesi Testnet
- Circom (for circuit compilation)
- SnarkJS (for proof generation/verification)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd zk-proof-generator
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file with the following variables:
```
CARTESI_TESTNET_URL="YOUR_TESTNET_URL"
PRIVATE_KEY="YOUR_PRIVATE_KEY"
CARTESI_COPROCESSOR_ADDRESS="COPROCESSOR_CONTRACT_ADDRESS"
DEPLOYED_ADDRESS="DEPLOYED_CONTRACT_ADDRESS" # After deployment
```

## Project Structure

```
├── circuits/
│   └── hash_preimage.circom    # ZK circuit definition
├── contracts/
│   └── ZKProofGenerator.sol    # Main contract
├── cartesi/
│   └── proof_generator.py      # Cartesi Machine logic
├── scripts/
│   ├── deploy.ts              # Deployment script
│   ├── setup_circuit.ts       # Circuit setup script
│   └── example.ts             # Example usage script
├── test/
│   └── ZKProofGenerator.test.ts # Test cases
├── hardhat.config.ts
└── package.json
```

## Development Workflow

1. Set up the ZK circuit:
```bash
npm run setup:circuit
```
This will:
- Compile the circuit
- Generate proving/verification keys
- Create necessary build artifacts

2. Compile contracts:
```bash
npm run compile
```

3. Run tests:
```bash
npm test
```

4. Deploy the contract:
```bash
npm run deploy
```

5. Run the example:
```bash
npx hardhat run scripts/example.ts
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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

- Cartesi Team
- EigenLayer Team
- circom/SnarkJS Team 