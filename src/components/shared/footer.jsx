import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFire, FaBookmark, FaCompass, FaUser } from 'react-icons/fa';
import '../../styles/Footer.css';


function Footer() {
    return (
        <nav className="bottom-nav">
            <div className="nav-content">
                <NavLink
                    to="/trending"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <FaFire className="nav-icon" />
                    <span>Trending</span>
                </NavLink>

                <NavLink
                    to="/bookmark"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <FaBookmark className="nav-icon" />
                    <span>Bookmark</span>
                </NavLink>

                <NavLink
                    to="/explore"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <FaCompass className="nav-icon" />
                    <span>Explore</span>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <FaUser className="nav-icon" />
                    <span>Profile</span>
                </NavLink>
            </div>
        </nav>
    );
}

export default Footer;
