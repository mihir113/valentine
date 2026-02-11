# Troubleshooting & FAQ

## 🆘 Common Issues & Solutions

### ❌ Issue: "Cannot find module '@/lib/supabase'"

**Cause**: Missing or misconfigured Supabase client

**Solution**:
1. Verify `lib/supabase.ts` exists
2. Check file has:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```
3. Restart dev server: `npm run dev`

---

### ❌ Issue: Login page shows "Unable to verify security question"

**Cause**: Security question not set in database

**Solution**:
1. Check Supabase dashboard
2. Go to SQL Editor
3. Run:
```sql
INSERT INTO "public"."auth_config" 
("security_question", "security_answer") 
VALUES ('Where did we meet?', 'Chandigarh');
```
4. Refresh login page and try again

---

### ❌ Issue: Admin dashboard shows "Unauthorized" error

**Cause**: Admin session cookie not set or expired

**Solution**:
1. Clear browser cookies (Settings → Privacy → Clear cookies for localhost)
2. Go to http://localhost:3000/admin
3. Login again with password: `Chandigarh`
4. If still fails, check .env.local for ADMIN_PASSWORD

---

### ❌ Issue: "Images not uploading" or "Upload failed"

**Cause**: Storage bucket missing or not public

**Solution**:
1. Go to Supabase Dashboard
2. Click Storage in left sidebar
3. Look for "timeline-images" bucket
4. If missing, run this SQL:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('timeline-images', 'timeline-images', true)
ON CONFLICT (id) DO NOTHING;
```
5. Check bucket is marked as public
6. Restart dev server

---

### ❌ Issue: "Cannot read property 'getPublicUrl' of undefined"

**Cause**: Supabase storage not properly initialized

**Solution**:
1. Verify storage bucket exists
2. Check Supabase API keys in .env.local
3. Clear browser cache and rebuild:
```bash
rm -rf .next
npm run dev
```

---

### ❌ Issue: "Events not showing on timeline"

**Cause**: Events not in database or API returning empty

**Solution**:
1. Check Supabase dashboard for `timeline_events` table
2. Verify events exist in the table:
```sql
SELECT * FROM timeline_events;
```
3. If table empty, add event from admin dashboard
4. If no events appear, check browser console (F12) for API errors
5. Verify `/api/events` endpoint returns data

---

### ❌ Issue: "Middleware not protecting routes"

**Cause**: Middleware.ts not created or misconfigured

**Solution**:
1. Check `middleware.ts` exists in project root
2. Should have this config:
```typescript
export const config = {
  matcher: ['/timeline/:path*', '/admin/dashboard/:path*'],
};
```
3. Restart dev server
4. Clear cookies and test accessing /timeline without login

---

### ❌ Issue: "Form data not saving"

**Cause**: Form submission not completing

**Solution**:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try submitting form
4. Check if request appears in Network tab
5. Look for errors in response
6. If POST returns 401, admin session expired - login again
7. If 500 error, check API route for syntax errors

---

### ❌ Issue: "Animations not working"

**Cause**: Framer Motion not loaded or CSS conflicts

**Solution**:
1. Verify npm install completed: `npm ls framer-motion`
2. Check component imports: `import { motion } from 'framer-motion'`
3. Clear browser cache: Ctrl+Shift+Delete
4. Rebuild: `npm run dev`
5. Check if CSS is conflicting (disable Tailwind plugins)

---

### ❌ Issue: "Styled form buttons not working"

**Cause**: Tailwind CSS not properly configured

**Solution**:
1. Check `tailwind.config.ts` exists
2. Verify content paths:
```typescript
content: [
  './app/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
]
```
3. Restart dev server
4. Clear cache: `rm -rf .next && npm run dev`

---

### ❌ Issue: "Cookies not persisting between sessions"

**Cause**: Cookie settings incorrect

**Solution**:
1. Cookies set with:
   - `httpOnly: true` (not accessible via JS)
   - `sameSite: 'lax'` (CSRF protection)
   - `maxAge: 7 days` (or 24 hours for admin)

2. Test cookie persistence:
   - DevTools → Application → Cookies
   - Should see `user_token` or `admin_token`

3. If missing:
   - Clear all cookies
   - Login again
   - Check they appear
   - Close tab and reopen - should still be there

---

### ❌ Issue: "Security question not updating"

**Cause**: Admin session not valid

**Solution**:
1. Logout from admin dashboard
2. Login again with password
3. Try updating security question again
4. If still fails, check admin_token cookie exists:
   - DevTools → Application → Cookies
   - Should see `admin_token`

---

## ❓ Frequently Asked Questions

### Q: How do I change the admin password?
**A**: Edit `.env.local` file:
```
ADMIN_PASSWORD=your-new-password
```
Restart dev server: `npm run dev`

---

### Q: Can I have multiple admin users?
**A**: Not in current implementation. To add:
1. Create `admin_users` table
2. Modify `/api/admin/login` to query table
3. Compare password with hashed value

---

### Q: How do I backup my timeline data?
**A**: 
1. Go to Supabase dashboard
2. SQL Editor → Create backup query
3. Or export via CSV in Table Editor
4. Or configure automated backups in Supabase

