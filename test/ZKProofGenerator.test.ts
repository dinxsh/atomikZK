import { expect } from "chai";
import { ethers } from "hardhat";
import { verificationKey } from "../build/circuits/verification_key";
import { ZKProofGenerator } from "../typechain-types";

describe("ZKProofGenerator", function () {
    let zkProofGenerator: ZKProofGenerator;
    let owner: any;
    let user: any;
    
    const mockCoprocessorAddress = "0x1234567890123456789012345678901234567890";

    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();

        const ZKProofGenerator = await ethers.getContractFactory("ZKProofGenerator");
        zkProofGenerator = await ZKProofGenerator.deploy(
            mockCoprocessorAddress,
            verificationKey.alpha1,
            verificationKey.beta2,
            verificationKey.gamma2,
            verificationKey.delta2,
            verificationKey.IC
        );
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await zkProofGenerator.owner()).to.equal(owner.address);
        });
    });

    describe("Proof Generation", function () {
        it("Should accept proof requests", async function () {
            const input = ethers.encodeBytes32String("test input");
            await expect(zkProofGenerator.connect(user).submitProofRequest(input))
                .to.emit(zkProofGenerator, "ProofSubmitted")
                .withArgs(ethers.keccak256(input), user.address);
        });

        it("Should not accept duplicate requests", async function () {
            const input = ethers.encodeBytes32String("test input");
            await zkProofGenerator.connect(user).submitProofRequest(input);
            
            await expect(
                zkProofGenerator.connect(user).submitProofRequest(input)
            ).to.be.revertedWith("Request already exists");
        });
    });

    describe("Proof Verification", function () {
        it("Should not verify non-existent proofs", async function () {
            const fakeHash = ethers.keccak256(ethers.encodeBytes32String("fake"));
            await expect(
                zkProofGenerator.verifyProof(fakeHash)
            ).to.be.revertedWith("Proof not generated yet");
        });

        // Add more test cases for proof verification once implemented
    });

    describe("Proof Status", function () {
        it("Should return correct status for non-existent proof", async function () {
            const fakeHash = ethers.keccak256(ethers.encodeBytes32String("fake"));
            const status = await zkProofGenerator.getProofStatus(fakeHash);
            
            expect(status.exists).to.be.false;
            expect(status.processed).to.be.false;
            expect(status.verified).to.be.false;
            expect(status.proof).to.equal("0x");
        });

        it("Should return correct status for submitted proof", async function () {
            const input = ethers.encodeBytes32String("test input");
            const inputHash = ethers.keccak256(input);
            
            await zkProofGenerator.connect(user).submitProofRequest(input);
            const status = await zkProofGenerator.getProofStatus(inputHash);
            
            expect(status.exists).to.be.true;
            expect(status.processed).to.be.false;
            expect(status.verified).to.be.false;
            expect(status.proof).to.equal("0x");
        });
    });
}); 