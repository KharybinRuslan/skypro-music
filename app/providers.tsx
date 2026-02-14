'use client';

import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from '@/store/store';
import 'react-toastify/dist/ReactToastify.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <ToastContainer
        position="top-right"
        theme="dark"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        toastStyle={{
          background: '#313131',
          color: '#ffffff',
          borderRadius: '12px',
        }}
      />
    </Provider>
  );
}
