import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

interface ProofStatusProps {
  status: {
    exists: boolean;
    processed: boolean;
    verified: boolean;
  };
  inputHash?: string;
}

export default function ProofStatus({ status, inputHash }: ProofStatusProps) {
  const getStatusIcon = () => {
    if (!status.exists) return <ClockIcon className="h-6 w-6 text-gray-400" />;
    if (!status.processed) return <ClockIcon className="h-6 w-6 text-primary animate-pulse" />;
    if (status.verified) return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
    return <XCircleIcon className="h-6 w-6 text-red-500" />;
  };

  const getStatusText = () => {
    if (!status.exists) return 'No proof submitted';
    if (!status.processed) return 'Generating proof...';
    if (status.verified) return 'Proof verified successfully';
    return 'Proof verification failed';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl backdrop-blur-lg bg-background-light/30 border border-gray-800"
    >
      <h2 className="text-xl font-semibold mb-4">Proof Status</h2>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <span className="text-lg">{getStatusText()}</span>
        </div>

        {inputHash && (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-1">Input Hash:</p>
            <div className="p-3 rounded-lg bg-background-dark break-all font-mono text-sm">
              {inputHash}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-4">
          <StatusIndicator
            label="Submitted"
            active={status.exists}
          />
          <StatusIndicator
            label="Processed"
            active={status.processed}
          />
          <StatusIndicator
            label="Verified"
            active={status.verified}
          />
        </div>
      </div>
    </motion.div>
  );
}

interface StatusIndicatorProps {
  label: string;
  active: boolean;
}

function StatusIndicator({ label, active }: StatusIndicatorProps) {
  return (
    <div className="text-center">
      <div
        className={`w-3 h-3 rounded-full mx-auto mb-2 ${
          active
            ? 'bg-primary animate-pulse'
            : 'bg-gray-600'
        }`}
      />
      <span className="text-sm text-gray-400">{label}</span>
    </div>
  );
} 