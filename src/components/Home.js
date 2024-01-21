import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

function Home() {
  return (
    <div className="container">
        <div className="card">
            <div className="card-header">
                <h2 className='text-center'>Bemutatkozás</h2>
            </div>
            <div className="card-body">
                <p className="card-text">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates ut, omnis tempora possimus accusamus aliquid nesciunt perspiciatis officia eius aliquam impedit quam hic error. Nemo maiores obcaecati odio quas ullam.
                </p>
            </div>
            <div className='card-footer'>
                <div className="d-flex justify-content-center">
                    <span className="d-flex align-items-center">
                        <a href="https://www.facebook.com/norberto.badzso1473/" target="_blank" rel="noopener noreferrer" className="m-2">
                        <FontAwesomeIcon icon={faFacebookF} size="2x" style={{ color: 'black' }} />
                        </a>
                        <p className="m-0">Ujj Norbert</p>
                    </span>

                    <span className="d-flex align-items-center">
                        <a href="https://www.instagram.com/ujj_norbert/" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center m-2">
                            <FontAwesomeIcon icon={faInstagram} size="2x" style={{ color: 'black' }} />
                        </a>
                        <p className="m-0">@ujj_norbert</p>
                    </span>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Home;
