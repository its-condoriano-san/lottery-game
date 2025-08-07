import LotteryHero from '@/pages/lottery/components/LotteryHero';
import clsx from 'clsx';
import React from 'react';
import Footer from '../shared/footer';
import Header from '../shared/header';

type LotteryLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

const LotteryLayout = ({ children, className }: LotteryLayoutProps) => {
  // const { currentTxnStep } = useTransaction();
  return (
    <div className={clsx(className, 'space-y-8 ')}>
      <Header />
      <section className="mx-auto max-w-[80vw] space-y-8">{children}</section>
      <Footer />
      {/* <TransactionModal
        isOpen={Boolean(currentTxnStep)}
        onModalClose={() => {}}
      /> */}
    </div>
  );
};

export default LotteryLayout;
