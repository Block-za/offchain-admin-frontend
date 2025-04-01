import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import EventForm from './components/EventForm'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import AuthPage from './pages/Auth'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import EventList from './components/EventList'
import CreatePodcast from './components/podcasts/CreatePodcast'
import ViewPodcasts from './components/podcasts/ViewPodcasts'
import EditPodcast from './components/podcasts/EditPodcast'

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="app-container">
      {!isAuthPage && <Navbar />}
      {!isAuthPage && <Sidebar />}
      <div className={`main-content ${isAuthPage ? 'auth-layout' : ''}`}>
        <main>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/events/create" element={<EventForm />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/podcasts/create" element={<CreatePodcast />} />
            <Route path="/podcasts" element={<ViewPodcasts />} />
            <Route path="/podcasts/edit/:slug" element={<EditPodcast />} />
            <Route path="/" element={
              <div className="welcome-message">
                <h2>Welcome to Admin Portal</h2>
                <p>Select an option from the sidebar to get started.</p>
              </div>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App