import {
  ChevronLeft,
  ChevronLeftCircle,
  ChevronRight,
  ChevronRightCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { useLottery } from '@/providers/lotteryProvider';
import BuyTicketModal from './BuyTicketModal';
import Ticket from './Ticket/Ticket';
import { addDays } from 'date-fns';
import { useEffect } from 'react';
import { useState } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import ResultModal from './ResultModal';
import { startDay } from '@/constants/config';

interface LotteryTicket {
  days: number;
  tickets: Array<number[]>;
}

const MyTickets = () => {
  const {
    gameState,
    getRecords,
    claimableBalance, //changed
    dayCount,
    setDayCount,
    matchLottery
  } = useLottery();
  const { publicKey } = useWallet();
  const startingDate = startDay;
  const [wonAmount, setWonAmount] = useState<number>(0);
  const [ticketsByDate, setTicketsByDate] = useState<Array<LotteryTicket>>();
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const today = new Date();
  const timeDifference = today.getTime() - startingDate.getTime();
  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;
  const maxDays = daysPassed;

  const getTicketNumber = (dayIndex: number, index: number) => {
    let ticketCount = 0;
    // Sum up all tickets from previous entries
    for (let i = 0; i < dayIndex; i++) {
      ticketCount += ticketsByDate?.[i]?.tickets.length || 0;
    }
    // Add the current index + 1 for the current ticket number
    return ticketCount + index + 1;
  };

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

  const handleMatchLottery = async () => {
    const prevbalance = claimableBalance;
    let newBalance;
    matchLottery(() => {
      setIsResultModalOpen(true);

      setTimeout(() => {
        newBalance = claimableBalance;
      }, 2000);
    });
    console.log(prevbalance, newBalance, 'prev and new balance');
    setWonAmount(newBalance - prevbalance);
  };

  useEffect(() => {
    if (!publicKey) return;
    console.log('getting records');
    getRecords();
  }, [publicKey]);

  useEffect(() => {
    const filteredTickets = gameState.ticketsBought?.filter(
      (ticket) => ticket.days === dayCount
    );
    setTicketsByDate(filteredTickets);
  }, [dayCount, gameState]);

  return (
    <div className="flex  w-full  flex-col items-center gap-8 rounded-lg bg-[#1F3F63] px-8 py-6">
      <div className="flex w-full justify-between ">
        <div className="flex gap-6">
          <Typography variant={'subtitle-lg'}>
            You have{' '}
            {gameState.ticketsBought.length > 0
              ? gameState.ticketsBought.filter(
                  (ticket) => ticket.days === dayCount
                )[0]?.tickets.length || 0
              : 0}{' '}
            tickets!
          </Typography>

          <div className="flex items-center gap-4">
            <button onClick={handlePrevDay} disabled={dayCount === 1}>
              <ChevronLeftCircle className="text-[#FC5185]" />
            </button>
            <Typography className="font-dm-sans text-[20px] font-medium text-[#F5F5F5]">
              {addDays(
                startingDate,
                dayCount - 1
                // gameState.ticketsBought[0].days
              ).toDateString()}
            </Typography>
            <button onClick={handleNextDay} disabled={dayCount === maxDays}>
              <ChevronRightCircle className="text-[#FC5185]" />
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-5">
          {gameState.winnerTickets.filter((winner) => winner.days === dayCount)
            .length > 0 &&
            gameState.ticketsBought.filter((ticket) => ticket.days === dayCount)
              .length > 0 && (
              <div>
                <Button onClick={handleMatchLottery}>Check your ticket </Button>
              </div>
            )}
          <BuyTicketModal
            trigger={
              <Button
                variant={'outline'}
                className="rounded-full px-[20px] py-2"
              >
                Buy Tickets
              </Button>
            }
          />
        </div>
      </div>
      <div className="flex w-full gap-8 overflow-auto pb-4">
        {/* {gameState.ticketsBought.length > 0
          ? gameState.ticketsBought[0].tickets.map((ticket, index) => (
              <Ticket key={index} ticketNumber={ticket} ticketNo={index + 1} />
            ))
          : 'No tickets bought'} */}
        {gameState.ticketsBought.find((ticket) => ticket.days === dayCount)
          ? ticketsByDate?.map((dayTicket, dayIndex) =>
              dayTicket.tickets.map((ticket, index) => (
                <div className="flex ">
                  <Ticket
                    // key={`${dayIndex}-${index}`}
                    ticketNumber={ticket}
                    ticketNo={getTicketNumber(dayIndex, index)}
                    isDeletable={false}
                  />
                </div>
              ))
            )
          : 'No tickets bought on this day'}
        {/* {gameState.ticketsBought.find((ticket) => ticket.days === dayCount)
          ? ticketsByDate?.flatMap((dayTicket, dayIndex) =>
              dayTicket.tickets.map((ticket, index) => (
                <Ticket
                  key={`${dayIndex}-${index}`}
                  ticketNumber={ticket}
                  ticketNo={index + 1}
                />
              ))
            )
          : 'No tickets bought on this day'} */}
      </div>
      <ResultModal
        open={isResultModalOpen}
        status={wonAmount > 0 ? 'win' : 'lose'}
        onclose={() => setIsResultModalOpen(false)}
        amount={wonAmount}
      />
    </div>
  );
};

export default MyTickets;
