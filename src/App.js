import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import Body from './components/body';

import usePageReloadOnBack from './components/pageReloadonback';

function App() {
  // usePageReloadOnBack();
  return (
   <>
     
      <Header />
      <Body/>

  
   </>
  );
}

export default App;
