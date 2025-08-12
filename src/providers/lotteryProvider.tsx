import { VITE_LOTTERY_PROGRAM, VITE_NETWORK_TYPE } from '@/configs/env';
import {
  Transaction,
  WalletAdapterNetwork
} from '@demox-labs/aleo-wallet-adapter-base';
import { useAleoContract } from '@/hooks/useAleoContract';
import { useAleoTransaction } from '@/hooks/useAleoTransaction';
import { useAleoWallet } from '@/hooks/useAleoWallet';
import { convertNormalToBigIntValue } from '@/utils/conversion';
import { hasher } from '@/utils/hasher';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { js2leo } from '@/lib/aleo';
import { TRANSACTION_STEPS } from '@/configs/transaction';
import { toast } from 'react-toastify';
import { useTransaction } from './TransactionProvider/transaction.provider';
import { leo2js } from '@/lib/aleo';
import { number } from 'zod';
import { startDay } from '@/constants/config';

enum GameMode {
  Public = 'public',
  Private = 'private'
}

interface ILotteryContext {
  gameState: LotteryGameState;
  claimableBalance: number;

  addTicket: () => void;
  setGameState: React.Dispatch<React.SetStateAction<LotteryGameState>>;
  prepareInputs: () => void;
  getRecords: () => void;
  getWinner: () => void;
  buy: () => void;
  matchLottery: (fn) => void;
  resetGame: () => void;
  dayCount: number;
  setDayCount: (count) => void;
  removeTicket: (arr: Array<number | undefined>) => void;
}

interface LotteryTicket {
  days: number;
  tickets: Array<number[]>;
}

interface WinnerTicket {
  days: number;
  tickets: Array<number>;
}

export type LotteryGameState = {
  activeTicket: (number | undefined)[];
  selectedNumbers: Array<number[]>;
  ticketsBought: Array<LotteryTicket>;
  winnerTickets: Array<WinnerTicket>;
};

const initialState: LotteryGameState = {
  selectedNumbers: [],
  activeTicket: new Array(5).fill(undefined),
  ticketsBought: [],
  winnerTickets: []
};

const initialContext: ILotteryContext = {
  gameState: initialState,
  claimableBalance: 0,
  setGameState: () => {},
  addTicket: () => {},
  prepareInputs: () => {},
  getRecords: () => {},
  getWinner: () => {},
  dayCount: 1,
  setDayCount: (count: number) => {},
  buy: () => {},
  matchLottery: (fn) => {},
  removeTicket: (arr) => {},
  resetGame: () => {}
};

const maxNoOfTickets = 5;
const lotteryPrice = 2;

const LotteryContext = createContext<ILotteryContext | undefined>(undefined);

