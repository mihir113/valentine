# Quick Setup Guide

## Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to initialize
3. Go to **SQL Editor** in the left sidebar
4. Click "New Query"
5. Copy the entire contents of `supabase-schema.sql` and paste it
6. Click "Run" to execute the SQL

## Step 2: Get Supabase Credentials

1. In Supabase, go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon public key** (long string starting with "eyJ...")

## Step 3: Environment Variables

1. Create `.env.local` file in the project root
2. Add these values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ADMIN_PASSWORD=YourSecurePasswordHere
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
```

## Step 4: Install and Run

```bash
npm install
npm run dev
```

## Step 5: First Time Setup

1. Open http://localhost:3000/admin
2. Login with your ADMIN_PASSWORD
3. Set up your security question and answer
4. Add your first timeline event!

## Common Issues

**Can't connect to Supabase:**
- Make sure you ran the SQL schema
- Check that your URL and key are correct in `.env.local`
- Restart the dev server after changing `.env.local`

**Images not uploading:**
- Verify the `timeline-images` storage bucket was created
- Check storage policies in Supabase

**Login not working:**
- Clear browser cookies
- Check that security question is set up in database

## Next Steps

Once the basic app is running, you can work with Claude Code to:
1. Implement the authentication logic
2. Build out the admin dashboard CRUD operations
3. Add animations to the timeline
4. Customize the design and colors
5. Add more features!

The README.md has a full TODO checklist of features to implement.
