import React from 'react';

function Header() {
  return (
    <header style={{
      backgroundColor: '#7209b7',
      color: '#fff',
      padding: '12px 16px',
      borderBottom: '2px solid #333',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '6px'
    }}>
      <img
        src="/logo.png" // pastikan ada di /public/logo.png
        alt="Logo"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          objectFit: 'cover'
        }}
      />
      <p style={{
        margin: 0,
        fontSize: '0.95rem',
        opacity: 0.85,
        fontWeight: 400
      }}>
        Menyajikan berita terkini dan trending
      </p>
    </header>
  );
}

export default Header;
