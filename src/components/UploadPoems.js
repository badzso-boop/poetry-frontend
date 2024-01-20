// src/components/UploadPoems.js

import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

import BadgeAlert from './BadgeAlert';

const UploadPoems = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { user, setPoemUpload } = useContext(AppContext);
  const [uploadPoemSucces, setUploadPoemSucces] = useState(null)
  const [uploadPoemText, setUploadPoemText] = useState("")

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
      const apiUrl = process.env.REACT_APP_API_URL;

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

      const response = await fetch(apiUrl+'/poems', {
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
        setUploadPoemSucces(true)
        setUploadPoemText("Sikeres vers feltöltés!")
        // Tisztítjuk az űrlap mezőket
        setTitle('');
        setContent('');
      } else {
        // Sikertelen vers feltöltés, kezelheted a választ itt
        console.error('Poem upload failed');
        setUploadPoemSucces(false)
        setUploadPoemText("Sikertelen vers feltöltés!")
      }
    } catch (error) {
      console.error('Error during poem upload:', error.message);
    }
  };

  return (
    <div>
      <h2>Vers feltöltése</h2>
      <form onSubmit={handleSubmit} className='mb-2'>
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
      {uploadPoemSucces !== null && (
        <BadgeAlert
          success={uploadPoemSucces}
          text={uploadPoemText}
        />
      )}
    </div>
  );
};

export default UploadPoems;
