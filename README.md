# Spott - AI-Powered Event Organizer Platform

![Spott Banner](https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000&auto=format&fit=crop)

Spott is a modern, full-stack event management platform that leverages AI to help organizers create compelling events and attendees find their next great experience. Built with performance and user experience in mind, it features real-time updates, secure ticketing, and a beautiful premium UI.

## 🚀 Features

- **authentication & User Profiles**: Secure login and account management powered by **Clerk**.
- **Real-time Database**: Instant data synchronization using **Convex**.
- **Event Management**: Create, update, and manage events with rich details.
- **AI-Powered**: Integrated **Google Gemini AI** for content generation and smart suggestions.
- **Ticketing System**:
  - Paid & Free events support.
  - Integration with **Stripe** for payments.
  - **QR Code Check-in** for seamless attendee entry.
- **Modern UI/UX**:
  - Fully responsive design.
  - Dark mode with glassmorphism effects.
  - Smooth animations using **Framer Motion**.
  - Components from **Shadcn UI**.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: [Convex](https://convex.dev/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI**: [Google Generative AI SDK](https://ai.google.dev/)
- **Payments**: [Stripe](https://stripe.com/)

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### 1. Clone the repository

```bash
git clone https://github.com/your-username/spott.git
cd spott
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following keys:

```env
# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=


# Google Gemini AI
GEMINI_API_KEY=

# App Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Run Development Server

You need to run both the Next.js app and the Convex backend.

```bash
# Terminal 1: Run Convex
npx convex dev

# Terminal 2: Run Next.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📂 Project Structure

```
spott/
├── app/                  # Next.js App Router pages
│   ├── (main)/           # Main application layout
│   ├── (public)/         # Public landing pages
│   └── layout.jsx        # Root layout
├── components/           # Reusable UI components
│   ├── ui/               # Shadcn UI primitives
│   └── ...               # Custom components (EventCard, Header, etc.)
├── convex/               # Convex backend functions (schema, api, etc.)
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
