#!/usr/bin/env python3
import json
import sys
import os
from pathlib import Path
import subprocess
from hashlib import sha256
from eth_abi import decode, encode

CIRCUIT_PATH = Path("/opt/cartesi/share/circuits/hash_preimage.circom")
BUILD_DIR = Path("/opt/cartesi/share/build")

def setup_circuit():
    """
    Compile the circuit and generate proving/verification keys
    """
    try:
        # Create build directory if it doesn't exist
        BUILD_DIR.mkdir(parents=True, exist_ok=True)
        
        # Compile the circuit
        subprocess.run([
            "circom",
            str(CIRCUIT_PATH),
            "--r1cs",
            "--wasm",
            "--sym",
            "-o",
            str(BUILD_DIR)
        ], check=True)
        
        # Generate proving key
        subprocess.run([
            "snarkjs",
            "groth16",
            "setup",
            str(BUILD_DIR / "hash_preimage.r1cs"),
            "pot12_final.ptau",
            str(BUILD_DIR / "hash_preimage_0000.zkey")
        ], check=True)
        
        # Generate verification key
        subprocess.run([
            "snarkjs",
            "zkey",
            "export",
            "verificationkey",
            str(BUILD_DIR / "hash_preimage_0000.zkey"),
            str(BUILD_DIR / "verification_key.json")
        ], check=True)
        
    except subprocess.CalledProcessError as e:
        print(f"Error in circuit setup: {str(e)}", file=sys.stderr)
        sys.exit(1)

def generate_proof(input_data):
    """
    Generate a ZK proof using the compiled circuit
    """
    try:
        # Parse input data
        data = json.loads(input_data)
        preimage = data.get("preimage", [0, 0])
        
        # Create witness input
        witness_input = {
            "preimage": preimage,
            "hash": calculate_poseidon_hash(preimage)
        }
        
        # Write witness input to file
        with open(BUILD_DIR / "input.json", "w") as f:
            json.dump(witness_input, f)
        
        # Generate witness
        subprocess.run([
            "snarkjs",
            "wtns",
            "calculate",
            str(BUILD_DIR / "hash_preimage_js/hash_preimage.wasm"),
            str(BUILD_DIR / "input.json"),
            str(BUILD_DIR / "witness.wtns")
        ], check=True)
        
        # Generate proof
        subprocess.run([
            "snarkjs",
            "groth16",
            "prove",
            str(BUILD_DIR / "hash_preimage_0000.zkey"),
            str(BUILD_DIR / "witness.wtns"),
            str(BUILD_DIR / "proof.json"),
            str(BUILD_DIR / "public.json")
        ], check=True)
        
        # Read generated proof
        with open(BUILD_DIR / "proof.json", "r") as f:
            proof = json.load(f)
        
        with open(BUILD_DIR / "public.json", "r") as f:
            public = json.load(f)
        
        # Format proof for smart contract
        formatted_proof = {
            "pi_a": proof["pi_a"],
            "pi_b": proof["pi_b"],
            "pi_c": proof["pi_c"],
            "protocol": "groth16",
            "public_inputs": public
        }
        
        # Calculate input hash for contract
        input_hash = sha256(str(preimage).encode()).hexdigest()
        
        return input_hash, json.dumps(formatted_proof).encode()
        
    except Exception as e:
        print(f"Error generating proof: {str(e)}", file=sys.stderr)
        sys.exit(1)

def calculate_poseidon_hash(preimage):
    """
    Calculate Poseidon hash of preimage (placeholder - implement actual Poseidon hash)
    """
    # This is a placeholder - implement actual Poseidon hash calculation
    return int(sha256(str(preimage).encode()).hexdigest(), 16) % (2**254)

def main():
    try:
        # Ensure circuit is set up
        if not (BUILD_DIR / "hash_preimage_0000.zkey").exists():
            setup_circuit()
        
        # Read input from stdin
        input_data = sys.stdin.read().strip()
        
        # Generate proof
        input_hash, proof = generate_proof(input_data)
        
        # Encode result for smart contract
        result = encode(['bytes32', 'bytes'], [bytes.fromhex(input_hash), proof])
        
        # Write result to stdout
        sys.stdout.buffer.write(result)
        
    except Exception as e:
        print(f"Error in main: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main() 