# V-Connect Frontend

This is the frontend application for V-Connect, a platform that connects volunteers with organizations and events, making it easier to contribute to causes they care about.

## Features

- Modern, responsive design with a mobile-first approach
- Smooth animations and transitions
- Fully interactive UI components
- Sections include:
  - Navigation bar
  - Hero section with a compelling quote
  - About section
  - How to use the app
  - Donations section
  - Testimonials
  - Footer

## Technologies Used

- React
- Vite
- Tailwind CSS
- Framer Motion for animations
- React Icons

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/Yrcd27/V-Connect-yRcd.git
   ```

2. Navigate to the frontend directory
   ```
   cd V-Connect-yRcd/frontend
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:

```
npm run build
```

This will generate a `dist` folder with all the optimized files.

## Project Structure

```
frontend/
├── public/
│   └── vconnect-logo.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   ├── sections/
│   │   ├── About.jsx
│   │   ├── Donations.jsx
│   │   ├── Hero.jsx
│   │   ├── HowToUse.jsx
│   │   └── Testimonials.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```
