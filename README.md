<p align="center">
  <p align="center">
    <a href="https://www.youtube.com/@codingforinnovations" target="_blank">
      <img src=".github/static/logo.png" height="72" alt="Coding for Innovations Logo"/>    
    </a>
  </p>
  <p align="center">
    For Programmers, By Programmers.
  </p>
</p>

# Crocodile Kingdom: Word Association Game

A word association memory game built with the MERN stack and deployed on Vercel.

## 🎮 Game Rules

1. The game loads with a grid of 16 face-down cards.
2. Click on a card to flip it over, revealing an image and a word.
3. Click on a second card to flip it over.
4. When two cards are flipped, a modal appears with both images and a text box.
5. Enter a sentence that incorporates both words shown on the cards.
6. Click "Submit" to close the modal.
7. Successfully matched cards remain face-up.
8. Continue playing with the remaining face-down cards. See steps 2-7.
9. The game ends when all cards have been flipped over.

## 📚 Tech Stack:

- [Vercel](https://vercel.com/) - Frontend Cloud for deployment
- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Frontend build tool
- [Express](https://expressjs.com/) - Backend web framework
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vitest](https://vitest.dev/) - Testing framework

## 🧪 Testing

The project uses Vitest for both unit and integration testing:

### Unit Tests
- Test individual components (Card, Game)
- Test utility functions (loadCards, wordAssociation)
- Test context and hooks

### Integration Tests
- Test the complete game flow
- Verify card flipping functionality
- Test the word association modal
- Validate game state after interactions

To run tests:
```bash
cd client
npm test -- "TestName"       # Run a specific test
npm test                     # Run all tests
```

## 📁 Project structure:

```
$PROJECT_ROOT
│  
├── api/  # Express Backend
│  
├── client/  # React app
│   ├── src/
│   │   ├── components/  # UI components
│   │   │   ├── game/    # Game components
│   │   │   └── modals/  # Modal components
│   │   ├── context/     # React context
│   │   ├── hooks/       # Custom hooks
│   │   ├── utils/       # Utility functions
│   │   └── tests/       # Test files
│   │       ├── unit/    # Unit tests
│   │       └── integration/ # Integration tests
│
├── vercel.json # Vercel configuration
```

##  🏆 Getting Started: 

- Clone repository:

```bash
git clone https://github.com/your-username/crocodile-kingdom-mern.git
cd crocodile-kingdom-mern
```  

- Start Express Js:
```bash
cd api
npm i
npm run dev
```

- Start React app:

```bash
cd client
npm i
npm run dev
```

Open [localhost:8000/api/hello](http://localhost:8000/api/hello) in your browser for API!

Open [localhost:3000](http://localhost:3000) in your browser for client


## 🎫 LICENSE:

[MIT LICENSE](LICENSE)

<br />

<div align="center">
<i>Other places you can find us:</i><br>
<a href="https://www.youtube.com/@codingforinnovations" target="_blank"><img src="https://img.shields.io/badge/YouTube-%23E4405F.svg?&style=flat-square&logo=youtube&logoColor=white" alt="YouTube"></a>
</div>
