import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateQuiz.css';
import { API_BASE_URL } from '../config'

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    title: '',
    duration: 0,
    numberOfQuestions: 0,
    reward: 0,
    maxParticipants: 0,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

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

  const addQuestion = () => {
    if (quizData.questions.length < quizData.numberOfQuestions) {
      setQuizData({
        ...quizData,
        questions: [...quizData.questions, currentQuestion]
      });
      setCurrentQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate number of questions
      if (quizData.questions.length !== parseInt(quizData.numberOfQuestions)) {
        alert(`Please add exactly ${quizData.numberOfQuestions} questions before submitting.`);
        return;
      }

      // Convert string values to numbers
      const formattedQuizData = {
        ...quizData,
        duration: parseInt(quizData.duration),
        numberOfQuestions: parseInt(quizData.numberOfQuestions),
        reward: parseInt(quizData.reward),
        maxParticipants: parseInt(quizData.maxParticipants)
      };

      console.log('Submitting quiz data:', formattedQuizData);
      const response = await axios.post(`${API_BASE_URL}/api/quiz`, formattedQuizData);
      console.log('Quiz created successfully:', response.data);
      if (response.data) {
        navigate('/quiz');
      }
    } catch (error) {
      console.error('Error creating quiz:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to create quiz');
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-form">
        <h2 className="quiz-title">Create New Quiz</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="input-label">Number of Questions</label>
              <input
                type="number"
                name="numberOfQuestions"
                value={quizData.numberOfQuestions}
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

          <div className="question-section">
            <h3 className="quiz-title text-xl">Add Questions</h3>
            <div className="space-y-4">
              <input
                type="text"
                name="question"
                value={currentQuestion.question}
                onChange={handleQuestionChange}
                placeholder="Enter question"
                className="input-field"
              />
              {currentQuestion.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="input-field"
                />
              ))}
              <div className="form-group">
                <label className="input-label">Correct Answer (0-3)</label>
                <input
                  type="number"
                  name="correctAnswer"
                  value={currentQuestion.correctAnswer}
                  onChange={handleQuestionChange}
                  min="0"
                  max="3"
                  className="input-field"
                />
              </div>
              <button
                type="button"
                onClick={addQuestion}
                className="button button-primary"
                disabled={quizData.questions.length >= quizData.numberOfQuestions}
                style={{ opacity: quizData.questions.length >= quizData.numberOfQuestions ? 0.5 : 1 }}
              >
                Add Question ({quizData.questions.length}/{quizData.numberOfQuestions})
              </button>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="button button-secondary"
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;