import { verifyPayment } from './api';

export interface RazorpayOptions {
  order_id: string;
  amount: number;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  module: 'nominations' | 'events' | 'sponsorships' | 'coffee-book' | 'community';
  record_id: number;
}

export function initiateRazorpayPayment(
  options: RazorpayOptions,
  onSuccess: () => void,
  onFail: (err: any) => void
) {
  if (typeof window === 'undefined' || !(window as any).Razorpay) {
    onFail(new Error('Razorpay SDK not loaded'));
    return;
  }

  const rzpOptions = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YourKeyIdHere',
    amount: options.amount * 100, // Amount in paise
    currency: 'INR',
    name: 'Greenpreneur 2026',
    description: options.description,
    order_id: options.order_id,
    handler: async function (response: any) {
      try {
        // Step 3: Verify signature on the backend
        const verifyRes = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          module: options.module,
          record_id: options.record_id,
        });

        if (verifyRes.success) {
          onSuccess();
        } else {
          onFail(new Error('Payment verification failed'));
        }
      } catch (err) {
        onFail(err);
      }
    },
    prefill: {
      name: options.prefill.name,
      email: options.prefill.email,
      contact: options.prefill.contact,
    },
    theme: {
      color: '#1E6B3C', // Primary Green
    },
  };

  const rzp = new (window as any).Razorpay(rzpOptions);
  rzp.on('payment.failed', function (response: any) {
    onFail(new Error(response.error.description));
  });

  rzp.open();
}
