import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { injectedWallet } from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { bscTestnet, baseGoerli, polygonMumbai } from 'wagmi/chains';

const connectors = connectorsForWallets([
  { groupName: 'Recommended', wallets: [injectedWallet()] },
]);

const { chains, provider } = configureChains(
  [bscTestnet, baseGoerli, polygonMumbai],
  [publicProvider()]
);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});
