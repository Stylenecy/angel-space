/**
 * Portfolio Data — Data-Driven approach.
 * Edit this file to update profile info, skills, projects, and links.
 */

export const profile = {
  fullName: 'Martha Angelina Gunawan',
  shortName: 'Angel',
  title: 'Creative Designer & Digital Artist',
  tagline: 'Crafting digital experiences where luxury meets warmth.',
  about: `I believe great design isn't just about how things look — it's about how they make you feel. My work sits at the intersection of aesthetics and purpose, where every pixel has intention and every animation tells a story.

With a deep love for visual storytelling, I create designs that speak to the heart while staying grounded in functionality.`,
  email: 'hello@angel.design',
  socials: {
    instagram: 'https://instagram.com/',
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/in/',
    dribbble: 'https://dribbble.com/',
  },
};

export const skills = [
  { name: 'UI/UX Design', level: 90, category: 'design' },
  { name: 'Brand Identity', level: 85, category: 'design' },
  { name: 'Web Design', level: 88, category: 'design' },
  { name: 'Figma', level: 92, category: 'tools' },
  { name: 'Adobe Photoshop', level: 80, category: 'tools' },
  { name: 'Adobe Illustrator', level: 78, category: 'tools' },
  { name: 'HTML / CSS', level: 85, category: 'development' },
  { name: 'React / JavaScript', level: 70, category: 'development' },
  { name: 'Motion Design', level: 75, category: 'development' },
];

export const projects = [
  {
    id: 1,
    title: 'Project Aurora',
    category: 'Brand Identity',
    description: 'A complete brand overhaul focusing on luxury aesthetics with modern minimalism.',
    image: '/assets/images/20260221_163815(0) (1)(1).jpg',
    gradient: 'linear-gradient(135deg, #1a0b2e 0%, #0044ff 100%)',
  },
  {
    id: 2,
    title: 'Velvet UI',
    category: 'App Design',
    description: 'Mobile-first design system with glassmorphism and smooth micro-interactions.',
    image: '/assets/images/IMG-20260221-WA0091.jpg',
    gradient: 'linear-gradient(135deg, #2e0b0b 0%, #800020 100%)',
  },
  {
    id: 3,
    title: 'Noir Campaign',
    category: 'Digital Art',
    description: 'A series of cinematic visuals blending dark elegance with emotional depth.',
    image: '/assets/images/20260319_175504.jpg',
    gradient: 'linear-gradient(135deg, #0b1a2e 0%, #000000 100%)',
  },
  {
    id: 4,
    title: 'Golden Hour',
    category: 'Web Design',
    description: 'Responsive landing page with warm gradients and immersive storytelling.',
    image: '/assets/images/20260221_210200.jpg',
    gradient: 'linear-gradient(135deg, #2e1f0b 0%, #d4a853 100%)',
  },
  {
    id: 5,
    title: 'Midnight Bloom',
    category: 'Brand Identity',
    description: 'Personal brand concept inspired by night sky and quiet beauty.',
    image: '/assets/images/IMG-20260221-WA0099.jpg',
    gradient: 'linear-gradient(135deg, #0a0e27 0%, #7b5ea7 100%)',
  },
  {
    id: 6,
    title: 'Pixel Dreams',
    category: 'Digital Art',
    description: 'Exploration of pixel art meets modern design — a love letter to retro aesthetics.',
    image: '/assets/images/20260222_131802.jpg',
    gradient: 'linear-gradient(135deg, #0b2e1a 0%, #38b764 100%)',
  },
];

export const categories = ['All', 'Brand Identity', 'App Design', 'Web Design', 'Digital Art'];
