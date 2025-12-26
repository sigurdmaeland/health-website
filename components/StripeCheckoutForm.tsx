'use client';

import { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

interface StripeCheckoutFormProps {
  amount: number;
  orderId: string;
  customerEmail: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function StripeCheckoutForm({
  amount,
  orderId,
  customerEmail,
  onSuccess,
  onError
}: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/ordre-bekreftelse?orderId=${orderId}`,
      },
    });

    if (error) {
      setMessage(error.message || 'En feil oppstod ved betaling');
      onError(error.message || 'Betalingsfeil');
      setIsLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {message && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full py-4 gradient-primary text-white rounded-xl hover:shadow-elegant-lg transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <div className="animate-spin w-5 h-5 border-3 border-white border-t-transparent rounded-full"></div>
            <span>Behandler betaling...</span>
          </>
        ) : (
          `Betal ${amount.toFixed(2)} kr`
        )}
      </button>

      <div className="text-xs text-center text-stone-500">
        Betaling prosesseres sikkert av Stripe
      </div>
    </form>
  );
}
