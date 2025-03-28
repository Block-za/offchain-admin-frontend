import { useState } from 'react'
import './App.css'
import EventForm from './components/EventForm'
import Sidebar from './components/Sidebar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import EventList from './components/EventList'

function App() {
  const [currentView, setCurrentView] = useState('welcome')

  const renderContent = () => {
    switch (currentView) {
      case 'events-create':
        return <EventForm />
      case 'events-view':
        return <EventList />
      default:
        return (
          <div className="welcome-message">
            <h2>Welcome to Admin Portal</h2>
            <p>Select an option from the sidebar to get started.</p>
          </div>
        )
    }
  }

  return (
    <div className="app-container">
      <Sidebar onNavigate={setCurrentView} currentView={currentView} />
      <div className="main-content">
        <header>
          <h1>Event Management</h1>
        </header>
        <main>
          {renderContent()}
        </main>
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  )
}

export default App