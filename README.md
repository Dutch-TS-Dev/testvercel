This is a [Next.js](https://nextjs.org) sports app project with Firebase and NextAuth integration.

## Getting Started

First, set up your environment variables:

1. Copy `.env.local.example` to `.env.local`
2. Update the values in `.env.local` with your own configuration

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication

This app uses a dual-layer authentication approach:

1. **Firebase Authentication**: Handles user signup, email verification, and core authentication features
2. **NextAuth.js**: Provides JWT session management with long-term persistence (1 year)

### Key Authentication Features

- Email/password authentication with Firebase
- Email verification requirement
- Persistent sessions via JWT with 1-year validity
- Secure token storage in HTTP-only cookies
- Automatic login via JWT for returning users
- Password reset functionality

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
