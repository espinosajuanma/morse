# Morse Code Learner

An interactive, level-based web application to learn and practice Morse code. Developed with React and Vite.

Live at: [morse.com.ar](https://morse.com/ar)

## Features

- **Level-Based Learning:** Step-by-step cumulative levels to learn receiving
  Morse code. Starts with basic letters (E, T) and progressively introduces
  more.
- **Transmission Practice:** A dedicated sandbox area to practice tapping dots
  and dashes, translating your input into Latin characters in real-time.
- **Optimized Audio Synthesis:** Uses the Web Audio API with smoothed envelopes
  and standardized WPM (Words Per Minute) timing to prevent ear fatigue and
  provide a realistic radio feel.
- **PWA Ready:** Installable on mobile devices (iOS/Android) and desktop
  directly from the browser for a standalone, full-screen experience.
- **Responsive Design:** A pale, retro-manual aesthetic that scales perfectly
  across devices.

## Tech Stack

- **Framework:** React
- **Build Tool:** Vite
- **PWA:** `vite-plugin-pwa`
- **Styling:** Vanilla CSS with custom properties

## Getting Started

To run this project locally, make sure you have Node.js installed.

1. **Clone the repository:**

```bash
git clone https://github.com/espinosajuanma/morse
cd morse
```

2. **Install dependencies:**

```bash
npm install
```

3. **Run the development server:**

```bash
npm run dev
```

This will start the Vite development server. Open `http://localhost:5173` in
your browser to view the app.

## Build for Production

To build the app for production, run:

```bash
npm run build
```

This will generate a `dist` folder with the optimized static files, ready to be
deployed.

## Contact

Developed by Juanma Espinosa

- Email: hola@juanma.ar
- LinkedIn: [/in/espinosajuanma](https://linkedin.com/in/espinosajuanma)

