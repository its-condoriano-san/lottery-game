import { ChevronLeft, ChevronRight } from '@/assets/icons';
import { Typography } from '@/components/ui/typography';
import { addDays } from 'date-fns';
import TicketNumbers from './Ticket/TicketNumbers';
import { useLottery } from '@/providers/lotteryProvider';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { useEffect, useState } from 'react';
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import { startDay } from '@/constants/config';

interface WinnerTicket {
  days: number;
  tickets: Array<number>;
}

const WinningNumber = () => {
  const { gameState, getRecords, dayCount, setDayCount, getWinner } =
    useLottery();

  const { publicKey } = useWallet();
  const startingDate = startDay;
  const today = new Date();
  const timeDifference = today.getTime() - startingDate.getTime();
  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;
  const maxDays = daysPassed;
  const [winningTicket, setWinningTicket] = useState<number[]>([]);

  const handlePrevDay = () => {
    if (dayCount > 1) {
      setDayCount(dayCount - 1);
    }
  };

  const handleNextDay = () => {
    if (dayCount < maxDays) {
      setDayCount(dayCount + 1);
    }
  };

  useEffect(() => {
    const fetchWinner = async () => {
      await getWinner();
    };
    fetchWinner();
  }, []);

  useEffect(() => {
    const temp = gameState.winnerTickets?.find(
      (ticket) => ticket.days === dayCount
    );
    setWinningTicket(temp?.tickets || []);
  }, [dayCount, gameState.winnerTickets]);

  return (
    <div className="flex min-h-[100px] w-full flex-col items-center justify-between rounded-lg bg-[#1F3F63] px-8 py-4 sm:flex-row">
      <div className="flex gap-6">
        <Typography variant={'subtitle-lg'}>Winning Numbers</Typography>
        <Typography className="font-dm-sans text-[20px] font-medium text-[#F5F5F5]">
          {addDays(
            startingDate,
            dayCount - 1
            // gameState.ticketsBought[0].days
          ).toDateString()}
        </Typography>
      </div>
      <div className="flex items-center gap-8">
        <button onClick={handlePrevDay}>
          <ChevronLeftCircle className="text-[#FC5185]" />
        </button>
        {winningTicket.length > 0 ? (
          <TicketNumbers
            numbers={winningTicket} // Use the first found ticket's numbers
            won
          />
        ) : (
          <p className="text-white">Winner not selected</p>
        )}
        <button onClick={handleNextDay}>
          <ChevronRightCircle className="text-[#FC5185]" />
        </button>
      </div>
    </div>
  );
};

export default WinningNumber;
