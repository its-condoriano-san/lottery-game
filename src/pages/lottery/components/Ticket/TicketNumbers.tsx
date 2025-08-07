import TicketNumber from './TicketNumber';

type TicketNumbersProps = {
  numbers: (number | undefined)[];
  won?: boolean;
};

const TicketNumbers = ({ numbers, won }: TicketNumbersProps) => {
  return (
    <div className="flex gap-3">
      {numbers.map((num, index) => (
        <TicketNumber key={index} num={num} isSpecial={index === 5} won={won} />
      ))}
     
    </div>
  );
};

export default TicketNumbers;