---

### Q: Can guests edit or delete events?
**A**: No. Only admins can via `/admin/dashboard`. API endpoints check `admin_token` cookie.

---

### Q: How do I increase the image file size limit?
**A**: Current implementation accepts any size. To add limit:
```typescript
// In /api/upload/route.ts
if (file.size > 5 * 1024 * 1024) { // 5MB limit
  return NextResponse.json({ message: 'File too large' }, { status: 400 });
}
```

---

### Q: Can I add multiple photos to one event?
**A**: Not in current implementation. Each event has one `image_url`. To add multiple:
1. Create `event_images` table
2. Store multiple URLs per event
3. Modify Timeline.tsx to display gallery

---

### Q: How do I make the timeline public with a custom link?
**A**: Create new page:
1. Create `/app/shared/[code]/page.tsx`
2. Add database table `timeline_shares` with:
   - `code` (unique share code)
   - `created_by` (user)
   - `access_level` (view only)
3. Modify Timeline to accept optional code parameter

---

### Q: Can I password-protect individual events?
**A**: Not in current implementation. Would need:
1. Add `is_private` boolean field
2. Add permission check in `/api/events`
3. Modify timeline display logic

---

### Q: How do I reset the database?
**A**: 
1. In Supabase dashboard
2. SQL Editor → Select all → Delete
3. Re-run `supabase-schema.sql`
4. Refresh browser

---

### Q: What if I forget the admin password?
**A**:
1. No password recovery in current app
2. You must know or have .env.local
3. Change it in .env.local and restart

---

### Q: Can I use this with Vercel?
**A**: Yes! Steps:
1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy automatically

---

### Q: Is my data encrypted?
**A**: Supabase uses HTTPS by default. Data encrypted in transit. At rest, use Supabase encryption features.

---

### Q: Can I change the theme colors?
**A**: Yes! All colors use Tailwind classes. Change in:
- `components/LoginForm.tsx`
- `components/Timeline.tsx`
- `components/AdminDashboard.tsx`

Example: Change red to blue:
```
bg-red-500 → bg-blue-500
text-red-600 → text-blue-600
```

---

### Q: How do I add a new field to events?
**A**: 
1. Create migration in Supabase
2. Alter `timeline_events` table
3. Update TypeScript types in `types/index.ts`
4. Update API routes to include new field
5. Update form components

---

### Q: Can I schedule events to appear on a specific date?
**A**: Not in current implementation. To add:
1. Add `published_date` field to table
2. Modify GET `/api/events` to filter by date
3. Add scheduling UI in admin

---

### Q: What happens if the database goes down?
**A**: Users see error message. Causes:
- No events load
- Cannot login
- Cannot save

Solution: Supabase has 99.99% uptime SLA

---

## 🔧 Advanced Troubleshooting

### Check Logs
```bash
# Terminal logs
# Look for errors when making API calls
# Red text = errors, Yellow = warnings

# Browser console logs
# Press F12, Console tab
# Check for JavaScript errors
```

### Network Debugging
```bash
# F12 → Network tab
# Make request (login, create event, etc.)
# Click request
# Check Status (should be 200 for success)
# Check Response (should have expected data)
```

### Database Debugging
```bash
# Supabase dashboard
# SQL Editor
# Run queries directly
SELECT * FROM timeline_events;
SELECT * FROM auth_config;
```

### Environment Variable Debugging
```bash
# Check .env.local has all variables
# Add console.log in API routes to verify
// Don't log sensitive info in production!
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
```

---

## 📞 When All Else Fails

1. **Clear everything and restart**:
```bash
# Stop dev server (Ctrl+C)
rm -rf node_modules .next
npm install
npm run dev
```

2. **Verify database is connected**:
- Supabase dashboard → Settings → Database
- Check status is "Active"

3. **Check environment variables**:
- Copy exact values from Supabase Settings → API
- Paste into .env.local
- No extra spaces or quotes

4. **Test API endpoints directly**:
```bash
curl http://localhost:3000/api/events
# Should return JSON with events array
```

5. **Review the Implementation Summary**:
- Read IMPLEMENTATION.md for full architecture
- Check example code snippets
- Compare with your current code

6. **Enable verbose logging**:
- Add `console.log()` in API routes
- Add `console.error()` in catch blocks
- Check browser Console (F12)

---

## 📋 Pre-Deployment Checklist

- [ ] Updated ADMIN_PASSWORD in .env.local
- [ ] Generated new NEXTAUTH_SECRET
- [ ] Set NEXTAUTH_URL to production domain
- [ ] Tested all features (login, add event, edit, delete)
- [ ] Verified images upload correctly
- [ ] Tested animations work smoothly
- [ ] Checked mobile responsiveness
- [ ] Updated security question
- [ ] Cleared console warnings
- [ ] No hardcoded test data
- [ ] Cookies set to secure: true in production
- [ ] Added CORS headers if needed

---

This guide covers 90% of issues you might encounter. If you still have problems, check the detailed IMPLEMENTATION.md file!
