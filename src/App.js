import logo from './assets/images/logo.svg';
import './assets/css/main.css';
import Routes from "./routes";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <header className="App-header">
        
          <Routes />
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
      </BrowserRouter>
    
  );
}

export default App;
