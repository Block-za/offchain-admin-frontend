import React, { useState, useEffect } from 'react';
import './QuizManagement.css';
import { resultService } from '../../services/api';
import { API_BASE_URL } from '../../config';

const QuizManagement = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      
      // This would use the service in a production app
      // const response = await resultService.getAllResults();
      
      // For development/testing directly call the API
      const response = await fetch(`${API_BASE_URL}/api/result`);
      const data = await response.json();
      
      setResults(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to load quiz results. Please try again later.');
      setLoading(false);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter results based on search term (user ID)
  const filteredResults = results.filter(result => 
    result.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (result.quizId?.title && result.quizId.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="quiz-management">
      <h1>Quiz Management</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by user ID or quiz title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <p>Loading results...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <div className="results-summary">
            <p>Total Results: {results.length}</p>
            {searchTerm && <p>Filtered Results: {filteredResults.length}</p>}
          </div>

          {filteredResults.length > 0 ? (
            <div className="table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Quiz Title</th>
                    <th>Score</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result) => (
                    <tr key={result._id}>
                      <td>{result.user}</td>
                      <td>{result.quizId?.title || 'Unknown Quiz'}</td>
                      <td>{result.score}</td>
                      <td>{formatDate(result.takenAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No quiz results found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default QuizManagement; 