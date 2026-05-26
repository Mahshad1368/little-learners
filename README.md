# Little Learners

Little Learners is a modern educational web application for children aged 3-7. It helps early learners practice letters, shapes, colors, and basic vocabulary through bright visuals, friendly motion, audio prompts, rewards, and a simple parent dashboard.

## Features

- Interactive home page with animated learning paths
- Alphabet lesson with responsive cards, example words, picture placeholders, audio playback, and progress
- Shape lesson with animated circle, square, triangle, and rectangle cards
- Color lesson with pronunciation buttons and everyday examples
- Matching game with score tracking, restart flow, and reward popup
- Parent dashboard with lesson metrics, activity cards, and progress bars
- Dark and light mode toggle with persisted preference
- Mobile-first responsive layout for phones, tablets, and desktop
- Reusable components, typed mock data, and clean App Router structure

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hooks
- Web Speech API for simple audio prompts

## Project Structure

```text
app/          App Router pages and global styles
components/   Reusable UI and lesson components
data/         Mock learning data
types/        TypeScript interfaces
utils/        Shared utilities and hooks
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
