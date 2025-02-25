import React from 'react';
import AppRoutes from './routes';
import { AuthProvider } from "./contexts/AuthContext";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

const App = () => {
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <AppRoutes /> 
      </Elements>
    </AuthProvider>
  );
};

export default App;
