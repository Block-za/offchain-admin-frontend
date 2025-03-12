// File: components/EventForm.jsx
import { useState } from 'react'
import { toast } from 'react-toastify'
import './EventForm.css'
import { API_BASE_URL } from '../config'

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    status: 'Upcoming'
  })
  
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Create form data object to send file
      const submitData = new FormData()
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key])
      })
      
      // Add image if selected
      if (image) {
        submitData.append('image', image)
      }
      
      // Updated API URL to use environment variable
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        body: submitData,
        // Don't set Content-Type header, let the browser set it with boundary for FormData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create event')
      }
      
      const result = await response.json()
      
      // Reset form after successful submission
      setFormData({
        title: '',
        date: '',
        location: '',
        description: '',
        status: 'Upcoming'
      })
      setImage(null)
      setImagePreview('')
      
      toast.success('Event created successfully!')
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
      console.error('Error creating event:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter event title"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Event Date*</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location*</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Enter event location"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Ended">Ended</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Event Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  )
}

export default EventForm