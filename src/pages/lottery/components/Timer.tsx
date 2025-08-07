import { Typography } from '@/components/ui/typography';
import React from 'react';

const Timer = ({
  timeLeft
}: {
  timeLeft: { hours: number; minutes: number; seconds: number };
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Typography className="font-medium leading-[20.16px] text-[#f5f5f5]">
        Time Until Next Draw
      </Typography>

      <div className="flex gap-4">
        <div className="clock-border flex h-[80px] w-[80px] flex-col items-center justify-center gap-1 rounded-lg">
          <Typography className="font-dm-sans text-[24px] font-medium leading-[24px]">
            {timeLeft.hours}
          </Typography>
          <Typography variant={'label-sm'} className="text-[#92819F]">
            hr
          </Typography>
        </div>
        <div className="clock-border flex h-[80px] w-[80px] flex-col items-center justify-center gap-1 rounded-lg">
          <Typography className="font-dm-sans text-[24px] font-medium leading-[24px]">
            {timeLeft.minutes}
          </Typography>
          <Typography variant={'label-sm'} className="text-[#92819F]">
            min
          </Typography>
        </div>
        <div className="clock-border flex h-[80px] w-[80px] flex-col items-center justify-center gap-1 rounded-lg">
          <Typography className="font-dm-sans text-[24px] font-medium leading-[24px]">
            {timeLeft.seconds}
          </Typography>
          <Typography variant={'label-sm'} className="text-[#92819F]">
            sec
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Timer;
