import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Layout from '../components/Layout';
import ProofForm from '../components/ProofForm';
import ProofStatus from '../components/ProofStatus';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [proofStatus, setProofStatus] = useState({
    exists: false,
    processed: false,
    verified: false
  });
  const [inputHash, setInputHash] = useState<string>();

  return (
    <Layout>
      <ToastContainer
        position="top-right"
        theme="dark"
        autoClose={5000}
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">
            Zero-Knowledge Proof Generator
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Generate and verify zero-knowledge proofs using Cartesi Coprocessor and EigenLayer.
            Prove you know something without revealing what it is.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <ProofForm />
          </div>
          <div>
            <ProofStatus
              status={proofStatus}
              inputHash={inputHash}
            />
          </div>
        </div>

        <div className="mt-12 p-6 rounded-xl backdrop-blur-lg bg-background-light/30 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">How it works</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              1. Enter two numbers that you want to prove knowledge of without revealing them.
            </p>
            <p>
              2. The system will generate a zero-knowledge proof using the Cartesi Machine.
            </p>
            <p>
              3. The proof is verified on-chain using EigenLayer's security model.
            </p>
            <p>
              4. Anyone can verify you know the numbers without learning what they are!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 