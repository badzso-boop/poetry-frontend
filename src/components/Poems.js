import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { AppContext } from '../context/AppContext';

const Poems = () => {
  const { poems, userId, setPoems } = useContext(AppContext);
  const [showcomment, setShowComment] = useState(false);
  const [selectedPoemIndex, setSelectedPoemIndex] = useState(null);
  const [likeCount, setLikeCount] = useState({});

  const handleToggleComments = (index) => {
    setShowComment(!showcomment);
    setSelectedPoemIndex(index);
  };

  const handleLike = async (poemId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/poems/like/${poemId}`,
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

  useEffect(() => {
    // Betöltésnél inicializáljuk a like számokat
    if (poems.length > 0) {
      const initialLikes = poems.reduce((acc, poem) => {
        acc[poem.id] = poem.likeDb;
        return acc;
      }, {});
      setLikeCount(initialLikes);
    }
  }, [poems]);

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

  return (
    <>
      {poems && poems.length > 0 ? (
        <>
          <div>
            <h1 className="text-center">Versek</h1>
            <ul className="list-unstyled">
              {poems.map((poem, index) => (
                <li key={index}>
                  <div className="card m-4">
                    <div className="card-header">
                      <Link to={`/poems/${index}`}>
                        <strong>{poem.title}</strong>
                      </Link>
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

                      <span><strong>Kommentek:</strong> {poem.comments.length} db</span>
                      {poem.comments.length > 0 ? (
                        <>
                          <button
                            className="btn btn-primary btn-sm ms-2"
                            onClick={() => handleToggleComments(index)}
                          >
                            {selectedPoemIndex === index && showcomment
                              ? 'Elrejtés'
                              : 'Megjelenítés'}
                          </button>
                          {selectedPoemIndex === index && showcomment
                              ? (
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
                                        <p className="card-text">
                                          {comment.commentText}
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>  
                            ) : (
                              <>
                                <br />
                              </>  
                            )}
                        </>
                      ) : (
                        <>
                          <br />
                        </>
                      )}

                      <span><strong>Likeok: </strong> {likeCount[poem.id] || 0} db</span>
                      {userId && (<button className='btn btn-primary m-2 btn-sm' onClick={() => handleLike(poem.id)}>Kedvelés</button>)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          <p>A versek még nem töltöttek be</p>
        </>
      )}
    </>
  );
};

export default Poems;
