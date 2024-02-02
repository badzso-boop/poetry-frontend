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
                    Ez az oldal azért jött létre, hogy összegyűjtsem a saját verseimet, és úgy gondoltam miért csak a saját verseim jelenjenek meg? Mi lenne, ha mások is meg tudnák osztani a verseiket a nagyvilággal. Ezért is jött létre ez az oldal.
                </p>
                <p className='card-text'>
                    Regisztráció után már lehet is verseket feltölteni, illetve azokat albumokba gyűjteni. Ezeket a Profilom menüpont alatt lehet menedzselni, illetve szerkeszteni is.
                </p>

                <h5>Ez az oldal fejlesztés alatt áll, lehetnek benne hibák illetve fognak még bővülni új funkciókkal is</h5>

                <br />

                <h2>Tervezett újítások</h2>
                <ul>
                    <li>Verseket szétválogatom követett alkotók közt és felfedezés közt</li>
                    <li>keresomotor - minden versnek es albumnak lesznek labeljei es ezekre majd lehet szurni/keresni</li>
                </ul>

                <h2>Elvégzett újítások</h2>
                <ul>
                    <li>verseknek labelek</li>
                    <li>verseknek lathatosag</li>
                    <li>kikapcsolhatoak a kommentek a verseknel</li>
                    <li>Tul sok a szoveg egyszerre, inkabb csak 4-8 sor megjelenitese majd egy gombbal tovabblepes</li>
                    <li>albumoknal csak a versek cime jelenik meg es azokra kattintva lehet elolvasni + vegigolvasas funkcio</li>
                    <li>profilba bio</li>
                </ul>

                <p className='card-text'>
                    Ha hibát észlelsz a lentebb található közösségi felületeken elérsz! :)
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
