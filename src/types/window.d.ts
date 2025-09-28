export {};

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString(): string } }>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: unknown) => Promise<unknown>;
      signAllTransactions: (transactions: unknown[]) => Promise<unknown[]>;
      publicKey?: { toString(): string };
      isConnected?: boolean;
    };
    
    // Keep ethereum for backward compatibility during transition
    ethereum?: {
      request: (args: { 
        method: string; 
        params?: unknown[] 
      }) => Promise<unknown>;
      
      on: (
        event: string, 
        callback: (params: unknown[]) => void
      ) => void;
      
      removeListener: (
        event: string, 
        callback: (params: unknown[]) => void
      ) => void;
      
      isMetaMask?: boolean;
    };
  }
} 