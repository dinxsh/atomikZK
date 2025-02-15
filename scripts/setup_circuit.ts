import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const circuitsDir = path.join(__dirname, '../circuits');
    const buildDir = path.join(__dirname, '../build/circuits');

    // Create build directory
    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir, { recursive: true });
    }

    console.log('Setting up ZK circuit...');

    try {
        // Compile circuit
        console.log('Compiling circuit...');
        execSync(`circom ${path.join(circuitsDir, 'hash_preimage.circom')} --r1cs --wasm --sym -o ${buildDir}`);

        // Download Powers of Tau file if not exists
        if (!fs.existsSync(path.join(buildDir, 'pot12_final.ptau'))) {
            console.log('Downloading Powers of Tau file...');
            execSync(`wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau -O ${path.join(buildDir, 'pot12_final.ptau')}`);
        }

        // Generate proving key
        console.log('Generating proving key...');
        execSync(`snarkjs groth16 setup ${path.join(buildDir, 'hash_preimage.r1cs')} ${path.join(buildDir, 'pot12_final.ptau')} ${path.join(buildDir, 'hash_preimage_0000.zkey')}`);

        // Generate verification key
        console.log('Generating verification key...');
        execSync(`snarkjs zkey export verificationkey ${path.join(buildDir, 'hash_preimage_0000.zkey')} ${path.join(buildDir, 'verification_key.json')}`);

        // Generate Solidity verifier
        console.log('Generating Solidity verifier...');
        execSync(`snarkjs zkey export solidityverifier ${path.join(buildDir, 'hash_preimage_0000.zkey')} ${path.join(buildDir, 'verifier.sol')}`);

        // Read verification key
        const verificationKey = JSON.parse(fs.readFileSync(path.join(buildDir, 'verification_key.json'), 'utf8'));

        // Format verification key for contract constructor
        const formattedKey = {
            alpha1: verificationKey.vk_alpha_1,
            beta2: verificationKey.vk_beta_2,
            gamma2: verificationKey.vk_gamma_2,
            delta2: verificationKey.vk_delta_2,
            IC: verificationKey.IC
        };

        // Save formatted key
        fs.writeFileSync(
            path.join(buildDir, 'verification_key.ts'),
            `export const verificationKey = ${JSON.stringify(formattedKey, null, 2)};`
        );

        console.log('Circuit setup complete!');
        console.log('Verification key saved to build/circuits/verification_key.ts');

    } catch (error) {
        console.error('Error setting up circuit:', error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 