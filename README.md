# Little Learners

Little Learners is a toddler-first interactive toy for children aged 2-4. It is designed to feel alive and tactile: children catch floating letters, tap moving animals, pop bubbles, feed a monster, fish for letters, and chase stars with voice prompts, happy sounds, and instant rewards.

## Features

- Parent onboarding asks for one or two short encouragement voice recordings
- Parent recordings are saved locally and played during reward moments
- Skip option uses built-in cheerful voice prompts and generated sound effects
- Simple home screen with three giant toy buttons: Letters, Animals, and Mini Games
- Floating letter catch mode with water-like drifting motion
- Moving animal mode with animal sounds
- Mini games: Bubble Pop, Feed Monster, Fishing Letters, and Catch the Star
- Very large toddler-friendly touch targets
- Cute mascot prompts and happy reactions
- Voice instructions such as "Catch B!" and "Find the Lion!"
- Encouraging voice rewards such as "Yay!" and "Awesome!"
- Generated pop, clap, crowd-cheer, sparkle, and wrong-buzzer effects through the Web Audio API
- Big reward burst with stars, flowers, hearts, confetti, mascot jumps, and earned stars
- Correct targets pulse, brighten, and glow softly so toddlers can find them quickly
- Wrong choices turn red briefly, wobble gently, and never reduce score
- Persisted earned stars
- Small hidden parent area with mute, progress, reset, and recording setup access
- Touch-safe UX with disabled double-tap zoom, no text selection, and tap handlers only on interactive objects
- Dark and light mode toggle with persisted preference
- Mobile/tablet-first layout
- Minimal App Router structure ready for Vercel

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hooks
- MediaRecorder API
- Web Speech API
- Web Audio API

## Parent Voice Recording

On first launch, parents see a simple setup screen with two recording slots. They can record, stop, preview, continue, or skip. Clips are stored locally in the browser and randomly played when the child answers correctly. If recordings are skipped or unavailable, the app uses built-in happy voice prompts.

## Reward System

Correct answers trigger a joyful multi-sensory moment: claps, cheer tones, sparkles, parent voice or fallback encouragement, confetti, flowers, hearts, mascot animation, a happy bounce on the selected item, and a saved star. Wrong taps only affect the tapped item with a short red wobble and a soft buzzer.

## Touch-Safe UX

The app is designed for repeated toddler taps. It uses `touch-action: manipulation`, disables selection and tap highlight, avoids click handlers on large parent containers, and keeps interactions on letters, animals, buttons, bubbles, food, fish, and stars only.

## Project Structure

```text
app/          App Router pages and global styles
components/   Toy UI and interactive game components
data/         Letter, animal, and mini-game data
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
