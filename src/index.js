import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 1. IMPORTAÇÃO DO PROVIDER: Altere o caminho abaixo para a pasta exata onde guardou o seu authContext
import { AuthContextProvider } from './components/context/authContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. ENVOLVA O COMPONENTE APP COM O PROVEDOR DE AUTENTICAÇÃO */}
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);

reportWebVitals();
