// Import HashRouter instead of BrowserRouter
import { HashRouter } from 'react-router-dom';

// ... and in your rendering code
ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);