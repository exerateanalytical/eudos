import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentCountdownProps {
  reservedUntil: string;
  onExpired?: () => void;
}

export const PaymentCountdown = ({ reservedUntil, onExpired }: PaymentCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const expiry = new Date(reservedUntil).getTime();
      const now = Date.now();
      const difference = expiry - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft(0);
        if (onExpired) {
          onExpired();
        }
        return;
      }

      setTimeLeft(difference);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [reservedUntil, onExpired]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const getColorClass = () => {
    if (isExpired) return 'text-destructive bg-destructive/10 border-destructive/30';
    if (minutes < 5) return 'text-orange-600 bg-orange-50 border-orange-300 dark:bg-orange-950/20 dark:text-orange-400';
    if (minutes < 10) return 'text-yellow-600 bg-yellow-50 border-yellow-300 dark:bg-yellow-950/20 dark:text-yellow-400';
    return 'text-green-600 bg-green-50 border-green-300 dark:bg-green-950/20 dark:text-green-400';
  };

  if (isExpired) {
    return (
      <div className={cn(
        'flex items-center gap-3 p-4 rounded-lg border-2 animate-pulse',
        getColorClass()
      )}>
        <AlertTriangle className="h-6 w-6 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-bold text-lg">Address Expired</p>
          <p className="text-sm opacity-90">Please generate a new payment address to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300',
      getColorClass()
    )}>
      <Clock className="h-6 w-6 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-semibold text-sm">Address Reserved For:</p>
        <p className="text-2xl font-bold font-mono tabular-nums">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
      </div>
      {minutes < 5 && (
        <div className="flex-shrink-0">
          <span className="text-xs font-medium uppercase opacity-75">Hurry!</span>
        </div>
      )}
    </div>
  );
};
