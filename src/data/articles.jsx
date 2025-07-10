// src/data/articles.jsx

const mockArticles = [
  {
    id: 'tech-ai-efficiency',
    title: 'Penemuan Terbaru di Bidang AI Meningkatkan Efisiensi Industri',
    author: 'Dr. Sarah Teknologi',
    description: 'Sebuah terobosan baru dalam algoritma pembelajaran mesin menjanjikan peningkatan efisiensi yang signifikan di berbagai sektor industri.',
    url: 'https://example.com/ai-breakthrough-original',
    urlToImage: 'https://via.placeholder.com/600x400/007bff/ffffff?text=AI+Tech',
    image: 'https://via.placeholder.com/600x400/007bff/ffffff?text=AI+Tech',
    publishedAt: '2h ago',
    category: 'Science',
    source: {
      name: 'Tech Daily'
    },
    isBreaking: true,
    content: 'Para peneliti dari Universitas Teknologi Global telah mengumumkan pengembangan algoritma AI revolusioner yang mampu memproses data dengan kecepatan dan akurasi yang belum pernah ada sebelumnya. Algoritma ini, yang diberi nama "QuantumLearn," menggunakan pendekatan kuantum untuk optimasi, memungkinkan analisis kumpulan data yang sangat besar dalam waktu singkat. Ini berpotensi merevolusi industri manufaktur, keuangan, dan kesehatan, dengan memungkinkan pengambilan keputusan yang lebih cepat dan lebih tepat. Implementasi awal menunjukkan pengurangan biaya operasional hingga 30% pada beberapa simulasi. Selain itu, aspek etika dan keamanan data juga menjadi fokus utama dalam pengembangan QuantumLearn untuk memastikan penggunaan teknologi yang bertanggung jawab. Tim saat ini sedang mencari mitra industri untuk uji coba skala penuh.'
  },
  {
    id: 'europe-heatwave-extreme',
    title: 'Gelombang Panas Ekstrem Melanda Eropa, Waspada Dampak Iklim',
    author: 'Reporter Cuaca Global',
    description: 'Suhu di beberapa negara Eropa mencapai rekor tertinggi, memicu kekhawatiran serius tentang perubahan iklim dan dampaknya terhadap kesehatan publik.',
    url: 'https://example.com/europe-heatwave-original',
    urlToImage: 'https://via.placeholder.com/600x400/dc3545/ffffff?text=Heatwave',
    image: 'https://via.placeholder.com/600x400/dc3545/ffffff?text=Heatwave',
    publishedAt: '4h ago',
    category: 'Health',
    source: {
      name: 'Climate News'
    },
    isBreaking: false,
    content: 'Pihak berwenang di seluruh benua telah mengeluarkan peringatan dan langkah-langkah pencegahan, termasuk pembatasan penggunaan air dan pendirian pusat-pusat pendingin darurat. Gelombang panas ini telah menyebabkan peningkatan kasus stroke panas dan dehidrasi, serta memicu kebakaran hutan di beberapa wilayah. Para ilmuwan iklim menyerukan tindakan darurat global untuk mengatasi emisi gas rumah kaca, menunjukkan bahwa kejadian ekstrem seperti ini akan menjadi lebih sering dan intens di masa depan jika tidak ada intervensi signifikan. Masyarakat diimbau untuk tetap terhidrasi dan menghindari aktivitas luar ruangan selama jam-jam terpanas.'
  },
  {
    id: 'ev-innovation-long-range',
    title: 'Inovasi Mobil Listrik Terbaru Janjikan Jarak Tempuh Lebih Jauh',
    author: 'Otomotif News',
    description: 'Produsen mobil listrik terkemuka meluncurkan model baru dengan kapasitas baterai yang ditingkatkan, menawarkan jarak tempuh yang jauh lebih impresif dan waktu pengisian yang lebih singkat.',
    url: 'https://example.com/ev-innovation-original',
    urlToImage: 'https://via.placeholder.com/600x400/28a745/ffffff?text=EV+Innovation',
    image: 'https://via.placeholder.com/600x400/28a745/ffffff?text=EV+Innovation',
    publishedAt: '6h ago',
    category: 'Business',
    source: {
      name: 'Auto World'
    },
    isBreaking: false,
    content: 'Model terbaru ini tidak hanya menawarkan efisiensi energi yang lebih baik tetapi juga fitur-fitur pintar yang meningkatkan pengalaman berkendara, seperti sistem navigasi berbasis AI dan kemampuan pengisian daya dua arah. Baterai generasi baru menggunakan teknologi solid-state, yang tidak hanya lebih padat energi tetapi juga lebih aman dan tahan lama. Dengan jarak tempuh lebih dari 800 km dengan sekali pengisian penuh, kendaraan ini siap bersaing dengan mobil bertenaga bensin dan mempercepat adopsi kendaraan listrik secara global. Harga dan ketersediaan akan diumumkan pada kuartal keempat tahun ini.'
  },
  {
    id: 'football-team-qualifies',
    title: 'Tim Sepak Bola Nasional Lolos ke Babak Kualifikasi Berikutnya',
    author: 'Sport News Desk',
    description: 'Kemenangan dramatis di pertandingan terakhir memastikan tempat tim nasional di babak kualifikasi bergengsi untuk turnamen internasional yang akan datang.',
    url: 'https://example.com/football-qualification-original',
    urlToImage: 'https://via.placeholder.com/600x400/ffc107/333333?text=Football+Win',
    image: 'https://via.placeholder.com/600x400/ffc107/333333?text=Football+Win',
    publishedAt: '1d ago',
    category: 'Sports',
    source: {
      name: 'Sports Tribune'
    },
    isBreaking: false,
    content: 'Ribuan penggemar merayakan di jalanan setelah peluit akhir dibunyikan, menandai pencapaian penting bagi sepak bola nasional. Pelatih kepala memuji semangat juang tim dan dukungan tak henti-hentinya dari para suporter. Kemenangan ini datang setelah pertandingan yang penuh ketegangan, di mana gol penentu dicetak di menit-menit akhir babak kedua. Persiapan intensif akan segera dimulai untuk menghadapi lawan-lawan tangguh di babak kualifikasi berikutnya, dengan harapan besar untuk melaju ke putaran final turnamen.'
  },
  {
    id: 'digital-art-popularity',
    title: 'Seni Digital Semakin Populer di Pasar Global',
    author: 'Art & Culture Weekly',
    description: 'Tren seni digital terus menunjukkan pertumbuhan pesat, dengan semakin banyak seniman dan kolektor beralih ke platform digital dan NFT.',
    url: 'https://example.com/digital-art-original',
    urlToImage: 'https://via.placeholder.com/600x400/6f42c1/ffffff?text=Digital+Art',
    image: 'https://via.placeholder.com/600x400/6f42c1/ffffff?text=Digital+Art',
    publishedAt: '2d ago',
    category: 'Travel',
    source: {
      name: 'Culture Today'
    },
    isBreaking: false,
    content: 'NFT dan teknologi blockchain memainkan peran besar dalam popularitas ini, memungkinkan seniman untuk menjual karya mereka secara langsung, memastikan keaslian, dan melacak kepemilikan. Balai lelang seni ternama kini rutin menyelenggarakan lelang karya seni digital, dengan beberapa di antaranya mencapai harga fantastis. Fenomena ini telah membuka peluang baru bagi seniman untuk menjangkau audiens global dan bereksperimen dengan bentuk-bentuk ekspresi baru. Edukasi tentang seni digital dan pasar NFT juga semakin marak, menarik lebih banyak individu untuk terlibat dalam ekosistem yang berkembang pesat ini.'
  },
  {
    id: 'crypto-market-surge',
    title: 'Pasar Cryptocurrency Mengalami Lonjakan Signifikan',
    author: 'Financial Reporter',
    description: 'Bitcoin dan altcoin utama menunjukkan tren positif yang kuat, didorong oleh adopsi institusional dan regulasi yang lebih jelas.',
    url: 'https://example.com/crypto-surge-original',
    urlToImage: 'https://via.placeholder.com/600x400/ff6b35/ffffff?text=Crypto+Surge',
    image: 'https://via.placeholder.com/600x400/ff6b35/ffffff?text=Crypto+Surge',
    publishedAt: '3h ago',
    category: 'Business',
    source: {
      name: 'Finance Weekly'
    },
    isBreaking: false,
    content: 'Lonjakan ini didorong oleh berbagai faktor termasuk kejelasan regulasi dari beberapa negara besar dan adopsi yang semakin luas oleh institusi keuangan. Para analis memperkirakan tren positif ini akan berlanjut dalam jangka menengah, meskipun tetap mengingatkan investor untuk berhati-hati mengingat volatilitas yang tinggi di pasar cryptocurrency.'
  },
  {
    id: 'health-breakthrough',
    title: 'Terobosan Baru dalam Pengobatan Kanker Memberikan Harapan',
    author: 'Medical News',
    description: 'Penelitian terbaru menunjukkan efektivitas terapi gen dalam mengobati jenis kanker tertentu dengan tingkat keberhasilan yang menggembirakan.',
    url: 'https://example.com/cancer-breakthrough-original',
    urlToImage: 'https://via.placeholder.com/600x400/20c997/ffffff?text=Medical+Research',
    image: 'https://via.placeholder.com/600x400/20c997/ffffff?text=Medical+Research',
    publishedAt: '5h ago',
    category: 'Health',
    source: {
      name: 'Medical Journal'
    },
    isBreaking: false,
    content: 'Uji klinis fase III menunjukkan tingkat remisi yang sangat tinggi pada pasien dengan kanker stadium lanjut. Terapi ini menggunakan pendekatan inovatif yang memodifikasi sel-sel kekebalan tubuh untuk melawan sel kanker secara lebih efektif. Tim peneliti internasional optimis bahwa terapi ini dapat disetujui untuk penggunaan klinis dalam dua tahun ke depan.'
  },
  {
    id: 'political-summit',
    title: 'KTT Internasional Bahas Kerjasama Ekonomi Regional',
    author: 'Political Correspondent',
    description: 'Para pemimpin negara-negara Asia Tenggara berkumpul untuk membahas strategi kerjasama ekonomi dan perdagangan di era digital.',
    url: 'https://example.com/political-summit-original',
    urlToImage: 'https://via.placeholder.com/600x400/6610f2/ffffff?text=Political+Summit',
    image: 'https://via.placeholder.com/600x400/6610f2/ffffff?text=Political+Summit',
    publishedAt: '7h ago',
    category: 'Politics',
    source: {
      name: 'International News'
    },
    isBreaking: false,
    content: 'KTT ini menghasilkan kesepakatan penting mengenai standardisasi perdagangan digital dan kerjasama dalam pengembangan infrastruktur teknologi. Para pemimpin juga membahas strategi bersama untuk menghadapi tantangan ekonomi global dan memperkuat ketahanan supply chain regional.'
  }
];

export const getArticles = () => {
  return new Promise((resolve) => {
    // Simulasikan delay jaringan
    setTimeout(() => {
      resolve(mockArticles);
    }, 500); // Delay 500ms
  });
};

export const getArticleById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const article = mockArticles.find(article => article.id === id);
      if (article) {
        resolve(article);
      } else {
        reject(new Error('Article not found (mock data)'));
      }
    }, 300); // Delay 300ms
  });
};