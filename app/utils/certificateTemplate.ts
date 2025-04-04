import { Certificate } from '../services/certificate';

export function generateCertificateTemplate(certificate: Certificate): string {
  const date = new Date(certificate.completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <!-- Certificate Border -->
      <rect x="20" y="20" width="760" height="560" fill="none" 
        stroke="#234CAD" stroke-width="2" rx="10" />
      <rect x="25" y="25" width="750" height="550" fill="none" 
        stroke="#234CAD" stroke-width="1" rx="8" />

      <!-- Header -->
      <text x="400" y="100" text-anchor="middle" font-family="Arial" 
        font-size="48" fill="#234CAD" font-weight="bold">Certificate of Completion</text>

      <!-- Web3Learn Logo -->
      <text x="400" y="150" text-anchor="middle" font-family="Arial" 
        font-size="24" fill="#666">Web3Learn</text>

      <!-- Main Text -->
      <text x="400" y="250" text-anchor="middle" font-family="Arial" 
        font-size="24" fill="#333">This is to certify that</text>

      <!-- Student Address -->
      <text x="400" y="300" text-anchor="middle" font-family="monospace" 
        font-size="20" fill="#234CAD">${certificate.studentAddress}</text>

      <!-- Course Details -->
      <text x="400" y="350" text-anchor="middle" font-family="Arial" 
        font-size="24" fill="#333">has successfully completed the course</text>

      <text x="400" y="400" text-anchor="middle" font-family="Arial" 
        font-size="32" fill="#234CAD" font-weight="bold">${certificate.courseName}</text>

      <!-- Date -->
      <text x="400" y="450" text-anchor="middle" font-family="Arial" 
        font-size="20" fill="#666">Completed on ${date}</text>

      <!-- Verification Info -->
      <text x="400" y="500" text-anchor="middle" font-family="Arial" 
        font-size="14" fill="#666">Verified on XION Blockchain</text>
      <text x="400" y="520" text-anchor="middle" font-family="monospace" 
        font-size="12" fill="#666">${certificate.transactionHash || 'Pending Verification'}</text>
    </svg>
  `.trim();
}