# Little Learners

Little Learners is a toddler-first letter game for children aged 2-4. The app is intentionally simple: one start button, one big target letter, three large bubble choices, voice prompts, happy sounds, animated rewards, and no negative feedback.

## Features

- One-screen letter bubble game
- Very large toddler-friendly touch targets
- Cute mascot that reacts to success
- Voice instructions such as "Find B!"
- Encouraging voice rewards such as "Yay!" and "Great job!"
- Generated pop, clap, and soft retry sound effects through the Web Audio API
- Stars, confetti, and bounce animations for correct answers
- Gentle shake-only retry behavior for wrong answers
- Persisted earned stars
- Small hidden parent area with progress and reset
- Dark and light mode toggle with persisted preference
- Mobile/tablet-first layout
- Minimal App Router structure ready for Vercel

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hooks
- Web Speech API
- Web Audio API

## Project Structure

```text
app/          App Router pages and global styles
components/   Toy UI and game components
data/         Letter game data
utils/        Shared utilities and audio hooks
public/       Static visual assets
```

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Keep the default Next.js build settings.
4. Deploy.

Vercel will install dependencies and run the Next.js production build automatically.
