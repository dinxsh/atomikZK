import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowPathIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

export default function ProofForm() {
  const [preimage, setPreimage] = useState<[number, number]>([0, 0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement actual proof submission
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      toast.success('Proof submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit proof');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl backdrop-blur-lg bg-background-light/30 border border-gray-800"
    >
      <div className="flex items-center mb-6">
        <LockClosedIcon className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-xl font-semibold">Generate ZK Proof</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Preimage First Number
            </label>
            <input
              type="number"
              value={preimage[0]}
              onChange={e => setPreimage([parseInt(e.target.value), preimage[1]])}
              className="w-full px-4 py-2 rounded-lg bg-background-dark border border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              placeholder="Enter first number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Preimage Second Number
            </label>
            <input
              type="number"
              value={preimage[1]}
              onChange={e => setPreimage([preimage[0], parseInt(e.target.value)])}
              className="w-full px-4 py-2 rounded-lg bg-background-dark border border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              placeholder="Enter second number"
              required
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center">
            {loading ? (
              <>
                <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
                Generating Proof...
              </>
            ) : (
              'Generate Proof'
            )}
          </span>
        </motion.button>
      </form>

      <div className="mt-6 text-sm text-gray-400">
        <p>This will generate a zero-knowledge proof that you know the preimage of a hash without revealing the actual numbers.</p>
      </div>
    </motion.div>
  );
} 