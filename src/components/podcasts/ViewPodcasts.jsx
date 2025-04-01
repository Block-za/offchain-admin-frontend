import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { podcastService } from '../../services/api';
import { toast } from 'react-toastify';
import './ViewPodcasts.css';

const ITEMS_PER_PAGE = 5;

const ViewPodcasts = () => {
  const navigate = useNavigate();
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Pagination states
  const [draftPage, setDraftPage] = useState(1);
  const [publishedPage, setPublishedPage] = useState(1);

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const response = await podcastService.getAllPodcasts();
      setPodcasts(response.data.data || []);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch podcasts');
      toast.error('Error loading podcasts');
      setLoading(false);
    }
  };

  const handleEdit = (slug) => {
    navigate(`/podcasts/edit/${slug}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this podcast?')) {
      try {
        setDeletingId(id);
        const response = await podcastService.deletePodcast(id);
        
        if (response.data.success) {
          toast.success('Podcast deleted successfully');
          fetchPodcasts();
        } else {
          throw new Error('Failed to delete podcast');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.error || 'Error deleting podcast');
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Filter podcasts only if podcasts array exists
  const draftPodcasts = Array.isArray(podcasts) 
    ? podcasts.filter(podcast => podcast.status === 'draft')
    : [];
    
  const publishedPodcasts = Array.isArray(podcasts)
    ? podcasts.filter(podcast => podcast.status === 'published')
    : [];

  // Pagination calculations
  const getDraftPageData = () => {
    const startIndex = (draftPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return draftPodcasts.slice(startIndex, endIndex);
  };

  const getPublishedPageData = () => {
    const startIndex = (publishedPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return publishedPodcasts.slice(startIndex, endIndex);
  };

  const renderPagination = (currentPage, setPage, totalItems, label) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={currentPage === i ? 'active' : ''}
          disabled={currentPage === i}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => setPage(curr => Math.max(1, curr - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => setPage(curr => Math.min(totalPages, curr + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages} ({totalItems} {label})
        </span>
      </div>
    );
  };

  const renderTable = (podcasts, status) => (
    <table className="podcast-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Company</th>
          <th>Category</th>
          <th>Created At</th>
          <th>YouTube Link</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {podcasts.map(podcast => (
          <tr key={podcast._id}>
            <td>{podcast.title}</td>
            <td>{podcast.company}</td>
            <td>{podcast.category}</td>
            <td>{new Date(podcast.createdAt).toLocaleDateString()}</td>
            <td>
              {podcast.youtubeIframe ? (
                <a 
                  href={podcast.youtubeIframe}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="youtube-link"
                >
                  Open Video
                </a>
              ) : (
                <span>No link</span>
              )}
            </td>
            <td className="actions">
              <button
                className="action-button edit-button"
                onClick={() => handleEdit(podcast.slug)}
                disabled={deletingId === podcast._id}
              >
                Edit
              </button>
              <button
                className="action-button delete-button"
                onClick={() => handleDelete(podcast._id)}
                disabled={deletingId === podcast._id}
              >
                {deletingId === podcast._id ? 'Deleting...' : 'Delete'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="view-podcasts">
      <h1>Podcasts</h1>
      
      <div className="podcast-section">
        <h2>Draft Podcasts</h2>
        {draftPodcasts.length > 0 ? (
          <>
            {renderTable(getDraftPageData(), 'draft')}
            {renderPagination(draftPage, setDraftPage, draftPodcasts.length, 'Drafts')}
          </>
        ) : (
          <p>No draft podcasts found</p>
        )}
      </div>

      <div className="podcast-section">
        <h2>Published Podcasts</h2>
        {publishedPodcasts.length > 0 ? (
          <>
            {renderTable(getPublishedPageData(), 'published')}
            {renderPagination(publishedPage, setPublishedPage, publishedPodcasts.length, 'Published')}
          </>
        ) : (
          <p>No published podcasts found</p>
        )}
      </div>
    </div>
  );
};

export default ViewPodcasts;
