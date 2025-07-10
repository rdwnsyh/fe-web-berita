import React, { useState } from "react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Home", slug: "" },
  { name: "Nasional", slug: "nasional" },
  { name: "Internasional", slug: "internasional" },
  { name: "Ekonomi", slug: "ekonomi" },
  { name: "Olahraga", slug: "olahraga" },
  { name: "Teknologi", slug: "teknologi" },
  { name: "Otomotif", slug: "otomotif" },
  { name: "Hiburan", slug: "hiburan" },
  { name: "Gaya Hidup", slug: "gaya-hidup" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center bg-black text-white px-4 md:px-6 h-14 font-sans relative">
      <div className="flex items-center">
        <Link to="/" className="mr-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6e/CNN_Indonesia_logo.png"
            alt="Logo"
            className="h-9"
          />
        </Link>
        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.slug ? `/category/${cat.slug}` : "/"}
              className="text-white text-base px-1 hover:text-red-600 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            to="/cnn-tv"
            className="flex items-center border border-red-600 rounded px-2 py-0.5 ml-2 text-white text-base"
          >
            <span className="w-2 h-2 bg-red-600 rounded-full inline-block mr-1" />{" "}
            CNN TV
          </Link>
        </div>
      </div>
      {/* Desktop right menu */}
      <div className="hidden md:flex items-center gap-4">
        <div className="cursor-pointer text-base mr-2 flex items-center">
          RAGAM <span className="text-xs ml-1">▼</span>
        </div>
        <button className="ml-2 flex items-center" aria-label="search">
          <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2">
            <circle cx="10" cy="10" r="7" />
            <line x1="15" y1="15" x2="20" y2="20" />
          </svg>
        </button>
        <button className="ml-2 flex items-center" aria-label="user">
          <svg width="28" height="28" fill="#aaa">
            <circle cx="14" cy="10" r="6" />
            <ellipse cx="14" cy="22" rx="8" ry="5" />
          </svg>
        </button>
      </div>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden flex items-center ml-2"
        onClick={() => setOpen(!open)}
        aria-label="menu"
      >
        <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2">
          <line x1="6" y1="9" x2="22" y2="9" />
          <line x1="6" y1="15" x2="22" y2="15" />
          <line x1="6" y1="21" x2="22" y2="21" />
        </svg>
      </button>
      {/* Mobile menu */}
      {open && (
        <div className="absolute top-14 left-0 w-full bg-black z-20 flex flex-col border-t border-gray-800 md:hidden animate-fadeIn">
          <div className="flex flex-col px-4 py-2">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.slug ? `/category/${cat.slug}` : "/"}
                className="py-2 text-white border-b border-gray-800 hover:text-red-600 transition-colors"
                onClick={() => setOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <Link
              to="/cnn-tv"
              className="flex items-center border border-red-600 rounded px-2 py-1 mt-2 text-white text-base w-max"
              onClick={() => setOpen(false)}
            >
              <span className="w-2 h-2 bg-red-600 rounded-full inline-block mr-1" />{" "}
              CNN TV
            </Link>
            <div className="flex items-center mt-4 gap-4">
              <div className="cursor-pointer text-base flex items-center">
                RAGAM <span className="text-xs ml-1">▼</span>
              </div>
              <button className="flex items-center" aria-label="search">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                >
                  <circle cx="10" cy="10" r="7" />
                  <line x1="15" y1="15" x2="20" y2="20" />
                </svg>
              </button>
              <button className="flex items-center" aria-label="user">
                <svg width="28" height="28" fill="#aaa">
                  <circle cx="14" cy="10" r="6" />
                  <ellipse cx="14" cy="22" rx="8" ry="5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
