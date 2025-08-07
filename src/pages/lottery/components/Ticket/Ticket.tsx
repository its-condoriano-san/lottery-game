import { Typography } from '@/components/ui/typography';
import TicketNumbers from './TicketNumbers';
import { Delete } from '@/assets/icons';
import { useLottery } from '@/providers/lotteryProvider';

type TicketProps = {
  ticketNumber: (number | undefined)[];
  ticketNo: number;
  isDeletable: boolean;
};

const Ticket = ({ ticketNumber, ticketNo, isDeletable }: TicketProps) => {
  const { removeTicket } = useLottery();

  return (
    <div className="relative">
      <div className="absolute -left-3 -top-3 h-8 w-8 rounded-full bg-[#1F3F63]" />
      <div className="absolute -bottom-3 -left-3 h-8 w-8 rounded-full bg-[#1F3F63]" />
      <div className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-[#1F3F63]" />
      <div className="absolute -bottom-3 -right-3 h-8 w-8 rounded-full bg-[#1F3F63]" />
      <div className="flex flex-col gap-5 bg-[#060634] px-8 py-6">
        <Typography className="flex flex-row justify-between font-semibold leading-[20.16px]">
          Ticket {ticketNo === 0 ? '' : ticketNo}
          {isDeletable && (
            <div>
              <button onClick={() => removeTicket(ticketNumber)}>
                <img src={Delete} alt="delete icon" className="h-5 w-10" />
              </button>
            </div>
          )}
        </Typography>
        <TicketNumbers numbers={ticketNumber} />
      </div>
    </div>
  );
};

export default Ticket;
