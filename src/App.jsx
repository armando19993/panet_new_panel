import React from 'react';
import { MyRoutes } from './routers/routes';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <MyRoutes />
      <Toaster richColors />
    </>
  );
}

export default App;

