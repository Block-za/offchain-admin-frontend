// File: components/EventForm.jsx
import { useState } from 'react'
import { toast } from 'react-toastify'
import './EventForm.css'
import { API_BASE_URL } from '../config'

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    country: '',
    city: '',
    eventStartDate: '',
    eventEndDate: '',
    category: '',
    website: '',
    linkedin: '',
    telegram: '',
    twitter: '',
    instagram: ''
  })
  
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(false)

  const categories = [
    'Conference',
    'Workshop',
    'Webinar',
    'Meetup',
    'Hackathon',
    'Training',
    'Other'
  ]
  
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
      const formDataToSend = new FormData()
      
      // Format dates to ISO string
      const formattedData = {
        ...formData,
        eventStartDate: new Date(formData.eventStartDate).toISOString(),
        eventEndDate: new Date(formData.eventEndDate).toISOString()
      }

      // Append all text fields
      for (const key in formattedData) {
        if (formattedData[key]) {
          if (['linkedin', 'telegram', 'twitter', 'instagram'].includes(key)) {
            continue;
          }
          formDataToSend.append(key, formattedData[key])
        }
      }

      // Append social links
      const socialLinks = {
        linkedin: formData.linkedin || '',
        telegram: formData.telegram || '',
        twitter: formData.twitter || '',
        instagram: formData.instagram || ''
      }

      Object.keys(socialLinks).forEach(key => {
        formDataToSend.append(key, socialLinks[key])
      })

      // Append image with the correct field name 'featuredImage'
      if (image) {
        formDataToSend.append('featuredImage', image)
      } else {
        throw new Error('Featured image is required')
      }

      // Log FormData for debugging
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]); 
      }

      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        body: formDataToSend
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event')
      }

      toast.success('Event created successfully!')
      
      // Reset form
      setFormData({
        title: '',
        company: '',
        description: '',
        location: '',
        country: '',
        city: '',
        eventStartDate: '',
        eventEndDate: '',
        category: '',
        website: '',
        linkedin: '',
        telegram: '',
        twitter: '',
        instagram: ''
      })
      setImage(null)
      setImagePreview('')
    } catch (error) {
      toast.error(error.message || 'Error creating event')
      console.error('Error details:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
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

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Location Details */}
        <div className="form-section">
          <h3>Location Details</h3>
          <div className="form-group">
            <label htmlFor="location">Venue/Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
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
          </div>
        </div>

        {/* Date and Time */}
        <div className="form-section">
          <h3>Date and Time</h3>
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
        </div>

        {/* Links */}
        <div className="form-section">
          <h3>Online Presence</h3>
          <div className="form-group">
            <label htmlFor="website">Website URL</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn</label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn URL"
              />
            </div>

            <div className="form-group">
              <label htmlFor="twitter">Twitter</label>
              <input
                type="url"
                id="twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="Twitter URL"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telegram">Telegram</label>
              <input
                type="url"
                id="telegram"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                placeholder="Telegram URL"
              />
            </div>

            <div className="form-group">
              <label htmlFor="instagram">Instagram</label>
              <input
                type="url"
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="Instagram URL"
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="form-section">
          <h3>Featured Image</h3>
          <div className="form-group">
            <label htmlFor="image">Upload Image *</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>
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
          {loading ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </div>
  )
}

export default EventForm