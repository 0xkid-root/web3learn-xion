import { useAbstraxionAccount, useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { XION_CONFIG } from "../config/xion";

export const useXionWallet = () => {
  const { data: { bech32Address }, isConnected, isConnecting } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();

  const getBalance = async () => {
    if (!bech32Address || !client) return null;
    
    try {
      const balance = await client.getBalance(bech32Address, XION_CONFIG.microDenom);
      return {
        amount: Number(balance.amount) / Math.pow(10, XION_CONFIG.coinDecimals),
        denom: "XION"
      };
    } catch (error) {
      console.error("Error fetching balance:", error);
      return null;
    }
  };

  return {
    address: bech32Address,
    isConnected,
    isConnecting,
    getBalance,
    client
  };
};