import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

import BuyTicketModal from './BuyTicketModal';
import { useState, useEffect, useCallback, useRef } from 'react';
import Timer from './Timer';
import WinningNumber from './WinningNumber';
import MyTickets from './MyTickets';

const LotteryHero = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set to 12:00 AM midnight

    const difference = +midnight - +now; // Calculate time difference in milliseconds

    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        hours,
        minutes,
        seconds
      });
    } else {
      setTimeLeft({
        hours: 0,
        minutes: 0,
        seconds: 0
      });
    }
  }, []);

  useEffect(() => {
    calculateTimeLeft(); // Initial calculation
    intervalRef.current = setInterval(calculateTimeLeft, 1000); // Update every second

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Clean up the interval on component unmount
      }
    };
  }, [calculateTimeLeft]);
  return (
    <section className=" flex h-[672px] w-full flex-col items-center justify-evenly">
      <div className="flex w-full justify-between">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-start">
            <p>Prize Pool</p>
            <div className="flex flex-col items-start gap-1">
              <Typography className="font-dm-sans  text-[48px] font-bold leading-[62px] text-[#ECD96F]">
                58,421
              </Typography>
              <Typography className=" text-[16px] font-semibold uppercase leading-[19.64px] text-[#8B84C1]">
                Aleo
              </Typography>
            </div>
          </div>
        </div>
        <Timer timeLeft={timeLeft} />
      </div>
      <WinningNumber />
      <MyTickets />
      <BuyTicketModal
        trigger={
          <Button className="rounded-full px-[40px] py-[14px] text-[20px] font-semibold leading-[25.2px]">
            Buy a Ticket
          </Button>
        }
      />
    </section>
  );
};

export default LotteryHero;
