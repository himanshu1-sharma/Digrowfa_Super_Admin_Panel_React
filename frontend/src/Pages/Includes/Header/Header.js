import React, { useState } from 'react'
import './Header.css'
import logo from '../../../img/logo/logo.webp'
import { Link } from 'react-router-dom'

import LeftPanel from '../LeftPanel/LeftPanel'

const Header = () => {

    const [active, setActive] = useState(false);


    return (
        <>
            <div className=''>
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className='desktopHide'>
                                <div className='mobileNavigation'>
                                    <ul>
                                        <li>
                                            <Link to="/">
                                                <img src={logo} alt="logo" className='img-fluid' />
                                            </Link>
                                        </li>
                                        <li>
                                            <div className="menubar">
                                                <div className="mobile-menu" onClick={() => setActive(!active)}>
                                                    <div className={active ? 'menu_click active' : 'menu_click'}>
                                                        <div id="top"></div>
                                                        <div id="middle"></div>
                                                        <div id="bottom"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={active ? 'mobilePanel active' : 'mobilePanel'}>
                <LeftPanel />
            </div>
        </>
    )
}

export default Header