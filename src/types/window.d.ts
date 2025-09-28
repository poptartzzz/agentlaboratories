export {};

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString(): string } }>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: any) => Promise<any>;
      signAllTransactions: (transactions: any[]) => Promise<any[]>;
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