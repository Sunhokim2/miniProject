import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OAuthCallback from './pages/OAuthCallback';
// ... 기존 import문들

function App() {
  return (
    <Router>
      <Routes>
        {/* 기존 라우트들 */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        {/* ... 다른 라우트들 */}
      </Routes>
    </Router>
  );
}

export default App; 