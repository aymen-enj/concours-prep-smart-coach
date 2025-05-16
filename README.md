# Concours Prep Smart Coach

A modern web application built with React, TypeScript, and Supabase to help students prepare for competitive exams.

## 🚀 Features

- Modern UI built with Shadcn UI components
- Responsive design with Tailwind CSS
- Type-safe development with TypeScript
- Real-time data management with Supabase
- Form handling with React Hook Form and Zod validation
- State management with React Query
- Beautiful charts and data visualization with Recharts
- Smooth animations with Framer Motion

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI (Radix UI)
- **Form Handling:** React Hook Form + Zod
- **State Management:** React Query
- **Routing:** React Router DOM
- **Database:** Supabase
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Date Handling:** date-fns
- **Notifications:** Sonner

## 📦 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd concours-prep-smart-coach
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Development

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
# or
bun run build
```

To preview the production build:

```bash
npm run preview
# or
yarn preview
# or
bun run preview
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── integrations/  # Third-party service integrations
├── lib/          # Utility functions and configurations
├── models/       # TypeScript interfaces and types
├── pages/        # Page components
├── providers/    # Context providers
├── styles/       # Global styles and CSS
└── utils/        # Helper functions
```

## 🧪 Testing

The project uses ESLint for code quality and TypeScript for type checking.

To run linting:

```bash
npm run lint
# or
yarn lint
# or
bun run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [Supabase](https://supabase.com/) for the backend services
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
