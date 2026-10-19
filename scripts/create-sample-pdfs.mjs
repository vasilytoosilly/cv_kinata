import fs from 'fs';
import path from 'path';

function createSimplePdf(title, subtitle, contentLines) {
  const textStream = [
    'BT',
    '/F1 20 Tf',
    '50 750 Td',
    `(${title}) Tj`,
    '/F1 12 Tf',
    '0 -24 Td',
    `(${subtitle}) Tj`,
    '/F1 10 Tf',
    '0 -30 Td',
    ...contentLines.flatMap(line => [
      `(${line.replace(/[()\\]/g, '\\$&')}) Tj`,
      '0 -16 Td'
    ]),
    'ET'
  ].join('\n');

  const streamLength = Buffer.byteLength(textStream);

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${textStream}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000227 00000 n 
0000000300 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
370
%%EOF`;

  return pdf;
}

const outDir = path.resolve('public/cv');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const cgiLines = [
  'Full Name: Achmad Kendhikinata Kuswirawanto',
  'Location: Tandes, Surabaya | kendhikinata24@gmail.com | +62 858 5751 1756',
  'Focus: 3D Environment Design, Hard-Surface Modeling, Archviz',
  '',
  'EXPERIENCE:',
  'Freelance 3D Artist - Hard-Surface & Environment (2020 - Present)',
  '- 10+ international client projects completed.',
  '- Specialized in Blender, Substance 3D Painter, Maya, low-poly and stylized assets.',
  '',
  'EDUCATION & ACHIEVEMENTS:',
  '- SMKN 2 Surabaya - Jurusan Animasi (2022 - 2025)',
  '- Juara 1 Lomba 3D Modeling (SMKN 2 Surabaya)',
  '- Proyek Akhir: Short 3D Animated Film'
];

const marketingLines = [
  'Full Name: Achmad Kendhikinata Kuswirawanto',
  'Location: Tandes, Surabaya | kendhikinata24@gmail.com | +62 858 5751 1756',
  'Focus: Digital Marketing, Commercial Video Direction, Graphic Design',
  '',
  'EXPERIENCE:',
  'Digital Marketing & Videographer Intern - PT Wong Bejo Joyo (Mar - Dec 2024)',
  '- Created 30+ property promotional videos for Reels and TikTok.',
  '- Grew engagement rate by 45% and followers by 20%.',
  '- Managed Meta Business Suite campaigns, copywriting, and analytics.',
  '',
  'EDUCATION:',
  '- SMKN 2 Surabaya - Jurusan Animasi (2022 - 2025)',
  '- Khadijah 2 Primary School Cambridge CIE'
];

const generalistLines = [
  'Full Name: Achmad Kendhikinata Kuswirawanto (Kinata)',
  'Location: Tandes, Surabaya | kendhikinata24@gmail.com | +62 858 5751 1756',
  'Focus: CGI Generalist, Digital Designer & Creative Technologist',
  '',
  'CORE EXPERIENCES:',
  '- Freelance 3D Artist (10+ international commissions in Blender, Substance, Maya)',
  '- Digital Marketing & Videographer at PT Wong Bejo Joyo (30+ videos, +45% engagement)',
  '- Active Member: Blender Community (3D challenges) & Hidden Dev (Web UI/UX, JS)',
  '',
  'TECHNICAL TOOLKIT:',
  '- 3D/CGI: Blender, Maya, Substance Painter, Cycles, PBR, Archviz, Hard-Surface',
  '- Design: Photoshop, Premiere Pro, CapCut, Figma, Motion Graphics',
  '- Web: HTML5, CSS3, JavaScript, Responsive UI, Git'
];

fs.writeFileSync(path.join(outDir, 'Kendhikinata_CV_3D_Artist.pdf'), createSimplePdf('KENDHIKINATA - 3D ARTIST RESUME', 'CGI Specialist & 3D Environment Artist', cgiLines));
fs.writeFileSync(path.join(outDir, 'Kendhikinata_CV_Digital_Marketing.pdf'), createSimplePdf('KENDHIKINATA - DIGITAL MARKETING RESUME', 'Video Production & Digital Marketing Specialist', marketingLines));
fs.writeFileSync(path.join(outDir, 'Kendhikinata_CV_Generalist.pdf'), createSimplePdf('KENDHIKINATA - CREATIVE TECHNOLOGIST RESUME', 'CGI Generalist & Digital Designer', generalistLines));

console.log('Sample PDFs generated successfully!');
