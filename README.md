# Chromat

AI-powered browser agent built with Electron and React. Features multi-tab browsing with integrated AI chat powered by Google Gemini.

## Features

- 🌐 Multi-tab browser with full Chromium support
- 🤖 AI chat assistant (Gemini 2.5 Flash)
- 💬 Persistent chat history
- 🎨 Modern UI with Tailwind CSS
- ⚡ Built with Vite + React + Electron

## Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/Chromat.git
cd Chromat
```

2. Install dependencies:
```bash
cd FRONTEND
npm install
```

3. Configure API key:
```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your Gemini API key
# Get your key from: https://aistudio.google.com/app/apikey
```

4. Run the app:
```bash
npm run electron
```

## Project Structure

```
Chromat/
├── FRONTEND/
│   ├── electron/          # Electron main process
│   ├── src/
│   │   ├── components/    # React components
│   │   └── utils/         # Utilities (Gemini API)
│   └── package.json
└── BACKEND/               # Future automation backend
```

## Development

```bash
# Start dev server
npm run dev

# Run Electron app
npm run electron

# Build for production
npm run build
```

## Technologies

- **Frontend**: React 19, Vite, Tailwind CSS
- **Desktop**: Electron 39
- **AI**: Google Generative AI (Gemini 2.5 Flash)
- **Icons**: Lucide React

## License

MIT
