# 🎓 Concours Prep Smart Coach

A modern, responsive web application built with React, TypeScript, and Supabase to help students efficiently prepare for competitive exams.

---

## 🚀 Features

- ✨ Beautiful UI with [Shadcn UI](https://ui.shadcn.com/)
- 🎯 Type-safe development using TypeScript
- 📱 Fully responsive design via Tailwind CSS
- 📡 Real-time data sync powered by Supabase
- ✅ Form validation using React Hook Form + Zod
- ⚛️ State management with React Query
- 📊 Data visualization using Recharts
- 🎞️ Smooth animations via Framer Motion

---

## 🛠️ Tech Stack

| Category           | Tech                                               |
|--------------------|----------------------------------------------------|
| Frontend Framework | [React 18](https://react.dev)                      |
| Language           | [TypeScript](https://www.typescriptlang.org/)     |
| Build Tool         | [Vite](https://vitejs.dev)                         |
| Styling            | [Tailwind CSS](https://tailwindcss.com)           |
| UI Components      | [Shadcn UI (Radix)](https://ui.shadcn.com)        |
| Forms              | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev) |
| State Management   | [React Query](https://tanstack.com/query)         |
| Routing            | [React Router DOM](https://reactrouter.com/)      |
| Database           | [Supabase](https://supabase.com/)                 |
| Charts             | [Recharts](https://recharts.org/)                 |
| Animations         | [Framer Motion](https://www.framer.com/motion/)   |
| Dates              | [date-fns](https://date-fns.org/)                 |
| Notifications      | [Sonner](https://sonner.emilkowal.dev)            |

---

## ⚙️ Requirements  
- Node.js >= 18  
- Git  
- Supabase account (free tier is fine)  
- (Optional) Netlify account for production deployment  

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/concours-prep-smart-coach.git
cd concours-prep-smart-coach

```

### 2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

###  3. Set up environment variables:
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Configure Supabase  
1. Sign in to [Supabase](https://supabase.com/) and create a new project.  
2. Copy the `Project URL` and `Anon public key` and place them in your `.env` file above.  
3. Under **Authentication → Providers**, enable **Google** and add the following redirect URLs:  
   - `http://localhost:5173/auth/callback` (development)  
   - `https://<your-netlify-site>.netlify.app/auth/callback` (production)  
4. Under **Authentication → URL Configuration**, set “Site URL” to `http://localhost:5173` and add your Netlify site URL to “Additional Redirect URLs”.  
5. (Optional) Run database migrations or execute the SQL in `supabase/migrations` to create the required tables.<br/>

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

## 🌍 Deployment (Netlify)  
1. Push your code to GitHub (or GitLab).  
2. In Netlify, click **Add new site → Import from Git** and select the repository.  
3. In **Build settings** set  
   - **Build command**: `npm run build`  
   - **Publish directory**: `dist`  
4. Add environment variables:  
   - `VITE_SUPABASE_URL`  
   - `VITE_SUPABASE_ANON_KEY`  
5. Click **Deploy site**.  
6. Netlify will provide a live URL (e.g. `https://<site>.netlify.app`). Add this URL to your Supabase redirect URLs as described above.  
7. Client-side routes (including `/auth/callback`) are automatically redirected to `index.html` thanks to the included `netlify.toml`.

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

This project is dual-licensed:

1. **GNU Affero General Public License v3.0 (AGPL-3.0)** – see [LICENSE](cci:7://file:///c:/Users/aymen/concours-prep-smart-coach/LICENSE:0:0-0:0).  
2. **Commercial License** – see [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md).

You may choose either set of terms.


## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [Supabase](https://supabase.com/) for the backend services
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
