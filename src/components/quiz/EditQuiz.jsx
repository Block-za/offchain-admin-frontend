import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditQuiz.css';
import { API_BASE_URL } from '../../config';

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    title: '',
    duration: 0,
    numberOfQuestions: 0,
    reward: 0,
    maxParticipants: 0,
    questions: [],
    status: 'active'
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchQuizData();
    } else {
      setError('Quiz ID is missing');
      setLoading(false);
    }
  }, [id]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/quiz/${id}`);
      setQuizData(response.data);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      setError('Failed to fetch quiz data. Please try again.');
      if (error.response?.status === 404) {
        navigate('/quiz');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuizDataChange = (e) => {
    setQuizData({
      ...quizData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      [e.target.name]: e.target.value
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const startEditingQuestion = (index) => {
    const question = quizData.questions[index];
    setCurrentQuestion({
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer
    });
    setEditingQuestionIndex(index);
  };

  const saveQuestion = async () => {
    try {
      // Validate question data
      if (!currentQuestion.question.trim()) {
        alert('Question text cannot be empty');
        return;
      }
      if (currentQuestion.options.some(option => !option.trim())) {
        alert('All options must be filled');
        return;
      }

      const questionData = {
        question: currentQuestion.question,
        options: currentQuestion.options,
        correctAnswer: parseInt(currentQuestion.correctAnswer)
      };

      if (editingQuestionIndex !== null) {
        // Update existing question
        const response = await axios.put(
          `${API_BASE_URL}/api/quiz/${id}/questions/${editingQuestionIndex}`,
          questionData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data && response.data.quiz) {
          setQuizData(response.data.quiz);
          setCurrentQuestion({
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0
          });
          setEditingQuestionIndex(null);
        }
      } else {
        // Add new question
        const response = await axios.post(
          `${API_BASE_URL}/api/quiz/${id}/questions`,
          { question: questionData },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data && response.data.quiz) {
          setQuizData(response.data.quiz);
          setCurrentQuestion({
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0
          });
          setEditingQuestionIndex(null);
        }
      }
    } catch (error) {
      console.error('Error saving question:', error);
      console.error('Error details:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to save question');
    }
  };

  const deleteQuestion = async (index) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/quiz/${id}/questions/${index}`
      );
      fetchQuizData();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question');
    }
  };

  const updateQuizDetails = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/quiz/${id}`,
        {
          title: quizData.title,
          duration: parseInt(quizData.duration),
          reward: parseInt(quizData.reward),
          maxParticipants: parseInt(quizData.maxParticipants)
        }
      );
      alert('Quiz details updated successfully');
      navigate('/quiz');
    } catch (error) {
      console.error('Error updating quiz details:', error);
      alert('Failed to update quiz details');
    }
  };

  const updateQuizStatus = async () => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/quiz/${id}/status`,
        { status: quizData.status === 'active' ? 'inactive' : 'active' }
      );
      fetchQuizData();
    } catch (error) {
      console.error('Error updating quiz status:', error);
      alert('Failed to update quiz status');
    }
  };

  if (loading) {
    return <div className="quiz-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/quiz')} className="submit-button">
          Back to Quiz List
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-form">
        <h2 className="quiz-title">Edit Quiz</h2>
        
        <div className="form-section">
          <h3>Quiz Details</h3>
          <div className="form-group">
            <label className="input-label">Quiz Title</label>
            <input
              type="text"
              name="title"
              value={quizData.title}
              onChange={handleQuizDataChange}
              className="input-field"
              required
            />
          </div>

          <div className="grid-container">
            <div className="form-group">
              <label className="input-label">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={quizData.duration}
                onChange={handleQuizDataChange}
                className="input-field"
                required
              />
            </div>
            <div className="form-group">
              <label className="input-label">Reward Points</label>
              <input
                type="number"
                name="reward"
                value={quizData.reward}
                onChange={handleQuizDataChange}
                className="input-field"
                required
              />
            </div>
            <div className="form-group">
              <label className="input-label">Max Participants</label>
              <input
                type="number"
                name="maxParticipants"
                value={quizData.maxParticipants}
                onChange={handleQuizDataChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Status</label>
            <select
              name="status"
              value={quizData.status}
              onChange={handleQuizDataChange}
              className="input-field"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button
            type="button"
            onClick={updateQuizDetails}
            className="submit-button"
          >
            Update Quiz Details
          </button>
        </div>

        <div className="form-section">
          <h3>Questions</h3>
          {quizData.questions.map((question, index) => (
            <div key={index} className="question-card">
              <h4>Question {index + 1}</h4>
              <p>{question.question}</p>
              <div className="options-list">
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`option ${optIndex === question.correctAnswer ? 'correct' : ''}`}
                  >
                    {option}
                  </div>
                ))}
              </div>
              <div className="question-actions">
                <button
                  onClick={() => startEditingQuestion(index)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteQuestion(index)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <div className="question-form">
            <h4>{editingQuestionIndex !== null ? 'Edit Question' : 'Add New Question'}</h4>
            <div className="form-group">
              <label className="input-label">Question Text</label>
              <input
                type="text"
                name="question"
                value={currentQuestion.question}
                onChange={handleQuestionChange}
                className="input-field"
                required
              />
            </div>

            <div className="options-form">
              <label className="input-label">Options</label>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="option-input">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="input-field"
                    required
                  />
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={currentQuestion.correctAnswer === index}
                    onChange={() => setCurrentQuestion({
                      ...currentQuestion,
                      correctAnswer: index
                    })}
                  />
                  <label>Correct</label>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={saveQuestion}
              className="submit-button"
            >
              {editingQuestionIndex !== null ? 'Update Question' : 'Add Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuiz;