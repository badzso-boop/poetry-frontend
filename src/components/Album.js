import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons';

const Poem = (() => {
    const { albumId } = useParams();
    const { albums } = useContext(AppContext);
    
    const album = albums[albumId]

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
        {albums && albums.length > 0 ? 
        (
            <>
                <Nav.Link as={Link} to="/albums">
                    <button className="btn btn-primary">
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                </Nav.Link>
                <ul className="list-unstyled">
                    <li>
                        <div className="card m-4">
                            <div className="card-header">
                                <strong>{album.title}</strong>
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
                </ul>
            </>
        )
        :(
            <p>az album még nem töltődött be</p>
        )}
        </>
      );
})

export default Poem;