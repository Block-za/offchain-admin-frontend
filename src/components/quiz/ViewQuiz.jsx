import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewQuiz.css';
import { API_BASE_URL } from '../../config';


const ViewQuiz = () => {
  const [quizzes, setQuizzes] = useState([]); // Initialize as empty array
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz`);
      const data = await response.json();
      // Access the quizzes array from the response data
      setQuizzes(data.quizzes || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setQuizzes([]);
    }
  };

  const handleStatusChange = async (quizId, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/${quizId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: currentStatus === 'active' ? 'inactive' : 'active'
        })
      });

      if (response.ok) {
        fetchQuizzes();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update quiz status');
      }
    } catch (error) {
      console.error('Error updating quiz status:', error);
      alert('Failed to update quiz status');
    }
  };

  const handleDelete = async (quizId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/quiz/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        // Refresh the quiz list after successful deletion
        fetchQuizzes();
      } else {
        throw new Error('Failed to delete quiz');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz');
    }
  };

  // Only filter if quizzes is an array
  const filteredQuizzes = Array.isArray(quizzes) 
    ? quizzes.filter(quiz => quiz.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className="quiz-list-container">
      <div className="quiz-header">
        <input
          type="text"
          placeholder="Search quiz"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="quiz-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Article Name</th>
            <th>Duration</th>
            <th>Question</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuizzes.map(quiz => (
            <tr key={quiz._id}>
              <td>
                <div className="title-container">
                  {quiz.title}
                  <div className="action-links">
                    <a className="view-link">View</a>
                    <a className="edit-link">Edit</a>
                    <a 
                      className="delete-link" 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this quiz?')) {
                          handleDelete(quiz._id);
                        }
                      }}
                    >
                      Delete
                    </a>
                  </div>
                </div>
              </td>
              <td>{quiz.title}</td>
              <td>{quiz.duration}m</td>
              <td>{quiz.questions.length}</td>
              <td>
                <span className={`status-badge ${quiz.status}`}>
                  {quiz.status}
                </span>
              </td>
              <td className="action-buttons">
                <a className="action-link">Add question</a>
                <a className="action-link">View Questions</a>
                <a 
                  className="action-link"
                  onClick={() => handleStatusChange(quiz._id, quiz.status)}
                >
                  {quiz.status === 'active' ? 'Deactivate' : 'Activate'}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewQuiz;