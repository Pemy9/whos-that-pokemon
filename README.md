# 🎮 Pokemon Quiz Game

A full-stack Pokemon quiz game built with React, TypeScript, GraphQL, and Apollo.

## 🌟 Features

- **Interactive Quiz Gameplay**: Guess Pokemon from silhouettes
- **Multiple Difficulty Levels**: Choose from different Pokemon generations
- **Hint System**: Get help with Pokemon types, first letters, and more
- **Score Tracking**: Compete for high scores with streak bonuses
- **Timer System**: Race against the clock for each question
- **Responsive Design**: Play on desktop and mobile devices

## 🏗️ Tech Stack

### Backend

- **Node.js** with **TypeScript**
- **Apollo Server** (GraphQL)
- **PokeAPI** integration
- File-based score storage (JSON)

### Frontend

- **React 19** with **TypeScript**
- **Apollo Client** (GraphQL)
- **React Router** for navigation
- **Vite** for build tooling

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pokemon-quiz-game
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=4000
API_MODE=real
# API_MODE=mockoon (for local testing)
# MOCKOON_API_URL=http://localhost:3001
```

Start the backend server:

```bash
npm run dev
```

The GraphQL server will be available at `http://localhost:4000/graphql`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

Start the frontend development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
pokemon-quiz-game/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration constants
│   │   ├── datasources/     # PokeAPI data source
│   │   ├── schema/          # GraphQL schema and resolvers
│   │   ├── services/        # Business logic (ScoreService)
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utilities (logger, errors)
│   │   └── index.ts         # Server entry point
│   ├── data/                # JSON file storage for scores
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── apollo/          # Apollo Client setup
│   │   ├── components/      # React components
│   │   ├── config/          # Frontend constants
│   │   ├── graphql/         # GraphQL queries & mutations
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript types
│   │   └── main.tsx         # App entry point
│   └── package.json
└── mocks/                    # Mockoon configuration
```

## 🎮 How to Play

1. **Start a New Game**: Choose your difficulty level (Generation I, I-III, or All)
2. **Guess the Pokemon**: Look at the silhouette and select the correct Pokemon name
3. **Use Hints**: If stuck, use hints to reveal Pokemon type or first letter
4. **Beat the Timer**: Answer before time runs out
5. **Build Streaks**: Correct answers in a row increase your score multiplier
6. **Submit Your Score**: Save your high score at the end

## 🔧 Available Scripts

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run dev:mock` - Start with Mockoon API mode
- `npm run build` - Build for production
- `npm start` - Start production server

### Frontend

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔑 Environment Variables

### Backend (.env)

| Variable          | Description                                 | Default                 |
| ----------------- | ------------------------------------------- | ----------------------- |
| `PORT`            | Server port                                 | `4000`                  |
| `API_MODE`        | API mode (`real` or `mockoon`)              | `real`                  |
| `MOCKOON_API_URL` | Mockoon server URL                          | `http://localhost:3001` |
| `NODE_ENV`        | Environment (`development` or `production`) | `development`           |

### Frontend (.env)

| Variable           | Description          | Default                         |
| ------------------ | -------------------- | ------------------------------- |
| `VITE_GRAPHQL_URL` | GraphQL API endpoint | `http://localhost:4000/graphql` |

## 🧪 Testing with Mockoon

For local development without hitting the real PokeAPI:

1. Install [Mockoon](https://mockoon.com/)
2. Import the configuration from `mocks/mockoon-config.json`
3. Start the mock server on port 3001
4. Set `API_MODE=mockoon` in backend `.env`
5. Restart the backend server

## 📊 GraphQL Schema

### Queries

```graphql
# Get a specific Pokemon
pokemon(id: Int, name: String): Pokemon

# Get a random Pokemon
randomPokemon(generationId: Int): Pokemon

# Get a list of Pokemon
pokemonList(limit: Int, offset: Int): [Pokemon!]!

# Get available generations
generations: [Generation!]!

# Get high scores
highScores(limit: Int): [UserScore!]!
```

### Mutations

```graphql
# Save a player's score
saveScore(name: String!, score: Int!): UserScore!
```

## 🎯 Key Improvements Implemented

✅ Removed security vulnerabilities (`rejectUnauthorized: false`)
✅ Added proper TypeScript types throughout
✅ Created centralized configuration constants
✅ Implemented custom error classes
✅ Added logging utility for better debugging
✅ Added React Error Boundary
✅ Optimized duplicate Pokemon prevention
✅ Enhanced input validation
✅ Improved code organization and structure

## 🚧 Future Enhancements

- [ ] Migrate from JSON to proper database (PostgreSQL/MongoDB)
- [ ] Add user authentication
- [ ] Implement caching for Pokemon data
- [ ] Add sound effects and animations
- [ ] Add multiplayer mode
- [ ] Create mobile app version
- [ ] Add comprehensive test suite
- [ ] Add Docker support
- [ ] Implement analytics and monitoring

## 📝 License

MIT

## 📧 Contact

For questions or feedback, please open an issue on GitHub.
