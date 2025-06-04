import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import {PrivyProvider} from '@privy-io/react-auth';
import './index.css'
import { StateContextProvider } from './context';

const root= ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'dark',
          //logo: 
        },
      }}
    >
      <Router>
        <StateContextProvider>
           <App />
        </StateContextProvider>
      </Router>
    </PrivyProvider>,
);
