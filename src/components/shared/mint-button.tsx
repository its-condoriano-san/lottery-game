import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Button } from '../ui/button';
import { useTokens } from '@/providers/TokensProvider/tokens.hooks';

const MintButton = () => {
  const { mintLootToken } = useTokens();
  return (
    <div className="flex flex-row gap-5">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={'secondary'} onClick={mintLootToken}>
              Mint
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              You can mint LOOT to play games for free! Cover a small gas fee
              and mint 50 LOOT!
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <button>?</button>
    </div>
  );
};

export default MintButton;
