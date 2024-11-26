/* eslint-disable react/prop-types */
import  { useState } from 'react';
import './GoalSet.css';

const GoalSet = ({ userId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    targetDate: new Date().toISOString().split('T')[0],
    goals: {
      easy: 0,
      medium: 0,
      hard: 0
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/goal/set-goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          targetDate: formData.targetDate,
          goals: formData.goals
        }),
      });

      if (!response.ok) throw new Error('Failed to set goal');
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error setting goal:', error);
    }
  };

  return (
    <div className="goal-form-overlay">
      <div className="goal-form-container">
        <h2>Set Daily Goal</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Target Date</label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({
                ...formData,
                targetDate: e.target.value
              })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <label>Easy Questions</label>
            <input
              type="number"
              min="0"
              value={formData.goals.easy}
              onChange={(e) => setFormData({
                ...formData,
                goals: { ...formData.goals, easy: parseInt(e.target.value) || 0 }
              })}
            />
          </div>
          <div className="form-group">
            <label>Medium Questions</label>
            <input
              type="number"
              min="0"
              value={formData.goals.medium}
              onChange={(e) => setFormData({
                ...formData,
                goals: { ...formData.goals, medium: parseInt(e.target.value) || 0 }
              })}
            />
          </div>
          <div className="form-group">
            <label>Hard Questions</label>
            <input
              type="number"
              min="0"
              value={formData.goals.hard}
              onChange={(e) => setFormData({
                ...formData,
                goals: { ...formData.goals, hard: parseInt(e.target.value) || 0 }
              })}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Set Goal</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalSet;