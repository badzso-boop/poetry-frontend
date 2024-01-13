// src/components/UploadAlbum.js

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const UploadAlbum = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [poemIds, setPoemIds] = useState([]);
  const [poems, setPoems] = useState([]);
  const [error, setError] = useState(null);

  const { user, userId, setAlbumUpload } = useContext(AppContext);
  
  useEffect(() => {
    const fetchPoems = async () => {
      try {
        // Elkérjük a user ID-t a session-ből
        const userid = userId;

        // Ha nincs bejelentkezve a felhasználó, ne küldjük el a kérést
        if (!user || !user.username) {
          setError('Not logged in');
          return;
        }

        const response = await axios.get(`http://localhost:3000/poems/user/${userid}`, { withCredentials: true });
        setPoems(response.data);
      } catch (error) {
        console.error('Error fetching poems:', error.message);
        setError('Nincsenek még feltöltve verseid!');
      }
    };

    fetchPoems();
  }, [user, userId]);

  const handleCheckboxChange = (poemId) => {
    // Itt kezelheted a checkbox változását
    console.log(`Checkbox changed for poem with id: ${poemId}`);
    // Példa: hozzáadhatod a vers id-ját a kiválasztott poemIds-hez
    setPoemIds((prevIds) => [...prevIds, poemId]);
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
        description: content,
        poemIds: poemIds,
      };

      const response = await fetch('http://localhost:3000/albums/create-album', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include', // Küldjük a cookie-kat a szerverrel
      });

      if (response.ok) {
        // Sikeres vers feltöltés, kezelheted a választ itt
        console.log('Album uploaded successfully');
        // Tisztítjuk az űrlap mezőket
        setAlbumUpload(title)
        setTitle('');
        setContent('');
        setPoemIds([])
      } else {
        // Sikertelen vers feltöltés, kezelheted a választ itt
        console.error('Album upload failed');
      }
    } catch (error) {
      console.error('Error during album upload:', error.message);
    }
  };

  return (
    <div>
      <h2>Album feltöltése</h2>
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
          <label htmlFor="content">Leírás:</label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div>
            <p>Versek</p>
            {error && <p>{error}</p>}
            <ul>
                {poems.length > 0 && poems.map((poem) => (
                    <li key={poem.poem_id}>
                        <label>
                        <input
                            type="checkbox"
                            value={poem.poem_id}
                            onChange={() => handleCheckboxChange(poem.poem_id)}
                        /> - 
                        {poem.title}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
        <button type="submit" className="btn btn-primary">
          Mentés
        </button>
      </form>
    </div>
  );
};

export default UploadAlbum;
