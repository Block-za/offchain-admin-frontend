import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { podcastService } from '../../services/api';
import { toast } from 'react-toastify';
import './CreatePodcast.css';

const EditPodcast = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [originalStatus, setOriginalStatus] = useState('');
  const [podcastId, setPodcastId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    company: '',
    youtubeIframe: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchPodcast();
  }, [slug]);

  const fetchPodcast = async () => {
    try {
      const response = await podcastService.getPodcastBySlug(slug);
      if (response.data.success) {
        const podcast = response.data.data;
        setPodcastId(podcast._id); // Store the ID
        setFormData({
          title: podcast.title,
          description: podcast.description || '',
          shortDescription: podcast.shortDescription || '',
          category: podcast.category || '',
          company: podcast.company || '',
          youtubeIframe: podcast.youtubeIframe || '',
          status: podcast.status
        });
        setOriginalStatus(podcast.status);
        setLoading(false);
      } else {
        toast.error('Error loading podcast');
        navigate('/podcasts');
      }
    } catch (error) {
      toast.error('Error loading podcast');
      navigate('/podcasts');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.status === 'published') {
      const requiredFields = ['title', 'description', 'shortDescription', 'category', 'company', 'youtubeIframe'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return false;
      }
    } else {
      if (!formData.title) {
        toast.error('Title is required even for draft podcasts');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await podcastService.updatePodcast(podcastId, formData);
      if (response.data.success) {
        toast.success('Podcast updated successfully');
        navigate('/podcasts');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error updating podcast');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="podcast-form-container">
      <h2>Edit Podcast</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title*</label>
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
          <label htmlFor="description">Description{formData.status === 'published' && '*'}</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required={formData.status === 'published'}
          />
        </div>

        <div className="form-group">
          <label htmlFor="shortDescription">Short Description{formData.status === 'published' && '*'}</label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            required={formData.status === 'published'}
            maxLength={500}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category{formData.status === 'published' && '*'}</label>
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
          <label htmlFor="company">Company{formData.status === 'published' && '*'}</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required={formData.status === 'published'}
          />
        </div>

        <div className="form-group">
          <label htmlFor="youtubeIframe">YouTube Iframe{formData.status === 'published' && '*'}</label>
          <input
            type="text"
            id="youtubeIframe"
            name="youtubeIframe"
            value={formData.youtubeIframe}
            onChange={handleChange}
            required={formData.status === 'published'}
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
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="form-edit-actions">
          <button type="button" onClick={() => navigate('/podcasts')} className="secondary-button">
            Cancel
          </button>
          <button type="submit" className="secondary-button" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Podcast'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPodcast;
