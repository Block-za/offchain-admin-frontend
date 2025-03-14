import { useState } from 'react'
import './Sidebar.css'

const Sidebar = ({ onNavigate, currentView }) => {
  const [showEventDropdown, setShowEventDropdown] = useState(false)

  const handleEventClick = () => {
    setShowEventDropdown(!showEventDropdown)
  }

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <button 
          className={`sidebar-button ${currentView === 'welcome' ? 'active' : ''}`}
          onClick={() => onNavigate('welcome')}
        >
          <span>Dashboard</span>
        </button>
        <div className="dropdown-container">
          <button 
            className={`sidebar-button ${currentView.startsWith('events') ? 'active' : ''}`}
            onClick={handleEventClick}
          >
            <span>Events</span>
            <span className="dropdown-arrow">{showEventDropdown ? '▼' : '▶'}</span>
          </button>
          {showEventDropdown && (
            <div className="dropdown-menu">
              <button 
                className="dropdown-item"
                onClick={() => onNavigate('events-create')}
              >
                Create
              </button>
              <button 
                className="dropdown-item"
                onClick={() => onNavigate('events-view')}
              >
                View
              </button>
            </div>
          )}
        </div>
        <button className="sidebar-button">
          <span>Calendar</span>
        </button>
        <button className="sidebar-button">
          <span>Settings</span>
        </button>
        <button className="sidebar-button">
          <span>Profile</span>
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar 