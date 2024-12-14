import React, { useState } from 'react';

const Payment = () => {
  const [amount, setAmount] = useState(500); // Payment amount in INR

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      alert('Failed to load Razorpay SDK. Check your internet connection.');
      return;
    }

    const keyId = 'your_key_id'; // Replace with your Razorpay Key ID

    const paymentOptions = {
      key: keyId,
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'Your App Name',
      description: 'Test Payment',
      handler: (response) => {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        console.log('Payment Response:', response);
      },
      prefill: {
        name: 'John Doe', // User's name
        email: 'johndoe@example.com', // User's email
        contact: '9876543210', // User's contact
      },
      theme: {
        color: '#3399cc',
      },
    };

    const razorpayInstance = new window.Razorpay(paymentOptions);
    razorpayInstance.open();
  };
};

export default Payment;
