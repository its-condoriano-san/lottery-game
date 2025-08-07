import { Typography } from '../ui/typography';
import { Dialog, DialogContent, DialogClose } from '../ui/dialog';
import { useTransaction } from '@/providers/TransactionProvider/transaction.provider';
import { TRANSACTION_STEPS } from '@/configs/transaction';
import { XIcon } from 'lucide-react';

const LoaderModal = () => {
  const { currentTxnStep, setCurrentTxnStep } = useTransaction();

  return (
    <Dialog open={Boolean(currentTxnStep)}>
      <DialogContent>
        <div className="flex  flex-col items-center rounded-lg bg-[#1D1B49] p-12">
          {/* Close button */}
          <DialogClose asChild>
            <button
              className="absolute right-4 top-4 z-50 h-10 w-10 px-10 text-white hover:text-gray-400"
              onClick={() => {
                setCurrentTxnStep(TRANSACTION_STEPS.IDLE);
              }}
            >
              <XIcon className="h-6 w-6" />
            </button>
          </DialogClose>
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-white border-l-transparent" />
          <div className="flex flex-col items-center gap-4">
            {' '}
            <Typography className="text-center font-dm-sans font-bold leading-[20.83px] text-white">
              Please just wait for a moment while we process your
              transaction...{' '}
            </Typography>{' '}
            <Typography className="text-center font-dm-sans text-[14px] font-bold leading-[18.23px] text-[#58568B]">
              This might take up to upwards of 2 minutes{' '}
            </Typography>{' '}
          </div>{' '}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoaderModal;
