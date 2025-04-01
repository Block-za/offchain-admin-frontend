import React, { useState, useEffect } from 'react';
import './CreatePodcast.css';
import slugify from 'slugify';
import { podcastService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreatePodcast = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    company: '',
    youtubeIframe: '',
    image: null,
    imageCaption: '',
    status: 'draft',
    slug: ''
  });

  useEffect(() => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: title
    }));
    
    setTimeout(() => {
      const generatedSlug = slugify(title, {
        lower: true,
        strict: true
      });
      setFormData(prev => ({
        ...prev,
        slug: generatedSlug
      }));
    }, 300);
  };

  const handleCompanyChange = (e) => {
    const company = e.target.value;
    setSelectedCompany(company);
    setFormData(prev => ({
      ...prev,
      company: company
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);

    // Check if title is empty when saving as draft
    if (!formData.title.trim()) {
      setSubmitError('Title is required even for draft');
      setLoading(false);
      return;
    }

    // Additional validation only for publishing
    if (formData.status === 'published') {
      const requiredFields = ['description', 'shortDescription', 'category', 'company'];
      const missingFields = requiredFields.filter(field => !formData[field]?.trim());
      
      if (missingFields.length > 0) {
        setSubmitError(`${missingFields.join(', ')} ${missingFields.length > 1 ? 'are' : 'is'} required for publishing`);
        setLoading(false);
        return;
      }
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append('image', formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await podcastService.createPodcast(formDataToSend);
      toast.success('Podcast created successfully!');
      navigate('/');
    } catch (error) {
      setSubmitError(error.response?.data?.error || 'Failed to submit podcast');
      toast.error(error.message || 'Error creating podcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Podcast</h2>
      <form onSubmit={handleSubmit} className="podcast-form">
        {submitError && <div className="error submit-error">{submitError}</div>}
        
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="slug">Slug</label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            readOnly
          />
          <small>Automatically generated from title</small>
        </div>

        <div className="form-group">
          <label htmlFor="company">Company</label>
          <select
            id="company"
            name="company"
            value={selectedCompany}
            onChange={handleCompanyChange}
            required={formData.status === 'published'}
          >
            <option value="">Select Company</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required={formData.status === 'published'}
          />
        </div>

        <div className="form-group">
          <label htmlFor="shortDescription">Short Description</label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            rows="2"
            value={formData.shortDescription}
            onChange={handleChange}
            required={formData.status === 'published'}
            maxLength="500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required={formData.status === 'published'}
          />
        </div>

        <div className="form-group">
          <label htmlFor="youtubeIframe">YouTube Iframe</label>
          <input
            type="text"
            id="youtubeIframe"
            name="youtubeIframe"
            value={formData.youtubeIframe}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Podcast Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ maxWidth: '200px', marginBottom: '1rem' }} 
            />
          )}
          <input
            type="text"
            name="imageCaption"
            placeholder="Image Caption"
            value={formData.imageCaption}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={handleChange}
              />
              <span>Save as Draft</span>
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === 'published'}
                onChange={handleChange}
              />
              <span>Publish Now</span>
            </label>
          </div>
        </div>

        <div className="button-container">
          <button 
            type="submit" 
            disabled={loading}
            className={formData.status === 'published' ? 'publish-button' : 'draft-button'}
          >
            {loading 
              ? 'Saving...' 
              : formData.status === 'draft' 
                ? 'Save Draft' 
                : 'Publish'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePodcast;