# Learning Hub: Next.js, React, Stripe, Mux, Prisma, Tailwind, MySQL, ChatEngine, OpenAI

![Landign Page for Learning Hub](https://git.cs.usask.ca/neg208/learning-hub/-/blob/main/public/landing.png?raw=true)

This is a repository for Learning Hub Platform: Next.js, React, Stripe, Mux, Prisma, Tailwind, MySQL, ChatEngine, OpenAI

Key Features:

- Browse & Filter Courses
- Purchase Courses using Stripe
- Mark Chapters as Completed or Uncompleted
- Progress Calculation of each Course
- Student Dashboard
- Teacher mode
- Create new Courses
- Create new Chapters
- Easily reorder chapter position with drag n’ drop
- Upload thumbnails, attachments and videos using UploadThing
- Video processing using Mux
- HLS Video player using Mux
- Rich text editor for chapter description
- Authentication using Clerk
- ORM using Prisma
- MySQL database using Planetscale
- Quizzes generated using OpenAIApi
- Disscussion board using ChatEngine

### Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
git clone https://git.cs.usask.ca/neg208/learning-hub.git
```

### Install packages

```shell
npm install --legacy-peer-deps
```

### Setup .env file


```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=

DATABASE_URL=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=

API_URL='http://localhost:3000'
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_STREAM_KEY=
STREAM_SECRET=
OPENAI_API_KEY=

STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_TEACHER_ID=
```

### Setup Prisma

Add MySQL Database (I used PlanetScale)

```shell
npx prisma generate
npx prisma db push

```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |