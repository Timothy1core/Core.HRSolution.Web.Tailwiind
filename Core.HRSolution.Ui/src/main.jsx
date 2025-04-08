import '@/_metronic/components/keenicons/assets/styles.css';
import './_metronic/styles/globals.css';
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import {AuthProvider, setupAxios} from './app/modules/auth'
import { ProvidersWrapper } from './_metronic/providers';
import React from 'react';
import {AuthInit} from '@/app/modules/auth';
/**
 * Inject interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
setupAxios(axios);
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AuthInit>
        <ProvidersWrapper>
          <App />
        </ProvidersWrapper>
      </AuthInit>
    </AuthProvider>
  </React.StrictMode>
)