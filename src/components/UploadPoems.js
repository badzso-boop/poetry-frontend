// src/components/UploadPoems.js

import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

import BadgeAlert from './BadgeAlert';

const UploadPoems = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { user, setPoemUpload, labels } = useContext(AppContext);
  const [uploadPoemSucces, setUploadPoemSucces] = useState(null)
  const [uploadPoemText, setUploadPoemText] = useState("")
  const [isLabelWithInternallyDisabledControl, setIsLabelWithInternallyDisabledControl] = useState([]);

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
        userId: user.userId,
        labels: isLabelWithInternallyDisabledControl.join('-'),
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

  const handleCheckboxChange = (labelId) => {
    // Itt kezelheted a checkbox változását
    // console.log(`Checkbox changed for label with id: ${labelId}`);

    // Példa: hozzáadhatod a címke id-ját a kiválasztott isLabelWithInternallyDisabledControl-hoz
    setIsLabelWithInternallyDisabledControl((prevIds) => {
      if (prevIds.includes(labelId)) {
        // Ha már benne van, távolítsd el
        return prevIds.filter((id) => id !== labelId);
      } else {
        // Ha nincs benne, add hozzá
        return [...prevIds, labelId];
      }
    });
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
        <div>
          <p>Címkék</p>
            <ul>
              {labels.length > 0 && labels.map((label, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="checkbox"
                      value={label.label_id}
                      onChange={() => handleCheckboxChange(label.label_id)}
                      checked={isLabelWithInternallyDisabledControl.includes(label.label_id)} 
                    /> {label.label_name}
                  </label>
                </li>
              ))}
            </ul>
        </div>
        <button type="submit" className="btn btn-primary mt-2">
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
