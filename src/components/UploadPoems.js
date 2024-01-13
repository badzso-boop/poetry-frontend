// src/components/UploadPoems.js

import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const UploadPoems = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { user, setPoemUpload } = useContext(AppContext);

  const handleTextareaChange = (e) => {
    // Szűrjük az Enter gombot, és adjunk hozzá egy sortörést a tartalomhoz
    if (e.key === 'Enter') {
      e.preventDefault(); // Ne engedje tovább az Enter eseményt
      setContent((prevContent) => prevContent + '\n');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user || !user.username) {
        console.error('User not logged in');
        // Kezelés, ha a felhasználó nincs bejelentkezve
        return;
      }

      const requestBody = {
        title: title,
        content: content,
        userId: user.userId, // A session-ben tárolt user_id
      };

      const response = await fetch('http://localhost:3000/poems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include', // Küldjük a cookie-kat a szerverrel
      });

      if (response.ok) {
        // Sikeres vers feltöltés, kezelheted a választ itt
        console.log('Poem uploaded successfully');
        setPoemUpload(title)
        // Tisztítjuk az űrlap mezőket
        setTitle('');
        setContent('');
      } else {
        // Sikertelen vers feltöltés, kezelheted a választ itt
        console.error('Poem upload failed');
      }
    } catch (error) {
      console.error('Error during poem upload:', error.message);
    }
  };

  return (
    <div>
      <h2>Vers feltöltése</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Cím:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Vers:</label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleTextareaChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Mentés
        </button>
      </form>
    </div>
  );
};

export default UploadPoems;
