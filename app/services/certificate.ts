import { GranteeSignerClient } from "@burnt-labs/abstraxion";

export interface Certificate {
  id: string;
  courseId: string;
  studentAddress: string;
  courseName: string;
  completionDate: Date;
  issueDate: Date;
  transactionHash?: string;
}

interface CertificateMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    courseName: string;
    completionDate: string;
    issueDate: string;
    studentAddress: string;
  };
}

export class CertificateService {
  private client: GranteeSignerClient;

  constructor(client: GranteeSignerClient) {
    this.client = client;
  }

  /**
   * Generates a new certificate for a completed course
   */
  async generateCertificate(courseId: string, courseName: string, studentAddress: string): Promise<Certificate> {
    const certificate: Certificate = {
      id: `${courseId}-${studentAddress}-${Date.now()}`,
      courseId,
      studentAddress,
      courseName,
      completionDate: new Date(),
      issueDate: new Date()
    };

    // Generate certificate metadata for blockchain storage
    const metadata = this.createCertificateMetadata(certificate);

    // Store certificate metadata on XION blockchain
    const transactionHash = await this.storeCertificateOnChain(metadata);
    certificate.transactionHash = transactionHash;

    return certificate;
  }

  /**
   * Creates metadata for the certificate to be stored on chain
   */
  private createCertificateMetadata(certificate: Certificate): CertificateMetadata {
    return {
      name: `${certificate.courseName} Certificate`,
      description: `Certificate of completion for ${certificate.courseName}`,
      image: this.generateCertificateImage(certificate), // This would be implemented to generate a visual certificate
      attributes: {
        courseName: certificate.courseName,
        completionDate: certificate.completionDate.toISOString(),
        issueDate: certificate.issueDate.toISOString(),
        studentAddress: certificate.studentAddress
      }
    };
  }

  /**
   * Stores certificate metadata on XION blockchain
   */
  private async storeCertificateOnChain(metadata: CertificateMetadata): Promise<string> {
    try {
      // This is a placeholder for the actual XION blockchain interaction
      // Implementation would depend on XION's specific API for storing metadata
      const transaction = await this.client.execute(
        process.env.NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS || "",
        JSON.stringify({
          store_certificate: {
            metadata: JSON.stringify(metadata)
          }
        }),
        "auto",
        "auto",
        "0"
      );

      return transaction.transactionHash;
    } catch (error) {
      console.error('Failed to store certificate on chain:', error);
      throw new Error('Failed to store certificate on blockchain');
    }
  }

  /**
   * Generates a visual representation of the certificate
   * This is a placeholder that would need to be implemented based on your design requirements
   */
  private generateCertificateImage(certificate: Certificate): string {
    // This would be implemented to generate an actual certificate image
    // Could use HTML5 Canvas, SVG, or a third-party service
    return `https://api.web3learn.io/certificates/${certificate.id}/image`;
  }

  /**
   * Verifies a certificate's authenticity on the blockchain
   */
  async verifyCertificate(certificateId: string): Promise<boolean> {
    try {
      // This would be implemented to verify the certificate on XION blockchain
      // Implementation would depend on XION's specific API for verification
      const isValid = await this.client.queryContractSmart(
        process.env.NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS || "",
        { verify_certificate: { certificate_id: certificateId } }
      );
      return !!isValid;
    } catch (error) {
      console.error('Failed to verify certificate:', error);
      return false;
    }
  }
}