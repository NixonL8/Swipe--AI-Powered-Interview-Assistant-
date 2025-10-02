import type { InterviewQuestion, QuestionDifficulty } from '@/types'
import { v4 as uuid } from 'uuid'

export const QUESTION_TIMINGS: Record<QuestionDifficulty, number> = {
  easy: 20_000,
  medium: 60_000,
  hard: 120_000,
}

const QUESTION_BANK: Record<QuestionDifficulty, Array<Omit<InterviewQuestion, 'id'>>> = {
  easy: [
    {
      prompt:
        'What is the difference between null and undefined in JavaScript?',
      difficulty: 'easy',
      expectedKeywords: ['null', 'undefined', 'type', 'value', 'undefined variable'],
    },
    {
      prompt: 'Explain how the virtual DOM works in React.',
      difficulty: 'easy',
      expectedKeywords: ['virtual DOM', 'diffing', 'render', 'ReactDOM', 'performance'],
    },
    {
      prompt:
        'What is the purpose of package-lock.json in Node.js?',
      difficulty: 'easy',
      expectedKeywords: ['dependencies', 'version locking', 'npm', 'package'],
    },
    {
      prompt: 'What are React props and how are they used?',
      difficulty: 'easy',
      expectedKeywords: ['props', 'component', 'data flow', 'immutable'],
    },
  ],
  medium: [
    {
      prompt:
        'How would you handle form validation in a React application?',
      difficulty: 'medium',
      expectedKeywords: ['form validation', 'state', 'libraries', 'Formik', 'Yup'],
    },
    {
      prompt:
        'Describe a caching strategy for improving API performance.',
      difficulty: 'medium',
      expectedKeywords: ['cache', 'memory', 'Redis', 'performance', 'expiry'],
    },
    {
      prompt:
        'How would you design error handling in a microservices architecture?',
      difficulty: 'medium',
      expectedKeywords: ['error handling', 'logging', 'retry', 'circuit breaker', 'monitoring'],
    },
    {
      prompt:
        'Explain the role of React Context API and when to use it.',
      difficulty: 'medium',
      expectedKeywords: ['Context API', 'state management', 'props drilling', 'provider', 'consumer'],
    },
  ],
  hard: [
    {
      prompt:
        'Design a scalable API rate limiting solution for a Node.js application.',
      difficulty: 'hard',
      expectedKeywords: ['rate limiting', 'Redis', 'tokens', 'scalability', 'API gateway'],
    },
    {
      prompt:
        'How would you implement server-side rendering (SSR) for a React application?',
      difficulty: 'hard',
      expectedKeywords: ['SSR', 'Next.js', 'performance', 'SEO', 'hydration'],
    },
    {
      prompt:
        'Describe how you would build a real-time chat application using Node.js and WebSockets.',
      difficulty: 'hard',
      expectedKeywords: ['WebSocket', 'socket.io', 'real-time', 'Node.js', 'scaling'],
    },
    {
      prompt:
        'Explain your approach to migrating a monolithic Node.js app to microservices.',
      difficulty: 'hard',
      expectedKeywords: ['microservices', 'monolith', 'docker', 'Kubernetes', 'scalability'],
    },
  ],
}

function pickRandom<T>(items: T[], count: number) {
  const copy = [...items]
  const selected: T[] = []
  while (selected.length < count && copy.length > 0) {
    const index = Math.floor(Math.random() * copy.length)
    selected.push(copy.splice(index, 1)[0]!)
  }
  return selected
}

export function getFallbackQuestions() {
  const easy = pickRandom(QUESTION_BANK.easy, 2)
  const medium = pickRandom(QUESTION_BANK.medium, 2)
  const hard = pickRandom(QUESTION_BANK.hard, 2)

  const combined = [...easy, ...medium, ...hard]
  return combined.map((question) => ({ ...question, id: uuid() }))
}
