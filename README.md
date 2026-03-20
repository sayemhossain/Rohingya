# Rohingya in Bangladesh

A humanitarian response website for the Rohingya refugee crisis in Bangladesh. Built with Next.js 14, featuring a public-facing site and a full admin dashboard for content management.

## Tech Stack

- **Next.js 14** (App Router) — Full-stack React framework
- **Tailwind CSS** + **shadcn/ui** — Modern styling and UI components
- **MongoDB Atlas** — Database (Mongoose ODM)
- **NextAuth.js** — Admin authentication (Credentials + JWT)
- **Cloudinary** — Image upload, optimization, and CDN

## Features

### Public Website
- Homepage with hero slider, animated stats, sector cards, news, impact stories
- About page with mission, crisis timeline, team, and values
- Crisis Overview with detailed statistics and sector needs
- 8 Sector pages with programs, stats, and achievements
- News & Stories with article detail pages
- Resources & Reports with downloadable documents
- Photo Gallery with lightbox and category filters
- Get Involved page (donate, volunteer, careers, partnerships)
- Contact page with form submission

### Admin Dashboard (`/admin`)
- Role-based access (Superadmin / Admin)
- Dashboard with overview stats and recent activity
- News management (create, edit, delete articles)
- Sectors management (stats, programs, achievements)
- Resources management (reports, documents)
- Gallery management (photo upload via Cloudinary)
- Team member management
- Contact message inbox (read/unread, delete)
- Site settings (menu order, hero slides, stats, partners)
- User management (Superadmin only)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

### 1. Clone and Install

```bash
git clone <repo-url>
cd rohingya-in-bangladesh
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/rohingya-db?retryWrites=true&w=majority

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# NextAuth
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:3000

# Superadmin (used by seed script)
SUPERADMIN_EMAIL=admin@example.com
SUPERADMIN_PASSWORD=your-secure-password
```

### 3. Seed the Database

Start the dev server, then visit the seed endpoint:

```bash
npm run dev
```

Open **http://localhost:3000/api/seed** in your browser. This creates:
- Superadmin account
- Default site settings (menu, hero slides, stats, partners)
- 8 sectors with full data

### 4. Access the Admin Panel

Go to **http://localhost:3000/admin/login** and sign in with your superadmin credentials.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/              # Pages and API routes
│   ├── admin/        # Admin dashboard pages
│   └── api/          # REST API endpoints
├── components/       # React components
│   ├── layout/       # Navbar, Footer, PublicShell
│   ├── home/         # Homepage sections
│   └── ui/           # shadcn/ui components
├── models/           # Mongoose models (8 models)
├── lib/              # Utilities (MongoDB, Auth, Cloudinary)
└── types/            # TypeScript type extensions
```

## Deployment

Deploy to Vercel:

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables (update `NEXTAUTH_URL` to your production URL)
4. Deploy

## License

This project is for humanitarian purposes.
