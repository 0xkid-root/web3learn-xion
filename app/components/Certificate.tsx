import React from 'react';
import { useXionWallet } from '../hooks/useXionWallet';
import { CertificateService } from '../services/certificate';

interface CertificateProps {
  courseId: string;
  courseName: string;
  studentAddress: string;
  completionDate?: Date;
  transactionHash?: string;
}

export const Certificate: React.FC<CertificateProps> = ({
  courseId,
  courseName,
  studentAddress,
  completionDate,
  transactionHash
}) => {
  const { client } = useXionWallet();
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState<boolean | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const certificateService = React.useMemo(() => {
    return client ? new CertificateService(client) : null;
  }, [client]);

  const handleVerification = async () => {
    if (!certificateService || !transactionHash) {
      setError('Cannot verify certificate without wallet connection or transaction hash');
      return;
    }

    try {
      setIsVerifying(true);
      setError(null);
      const verified = await certificateService.verifyCertificate(transactionHash);
      setIsVerified(verified);
    } catch (err) {
      setError('Failed to verify certificate');
      setIsVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-4">
      <div className="border-b pb-4">
        <h3 className="text-xl font-bold text-gray-900">{courseName} Certificate</h3>
        <p className="text-gray-500 text-sm">Course ID: {courseId}</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm">
          <span className="font-semibold">Issued to:</span>{' '}
          <span className="font-mono">{studentAddress}</span>
        </p>
        {completionDate && (
          <p className="text-sm">
            <span className="font-semibold">Completed on:</span>{' '}
            {completionDate.toLocaleDateString()}
          </p>
        )}
        {transactionHash && (
          <p className="text-sm break-all">
            <span className="font-semibold">Transaction:</span>{' '}
            <span className="font-mono text-xs">{transactionHash}</span>
          </p>
        )}
      </div>

      <div className="pt-4">
        <button
          onClick={handleVerification}
          disabled={isVerifying || !transactionHash}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${isVerifying
            ? 'bg-gray-400'
            : isVerified
              ? 'bg-green-500'
              : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isVerifying
            ? 'Verifying...'
            : isVerified
              ? '✓ Verified'
              : 'Verify Certificate'}
        </button>

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};