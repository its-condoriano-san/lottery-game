import LotteryLayout from '@/components/layout/lotteryLayout';
import Lottery from './components/Lottery';
import { LotteryProvider } from '@/providers/lotteryProvider';
import { GameSettingProvider } from '@/providers/GameSettingProvider';
import LotteryHero from './components/LotteryHero';

const LotteryPage = () => {
  return (
    <>
      <GameSettingProvider localStoragePrefix="lt">
        <LotteryProvider>
          <LotteryLayout>
            <LotteryHero />
          </LotteryLayout>
        </LotteryProvider>
      </GameSettingProvider>
    </>
  );
};

export default LotteryPage;