export const LotteryProvider = ({ children }: { children: ReactNode }) => {
  const startingDate = startDay;
  const [gameState, setGameState] = useState<LotteryGameState>(initialState);
  const [records, setRecords] = useState<any>();
  // const public_connection = new AleoNetworkClient(VITE_LOTTERY_PROGRAM);
  const { publicKey, requestTransaction, requestBulkTransactions, connected } =
    useAleoWallet();
  const [claimableBalance, setClaimableBalance] = useState<number>(0);
  const { addTxns } = useAleoTransaction();
  const { program } = useAleoContract();
  const { setCurrentTxnStep } = useTransaction();

  const today = new Date();
  const timeDifference = today.getTime() - startingDate.getTime();
  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;
  const maxDays = daysPassed;

  const [dayCount, setDayCount] = useState(daysPassed);
  const { programRecords } = useAleoWallet();

  //function to get user balance

  useEffect(() => {
    async function getUserBalance() {
      if (!publicKey) return;
      try {
        const balanceMappings =
          program(VITE_LOTTERY_PROGRAM).map('user_balance');
        const balance = await balanceMappings.get(
          js2leo.u64(BigInt(publicKey))
        );
        balance ? setClaimableBalance(balance) : setClaimableBalance(0);
      } catch (e) {
        console.log(e);
      }
    }
    getUserBalance();
  }, []);

  // Add function to fetch and format records
  const getRecords = async () => {
    console.log('getting records');
    try {
      const records = await programRecords(VITE_LOTTERY_PROGRAM, false);

      console.log(records, 'records from contract');
      setRecords(records);
      const formattedRecords = records.map((record) => ({
        days: leo2js.u16(record.data.days),
        tickets: record.data.lottery
          .map((row: string[]) => row.map((num: string) => leo2js.u8(num)))
          .filter((ticket: number[]) => !ticket.every((num) => num === 0))
      }));
      console.log(formattedRecords, 'format records');

      // Update state with the formatted records
      setGameState((prevState) => {
        return {
          ...prevState,
          ticketsBought: formattedRecords
        };
      });
    } catch (err) {
      console.error('Error fetching records:', err);
      // toast.error('Failed to fetch lottery tickets');
    }
  };

  const LotteryContractConfig = useMemo(() => {
    return {
      [GameMode.Public]: {
        buyFn: 'buy_public',
        useBalance: 'user_balance',
        claimFn: 'claim',
        matchFn: 'match_lottery',
        getWalletKey: () => publicKey!
      },
      [GameMode.Private]: {
        buyFn: 'buy_public',
        useBalance: 'user_balance',
        claimFn: 'claim',

        getWalletKey: () => hasher(publicKey!)
      }
    };
  }, [publicKey]);
  const nullValue = ['0u8', '0u8', '0u8', '0u8', '0u8'];

  //get winner of lottery

  const getWinner = async () => {
    try {
      const winnerMappings =
        await program(VITE_LOTTERY_PROGRAM).map('winner_number');

      // Assuming dayCount is the current day or max day you want to fetch

      const allWinners: WinnerTicket[] = [];

      for (let day = 1; day <= maxDays; day++) {
        const winner = await winnerMappings.get(js2leo.u16(day));

        if (!winner) {
          console.log(`No winner data for day ${day}`);
          continue;
        }

        // Convert the string representation into an array and process each winner
        const cleanedString = winner.replace(/\[|\]/g, '');
        const winnerArray = cleanedString

          .split(',')
          .map((numStr) => numStr.trim());

        // Convert each element to u8 using leo2js
        const winnerData = winnerArray.map((num) => leo2js.u8(num));

        // Add the winner data for the day into the allWinners array
        allWinners.push({ days: day, tickets: winnerData });
      }

      // Update the gameState with all the winners after fetching them
      setGameState((prevState) => ({
        ...prevState,
        winnerTickets: [...prevState.winnerTickets, ...allWinners] // Store all winner tickets
      }));

      console.log('All winner tickets:', allWinners);
    } catch (e) {
      console.log('Error getting winner data:', e);
    }
  };

  const addTicket = () => {
    console.log('adding');
    if (gameState.selectedNumbers.length >= 5) {
      throw "Can't buy more than 5 tickets";
    }

    const undefinedIndex = gameState.activeTicket.findIndex(
      (a) => a === undefined
    );
    if (
      undefinedIndex !== -1 ||
      gameState.activeTicket.length > 5 ||
      gameState.activeTicket.length <= 0
    )
      return;

    console.log('here');
    setGameState((prevState) => ({
      ...prevState,
      selectedNumbers: [
        ...prevState.selectedNumbers,
        prevState.activeTicket as number[]
      ],
      activeTicket: new Array(5).fill(undefined)
    }));
  };

  const prepareMatchInputs = (dayCount: number) => {
    const tickets = gameState.ticketsBought.map((ticket) => {
      if (ticket.tickets.length < 5) {
        const remainingTickets = 5 - ticket.tickets.length;
        return {
          days: ticket.days,
          tickets: [
            ...ticket.tickets,
            ...Array(remainingTickets).fill([0, 0, 0, 0, 0])
          ]
        };
      }
      return ticket;
    });

    const filtered = tickets.filter((ticket) => ticket.days === dayCount);
    console.log(filtered, 'before filtered');

    const preparedInputs = filtered.map((ticket) => {
      return {
        days: ticket.days,
        tickets: ticket.tickets.map((numArray) => {
          return numArray.map((num) => {
            try {
              const u8Num = js2leo.u8(num); // Parsing individual number

              return u8Num; // Return the parsed u8 number
            } catch (error) {
              return null;
            }
          });
        })
      };
    });

    console.log(preparedInputs, 'preparedInputs');
    return preparedInputs;
  };

  const prepareInputs = () => {
    const tickets = [...gameState.selectedNumbers];
    const noOfTickets = tickets.length;
    console.log(noOfTickets, maxNoOfTickets, 'compare');

    if (noOfTickets < maxNoOfTickets) {
      const leftTickets = maxNoOfTickets - noOfTickets;
      tickets.push(...new Array(leftTickets).fill(new Array(5).fill(0)));
    }

    const amounts = Array.from({ length: maxNoOfTickets }, (_, i) =>
      i < noOfTickets ? lotteryPrice : 0
    );
    console.log(tickets, 'tickets');

    return [
      js2leo.arr2string(
        js2leo.array(amounts, (v) =>
          js2leo.u64(convertNormalToBigIntValue(v, 6))
        )
      ),

      js2leo.arr2string(js2leo.array(tickets, js2leo.u8))
    ];
  };

  const resetGame = () => {
    setGameState(initialState);
  };

  const claimBalance = async () => {
    if (!connected) {
      toast.info('Please connect wallet ');
      return;
    }
    console.log('claiming balance');

    const tx = Transaction.createTransaction(
      publicKey!,
      VITE_NETWORK_TYPE == 'mainnet'
        ? WalletAdapterNetwork.MainnetBeta
        : WalletAdapterNetwork.TestnetBeta,
      VITE_LOTTERY_PROGRAM,
      LotteryContractConfig[GameMode.Public].claimFn,
      [],
      500_000,
      false
    );

    console.log('this is the txn', tx);

    if (requestTransaction) {
      setCurrentTxnStep(TRANSACTION_STEPS.CONFIRMATION);
      console.log('Confirming...');
      const txId = await requestTransaction(tx);
      setCurrentTxnStep(TRANSACTION_STEPS.PENDING);

      addTxns({
        txID: txId,
        onSuccess: () => {
          console.log('Successfully bought the ticket');
          toast.success('Ticket bought successfully');

          setCurrentTxnStep(TRANSACTION_STEPS.SUCCESS);
        },
        onError: () => {
          console.error('failed to buy a ticket');
          toast.error('Failed to buy ticket');
          setCurrentTxnStep(TRANSACTION_STEPS.FAILED);
        }
      });
    }
  };

  async function buy() {
    if (!connected) {
      toast.info('Please connect wallet ');
      return;
    }
    console.log('buying lottery');
    const preparedInputs = prepareInputs();
    console.log('Prepared inputs:', preparedInputs);
    //to change later
    const today = new Date();
    const timeDifference = today.getTime() - startingDate.getTime();
    const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1; // Add 1 to count today as day 1

    console.log('Days since starting date:', daysPassed);

    const day = js2leo.u16(daysPassed);

    const tx = Transaction.createTransaction(
      publicKey!,
      VITE_NETWORK_TYPE == 'mainnet'
        ? WalletAdapterNetwork.MainnetBeta
        : WalletAdapterNetwork.TestnetBeta,
      VITE_LOTTERY_PROGRAM,
      LotteryContractConfig[GameMode.Public].buyFn,
      [...prepareInputs(), day],
      500_000,
      false
    );

    console.log('this is the txn', tx);

    if (requestTransaction) {
      setCurrentTxnStep(TRANSACTION_STEPS.CONFIRMATION);
      console.log('Confirming...');
      const txId = await requestTransaction(tx);
      setCurrentTxnStep(TRANSACTION_STEPS.PENDING);

      addTxns({
        txID: txId,
        onSuccess: () => {
          console.log('Successfully bought the ticket');
          toast.success('Ticket bought successfully');
          getRecords();

          setCurrentTxnStep(TRANSACTION_STEPS.SUCCESS);
        },
        onError: () => {
          console.error('failed to buy a ticket');
          toast.error('Failed to buy ticket');
          setCurrentTxnStep(TRANSACTION_STEPS.FAILED);
        }
      });
    }
  }

  const removeTicket = (arr: (number | undefined)[]) => {
    console.log('removing ticket', arr);

    // Find the index of the ticket to remove from selectedNumbers
    const ticketIndex = gameState.selectedNumbers.findIndex(
      (ticket) =>
        ticket.length === arr.length &&
        ticket.every((num, index) => num === arr[index])
    );

    if (ticketIndex !== -1) {
      // Remove the ticket from selectedNumbers array
      setGameState((prevState) => ({
        ...prevState,
        selectedNumbers: prevState.selectedNumbers.filter(
          (_, index) => index !== ticketIndex
        )
      }));
    }
    console.log(gameState.selectedNumbers);
  };

  console.log(gameState.selectedNumbers, 'activ ticket');

  const matchLottery = async (onSuccess) => {
    if (!connected) {
      toast.info('Please connect wallet ');
      return;
    }
    console.log('chcking your ticket ');

    // const arr = prepareMatchInputs(dayCount);
    // console.log(arr, 'prepped array');
    // console.log('records before', records);

    const recordsByDay = records.filter((record) => {
      console.log(record.data.days, dayCount);
      return leo2js.u16(record.data.days) === dayCount; // Compare days correctly
    });
    console.log(recordsByDay, 'by day');

    const tx = recordsByDay.map((records) =>
      Transaction.createTransaction(
        publicKey!,
        VITE_NETWORK_TYPE == 'mainnet'
          ? WalletAdapterNetwork.MainnetBeta
          : WalletAdapterNetwork.TestnetBeta,
        VITE_LOTTERY_PROGRAM,
        LotteryContractConfig[GameMode.Public].matchFn,
        [records],
        500_000,
        false
      )
    );

    console.log('this is the txn', tx);

    if (requestTransaction) {
      setCurrentTxnStep(TRANSACTION_STEPS.CONFIRMATION);
      console.log('Confirming...');
      const txId = await requestTransaction(tx[0]);
      setCurrentTxnStep(TRANSACTION_STEPS.PENDING);

      addTxns({
        txID: txId[0],
        onSuccess: () => {
          console.log('Successfully matched the ticket');
          toast.success('Matching completed');
          if (onSuccess) onSuccess();
          setCurrentTxnStep(TRANSACTION_STEPS.SUCCESS);
        },
        onError: () => {
          console.error('failed to match a ticket');
          toast.error('Failed to match ticket');
          setCurrentTxnStep(TRANSACTION_STEPS.FAILED);
        }
      });
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <LotteryContext.Provider
      value={{
        gameState,
        setGameState,
        getRecords,
        addTicket,
        buy,
        prepareInputs,
        resetGame,
        getWinner,
        dayCount,
        setDayCount,
        matchLottery,
        claimableBalance,
        removeTicket
      }}
    >
      {children}
    </LotteryContext.Provider>
  );
};

export const useLottery = () => {
  const cont = useContext(LotteryContext);
  if (!cont) throw new Error('Undefined context');
  return cont;
};
