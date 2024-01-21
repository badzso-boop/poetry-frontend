// AppContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [poems, setPoems] = useState([]);
  const [albums, setAlbums] = useState({});
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [poemUpload, setPoemUpload] = useState(null)
  const [albumUpload, setAlbumUpload] = useState(null)
  const [commentUpload, setCommentUpload] = useState(null)
  const [follow, setFollow] = useState(null)

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        
        const response = await axios.get(`${apiUrl}/poems`, { withCredentials: true });
        setPoems(response.data);
      } catch (error) {
        console.error('Error fetching poems:', error.message);
      }
    };

    const fetchAlbums = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;

        const response = await axios.get(apiUrl+'/albums/albums-with-poems', { withCredentials: true });
        setAlbums(response.data);
      } catch (error) {
        console.error('Error fetching albums:', error.message);
      }
    };

    fetchPoems();
    fetchAlbums();

  }, [poemUpload, albumUpload, commentUpload]);

  return (
    <AppContext.Provider value={{ albums,setAlbums, poems, setPoems, follow, setFollow, user, setUser, userId, setUserId, setAlbumUpload, setPoemUpload,setCommentUpload }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
