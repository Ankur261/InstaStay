import React from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import routes from './routes';

const AppRoutes = () => {
  const routing = useRoutes(routes);
  return routing;
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
