import React from 'react';
import './Header.css';
import {Link} from 'react-router-dom';
function Header() {
    
    return (
        <div className="header">
            <Link to="/category" className="header__info">CATEGORY</Link>
            <Link to="/product" className="header__info">PRODUCT</Link>
            <div className="header__info">WELCOME USER</div>
        </div>
    )
}

export default Header
