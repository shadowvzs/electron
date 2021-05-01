import React from 'react';
import { AppProvider } from './global/AppProvider';
import { GlobalStore } from './global/GlobalStore';
import MainPage from './views/MainPage/MainPage';

const App = () => {
  const globalStore = React.useState(() => new GlobalStore())[0];

  return (
    <AppProvider store={globalStore}>
      <MainPage />
    </AppProvider>
  );
}

export default App;
