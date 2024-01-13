// src/components/BadgeAlert.js

import React from 'react';

const BadgeAlert = ({ success, text }) => {
  const alertClass = success ? 'alert-success' : 'alert-danger';

  return (
    <div className={`alert ${alertClass}`} role="alert">
      {text}
    </div>
  );
};

export default BadgeAlert;
