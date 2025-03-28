import { useState } from 'react'
import { toast } from 'react-toastify'
import { API_BASE_URL } from '../config'
import './EventForm.css' // We'll reuse the EventForm styles

const EditEventForm = ({ event, onClose, onEventUpdated }) => {
  const [formData, setFormData] = useState({
    title: event.title,
    company: event.company,
    description: event.description,
    location: event.location,
    country: event.country,
    city: event.city,
    eventStartDate: new Date(event.eventStartDate).toISOString().slice(0, 16),
    eventEndDate: new Date(event.eventEndDate).toISOString().slice(0, 16),
    category: event.category || '',
    website: event.website || '',
    socialLinks: {
      linkedin: event.socialLinks?.linkedin || '',
      telegram: event.socialLinks?.telegram || '',
      twitter: event.socialLinks?.twitter || '',
      instagram: event.socialLinks?.instagram || ''
    },
    featuredImage: event.featuredImage // Include the existing image URL
  })
  
  // Keep track of whether we're using the existing image
  const [useExistingImage, setUseExistingImage] = useState(true)
  const [newImage, setNewImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(event.featuredImage)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('social-')) {
      const socialNetwork = name.replace('social-', '')
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialNetwork]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewImage(file)
      setUseExistingImage(false)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const submitData = new FormData()

    // Append all text fields
    Object.keys(formData).forEach(key => {
      if (key === 'socialLinks') {
        submitData.append(key, JSON.stringify(formData[key]))
      } else if (key !== 'featuredImage' || !newImage) { // Don't append featuredImage if we have a new image
        submitData.append(key, formData[key])
      }
    })

    // If there's a new image, append it
    if (newImage) {
      submitData.append('featuredImage', newImage)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${event._id}`, {
        method: 'PUT',
        body: submitData
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Event updated successfully')
        onEventUpdated(data.data)
        onClose()
      } else {
        toast.error(data.error || 'Failed to update event')
      }
    } catch (error) {
      toast.error('Error updating event')
      console.error('Error:', error)
    }
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Edit Event</h2>
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Event Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="company">Company Name *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Event Image</h3>
          <div className="form-group">
            <label>Current Image</label>
            <div className="image-preview">
              <img src={imagePreview} alt="Event" />
            </div>
            <label htmlFor="featuredImage" className="mt-3">Change Image (optional)</label>
            <input
              type="file"
              id="featuredImage"
              name="featuredImage"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Date and Location</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventStartDate">Start Date and Time *</label>
              <input
                type="datetime-local"
                id="eventStartDate"
                name="eventStartDate"
                value={formData.eventStartDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="eventEndDate">End Date and Time *</label>
              <input
                type="datetime-local"
                id="eventEndDate"
                name="eventEndDate"
                value={formData.eventEndDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Information</h3>
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Social Links</h3>
          <div className="form-row">
            {Object.entries(formData.socialLinks).map(([platform, value]) => (
              <div className="form-group" key={platform}>
                <label htmlFor={`social-${platform}`}>{platform}</label>
                <input
                  type="url"
                  id={`social-${platform}`}
                  name={`social-${platform}`}
                  value={value}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="submit-btn">Update Event</button>
          <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default EditEventForm 