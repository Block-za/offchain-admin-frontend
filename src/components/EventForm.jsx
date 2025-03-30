// File: components/EventForm.jsx
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import './EventForm.css'
import { API_BASE_URL } from '../config'

const EventForm = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  useEffect(() => {
    // Fetch countries
    fetch("https://restcountries.com/v3.1/all")
      .then(res => res.json())
      .then(data => {
        const countryNames = data.map(country => country.name.common).sort();
        setCountries(countryNames);
      })
      .catch(err => console.error("Error fetching countries:", err));

    // Fetch companies
    fetch("https://api.blockza.io/api/directory")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const companyOptions = data.data.map(company => ({
            id: company._id,
            name: company.name
          }));
          setCompanies(companyOptions);
        }
      })
      .catch(err => console.error("Error fetching companies:", err));
  }, []);

  const fetchStates = (country) => {
    setSelectedCountry(country);
    setSelectedState("");
    setFormData(prev => ({
      ...prev,
      country: country,
      city: ""
    }));
    if (country) {
      fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      })
      .then(res => res.json())
      .then(data => setStates(data.data.states.map(state => state.name)))
      .catch(err => console.error("Error fetching states:", err));
    } else {
      setStates([]);
    }
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    setFormData(prev => ({
      ...prev,
      city: state
    }));
  };

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

  const validateUrl = (url) => {
    if (!url) return true; // Empty URLs are allowed
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    return urlRegex.test(url);
  };

  const handleUrlChange = (e) => {
    const { name, value } = e.target;
    if (value && !validateUrl(value)) {
      toast.error(`Please enter a valid URL for ${name}`);
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate end date is after start date
    if (name === 'eventEndDate' && formData.eventStartDate) {
      if (new Date(value) < new Date(formData.eventStartDate)) {
        toast.error('End date must be after start date');
      }
    }
    if (name === 'eventStartDate' && formData.eventEndDate) {
      if (new Date(formData.eventEndDate) < new Date(value)) {
        toast.error('End date must be after start date');
      }
    }
  };

  const handleCompanyChange = (e) => {
    const companyName = e.target.value;
    setSelectedCompany(companyName);
    setFormData(prev => ({
      ...prev,
      company: companyName
    }));
  };

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
            <select
              id="company"
              name="company"
              value={selectedCompany}
              onChange={handleCompanyChange}
              required
            >
              <option value="">Select a company</option>
              {companies.map(company => (
                <option key={company.id} value={company.name}>{company.name}</option>
              ))}
            </select>
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
              <select
            className="filter-select"
            value={selectedCountry}
            onChange={(e) => fetchStates(e.target.value)}
          >
            <option value="">All Countries</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
            </div>

            <div className="form-group">
              <label htmlFor="city">City *</label>
              <select
            className="filter-select"
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            disabled={!selectedCountry}
          >
            <option value="">All States</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
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
                onChange={handleDateChange}
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
                onChange={handleDateChange}
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
              onChange={handleUrlChange}
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
                onChange={handleUrlChange}
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
                onChange={handleUrlChange}
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
                onChange={handleUrlChange}
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
                onChange={handleUrlChange}
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