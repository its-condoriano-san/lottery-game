import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Winner as NoLuck, Winner } from '@/assets/images';
import { Dispatch, SetStateAction } from 'react';

type ResultModalProps = {
  open: boolean;
  status: 'win' | 'lose';
  onclose: Dispatch<SetStateAction<boolean>>;
  amount: number;
};

const ResultModal = ({ open, status, onclose, amount }: ResultModalProps) => {
  return (
    <Dialog open={open}>
      <DialogContent className="result-modal-bg flex h-full max-h-[470px] w-full max-w-[640px] flex-col items-center justify-center gap-8">
        <img
          src={status === 'win' ? Winner : ''}
          alt="result-svg"
          className="max-w-[120px]"
        />
        <div className="relative flex flex-col justify-center space-y-[28px]">
          <div className="flex flex-col gap-6">
            <Typography as={'h3'} variant={'subtitle-lg'}>
              {status === 'win'
                ? `Congratulations! You’ve Won.`
                : `No Luck! Try Again. `}
            </Typography>
            {status === 'win' && (
              <Typography
                variant={'title-lg'}
                className="uppercase text-accent"
              >
                +{amount} ALEO
              </Typography>
            )}
          </div>
        </div>
        <Button
          variant={'tertiary'}
          onClick={() => onclose}
          className="rounded-full px-[40px] py-[14px] text-[20px] font-semibold leading-[25.2px]"
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ResultModal;
