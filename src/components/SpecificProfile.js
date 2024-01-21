// src/components/Profile.js

import React, { useState, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { AppContext } from '../context/AppContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

const SpecificProfile = () => {
  const { inUserId } = useParams();
  const { setFollow, userId} = useContext(AppContext)

  const [user, setUser] = useState(null)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])

  const fetchFollowers = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      
      const response = await axios.get(`${apiUrl}/follows/followers/${inUserId}`, { withCredentials: true });
      setFollowers(response.data);
    } catch (error) {
      console.error('Error fetching poems:', error.message);
    }
  };

  const fetchFollowing = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      
      const response = await axios.get(`${apiUrl}/follows/following/${inUserId}`, { withCredentials: true });
      setFollowing(response.data);
    } catch (error) {
      console.error('Error fetching poems:', error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      
      const response = await axios.get(`${apiUrl}/users/${inUserId}`, { withCredentials: true });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching poems:', error.message);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchFollowers();
    fetchFollowing();
  }, []);


  const renderContentWithLineBreaks = (poem) => {
    if (!poem) return null;

    const contentWithBreaks = poem.content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));

    return contentWithBreaks;
  };

  const handleFollowSubmit = async (FollowUserId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(
        apiUrl + `/follows/follow/${FollowUserId}`,
        {},
        {
          withCredentials: true
        }
      );
  
      console.log('Sikeres POST kérés:', response.data.message);
  
      setFollow(Math.floor(Math.random() * (100 - 1 + 1)) + 1);
      fetchFollowers();
      fetchFollowing();
  
      // Esetleges további műveletek a sikeres kérés esetén
    } catch (error) {
      console.error('Hiba a POST kérés során:', error);
  
      // Esetleges további műveletek a hiba esetén
    }
  };

  const followingUser = (inUserId) => {
    for (let i = 0; i < followers.length; i++) {
      if (followers[i].userId === inUserId) {
        return true;
      }
    }
    return false;
  };

  return (
    <>
    {user !== null && (
      <div>
        {/* <!-- Felhasználói adatok --> */}        
          <div className="col-12 mb-4">
            <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <strong className="text-left">{user.username}</strong>
              {(userId===null) ? (null) : (
                <>
                  {(String(inUserId) === String(userId)) ? (null) : (
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => {handleFollowSubmit(user.id)}}>
                      <span className="m-1">{followingUser(userId)? ("Követés leállítása") : ("Követés")}</span>
                      <FontAwesomeIcon icon={faUserPlus} />
                    </button>
                  )}
                </>
              )}
            </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-6">
                    <p className="card-text">E-mail cím: {user.email}</p>
                    <p className="card-text">Profil kép: {user.profileImgUrl}</p>
                    <p className="card-text">Rang: {user.role}</p>
                  </div>
                  <div className="col-6">
                    <p className="card-text">Követők: {followers.length}</p>
                    <p className="card-text">Követés: {following.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        

        


        <div className="container">
          <div className="row">
            {/* <!-- Verseket tartalmazó bal oszlop --> */}
            <div className="col-md-6">
              <h2 className="text-center">Összes Vers</h2>
              <ul className="list-unstyled">
                {user.poems && user.poems.length > 0 ? (
                  <>
                    {user.poems.map((poem, index) => (
                      <li
                        key={index}
                        data-poemid={poem.id}
                        className="mb-4"
                      >
                        <div className="card">
                          <div className="card-header">
                            <strong>{poem.title}</strong>
                          </div>
                          <div className="card-body">
                            <blockquote>
                              <p>{renderContentWithLineBreaks(poem)}</p>
                              <footer className="blockquote-footer">
                                <cite>
                                  <strong>{user.username}</strong>
                                  <p>{poem.creationDate.split("T")[0]}</p>
                                </cite>
                              </footer>
                            </blockquote>

                            <div className="text-center">
                              <span className="m-2"><FontAwesomeIcon icon={faHeart} /> {poem.likes.length} </span>
                              {/* <ul>
                                {poem.likes.map((like, index) => (
                                  <li key={index}>{like.username}</li>
                                ))}
                              </ul> */}

                              <span className="m-2"><FontAwesomeIcon icon={faComment} /> {poem.comments.length} </span>
                            </div>
                            <ul className="list-group list-group-flush mb-4">
                              {poem.comments && poem.comments.map((comment, index) => (
                                <li
                                  key={index}
                                  className="list-group-item"
                                  data-commentid={comment.id}
                                >
                                  <div className="card">
                                    <div className="card-header d-flex justify-content-between">
                                      <p className="text-left mb-0">{comment.commenter}</p>
                                      <p className="text-right mb-0">{comment.dateCommented.split("T")[0]}</p>
                                    </div>
                                    <div className="card-body">
                                      <div className="row">
                                        <div className="col-12">
                                          <p className="card-text komment">
                                            {comment.commentText}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </li>
                    ))}
                  </>
                ) : (
                  <>
                    <p>Még nincsenek versek feltöltve</p>
                  </>
                )}
              </ul>
            </div>

            {/* <!-- Albumokat tartalmazó jobb oszlop --> */}
            <div className="col-md-6">
                  <h2 className="text-center">Albumok</h2>
                  {user.albums && user.albums.length > 0 ? (
                    <>
                      <ul className="list-unstyled">
                        {user.albums[0].map((smallAlbum, smallindex) => (
                          <li key={smallindex}>
                            <div className="card mb-4">
                              <div className="card-header">
                                <strong>{smallAlbum.title}</strong>
                              </div>
                              <div className="card-body">
                                <p className="card-text">
                                  {smallAlbum.description}
                                </p>
                              </div>

                              <ul className="list-unstyled m-2">
                                {smallAlbum.poems && smallAlbum.poems.map((poem, index) => (
                                  <li key={index} className="m-2">
                                    <div className="card">
                                      <div className="card-header">
                                        <strong>{poem.title}</strong>
                                      </div>
                                      <div className="card-body">
                                        <blockquote>
                                          <p>{renderContentWithLineBreaks(poem)}</p>
                                          <footer className="blockquote-footer">
                                            <cite>
                                              <strong>{poem.author}</strong>
                                              <p>{poem.creationDate.split("T")[0]}</p>
                                            </cite>
                                          </footer>
                                        </blockquote>

                                        <span><strong>Likeok: </strong> {poem.likes.length} db</span>
                                        {/* <ul>
                                          {poem.likes.map((like, index) => (
                                            <li key={index}>{like.username}</li>
                                          ))}
                                        </ul> */}

                                        {/* <ul className="list-unstyled">
                                          {poem.comments.map((comment, index) => (
                                            <li key={index} className="list-group-item">
                                              <div className="card">
                                                <div className="card-header d-flex justify-content-between">
                                                  <p className="text-left mb-0">{comment.commenter}</p>
                                                  <p className="text-right mb-0">{comment.dateCommented.split("T")[0]}</p>
                                                </div>
                                                <div className="card-body">
                                                  <p className="text-left mb-0">{comment.commentText}</p>
                                                </div>
                                              </div>
                                            </li>
                                          ))}
                                        </ul> */}
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <>
                      <p>Még nincsenek albumok feltöltve</p>
                    </>
                  )}
            </div>
          </div>
        </div>

        
      </div>
    )}
    </>
  );
};

export default SpecificProfile;