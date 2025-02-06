import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import Body from './components/body';
import { BrowserRouter } from 'react-router-dom';
import usePageReloadOnBack from './components/pageReloadonback';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
function App() {
  usePageReloadOnBack();
  return (
   <>
     
      <Header />
      <Body/>

  
   </>
  );
}

export default App;
