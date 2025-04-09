import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
  const [showEventDropdown, setShowEventDropdown] = useState(false)
  const [showPodcastDropdown, setShowPodcastDropdown] = useState(false)
  const [showQuizDropdown, setShowQuizDropdown] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleEventClick = () => {
    setShowEventDropdown(!showEventDropdown)
  }

  const handlePodcastClick = () => {
    setShowPodcastDropdown(!showPodcastDropdown)
  }

  const handleQuizClick = () => {
    setShowQuizDropdown(!showQuizDropdown)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const isEventSection = () => {
    return location.pathname.startsWith('/events')
  }

  const isPodcastSection = () => {
    return location.pathname.startsWith('/podcasts')
  }

  const isQuizSection = () => {
    return location.pathname.startsWith('/quiz')
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

        <div className="dropdown-container">
          <button 
            className={`sidebar-button ${isPodcastSection() ? 'active' : ''}`}
            onClick={handlePodcastClick}
          >
            <span>Podcasts</span>
            <span className="dropdown-arrow">{showPodcastDropdown ? '▼' : '▶'}</span>
          </button>
          {showPodcastDropdown && (
            <div className="dropdown-menu">
              <button 
                className={`dropdown-item ${isActive('/podcasts/create') ? 'active' : ''}`}
                onClick={() => navigate('/podcasts/create')}
              >
                Create
              </button>
              <button 
                className={`dropdown-item ${isActive('/podcasts') ? 'active' : ''}`}
                onClick={() => navigate('/podcasts')}
              >
                View
              </button>
            </div>
          )}
        </div>

        <div className="dropdown-container">
          <button 
            className={`sidebar-button ${isQuizSection() ? 'active' : ''}`}
            onClick={handleQuizClick}
          >
            <span>Quiz</span>
            <span className="dropdown-arrow">{showQuizDropdown ? '▼' : '▶'}</span>
          </button>
          {showQuizDropdown && (
            <div className="dropdown-menu">
              <button 
                className={`dropdown-item ${isActive('/quiz/create') ? 'active' : ''}`}
                onClick={() => navigate('/quiz/create')}
              >
                Create
              </button>
              <button 
                className={`dropdown-item ${isActive('/quiz') ? 'active' : ''}`}
                onClick={() => navigate('/quiz')}
              >
                View
              </button>
              <button 
                className={`dropdown-item ${isActive('/quiz/manage') ? 'active' : ''}`}
                onClick={() => navigate('/quiz/manage')}
              >
                Manage
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar