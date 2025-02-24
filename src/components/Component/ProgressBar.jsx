import React from 'react';
import PropTypes from 'prop-types';

function ProgressBar({ currentStep, totalSteps }) {
  const progress = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: `${progress}%` }} />
      <div className="steps">
        {Array.from({ length: totalSteps }, (_, index) => (
          <span
            key={index}
            className={`step ${currentStep === index + 1 ? 'active' : ''} ${
              currentStep > index + 1 ? 'completed' : ''
            }`}
          >
            {index + 1}
          </span>
        ))}
      </div>
    </div>
  );
}

ProgressBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
};

export default ProgressBar;
