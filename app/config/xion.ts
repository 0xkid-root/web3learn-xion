export const XION_CONFIG = {
  chainId: "xion-testnet-2",
  chainName: "XION Testnet",
  rpcUrl: "https://rpc.xion-testnet-2.burnt.com/",
  restUrl: "https://api.xion-testnet-2.burnt.com/",
  treasury: "xion1yrqvlld7zxxhxnpchl4gvfcvstauyqknl24y5fywuvtrka0g24ts6jehu2",
  gasPrice: "0.025uxion",
  microDenom: "uxion",
  coinDecimals: 6,
  gasAdjustment: 1.3
};

export const ABSTRAXION_CONFIG = {
  treasury: XION_CONFIG.treasury,
  rpcUrl: XION_CONFIG.rpcUrl,
  restUrl: XION_CONFIG.restUrl,
  chainId: XION_CONFIG.chainId,
  gasPrice: XION_CONFIG.gasPrice
};