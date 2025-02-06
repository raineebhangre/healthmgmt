import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import {PrivyProvider} from '@privy-io/react-auth';
import './index.css'

const root= ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <PrivyProvider
      appId="cm6qcimre00pv7v6jdpsxmque"
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'dark',
          //logo: 
        },
      }}
    >
      <Router>
      <App />
      </Router>
    </PrivyProvider>,
);