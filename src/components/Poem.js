import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const Poem = (() => {
    const { poemId } = useParams();
    const { poems, user, userId, setCommentUpload } = useContext(AppContext);
    const [showcomment, setShowComment] = useState(false);
    const [selectedPoemIndex, setSelectedPoemIndex] = useState(null); // Új állapot
    const [commentText, setCommentText] = useState('');
    const [commented, setCommented] = useState(0)

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
        const response = await axios.delete(
          `http://localhost:3000/comments/${commentId}`,
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
        const response = await axios.post(
          `http://localhost:3000/comments/${poemId}`,
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

    

    return (
      <>
        {poem && poems.length > 0 ? (
            <>
              <div>
                <Nav.Link as={Link} to="/poems">
                  <button class="btn btn-primary">Vissza</button>
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
                          <ul className="list-group list-group-flush mb-4">
                            {poem.comments.map((comment, index) => (
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
                                    <div className="card-text d-flex justify-content-between">
                                      <p className="text-left mb-0">{comment.commentText}</p>
                                      {user && user.username === comment.commenter ? (<button className="text-right mb-0 btn btn-primary" onClick={(e) => {e.preventDefault();handleCommentDelete(comment.id);}}>Komment törlése</button>) : (<></>)}
                                      
                                      
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}

                            {userId > 0 ? (
                              <>
                                <li className="list-group-item">
                                  <div className="card">
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
                          </ul>  


                          <span><strong>Likeok: </strong> {poem.likeDb} db</span>
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