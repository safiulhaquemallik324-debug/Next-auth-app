# NextAuth App

A modern, full-stack authentication system built with **Next.js** and **NextAuth.js**, featuring email/password login, Google OAuth, and Cloudinary-powered profile picture uploads — all wrapped in a clean, responsive dark-themed UI.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js-3ECF8E?style=flat&logo=auth0&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)

## ✨ Features

- 🔐 **Email & Password Authentication** — secure signup and login flow
- 🌐 **Google OAuth Login** — one-click sign-in via Google
- 🖼️ **Profile Picture Upload** — powered by Cloudinary for fast, optimized image hosting
- 📊 **Protected Dashboard** — user-only area with session-based route protection
- ✏️ **Editable Profile** — update name and profile picture after signup
- 📱 **Fully Responsive** — works smoothly across desktop, tablet, and mobile screens
- 🎨 **Modern Dark UI** — custom-designed gradient interface with Poppins typography

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js |
| Authentication | NextAuth.js |
| Image Hosting | Cloudinary |
| Styling | Custom CSS (responsive, dark theme) |
| Font | Poppins (via `next/font/google`) |

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/safiulhaquemallik324-debug/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the development server

```bash
npm run dev
```

Open [ to view the app.

## 📂 Pages

- `/login` — Sign in with email/password or Google
- `/register` — Create a new account
- `/dashboard` — Protected user dashboard
- `/edit-profile` — Update profile info and picture

## 📦 Deployment

This project is deployed on **Vercel**. To deploy your own instance:

1. Push your code to GitHub
2. Import the repo into [Vercel](https://vercel.com)
3. Add the environment variables listed above in the Vercel project settings
4. Deploy 🚀

> ⚠️ Remember to update `NEXTAUTH_URL` to your production URL after deployment.

## 🙏 Acknowledgements

This project was built as a learning exercise, combining concepts from YouTube tutorials with AI-assisted development to explore authentication flows, session management, and cloud image handling in a real-world Next.js app.

## 📄 License

This project is open source and available for learning purposes.
