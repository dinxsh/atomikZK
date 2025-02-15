import { ethers } from "hardhat";
import { ZKProofGenerator } from "../typechain-types";

async function main() {
    // Get the deployed contract address
    const DEPLOYED_ADDRESS = process.env.DEPLOYED_ADDRESS;
    if (!DEPLOYED_ADDRESS) {
        throw new Error("Deployed contract address not configured");
    }

    // Get the contract instance
    const zkProofGenerator = await ethers.getContractAt(
        "ZKProofGenerator",
        DEPLOYED_ADDRESS
    ) as ZKProofGenerator;

    console.log("Running example flow...");

    // Create a sample input
    const sampleInput = {
        preimage: [123, 456] // Two numbers that we want to prove knowledge of
    };

    // Submit the proof request
    console.log("Submitting proof request...");
    const encodedInput = ethers.toUtf8Bytes(JSON.stringify(sampleInput));
    const tx = await zkProofGenerator.submitProofRequest(encodedInput);
    await tx.wait();

    // Get the input hash
    const inputHash = ethers.keccak256(encodedInput);
    console.log(`Input hash: ${inputHash}`);

    // Wait for the proof to be generated (in a real scenario, this would be handled by the Cartesi Machine)
    console.log("Waiting for proof generation...");
    let proofStatus = await zkProofGenerator.getProofStatus(inputHash);
    while (!proofStatus.processed) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        proofStatus = await zkProofGenerator.getProofStatus(inputHash);
    }

    // Verify the proof
    console.log("Verifying proof...");
    const verifyTx = await zkProofGenerator.verifyProof(inputHash);
    await verifyTx.wait();

    // Get final status
    proofStatus = await zkProofGenerator.getProofStatus(inputHash);
    console.log("Final proof status:", {
        exists: proofStatus.exists,
        processed: proofStatus.processed,
        verified: proofStatus.verified
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 