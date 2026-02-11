# Valentine Timeline Website 💕

A beautiful, personalized timeline website to share your love story with your spouse. Features a security question login and an admin dashboard to easily manage memories.

## Features

- **Custom Security Question Login**: Only your spouse can access using a personalized security question
- **Beautiful Timeline Display**: Vertical timeline with photos and stories
- **Admin Dashboard**: Easy-to-use interface to add, edit, and delete timeline events
- **Image Upload**: Upload and display photos with each memory
- **Responsive Design**: Looks great on mobile and desktop
- **Smooth Animations**: Elegant transitions using Framer Motion

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript**
- **Tailwind CSS** for styling
- **Supabase** for database and image storage
- **Framer Motion** for animations
- **bcryptjs** for password hashing

## Project Structure

```
valentine-timeline/
├── app/
│   ├── page.tsx              # Main login page (security question)
│   ├── timeline/
│   │   └── page.tsx          # Timeline display page
│   ├── admin/
│   │   ├── page.tsx          # Admin login
│   │   └── dashboard/
│   │       └── page.tsx      # Admin dashboard
│   └── api/                  # API routes (to be implemented)
├── components/
│   ├── LoginForm.tsx         # Security question login form
│   ├── Timeline.tsx          # Timeline display component
│   ├── AdminLoginForm.tsx    # Admin password login
│   └── AdminDashboard.tsx    # Admin management interface
├── lib/
│   └── supabase.ts           # Supabase client configuration
├── types/
│   └── index.ts              # TypeScript type definitions
└── public/                   # Static assets

```

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd valentine-timeline
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Run the SQL to create tables, policies, and storage bucket

### 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials:
   - Get URL and anon key from Supabase Dashboard > Settings > API
3. Set a secure admin password
4. Generate NEXTAUTH_SECRET: `openssl rand -base64 32`

```bash
cp .env.local.example .env.local
# Edit .env.local with your values
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Usage

### For Admin (You)

1. Go to `/admin`
2. Login with your admin password
3. Set up the security question and answer
4. Add timeline events with photos and descriptions
5. Reorder, edit, or delete events as needed

### For Your Spouse

1. Visit the homepage
2. Answer the security question
3. Browse through your beautiful love story timeline!

## Database Schema

### `auth_config` Table
- `id`: UUID (Primary Key)
- `security_question`: Text
- `security_answer`: Text (hashed)
- `created_at`: Timestamp

### `timeline_events` Table
- `id`: UUID (Primary Key)
- `title`: Text
- `date`: Date
- `description`: Text
- `image_url`: Text (nullable)
- `order_index`: Integer
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Storage Bucket
- `timeline-images`: Public bucket for event photos

## TODO (Implementation Checklist for Claude Code)

### Authentication & Security
- [ ] Implement API route for security question verification
- [ ] Implement API route for admin login
- [ ] Set up session management (cookies/JWT)
- [ ] Add middleware to protect `/timeline` and `/admin/dashboard` routes
- [ ] Hash security answer with bcryptjs before storing

### Admin Dashboard
- [ ] Implement Add Event functionality
  - [ ] Form validation
  - [ ] Image upload to Supabase Storage
  - [ ] Save event to database
- [ ] Implement Edit Event functionality
- [ ] Implement Delete Event functionality
- [ ] Implement drag-and-drop reordering
- [ ] Implement Security Question setup/update
- [ ] Add loading states and error handling

### Timeline Display
- [ ] Fetch events from Supabase
- [ ] Implement timeline layout (alternating left/right)
- [ ] Add Framer Motion animations
- [ ] Implement image lightbox/modal for full-size viewing
- [ ] Add date markers
- [ ] Optimize image loading with Next.js Image component
- [ ] Add mobile-responsive layout

### API Routes Needed
- [ ] `/api/auth/login` - Verify security question
- [ ] `/api/auth/admin-login` - Verify admin password
- [ ] `/api/auth/logout` - Clear session
- [ ] `/api/events` - GET all events
- [ ] `/api/events` - POST create event
- [ ] `/api/events/[id]` - PUT update event
- [ ] `/api/events/[id]` - DELETE event
- [ ] `/api/events/reorder` - POST update order
- [ ] `/api/config/security-question` - GET/POST security question
- [ ] `/api/upload` - POST image upload to Supabase

### Enhancements (Optional)
- [ ] Add music player with special song
- [ ] Add confetti or heart animations
- [ ] Add email notification when spouse views timeline
- [ ] Add "Add to Calendar" for future events
- [ ] Export timeline as PDF
- [ ] Add video support alongside images

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Important Notes

- Make sure to add your Supabase URL to Next.js image domains
- Set up proper RLS policies in production
- Use environment variables for all secrets
- Test thoroughly before sharing with your spouse!

## License

This is a personal project. Feel free to use it for your own romantic gestures! ❤️

---

Made with ❤️ for [Your Spouse's Name]
