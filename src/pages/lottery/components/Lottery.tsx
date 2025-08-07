import MyTickets from './MyTickets';
import WinningNumber from './WinningNumber';
import { LotteryProvider } from '@/providers/lotteryProvider';

const Lottery = () => {
  return (
    <>
      <WinningNumber />
      <MyTickets />
    </>
  );
};

export default Lottery;
