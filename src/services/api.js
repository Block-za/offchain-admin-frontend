import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const podcastService = {
  getAllPodcasts: () => api.get('/podcasts'),
  getPodcastBySlug: (slug) => api.get(`/podcasts/${slug}`),
  createPodcast: (formData) => api.post('/podcasts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  updatePodcast: (id, formData) => api.put(`/podcasts/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deletePodcast: (id) => api.delete(`/podcasts/${id}`),
  publishPodcast: (id) => api.patch(`/podcasts/${id}/publish`),
  unpublishPodcast: (id) => api.patch(`/podcasts/${id}/unpublish`),
};