# Quick Start Guide - Valentine Timeline

## First Time Setup

### 1. Database Setup (One-time)
```sql
-- Run this in Supabase SQL Editor
-- Copy from supabase-schema.sql and paste in Supabase
```

### 2. Security Question Setup
1. Go to http://localhost:3000/admin
2. Enter password: `Chandigarh`
3. Scroll to "Security Question Settings"
4. Update question and answer
5. Click "Update Security Question"

### 3. Add Your First Event
1. Still in admin dashboard
2. Click "Add New Event"
3. Fill in:
   - Title: e.g., "Our First Date"
   - Date: Select date
   - Description: Write the memory
   - Upload Photo: (Optional) Select image
4. Click "Save Event"
5. Verify it appears in the events list

## Daily Usage

### Guest/User View
```
http://localhost:3000
↓
Enter security answer
↓
http://localhost:3000/timeline (Beautiful timeline display)
```

### Admin View
```
http://localhost:3000/admin
↓
Enter admin password: Chandigarh
↓
http://localhost:3000/admin/dashboard (Full control panel)
```

## Admin Dashboard Features Quick Reference

| Feature | Location | Action |
|---------|----------|--------|
| Add Event | Top right button | Click "Add New Event" |
| Edit Event | Event card | Click "Edit" button |
| Delete Event | Event card | Click "Delete" button |
| Update Question | Bottom section | Edit & click "Update" |
| View Events | Middle section | Scroll through list |
| Logout | Top right | Click "Logout" button |

## API Endpoints Reference

### Public Endpoints
- `GET /api/events` - Fetch all events
- `GET /api/config/security-question` - Get security question
- `POST /api/auth/login` - Login with answer

### Admin Endpoints (Require admin_token cookie)
- `POST /api/events` - Create event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event
- `POST /api/config/security-question` - Update question
- `POST /api/upload` - Upload image

### Request Examples

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"answer":"Chandigarh"}'
```

#### Create Event
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "First Date",
    "date": "2020-02-14",
    "description": "The day we met",
    "image_url": null
  }'
```

#### Upload Image
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@path/to/image.jpg"
```

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
ADMIN_PASSWORD=Chandigarh
NEXTAUTH_SECRET=FZ6N/bOYAZS35o6UlXFZG7hgRgRfo+/nmA54HAK7l1c=
NEXTAUTH_URL=http://localhost:3000
```

## Components at a Glance

| Component | Location | Purpose |
|-----------|----------|---------|
| LoginForm | `/components/LoginForm.tsx` | Guest security question |
| AdminLoginForm | `/components/AdminLoginForm.tsx` | Admin password login |
| Timeline | `/components/Timeline.tsx` | Animated event display |
| AdminDashboard | `/components/AdminDashboard.tsx` | Full admin control |

## Database Tables

### auth_config
```
id (UUID)
security_question (TEXT)
security_answer (TEXT)
created_at (TIMESTAMP)
```

### timeline_events
```
id (UUID)
title (TEXT)
date (DATE)
description (TEXT)
image_url (TEXT, nullable)
order_index (INTEGER)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

## Styling
- Framework: **Tailwind CSS**
- Animations: **Framer Motion**
- Colors: Red/Pink theme for Valentine's
- Responsive: Mobile-first design

## Performance Tips

1. **Compress Images** before uploading (max 2-3MB)
2. **Optimize Photos** to ~500px width for web
3. **Limit Events** - Timeline works best with < 50 events
4. **Browser Caching** - Images cached on first load

## Common Tasks

### Change Admin Password
Update `ADMIN_PASSWORD` in `.env.local` and restart server

### Change Security Question
Admin Dashboard → Security Settings → Update → Save

### Add Multiple Events at Once
Use Admin Dashboard → Add New Event (repeat for each)

### Delete All Events
Admin Dashboard → Click Delete on each event

### Reset Everything
1. Delete all events in admin dashboard
2. Reset security question
3. Clear browser cookies
4. Logout and login again

## Keyboard Shortcuts
- None implemented yet (enhancement opportunity!)

## Mobile Experience
- Fully responsive design
- Touch-friendly buttons
- Optimized image sizes
- Single column timeline on mobile

## Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support  
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support (iOS Safari, Chrome Mobile)

---

**Questions?** Check [IMPLEMENTATION.md](IMPLEMENTATION.md) for detailed documentation.
