import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { API_BASE_URL } from '../config'
import './EventList.css'
import EditEventForm from './EditEventForm'

const EventList = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingEvent, setEditingEvent] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`)
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      toast.error('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          toast.success('Event deleted successfully')
          setEvents(events.filter(event => event._id !== id))
        } else {
          toast.error('Failed to delete event')
        }
      } catch (error) {
        toast.error('Error deleting event')
      }
    }
  }

  const handleEventUpdate = (updatedEvent) => {
    setEvents(events.map(event => 
      event._id === updatedEvent._id ? updatedEvent : event
    ))
  }

  if (loading) {
    return <div>Loading events...</div>
  }

  return (
    <div className="event-list-container">
      {editingEvent ? (
        <EditEventForm 
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onEventUpdated={handleEventUpdate}
        />
      ) : (
        <>
          <h2>Events</h2>
          <div className="table-container">
            <table className="event-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event._id}>
                    <td className="image-cell">
                      <img 
                        src={event.featuredImage} 
                        alt={event.title}
                        className="event-thumbnail"
                      />
                    </td>
                    <td>{event.title}</td>
                    <td>{event.company}</td>
                    <td>{new Date(event.eventStartDate).toLocaleDateString()}</td>
                    <td>{`${event.city}, ${event.country}`}</td>
                    <td className="action-buttons">
                      <button 
                        className="btn btn-view"
                        onClick={() => toast.info('View functionality coming soon')}
                      >
                        View
                      </button>
                      <button 
                        className="btn btn-edit"
                        onClick={() => setEditingEvent(event)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-delete"
                        onClick={() => handleDelete(event._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default EventList 