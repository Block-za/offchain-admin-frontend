import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
  const [showEventDropdown, setShowEventDropdown] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleEventClick = () => {
    setShowEventDropdown(!showEventDropdown)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const isEventSection = () => {
    return location.pathname.startsWith('/events')
  }

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <button 
          className={`sidebar-button ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <span>Dashboard</span>
        </button>
        <div className="dropdown-container">
          <button 
            className={`sidebar-button ${isEventSection() ? 'active' : ''}`}
            onClick={handleEventClick}
          >
            <span>Events</span>
            <span className="dropdown-arrow">{showEventDropdown ? '▼' : '▶'}</span>
          </button>
          {showEventDropdown && (
            <div className="dropdown-menu">
              <button 
                className={`dropdown-item ${isActive('/events/create') ? 'active' : ''}`}
                onClick={() => navigate('/events/create')}
              >
                Create
              </button>
              <button 
                className={`dropdown-item ${isActive('/events') ? 'active' : ''}`}
                onClick={() => navigate('/events')}
              >
                View
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar