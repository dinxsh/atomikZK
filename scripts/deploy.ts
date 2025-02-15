import { ethers } from "hardhat";
import { verificationKey } from "../build/circuits/verification_key";

async function main() {
  // Get the Cartesi Coprocessor address from environment
  const CARTESI_COPROCESSOR_ADDRESS = process.env.CARTESI_COPROCESSOR_ADDRESS;
  
  if (!CARTESI_COPROCESSOR_ADDRESS) {
    throw new Error("Cartesi Coprocessor address not configured");
  }

  console.log("Deploying ZKProofGenerator...");

  const ZKProofGenerator = await ethers.getContractFactory("ZKProofGenerator");
  const zkProofGenerator = await ZKProofGenerator.deploy(
    CARTESI_COPROCESSOR_ADDRESS,
    verificationKey.alpha1,
    verificationKey.beta2,
    verificationKey.gamma2,
    verificationKey.delta2,
    verificationKey.IC
  );

  await zkProofGenerator.waitForDeployment();

  const address = await zkProofGenerator.getAddress();
  console.log(`ZKProofGenerator deployed to: ${address}`);

  // Save deployment info
  console.log("Deployment info saved. Contract is ready to use!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 