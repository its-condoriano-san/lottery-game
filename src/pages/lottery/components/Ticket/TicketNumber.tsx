const TicketNumber = ({
  num,
  isSpecial,
  won
}: {
  num: number | undefined;
  isSpecial?: boolean;
  won?: boolean;
}) => {
  return (
    <>
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full  text-center font-semibold leading-[20.16px] text-[#060634] ${won ? (isSpecial ? ' bg-[#ECD96F]' : ' bg-[#CD67CE] ') : isSpecial ? ' border-2 border-[#ECD96F] text-white' : 'border-2 border-[#CD67CE] text-white'} `}
      >
        {num === undefined ? '' : num}
      </div>
    </>
  );
};

export default TicketNumber;
