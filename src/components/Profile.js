// src/components/Profile.js

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from '../context/AppContext';

const Profile = () => {
  const [poemId, setPoemId] = useState("");
  const [commentId, setCommentId] = useState("");
  const [editingStateComment, setEditingStateComment] = useState({});
  const [editingState, setEditingState] = useState({});
  const [albumDelete, setAlbumDelete] = useState(-1)

  const { user, userId, setUser } = useContext(AppContext);

  const handleDelete = async (event) => {
    event.preventDefault();

    try {
      // Az input mező értéke alapján állítsa be a poemId-t
      const poemIdToDelete = event.target.elements.poemId.value;

      // Axios DELETE kérés küldése a megadott poemId-vel
      await axios.delete(`http://localhost:3000/poems/${poemIdToDelete}`, {
        withCredentials: true,
      });

      // Sikeres törlés esetén további műveletek, pl. frissítés vagy visszajelzés
      console.log(`A költemény (${poemIdToDelete}) sikeresen törölve!`);
      setPoemId(poemIdToDelete);
    } catch (error) {
      // Hiba esetén kezelés, pl. hibaüzenet megjelenítése
      console.error("Hiba történt a törlés során:", error);
    }
  };

  const handleEditSubmit = async (poemId, event) => {
    event.preventDefault();

    try {
      const editedPoemData = editingState[poemId]?.editedPoem;

      if (!editedPoemData) {
        console.error("Nincs frissített vers adat.");
        return;
      }

      // Az editedPoem állapotot használhatod a frissített adatok elküldéséhez
      await axios.put(`http://localhost:3000/poems/${poemId}`, editedPoemData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Sikeres módosítás esetén további műveletek, pl. frissítés vagy visszajelzés
      console.log(`A költemény (${poemId}) sikeresen módosítva!`);

      // Frissítjük a state-et és leállítjuk a szerkesztés módot
      setEditingState((prevEditingState) => ({
        ...prevEditingState,
        [poemId]: {
          editing: false,
          editedPoem: {
            title: "",
            content: "",
          },
        },
      }));
    } catch (error) {
      // Hiba esetén kezelés, pl. hibaüzenet megjelenítése
      console.error("Hiba történt a módosítás során:", error);
    }
  };

  const handleEditClick = (poemId, poem) => {
    // Az adott vers egyedi azonosítója alapján állítsuk be az editingState-et
    setEditingState((prevEditingState) => ({
      ...prevEditingState,
      [poemId]: {
        editing: true,
        editedPoem: {
          title: poem.title,
          content: poem.content,
        },
      },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const poemId = e.target.closest("li").dataset.poemid;

    setEditingState((prevEditingState) => ({
      ...prevEditingState,
      [poemId]: {
        ...prevEditingState[poemId],
        editedPoem: {
          ...prevEditingState[poemId]?.editedPoem,
          [name]: value,
        },
      },
    }));
  };

  const handleDeleteClickComment = async (commentId) => {
    try {
      // Az input mező értéke alapján állítsa be a poemId-t
      const commentIdToDelete = commentId;

      // Axios DELETE kérés küldése a megadott poemId-vel
      await axios.delete(
        `http://localhost:3000/comments/${commentIdToDelete}`,
        {
          withCredentials: true,
        }
      );

      // Sikeres törlés esetén további műveletek, pl. frissítés vagy visszajelzés
      console.log(`A komment (${commentIdToDelete}) sikeresen törölve!`);
      setCommentId(commentIdToDelete);
    } catch (error) {
      // Hiba esetén kezelés, pl. hibaüzenet megjelenítése
      console.error("Hiba történt a törlés során:", error);
    }
  };

  const handleEditClickComment = (commentId, comment) => {
    console.log(comment.commentText);
    setEditingStateComment((prevEditingStateComment) => ({
      ...prevEditingStateComment,
      [commentId]: {
        editing: true,
        editedComment: {
          commentText: comment.commentText,
        },
      },
    }));
  };

  const handleInputChangeComment = (e) => {
    const { name, value } = e.target;
    const commentId = e.target.closest("li").dataset.commentid;
    console.log(commentId)

    setEditingStateComment((prevEditingStateComment) => ({
      ...prevEditingStateComment,
      [commentId]: {
        ...prevEditingStateComment[commentId],
        editedComment: {
          ...prevEditingStateComment[commentId]?.editedComment,
          [name]: value,
        },
      },
    }));
  };

  const handleEditSubmitComment = async (commentId, event) => {
    event.preventDefault();

    try {
      const editedCommentData = editingStateComment[commentId]?.editedComment;

      if (!editedCommentData) {
        console.error("Nincs frissített vers adat.");
        return;
      }

      // Az editedPoem állapotot használhatod a frissített adatok elküldéséhez
      await axios.put(
        `http://localhost:3000/comments/${commentId}`,
        editedCommentData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Sikeres módosítás esetén további műveletek, pl. frissítés vagy visszajelzés
      console.log(`A költemény (${commentId}) sikeresen módosítva!`);

      // Frissítjük a state-et és leállítjuk a szerkesztés módot
      setEditingStateComment((prevEditingStateComment) => ({
        ...prevEditingStateComment,
        [commentId]: {
          editing: false,
          editedComment: {
            commentText: "",
          },
        },
      }));
    } catch (error) {
      // Hiba esetén kezelés, pl. hibaüzenet megjelenítése
      console.error("Hiba történt a módosítás során:", error);
    }
  };

  const handleAlbumDelete = (albumId) => {
    axios.delete(`http://localhost:3000/albums/delete-album/${albumId}`,{ withCredentials: true, })
    .then((response) => {
      if (response.status === 200) {
        // A törlés sikeres
        setAlbumDelete(albumId);
      } else {
        // A törlés sikertelen
        console.log('A törlés sikertelen!');
      }
    })
    .catch((error) => {
      // Hiba történt
      console.log(error);
    });
  }

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

  const handleBack = () => {
    setEditingState(false)
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Elkérjük a user ID-t a session-ből
        const userid = userId;

        // Ha nincs bejelentkezve a felhasználó, ne küldjük el a kérést
        if (!user || !user.username) {
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/users/${userid}`,
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching poems:", error.message);
      }
    };

    fetchUser();
  }, [poemId, editingState, commentId, editingStateComment, albumDelete]);

  return (
    user && (
      <div>
        {/* <!-- Felhasználói adatok --> */}

        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-header">
              <strong>{user.username}</strong>
            </div> 
            <div className="card-body">
              <p className="card-text">E-mail cím: {user.email}</p>
              <p className="card-text">Profil kép: {user.profileImgUrl}</p>
              <p className="card-text">Rang: {user.role}</p>
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
                                  <strong>{poem.author}</strong>
                                  <p>{poem.creationDate.split("T")[0]}</p>
                                </cite>
                              </footer>
                            </blockquote>

                            <div className="row">
                              {editingState[poem.id]?.editing ? (
                                <>
                                  <form onSubmit={(e) => handleEditSubmit(poem.id, e)}>
                                    <div className="form-group">
                                      <label htmlFor="title">Title:</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        name="title"
                                        value={editingState[poem.id]?.editedPoem.title || ""}
                                        onChange={handleInputChange}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="content">Content:</label>
                                      <textarea
                                        className="form-control"
                                        id="content"
                                        name="content"
                                        value={editingState[poem.id]?.editedPoem.content || ""}
                                        onChange={handleInputChange}
                                        style={{ height: "450px" }}
                                      />
                                    </div>
                                    <button type="submit" className="btn btn-primary mt-2 w-100">Szerkesztés</button>
                                    <button className="btn btn-primary mt-2 w-100" onClick={handleBack}>
                                    Vissza
                                  </button>
                                  </form>
                                </>
                                ) : (
                                  <div className="row">
                                    <div className="col-6 d-flex align-items-center justify-content-center">
                                      <form onSubmit={handleDelete}>
                                        <label>
                                          <input
                                            type="text"
                                            name="poemId"
                                            value={poem.id}
                                            style={{ display: "none" }}
                                            readOnly
                                          />
                                        </label>
                                        <button type="submit" className="btn btn-primary">
                                          Törlés
                                        </button>
                                      </form>
                                    </div>
                                    <div className="col-6 d-flex align-items-center justify-content-center">
                                      <button className="btn btn-primary" onClick={() => handleEditClick(poem.id, poem)}>
                                        Szerkesztés
                                      </button>
                                    </div>
                                  </div>
                              )}
                            </div>

                            <br />
                            <span><strong>Likeok: </strong> {poem.likes.length} db</span>
                            {/* <ul>
                              {poem.likes.map((like, index) => (
                                <li key={index}>{like.username}</li>
                              ))}
                            </ul> */}

                            <h5>Kommentek: </h5>
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
                                      <p className="card-text">
                                        {comment.commentText}
                                      </p>

                                      <div className="row">
                                        
                                          {(user.role === "admin" || user.username === comment.commenter) ? (
                                            <>
                                              <div className="col">
                                                {editingStateComment[comment.id]?.editing ? (
                                                <div>
                                                  <form onSubmit={(e) => handleEditSubmitComment(comment.id, e)}>
                                                    <div className="form-group">
                                                      <label htmlFor="commentText">Comment text:</label>
                                                      <input
                                                        type="text"
                                                        className="form-control"
                                                        id="commentText"
                                                        name="commentText"
                                                        value={editingStateComment[comment.id]?.editedComment.commentText || ""}
                                                        onChange={handleInputChangeComment}
                                                      />
                                                    </div>
                                                    <button type="submit" className="btn btn-primary">Komment mentése</button>
                                                  </form>
                                                </div>
                                              ) : (
                                                <div>
                                                  <button
                                                    className="btn btn-primary m-1"
                                                    onClick={() =>
                                                      handleEditClickComment(
                                                        comment.id,
                                                        comment
                                                      )
                                                    }
                                                  >
                                                    Szerkesztés
                                                  </button>
                                                </div>
                                              )}
                                              </div>
                                              <div className="col">
                                                <button
                                                  className="btn btn-primary m-1"
                                                  onClick={() =>
                                                    handleDeleteClickComment(comment.id)
                                                  }
                                                >
                                                  Törlés
                                                </button>
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                            </>
                                          )}
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
                    <p>Még nincsenek verseid feltöltve</p>
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
                            <div className="card">
                              <div className="card-header">
                                <strong>{smallAlbum.title}</strong>
                              </div>
                              <div className="card-body">
                                <p className="card-text">
                                  {smallAlbum.description}
                                </p>
                                <button onClick={() => handleAlbumDelete(smallAlbum.album_id)} className="btn btn-primary">Törlés</button>
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
                      <p>Még nincs albumod</p>
                    </>
                  )}
            </div>
          </div>
        </div>

        
      </div>
    )
  );
};

export default Profile;
