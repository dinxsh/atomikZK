pragma circom 2.0.0;

include "circomlib/poseidon.circom";

template HashPreimage() {
    // Public inputs
    signal input hash;
    
    // Private inputs
    signal input preimage[2];
    
    // Intermediate signals
    component hasher = Poseidon(2);
    
    // Constraints
    hasher.inputs[0] <== preimage[0];
    hasher.inputs[1] <== preimage[1];
    
    // Output constraint
    hash === hasher.out;
}

component main = HashPreimage(); 