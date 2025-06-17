import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import CallbackPage from './CallbackPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/callback" element={<CallbackPage />} />
    </Routes>
  );
}

export default App;