import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Random } from '@/assets/icons';
import { useLottery } from '@/providers/lotteryProvider';
import Ticket from './Ticket/Ticket';
import { toast } from 'react-toastify';

type BuyTicketModalProps = {
  trigger: React.ReactNode;
};

const BuyTicketModal = ({ trigger }: BuyTicketModalProps) => {
  const { gameState, setGameState, addTicket, buy, prepareInputs } =
    useLottery();

  const selectLottoNumber = (number: number) => {
    const newActiveTicket = [...gameState.activeTicket];
    console.log(gameState.activeTicket, 'ticket before');

    if (gameState.activeTicket.includes(number)) {
      const index = newActiveTicket.indexOf(number);
      newActiveTicket[index] = undefined;
      setGameState({ ...gameState, activeTicket: newActiveTicket });
      return;
    }
    //find first available spot
    const firstUndefinedIndex = gameState.activeTicket.findIndex(
      (i) => i === undefined
    );
    if (firstUndefinedIndex < 0) {
      console.log('Selected more than specified size');
      return;
    }

    newActiveTicket[firstUndefinedIndex] = number;
    console.log(gameState.activeTicket, 'active ticket');
    setGameState({ ...gameState, activeTicket: newActiveTicket });
  };

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="flex h-full max-h-[750px] w-full max-w-[1000px] gap-8 bg-[#1F3F63]  p-12">
        {/* numbers */}
        <div className="flex w-full flex-col justify-between gap-4 border-r-2 border-[#2A275B] pr-12">
          <div className="flex w-[492px] flex-wrap gap-3">
            {Array.from({ length: 33 }).map((_, index) => {
              const isSelected = gameState.activeTicket.includes(index);
              return (
                <button
                  key={index}
                  onClick={() => selectLottoNumber(index)}
                  className={`px flex h-[72px] w-[72px] items-center justify-center ${isSelected ? 'bg-[#CD67CE] text-[#060634]' : 'bg-[#112946]'} rounded-full  text-[20px] font-semibold leading-[25.2px]`}
                >
                  {index}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              size={'icon'}
              className="h-[60px] w-[60px] rounded-full border border-[#ECD96F] bg-transparent text-[20px] font-semibold leading-[25.2px] text-[#ECD96F]"
            >
              <img src={Random} alt="random icon" />
            </Button>
            <Button
              onClick={() => {
                try {
                  addTicket();
                } catch (e) {
                  console.log(e);
                  toast.error(`${e}`);
                }
              }}
              className="rounded-full border border-[#ECD96F] bg-transparent px-[36px] py-[16px] text-[20px] font-semibold leading-[25.2px] text-[#ECD96F]"
            >
              Add Ticket
            </Button>
            <Button className="rounded-full border border-[#ECD96F] bg-transparent px-[36px] py-[16px] text-[20px] font-semibold leading-[25.2px] text-[#ECD96F]">
              Add x Tickets
            </Button>
          </div>
        </div>
        {/* Ticket */}
        <div className="flex w-[400px] flex-col justify-between">
          <Typography variant={'subtitle-lg'}>Your Tickets</Typography>
          <div className="selected-numbers flex justify-center gap-4">
            <Ticket
              key={gameState.activeTicket.length + 1}
              ticketNumber={gameState.activeTicket.reverse()}
              ticketNo={0}
              isDeletable={false}
            />
          </div>
          <div className="flex h-64 flex-col gap-4 overflow-y-auto">
            {gameState.selectedNumbers.map((ticket, index) => (
              <Ticket
                key={index}
                ticketNumber={ticket}
                ticketNo={index + 1}
                isDeletable={true}
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex w-full justify-between">
              <Typography variant={'body-sm'} className="text-[#58568B]">
                Tickets: {gameState.selectedNumbers.length}
              </Typography>
              <Typography variant={'body-sm'} className="text-[#58568B]">
                Total: {gameState.selectedNumbers.length * 1} ALEO
              </Typography>
            </div>
            <Button
              variant={'tertiary'}
              className="w-full rounded-full"
              onClick={() => buy()}
            >
              Buy Tickets
            </Button>
            <Typography variant={'body-sm'}>
              All tickets you buy are private.
            </Typography>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyTicketModal;
