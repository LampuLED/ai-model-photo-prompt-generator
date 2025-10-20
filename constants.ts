export const MODEL_NAME = "gemini-2.5-flash";
export const IMAGE_MODEL_NAME = "gemini-2.5-flash-image";

export const promptOptions: { [key: string]: string[] } = {
  'Jenis Kelamin (Analisis)': [
    'Jenis Kelamin (Analisis)','Tidak Spesifik', 'Pria Tampan', 'Wanita Anggun', 'Non-biner Elegan', 'Robot Android'
  ],
  'Ekspresi Wajah (Analisis)': [
    'Ekspresi Wajah (Analisis)','Netral', 'Senyum Bahagia', 'Serius dan Tajam', 'Sedih Merenung', 'Marah Intens', 'Tertawa Lepas'
  ],
  'Tipe Bidikan (Analisis)': [
    'Tipe Bidikan (Analisis)','Close-up (Wajah & Bahu)', 'Medium Shot (Pinggang ke Atas)', 'Full Body Shot (Seluruh Tubuh)', 'Extreme Close-up (Hanya Mata)', 'Wide Shot (Karakter & Lingkungan)'
  ],
  'Sudut Kamera (Analisis)': [
    'Sudut Kamera (Analisis)','Eye Level (Setinggi Mata)', 'High Angle (Dari Atas)', 'Low Angle (Dari Bawah)', 'Dutch Angle (Miring)', 'Over-the-Shoulder',
    'Low Angle (Sudut Rendah, Kuat)', 'High Angle (Sudut Tinggi, Kecil/Rapuh)', 'Eye Level (Setingkat Mata, Netral)', 'Dutch Angle (Miring, Tegang)', 'Overhead Shot (Dari Atas)'
  ],
  'Pose Karakter': [
    'Pose Karakter','Berdiri Tegak', 'Duduk Santai', 'Berlari Dinamis', 'Melompat di Udara',
    'Bersandar ke Dinding', 'Close-up Wajah',
    'Street Style Kasual (Gaya Jalanan)', 'High Fashion Runway (Gaya Catwalk)', 
    'Contrapposto Klasik', 'Hands-on-Hips (Tangan di Pinggul)', 
    'Look-Away (Melihat ke Samping)', 'Dynamic Motion Blur'
  ],
  'Latar Belakang / Loka': [
    'Latar Belakang / Loka','Studio Putih Bersih', 'Hutan Fantasi', 'Kota Malam Futuristik', 'Pantai Saat Senja', 'Ruangan Antik Victoria', 'Galaksi Bima Sakti'
  ],
  'Gaya Seni': [
    'Gaya Seni','Fotorealistik', 'Digital Painting (Gaya Artstation)', 'Anime/Manga', 'Pixel Art Retro', 'Sketsa Pensil', 'Gaya Lukisan Cat Minyak'
  ],
  'Pencahayaan': [
    'Pencahayaan','Cahaya Alami Siang Hari', 'Neon Biru & Purplu', 'Cahaya Sisi Keras (Rembrandt)', 'Cahaya Emas Senja', 'Cahaya Volumetrik (God Rays)', 'Siluet Dramatis'
  ],
  'Tone Warna': [
    'Tone Warna','Vibrant dan Jenuh', 'Monokrom Hitam Putih', 'Warna Pastel Lembut', 'Skema Warna Analogus', 'Warna Kontras Tinggi', 'Warna Bumi Alami',
    'Warm Tone (Nada Hangat)', 'Cold Tone (Nada Dingin)'
  ]
};

export const topDropdowns = ['Jenis Kelamin (Analisis)', 'Ekspresi Wajah (Analisis)', 'Tipe Bidikan (Analisis)', 'Sudut Kamera (Analisis)'];
export const middleDropdowns = ['Pose Karakter', 'Latar Belakang / Loka', 'Gaya Seni', 'Pencahayaan'];
export const bottomDropdown = 'Tone Warna';