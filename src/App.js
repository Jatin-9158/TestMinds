import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import Body from './components/body';
import { useLocation } from 'react-router-dom';


function App() {
  const location = useLocation(); 

  return (
    
    <>
      <Header /> 
      <Body />
    </>
  );

  
}

export default App;
