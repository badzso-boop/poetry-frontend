import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

import BadgeAlert from './BadgeAlert';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons';

const Poem = (() => {
    const { poemId } = useParams();
    const { poems, user, userId, setCommentUpload, setPoems } = useContext(AppContext);
    const [showcomment, setShowComment] = useState(false);
    const [selectedPoemIndex, setSelectedPoemIndex] = useState(null); // Új állapot
    const [commentText, setCommentText] = useState('');
    const [commented, setCommented] = useState(0)
    const [likeCount, setLikeCount] = useState({});
    const [fakeLike, setFakeLike] = useState(null)
    const [fakeLikeText, setFakeLikeText] = useState("")

    const poem = poems[poemId]

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // A hónapok 0-tól indexelődnek, ezért hozzáadunk 1-et
    const day = today.getDate();

    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

    const handleToggleComments = (index) => {
      setShowComment(!showcomment);
      setSelectedPoemIndex(index);
    };

    const handleCommentDelete = async (commentId) => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.delete(
          apiUrl+`/comments/${commentId}`,
          { withCredentials: true }
        );
  
        console.log('Sikeres Delete kérés:', response.data);
        setCommentUpload(commentId)
  
        // Esetleges további műveletek a sikeres kérés esetén
      } catch (error) {
        console.error('Hiba a POST kérés során:', error);
  
        // Esetleges további műveletek a hiba esetén
      }
    }

    const handleSubmit = async (poemId) => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.post(
          apiUrl+`/comments/${poemId}`,
          { commentText: commentText },
          { withCredentials: true }
        );
  
        console.log('Sikeres POST kérés:', response.data);
        setCommentUpload(poemId)
        setCommentText('')
        setCommented(Math.floor(Math.random() * (100 - 1 + 1)) + 1)
  
        // Esetleges további műveletek a sikeres kérés esetén
      } catch (error) {
        console.error('Hiba a POST kérés során:', error);
  
        // Esetleges további műveletek a hiba esetén
      }
    };

    const renderContentWithLineBreaks = () => {
      if (!poem) return null;
  
      const contentWithBreaks = poem.content.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ));
  
      return contentWithBreaks;
    };

    useEffect(() => {
    }, [commented]);

    const handleLike = async (poemId) => {
      try {
  
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.post(
          apiUrl+`/poems/like/${poemId}`,
          {},
          {
            withCredentials: true,
          }
        );
    
        const message = response.data.message;
    
        if (message === 'Poem liked successfully.') {
          // Ha a vers sikeresen lájkolva lett, növeljük a like-ok számát
          setLikeCount(prevLikes => ({
            ...prevLikes,
            [poemId]: (prevLikes[poemId] || 0) + 1
          }));
          // Frissítjük a verslistát
          setPoems(prevPoems => 
            prevPoems.map(poem => 
              poem.id === poemId ? { ...poem, likeDb: poem.likeDb + 1 } : poem
            )
          );
        } else if (message === 'Poem like removed successfully.') {
          // Ha a like sikeresen eltávolítva lett, csökkentjük a like-ok számát
          setLikeCount(prevLikes => ({
            ...prevLikes,
            [poemId]: Math.max((prevLikes[poemId] || 0) - 1, 0)
          }));
          // Frissítjük a verslistát
          setPoems(prevPoems => 
            prevPoems.map(poem => 
              poem.id === poemId ? { ...poem, likeDb: Math.max(poem.likeDb - 1, 0) } : poem
            )
          );
        }
      } catch (error) {
        console.error("Hiba történt a like kérés közben", error);
      }
    };

    const handleLikeFake = () => {
      setFakeLike(false)
      setFakeLikeText("Lépj be ahhoz hogy likeolni tudj!")
  
      setTimeout(() => {
        setFakeLike(null);
        setFakeLikeText("");
      }, 2000);
    } 

    

    return (
      <>
        {poem && poems.length > 0 ? (
            <>
              <div>
                <Nav.Link as={Link} to="/poems">
                  <button class="btn btn-primary">
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </button>
                </Nav.Link>
                <ul className="list-unstyled">
                    <li>
                      <div className="card m-4">
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

                          <span><strong>Kommentek:</strong> {poem.comments.length === 0 ? (<span>0 db</span>) : (<></>)} </span>

                          {userId>0?(
                            <button className='btn btn-primary m-2 btn-sm' onClick={() => handleLike(poem.id)}>
                              <FontAwesomeIcon icon={faHeart} /> {likeCount[poem.id] || 0}
                            </button>
                          ):(
                            <button className='btn btn-primary m-2 btn-sm' onClick={handleLikeFake}>
                              <FontAwesomeIcon icon={faHeart} /> {likeCount[poem.id] || 0}
                            </button>
                          )}

                          {fakeLike !== null && (
                            <BadgeAlert
                              success={fakeLike}
                              text={fakeLikeText}
                            />
                          )}

                          <ul className="list-unstyled list-group-flush mb-4">
                            {userId > 0 ? (
                              <>
                                <li className="list-group-item">
                                  <div className="card mb-2">
                                    <div className="card-header d-flex justify-content-between">
                                      <p className="text-left mb-0">{user.username}</p>
                                      <p className="text-right mb-0">{formattedDate}</p>
                                    </div>
                                    <div className="card-body">
                                      <div className="card-text">
                                        <form onSubmit={(e) => {e.preventDefault();handleSubmit(poem.id);}} className="mt-4">
                                          <div className="form-group mb-4">
                                            <label htmlFor="commentText">Komment:</label>
                                            <textarea
                                              className="form-control"
                                              id="commentText"
                                              rows="3"
                                              value={commentText}
                                              onChange={(e) => setCommentText(e.target.value)}
                                            />
                                          </div>
                                          <button type="submit" className="btn btn-primary">Küldés</button>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              </>
                            ) : (
                              <>

                              </>
                            )}


                            {poem.comments.map((comment, index) => (
                              <li
                                key={index}
                                className="list-group-item"
                                data-commentid={comment.id}
                              >
                                <div className="card mb-2">
                                  <div className="card-header d-flex justify-content-between">
                                    <p className="text-left mb-0">{comment.commenter}</p>
                                    <p className="text-right mb-0">{comment.dateCommented.split("T")[0]}</p>
                                  </div>
                                  <div className="card-body">
                                    <div className="card-text d-flex justify-content-between">
                                      <div className='row'>
                                        <div className='col-9'>
                                          <p className="card-text komment">
                                            {comment.commentText}
                                          </p>
                                        </div>
                                        <div className='col-3'>
                                          {user && user.username === comment.commenter ? (<button className="text-right mb-0 btn btn-danger" onClick={(e) => {e.preventDefault();handleCommentDelete(comment.id);}}><FontAwesomeIcon icon={faTrashAlt} /></button>) : (<></>)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>

                          {/* <ul>
                            {poem.likes.map((like, index) => (
                              <li key={index}>{like.username}</li>
                            ))}
                          </ul> */}
                        </div>
                      </div>
                      
                      
                      
                      
                    </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <p>A versek meg nem toltottek be</p>
            </>
          )}
        </>
      );
})

export default Poem;