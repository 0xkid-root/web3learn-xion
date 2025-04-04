import React, { useState } from 'react';
import { Button } from "@burnt-labs/ui";
import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useXionWallet } from "../hooks/useXionWallet";

interface Module {
  id: number;
  title: string;
  content: string;
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
  completed: boolean;
}

interface CourseContentProps {
  course: {
    title: string;
    description: string;
    modules: number;
    xionReward: number;
  };
  onComplete: () => void;
  onBack: () => void;
}

export default function CourseContent({ course, onComplete, onBack }: CourseContentProps) {
  const [currentModule, setCurrentModule] = useState(0);
  const [moduleProgress, setModuleProgress] = useState<boolean[]>(new Array(course.modules).fill(false));
  const { client, address } = useXionWallet();
  const [claiming, setClaiming] = useState(false);

  const moduleContent: Module[] = Array.from({ length: course.modules }, (_, i) => ({
    id: i + 1,
    title: `Module ${i + 1}: ${getModuleTitle(i, course.title)}`,
    content: getModuleContent(i, course.title),
    quiz: getModuleQuiz(i, course.title),
    completed: moduleProgress[i]
  }));

  const handleQuizSubmit = async (selectedAnswer: number) => {
    if (selectedAnswer === moduleContent[currentModule].quiz.correctAnswer) {
      const newProgress = [...moduleProgress];
      newProgress[currentModule] = true;
      setModuleProgress(newProgress);

      if (currentModule < moduleContent.length - 1) {
        setCurrentModule(currentModule + 1);
      } else if (newProgress.every(Boolean)) {
        await claimReward();
        onComplete();
      }
    } else {
      alert("Incorrect answer. Please try again!");
    }
  };

  const claimReward = async () => {
    if (!client || !address) {
      alert("Please connect your wallet first");
      return;
    }

    setClaiming(true);
    try {
      const msg = {
        claim_course_reward: {
          course_id: course.title,
          amount: course.xionReward.toString(),
          recipient: address
        }
      };

      const result = await client.execute(
        address,
        process.env.NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS || "",
        msg,
        "auto"
      );

      if (result) {
        alert(`Successfully claimed ${course.xionReward} XION tokens!`);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
      alert("Failed to claim reward. Please try again later.");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 via-teal-700 to-green-500 p-6">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-10 rounded-lg p-8 backdrop-blur-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">{course.title}</h1>
          <Button structure="base" onClick={onBack}>Back to Dashboard</Button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="col-span-3">
            <div className="bg-white bg-opacity-5 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {moduleContent[currentModule].title}
              </h2>
              <div className="prose text-gray-300 mb-8">
                {moduleContent[currentModule].content}
              </div>
              
              <div className="bg-white bg-opacity-5 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Knowledge Check</h3>
                <p className="text-gray-300 mb-4">{moduleContent[currentModule].quiz.question}</p>
                <div className="space-y-3">
                  {moduleContent[currentModule].quiz.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizSubmit(index)}
                      className="w-full text-left p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 text-gray-300 transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {moduleContent.map((module, index) => (
              <button
                key={module.id}
                onClick={() => index <= currentModule && setCurrentModule(index)}
                className={`w-full p-3 rounded-lg flex items-center justify-between ${
                  index <= currentModule
                    ? 'bg-white bg-opacity-10 hover:bg-opacity-20'
                    : 'bg-white bg-opacity-5 cursor-not-allowed'
                }`}
                disabled={index > currentModule}
              >
                <span className="text-white text-sm">Module {module.id}</span>
                {module.completed ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                ) : (
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-white">
            Progress: {moduleProgress.filter(Boolean).length} / {moduleContent.length} modules
          </div>
          <div className="text-white">
            Reward upon completion: {course.xionReward} XION
          </div>
        </div>
      </div>
    </div>
  );
}

function getModuleTitle(index: number, courseTitle: string): string {
  switch (courseTitle) {
    case "Introduction to XION Blockchain":
      return [
        'What is XION Blockchain?',
        'XION Architecture Overview',
        'XION Network Participants',
        'XION Token Economics',
        'XION Consensus Mechanism',
        'XION Governance Model',
        'XION Use Cases',
        'Getting Started with XION'
      ][index] || `XION Concept ${index + 1}`;

    case "XION DeFi Fundamentals":
      return [
        'Introduction to DeFi on XION',
        'Understanding Liquidity Pools',
        'Yield Farming Strategies',
        'DeFi Risk Management',
        'Lending and Borrowing',
        'Stablecoin Mechanics',
        'DeFi Protocol Analysis',
        'Advanced DeFi Strategies',
        'DeFi Security',
        'Future of DeFi on XION'
      ][index] || `DeFi Concept ${index + 1}`;

    case "Advanced XION Trading":
      return [
        'XION Market Structure',
        'Technical Analysis Fundamentals',
        'Trading Psychology',
        'Risk Management Strategies',
        'Advanced Order Types',
        'Market Making Strategies',
        'Arbitrage Opportunities',
        'Trading Automation',
        'Portfolio Management',
        'Advanced Trading Tools'
      ][index] || `Trading Concept ${index + 1}`;

    case "Building on XION":
      return [
        'XION Development Environment',
        'XION SDK Overview',
        'Building DApps on XION',
        'Smart Contract Integration',
        'Frontend Development',
        'Backend Integration',
        'Testing and Deployment',
        'Performance Optimization',
        'Security Best Practices',
        'Maintenance and Upgrades'
      ][index] || `Development Concept ${index + 1}`;

    case "XION Network Security":
      return [
        'Blockchain Security Fundamentals',
        'Cryptographic Principles',
        'Network Attack Vectors',
        'Security Auditing',
        'Smart Contract Security',
        'Wallet Security',
        'Privacy Considerations',
        'Security Tools and Frameworks',
        'Incident Response',
        'Future Security Challenges'
      ][index] || `Security Concept ${index + 1}`;

    default:
      return `Module ${index + 1}`;
  }
}

function getModuleContent(index: number, courseTitle: string): string {
  switch (courseTitle) {
    case "Introduction to XION Blockchain":
      return [
        `Welcome to XION Blockchain! In this module, we'll explore:

- What is XION?
  - Blockchain fundamentals
  - XION's unique features
  - Core value propositions
  - Ecosystem overview

- Key Components:
  - Consensus mechanism
  - Network validators
  - Token economics
  - Governance system

- Getting Started:
  - Setting up a wallet
  - Network interaction
  - Basic transactions
  - Safety practices`,

        `XION Architecture Deep Dive:

- Network Architecture:
  - Node types and roles
  - Network topology
  - Data structures
  - State management

- Consensus Layer:
  - Proof of Stake mechanism
  - Validator selection
  - Block production
  - Finality guarantees

- Transaction Layer:
  - Transaction types
  - Gas mechanics
  - State transitions
  - Execution model`,

        `Network Participants Guide:

- Validator Role:
  - Requirements
  - Responsibilities
  - Rewards and penalties
  - Performance metrics

- Delegator Guide:
  - Stake delegation
  - Reward distribution
  - Risk management
  - Strategy optimization

- Developer Role:
  - SDK overview
  - API access
  - Development tools
  - Resource management`,

        `XION Token Economics:

- Token Model:
  - Supply mechanics
  - Distribution model
  - Inflation policy
  - Burning mechanisms

- Utility Functions:
  - Transaction fees
  - Staking rewards
  - Governance rights
  - Protocol incentives

- Market Dynamics:
  - Value drivers
  - Supply and demand
  - Market participants
  - Economic security`,

        `Consensus Mechanism:

- PoS Implementation:
  - Validator selection
  - Block production
  - Reward distribution
  - Slashing conditions

- Network Security:
  - Byzantine fault tolerance
  - Attack resistance
  - Economic security
  - Recovery procedures

- Performance:
  - Throughput
  - Latency
  - Scalability
  - Optimization strategies`,

        `Governance Framework:

- Governance Model:
  - Proposal system
  - Voting mechanism
  - Implementation process
  - Emergency procedures

- Participation Guide:
  - Proposal creation
  - Voting rights
  - Delegation options
  - Community engagement

- Decision Making:
  - Parameter changes
  - Protocol upgrades
  - Fund allocation
  - Emergency actions`,

        `XION Use Cases:

- DeFi Applications:
  - Lending protocols
  - DEX platforms
  - Yield farming
  - Stablecoin systems

- Enterprise Solutions:
  - Payment systems
  - Supply chain
  - Identity management
  - Asset tokenization

- Integration Options:
  - API services
  - Oracle networks
  - Cross-chain bridges
  - Layer 2 solutions`,

        `Getting Started Guide:

- Development Setup:
  - Environment configuration
  - SDK installation
  - Tool selection
  - Best practices

- First Steps:
  - Wallet creation
  - Network connection
  - Test transactions
  - Resource management

- Next Steps:
  - Advanced features
  - Community resources
  - Support channels
  - Learning path`
      ][index] || `Content for module ${index + 1}`;

    case "XION Smart Contracts":
      return [
        `Smart Contract Fundamentals:

- Basic Concepts:
  - Contract structure
  - State variables
  - Functions
  - Events

- Development Environment:
  - Compiler setup
  - Testing framework
  - Development tools
  - Best practices

- Contract Lifecycle:
  - Development
  - Testing
  - Deployment
  - Maintenance`,

        `Contract Development:

- Writing Contracts:
  - Syntax basics
  - Data types
  - Function modifiers
  - Access control

- State Management:
  - Storage patterns
  - Memory usage
  - Gas optimization
  - State transitions

- Error Handling:
  - Require statements
  - Revert conditions
  - Error messages
  - Exception handling`,

        `Security Best Practices:

- Common Vulnerabilities:
  - Reentrancy
  - Overflow/Underflow
  - Access control
  - Front-running

- Security Patterns:
  - Checks-Effects-Interactions
  - Pull over Push
  - Emergency stops
  - Access restriction

- Audit Process:
  - Code review
  - Testing
  - Verification
  - Documentation`,

        `Testing Framework:

- Test Types:
  - Unit tests
  - Integration tests
  - Property tests
  - Fuzzing tests

- Test Environment:
  - Local setup
  - Test networks
  - CI/CD integration
  - Coverage analysis

- Test Cases:
  - Scenario design
  - Edge cases
  - Gas optimization
  - Performance testing`,

        `Contract Interaction:

- Interface Design:
  - ABI specification
  - Function signatures
  - Event handling
  - Error handling

- Integration Patterns:
  - Contract calls
  - Message passing
  - Delegate calls
  - Create2 pattern

- Gas Optimization:
  - Storage patterns
  - Computation costs
  - Batch operations
  - Proxy patterns`,

        `Token Standards:

- Token Types:
  - Fungible tokens
  - Non-fungible tokens
  - Semi-fungible tokens
  - Wrapped tokens

- Implementation Guide:
  - Standard interfaces
  - Extension options
  - Security features
  - Upgrade patterns

- Integration:
  - Wallet support
  - Exchange listing
  - DeFi protocols
  - Cross-chain bridges`,

        `DeFi Contract Patterns:

- Protocol Types:
  - Lending protocols
  - DEX contracts
  - Yield farming
  - Staking systems

- Implementation:
  - Pool management
  - Price oracles
  - Reward distribution
  - Emergency systems

- Risk Management:
  - Economic security
  - Technical risks
  - Governance risks
  - Market risks`,

        `Upgrade Patterns:

- Upgrade Strategies:
  - Proxy patterns
  - Diamond pattern
  - Factory pattern
  - Registry pattern

- Implementation:
  - Storage layout
  - Function selectors
  - Access control
  - State migration

- Best Practices:
  - Testing strategy
  - Security checks
  - Documentation
  - Governance process`,

        `Gas Optimization:

- Storage Patterns:
  - Packed storage
  - Bitmap usage
  - Array management
  - Mapping strategies

- Computation:
  - Loop optimization
  - Memory vs Storage
  - Batch operations
  - View functions

- Best Practices:
  - Code organization
  - Function modifiers
  - Event usage
  - Error handling`,

        `Advanced Topics:

- Complex Patterns:
  - Flash loans
  - MEV protection
  - Layer 2 integration
  - Cross-chain bridges

- Optimization:
  - Assembly usage
  - Custom errors
  - Minimal proxies
  - Storage slots

- Future Trends:
  - New standards
  - Protocol upgrades
  - Security tools
  - Integration patterns`,

        `Contract Deployment:

- Deployment Process:
  - Network selection
  - Gas estimation
  - Constructor params
  - Verification

- Post-deployment:
  - Monitoring
  - Maintenance
  - Upgrades
  - Documentation

- Best Practices:
  - Security checks
  - Testing strategy
  - Documentation
  - Emergency plans`,

        `Contract Maintenance:

- Monitoring:
  - Event tracking
  - Error detection
  - Performance metrics
  - Security alerts

- Updates:
  - Bug fixes
  - Feature additions
  - Security patches
  - Gas optimization

- Documentation:
  - Code comments
  - Technical specs
  - User guides
  - Audit reports`
      ][index] || `Content for module ${index + 1}`;

    case "XION DeFi Fundamentals":
    case "XION DeFi Fundamentals":
      return [
        `Welcome to DeFi on XION! In this module, we'll explore:

- What is DeFi?
  - Decentralized Finance fundamentals
  - Key DeFi protocols on XION
  - DeFi vs Traditional Finance

- Core Components:
  - Automated Market Makers (AMMs)
  - Lending protocols
  - Yield aggregators
  - Stablecoin mechanisms

- Getting Started:
  - Setting up a DeFi wallet
  - Understanding gas fees
  - Basic DeFi operations
  - Risk considerations`,

        `Understanding Liquidity Pools:

- Liquidity Pool Basics
  - What are liquidity pools?
  - How do they work?
  - Pool mathematics
  - Impermanent loss

- Types of Pools:
  - Constant product pools
  - Weighted pools
  - Stable pools
  - Dynamic pools

- Liquidity Provider Guide:
  - Adding liquidity
  - Removing liquidity
  - Calculating returns
  - Risk management`,

        `Yield Farming Strategies:

- Yield Farming Fundamentals
  - What is yield farming?
  - APY vs APR
  - Compound interest
  - Risk-reward analysis

- Popular Strategies:
  - Single asset staking
  - LP token farming
  - Protocol incentives
  - Multi-protocol strategies

- Advanced Techniques:
  - Leverage farming
  - Flash loans
  - Auto-compounding
  - Yield optimization`,

        `DeFi Risk Management:

- Types of Risks:
  - Smart contract risk
  - Impermanent loss
  - Oracle failures
  - Market risks

- Risk Mitigation:
  - Portfolio diversification
  - Insurance protocols
  - Risk assessment tools
  - Emergency procedures

- Best Practices:
  - Due diligence
  - Position sizing
  - Monitoring tools
  - Exit strategies`,

        `Lending and Borrowing:

- Protocol Mechanics:
  - Lending pools
  - Interest rate models
  - Collateralization
  - Liquidations

- Borrowing Strategies:
  - Leverage trading
  - Yield farming
  - Short selling
  - Arbitrage

- Risk Management:
  - Collateral management
  - Health factor monitoring
  - Liquidation prevention
  - Emergency procedures`,

        `Stablecoin Mechanics:

- Types of Stablecoins:
  - Fiat-backed
  - Crypto-backed
  - Algorithmic
  - Hybrid models

- Use Cases:
  - Trading pairs
  - Yield farming
  - Payment systems
  - Store of value

- Risk Analysis:
  - Depeg events
  - Collateral risks
  - Regulatory concerns
  - Market impacts`,

        `DeFi Protocol Analysis:

- Evaluation Framework:
  - TVL analysis
  - User metrics
  - Revenue models
  - Token economics

- Security Assessment:
  - Audit reports
  - Bug bounties
  - Team background
  - Track record

- Performance Metrics:
  - Volume analysis
  - Fee generation
  - User growth
  - Market share`,

        `Advanced DeFi Strategies:

- Complex Strategies:
  - Delta-neutral farming
  - Options strategies
  - Cross-chain arbitrage
  - MEV opportunities

- Portfolio Management:
  - Asset allocation
  - Risk management
  - Rebalancing
  - Performance tracking

- Automation Tools:
  - Trading bots
  - Yield optimizers
  - Auto-compounders
  - Portfolio trackers`,

        `DeFi Security:

- Security Best Practices:
  - Wallet security
  - Smart contract interaction
  - Approval management
  - Emergency procedures

- Common Attack Vectors:
  - Flash loan attacks
  - Oracle manipulation
  - Front-running
  - Rug pulls

- Protection Measures:
  - Hardware wallets
  - Multi-sig wallets
  - Insurance coverage
  - Security tools`,

        `Future of DeFi on XION:

- Emerging Trends:
  - Real-world assets
  - Institutional DeFi
  - Cross-chain integration
  - Layer 2 scaling

- Innovation Areas:
  - New financial products
  - Improved UX
  - Security solutions
  - Regulatory compliance

- Ecosystem Growth:
  - Protocol development
  - User adoption
  - Infrastructure
  - Integration opportunities`
      ][index] || `Content for module ${index + 1}`;

    case "Advanced XION Trading":
      return [
        `XION Market Structure:

- Market Components:
  - Order books
  - Market makers
  - Liquidity providers
  - Price discovery

- Trading Venues:
  - DEXs vs CEXs
  - AMM protocols
  - OTC markets
  - Cross-chain bridges

- Market Dynamics:
  - Volume analysis
  - Depth charts
  - Price impact
  - Slippage considerations`,

        `Technical Analysis Fundamentals:

- Chart Analysis:
  - Candlestick patterns
  - Support/resistance
  - Trend lines
  - Moving averages

- Technical Indicators:
  - RSI
  - MACD
  - Bollinger Bands
  - Volume indicators

- Pattern Recognition:
  - Chart patterns
  - Breakout signals
  - Reversal patterns
  - Continuation patterns`,

        `Trading Psychology:

- Psychological Aspects:
  - Fear and greed
  - FOMO management
  - Loss aversion
  - Confirmation bias

- Emotional Control:
  - Discipline
  - Patience
  - Risk tolerance
  - Decision making

- Performance Optimization:
  - Journal keeping
  - Performance review
  - Strategy adjustment
  - Mental preparation`,

        `Risk Management Strategies:

- Position Sizing:
  - Kelly criterion
  - Fixed fractional
  - Risk per trade
  - Portfolio allocation

- Stop Loss Strategies:
  - Fixed stops
  - Trailing stops
  - Time-based stops
  - Volatility stops

- Portfolio Protection:
  - Hedging strategies
  - Correlation analysis
  - Diversification
  - Risk metrics`,

        `Advanced Order Types:

- Order Categories:
  - Limit orders
  - Stop orders
  - OCO orders
  - Time-weighted orders

- Execution Strategies:
  - TWAP
  - VWAP
  - Iceberg orders
  - Smart routing

- Order Management:
  - Order book analysis
  - Execution quality
  - Fill rates
  - Cost analysis`,

        `Market Making Strategies:

- Market Making Basics:
  - Spread management
  - Inventory control
  - Risk management
  - Quote optimization

- Advanced Techniques:
  - Dynamic spreads
  - Multi-asset making
  - Cross-exchange making
  - Arbitrage integration

- Technology Requirements:
  - Infrastructure
  - Connectivity
  - Risk systems
  - Monitoring tools`,

        `Arbitrage Opportunities:

- Types of Arbitrage:
  - Exchange arbitrage
  - Cross-chain arbitrage
  - Statistical arbitrage
  - Flash loan arbitrage

- Execution Framework:
  - Opportunity detection
  - Risk assessment
  - Execution speed
  - Cost analysis

- Infrastructure Setup:
  - Technical requirements
  - Network connectivity
  - Monitoring systems
  - Risk controls`,

        `Trading Automation:

- Bot Development:
  - Strategy coding
  - Risk management
  - Performance monitoring
  - Error handling

- Infrastructure:
  - Server setup
  - API integration
  - Data feeds
  - Monitoring systems

- Strategy Implementation:
  - Backtesting
  - Paper trading
  - Live deployment
  - Performance tracking`,

        `Portfolio Management:

- Portfolio Strategy:
  - Asset allocation
  - Risk budgeting
  - Rebalancing
  - Performance attribution

- Risk Management:
  - VaR analysis
  - Stress testing
  - Correlation analysis
  - Drawdown management

- Performance Analysis:
  - Return metrics
  - Risk metrics
  - Attribution analysis
  - Reporting`,

        `Advanced Trading Tools:

- Analysis Tools:
  - TradingView integration
  - Custom indicators
  - Backtesting platforms
  - Portfolio analytics

- Execution Tools:
  - Trading terminals
  - Order management
  - Risk systems
  - Automation platforms

- Monitoring Tools:
  - Market data feeds
  - Alert systems
  - Performance dashboards
  - Risk monitoring`
      ][index] || `Content for module ${index + 1}`;

    case "Building on XION":
      return [
        `XION Development Environment:

- Setup Guide:
  - Development tools
  - SDK installation
  - Environment configuration
  - Testing framework

- Key Components:
  - XION CLI
  - Development networks
  - Block explorers
  - Documentation

- Best Practices:
  - Version control
  - Code organization
  - Testing strategy
  - Deployment workflow`,

        `XION SDK Overview:

- Core Features:
  - Transaction handling
  - Account management
  - Smart contract interaction
  - Event handling

- Integration Guide:
  - SDK installation
  - Configuration
  - Basic operations
  - Error handling

- Advanced Features:
  - Custom transactions
  - Batch processing
  - Event listeners
  - State management`,

        `Building DApps on XION:

- Architecture Overview:
  - Frontend framework
  - Backend services
  - Smart contracts
  - Data storage

- Development Process:
  - Project setup
  - Component design
  - State management
  - API integration

- User Experience:
  - Wallet integration
  - Transaction flow
  - Error handling
  - Performance optimization`,

        `Smart Contract Integration:

- Contract Development:
  - Contract structure
  - State management
  - Function types
  - Events and errors

- Testing Framework:
  - Unit tests
  - Integration tests
  - Coverage analysis
  - Performance testing

- Deployment Process:
  - Contract compilation
  - Network selection
  - Verification
  - Documentation`,

        `Frontend Development:

- UI Framework:
  - Component library
  - State management
  - Routing
  - API integration

- Web3 Integration:
  - Wallet connection
  - Transaction handling
  - Event listening
  - Error management

- Performance:
  - Loading strategies
  - Caching
  - Optimization
  - Analytics`,

        `Backend Integration:

- Server Architecture:
  - API design
  - Database integration
  - Authentication
  - Caching

- Blockchain Integration:
  - Node connection
  - Event processing
  - Transaction management
  - State synchronization

- Security:
  - Access control
  - Data validation
  - Error handling
  - Monitoring`,

        `Testing and Deployment:

- Testing Strategy:
  - Unit testing
  - Integration testing
  - End-to-end testing
  - Performance testing

- Deployment Process:
  - Environment setup
  - CI/CD pipeline
  - Monitoring
  - Documentation

- Maintenance:
  - Updates
  - Bug fixes
  - Performance monitoring
  - Security patches`,

        `Performance Optimization:

- Frontend Optimization:
  - Code splitting
  - Lazy loading
  - Caching strategies
  - Bundle optimization

- Backend Optimization:
  - Database queries
  - API responses
  - Caching layers
  - Load balancing

- Blockchain Optimization:
  - Gas optimization
  - Batch processing
  - Event handling
  - State management`,

        `Security Best Practices:

- Smart Contract Security:
  - Audit process
  - Common vulnerabilities
  - Testing procedures
  - Emergency response

- Application Security:
  - Authentication
  - Authorization
  - Data protection
  - Input validation

- Infrastructure Security:
  - Network security
  - Access control
  - Monitoring
  - Incident response`,

        `Maintenance and Upgrades:

- Maintenance Strategy:
  - Regular updates
  - Security patches
  - Performance monitoring
  - User feedback

- Upgrade Process:
  - Version control
  - Testing procedure
  - Deployment strategy
  - Rollback plan

- Documentation:
  - Code documentation
  - API documentation
  - User guides
  - Maintenance logs`
      ][index] || `Content for module ${index + 1}`;

    case "XION Network Security":
      return [
        `Blockchain Security Fundamentals:

- Security Principles:
  - Decentralization
  - Consensus mechanisms
  - Cryptographic primitives
  - Network security

- Threat Landscape:
  - Attack vectors
  - Common vulnerabilities
  - Risk assessment
  - Defense strategies

- Security Framework:
  - Security policies
  - Best practices
  - Monitoring systems
  - Incident response`,

        `Cryptographic Principles:

- Cryptography Basics:
  - Hash functions
  - Digital signatures
  - Public key cryptography
  - Zero-knowledge proofs

- Implementation:
  - Key management
  - Secure random numbers
  - Encryption standards
  - Protocol security

- Advanced Topics:
  - Post-quantum cryptography
  - Multi-party computation
  - Threshold signatures
  - Privacy-preserving protocols`,

        `Network Attack Vectors:

- Common Attacks:
  - 51% attacks
  - Double spending
  - Eclipse attacks
  - DDoS attacks

- Defense Mechanisms:
  - Network monitoring
  - Node security
  - Peer selection
  - Traffic analysis

- Mitigation Strategies:
  - Security updates
  - Network hardening
  - Attack prevention
  - Recovery procedures`,

        `Security Auditing:

- Audit Process:
  - Scope definition
  - Code review
  - Vulnerability assessment
  - Report generation

- Tools and Techniques:
  - Static analysis
  - Dynamic analysis
  - Fuzzing
  - Formal verification

- Best Practices:
  - Documentation
  - Testing procedures
  - Quality assurance
  - Continuous monitoring`,

        `Smart Contract Security:

- Vulnerability Types:
  - Reentrancy
  - Integer overflow
  - Access control
  - Logic errors

- Security Tools:
  - Analysis tools
  - Testing frameworks
  - Verification tools
  - Monitoring systems

- Best Practices:
  - Secure coding
  - Testing procedures
  - Deployment checks
  - Upgrade patterns`,

        `Wallet Security:

- Wallet Types:
  - Hot wallets
  - Cold storage
  - Hardware wallets
  - Multi-sig wallets

- Security Measures:
  - Key management
  - Backup procedures
  - Access control
  - Recovery options

- Best Practices:
  - Regular audits
  - Update procedures
  - User training
  - Emergency response`,

        `Privacy Considerations:

- Privacy Features:
  - Transaction privacy
  - Address privacy
  - Data protection
  - Network privacy

- Implementation:
  - Privacy protocols
  - Encryption methods
  - Mixing services
  - Zero-knowledge proofs

- Compliance:
  - Regulatory requirements
  - Data protection
  - Audit trails
  - Reporting`,

        `Security Tools and Frameworks:

- Analysis Tools:
  - Code analyzers
  - Vulnerability scanners
  - Monitoring systems
  - Testing frameworks

- Security Frameworks:
  - Risk assessment
  - Compliance checking
  - Audit procedures
  - Incident response

- Implementation:
  - Tool integration
  - Automation
  - Reporting
  - Maintenance`,

        `Incident Response:

- Response Plan:
  - Detection
  - Analysis
  - Containment
  - Recovery

- Team Structure:
  - Roles
  - Responsibilities
  - Communication
  - Escalation

- Documentation:
  - Incident logs
  - Response procedures
  - Post-mortem analysis
  - Lessons learned`,

        `Future Security Challenges:

- Emerging Threats:
  - Quantum computing
  - AI-based attacks
  - New vulnerabilities
  - Attack evolution

- Defense Evolution:
  - Security research
  - Tool development
  - Protocol updates
  - Training needs

- Preparation:
  - Research
  - Development
  - Testing
  - Implementation`
      ][index] || `Content for module ${index + 1}`;

    default:
      return `Content for module ${index + 1}`;
  }
}

function getModuleQuiz(index: number, courseTitle: string): { question: string; options: string[]; correctAnswer: number } {
  switch (courseTitle) {
    case "Introduction to XION Blockchain":
      return [
        {
          question: "What is the primary characteristic of XION Blockchain?",
          options: [
            "A traditional centralized database",
            "A next-generation blockchain platform",
            "A social media platform",
            "A gaming console"
          ],
          correctAnswer: 1
        },
        {
          question: "Which component is fundamental to XION's architecture?",
          options: [
            "Centralized control",
            "Proof of Work consensus",
            "Layer-1 scalability solution",
            "Traditional database structure"
          ],
          correctAnswer: 2
        },
        {
          question: "What role do validators play in the XION network?",
          options: [
            "They only observe transactions",
            "They validate transactions and maintain network security",
            "They have no specific role",
            "They only store data"
          ],
          correctAnswer: 1
        },
        {
          question: "How does XION token economics work?",
          options: [
            "Fixed supply with no utility",
            "Inflationary model with utility and staking",
            "No token system",
            "Only for decoration"
          ],
          correctAnswer: 1
        },
        {
          question: "What is the purpose of XION's consensus mechanism?",
          options: [
            "To slow down transactions",
            "To ensure network agreement and security",
            "To increase costs",
            "To centralize control"
          ],
          correctAnswer: 1
        },
        {
          question: "How does XION governance work?",
          options: [
            "Central authority makes all decisions",
            "Community-driven proposal and voting system",
            "No governance system",
            "Random decision making"
          ],
          correctAnswer: 1
        },
        {
          question: "What is a primary use case for XION blockchain?",
          options: [
            "Only for gaming",
            "DeFi and decentralized applications",
            "Personal messaging",
            "File storage only"
          ],
          correctAnswer: 1
        },
        {
          question: "What do you need to start using XION blockchain?",
          options: [
            "Nothing specific",
            "A XION wallet and basic understanding",
            "Advanced programming skills",
            "Special hardware"
          ],
          correctAnswer: 1
        }
      ][index] || {
        question: "What is a key concept from XION blockchain?",
        options: [
          "Centralization",
          "Decentralization and scalability",
          "Limited functionality",
          "Slow processing"
        ],
        correctAnswer: 1
      };

    case "XION DeFi Fundamentals":
      return [
        {
          question: "What is the primary advantage of DeFi on XION?",
          options: [
            "Centralized control",
            "High transaction fees",
            "Decentralized financial services",
            "Limited accessibility"
          ],
          correctAnswer: 2
        },
        {
          question: "How do liquidity pools work in DeFi?",
          options: [
            "They require central bank approval",
            "They use automated market maker mechanisms",
            "They only accept fiat currency",
            "They need manual order matching"
          ],
          correctAnswer: 1
        },
        {
          question: "What is yield farming?",
          options: [
            "Traditional agriculture",
            "Mining cryptocurrency",
            "Earning rewards by providing liquidity",
            "Selling tokens"
          ],
          correctAnswer: 2
        }
      ][index] || {
        question: "What is a key concept from this module?",
        options: [
          "Centralization",
          "DeFi innovation",
          "Traditional finance",
          "Manual processes"
        ],
        correctAnswer: 1
      };

    case "Advanced XION Trading":
      return [
        {
          question: "What is the most important aspect of market structure?",
          options: [
            "Random trading",
            "Price discovery mechanism",
            "Ignoring volume",
            "Avoiding analysis"
          ],
          correctAnswer: 1
        },
        {
          question: "Which technical analysis tool is most useful for trend identification?",
          options: [
            "Random guessing",
            "Moving averages",
            "Ignoring charts",
            "Emotional decisions"
          ],
          correctAnswer: 1
        },
        {
          question: "What is the key to successful trading psychology?",
          options: [
            "Emotional trading",
            "Random decisions",
            "Disciplined approach",
            "Ignoring risks"
          ],
          correctAnswer: 2
        }
      ][index] || {
        question: "What is a crucial trading concept from this module?",
        options: [
          "Emotional trading",
          "Strategic planning",
          "Random execution",
          "Ignoring market conditions"
        ],
        correctAnswer: 1
      };

    case "Building on XION":
      return [
        {
          question: "What is the first step in setting up a XION development environment?",
          options: [
            "Start coding immediately",
            "Install XION SDK and tools",
            "Skip documentation",
            "Ignore testing"
          ],
          correctAnswer: 1
        },
        {
          question: "Which component is essential for XION DApp development?",
          options: [
            "No planning needed",
            "Smart contract integration",
            "Skipping testing",
            "Ignoring security"
          ],
          correctAnswer: 1
        },
        {
          question: "What is the best practice for smart contract development?",
          options: [
            "Skip testing",
            "No documentation",
            "Comprehensive testing and auditing",
            "Ignore security"
          ],
          correctAnswer: 2
        }
      ][index] || {
        question: "What is a key development principle covered in this module?",
        options: [
          "Skip planning",
          "Best practices and security",
          "Ignore testing",
          "Random development"
        ],
        correctAnswer: 1
      };

    case "XION Network Security":
      return [
        {
          question: "What is the most important aspect of blockchain security?",
          options: [
            "Ignoring vulnerabilities",
            "Comprehensive security framework",
            "No testing needed",
            "Skip auditing"
          ],
          correctAnswer: 1
        },
        {
          question: "Which cryptographic principle is fundamental to blockchain?",
          options: [
            "No encryption",
            "Public key cryptography",
            "Ignore security",
            "Skip verification"
          ],
          correctAnswer: 1
        },
        {
          question: "What is the best defense against network attacks?",
          options: [
            "No protection",
            "Multiple security layers",
            "Ignore threats",
            "Skip monitoring"
          ],
          correctAnswer: 1
        }
      ][index] || {
        question: "What is a critical security concept from this module?",
        options: [
          "Ignore security",
          "Comprehensive protection",
          "No monitoring",
          "Skip updates"
        ],
        correctAnswer: 1
      };

    default:
      return {
        question: "What is the main concept covered in this module?",
        options: [
          "Basic understanding",
          "Advanced concepts",
          "Expert knowledge",
          "All of the above"
        ],
        correctAnswer: 3
      };
  }
}