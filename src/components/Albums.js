// src/components/Albums.js

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Albums = () => {
  const { albums } = useContext(AppContext);

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
      {albums && albums.length > 0 ? (
        <div>
        <h2 className="text-center">Albumok</h2>
        <ul className="list-unstyled">
          {albums.map((album, index) => (
            <li key={index}>
              <div className="card m-4">
                <div className="card-header">
                  <Link to={`/albums/${index}`}>
                    <strong>{album.title}</strong>
                  </Link>
                </div>
                <div className="card-body">
                  <p className="card-text">{album.description}</p>
                </div>
                <ul className="list-unstyled">
                  {album.poems.map((poem, index) => (
                    <li key={index} className="m-3">
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
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
      ) : (
        <p>az albumok meg toltenek</p>
      ) }
    </>
  );
};

export default Albums;
