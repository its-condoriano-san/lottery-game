import { TokenDetails } from '@/interfaces/tokens.interface';
import { ValueOf } from 'type-fest';
import { VITE_NETWORK_TYPE } from './env';
import { AleoCoin } from '@/assets/images';

export const NETWORK_TYPES = {
  MAINNET: 'mainnet',
  TESTNET: 'testnet'
} as const;

export const ALEO_TOKENS = {
  ALEO: 'Aleo'
} as const;

export type SupportedTokens = ValueOf<typeof ALEO_TOKENS>;
export type tNetworkTypes = ValueOf<typeof NETWORK_TYPES>;

export type TokenMapping = Record<SupportedTokens, TokenDetails>;

export const TOKEN_CONFIG: TokenMapping = {
  [ALEO_TOKENS.ALEO]: {
    name: 'Aleo',
    symbol: 'Aleo',
    decimals: 6,
    isActive: true,
    isNative: true,
    tokenProgram: 'credits.aleo',
    balanceMap: 'account',
    tokenId: BigInt('1234567890'),
    tokenAddress: {
      [NETWORK_TYPES.MAINNET]:
        'aleo1lqmly7ez2k48ajf5hs92ulphaqr05qm4n8qwzj8v0yprmasgpqgsez59gg',
      [NETWORK_TYPES.TESTNET]:
        'aleo1lqmly7ez2k48ajf5hs92ulphaqr05qm4n8qwzj8v0yprmasgpqgsez59gg'
    },
    logo: AleoCoin
  }
};

export const getTokenDetail = (token: SupportedTokens) => {
  const tokenDetail = TOKEN_CONFIG[token];
  if (!tokenDetail) throw new Error("Token Detail doesn't exists");
  return { ...tokenDetail, tokenAddress: tokenDetail[VITE_NETWORK_TYPE] };
};
