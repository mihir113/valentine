# Valentine Timeline - Feature Walkthrough

## 🏠 Home Page (http://localhost:3000)

### What You See
```
┌─────────────────────────────────────────┐
│  Our Love Story ❤️                      │
│  A journey through our beautiful        │
│  moments together                       │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Security Question: What is our    │  │
│  │ special place?                    │  │
│  │                                   │  │
│  │ [Your answer...            ]      │  │
│  │                                   │  │
│  │ [Enter Our Love Story Button]     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### User Actions
- Enter security answer (case-insensitive)
- Click "Enter Our Love Story"
- Success → Redirected to /timeline
- Wrong answer → Red error message, try again

### Technical Flow
```
form submit
    ↓
POST /api/auth/login
    ↓
Database query (auth_config)
    ↓
Answer match?
    ├─ YES → Set user_token cookie → /timeline
    └─ NO → Error message
```

---

## 📅 Timeline Page (http://localhost:3000/timeline)

### Layout
```
┌────────────────────────────────────────┐
│ ❤️ Our Love Story          [Logout]    │ ← Sticky Header
├────────────────────────────────────────┤
│                                        │
│  Left Card (Event 1)     [Timeline]   │
│                          [Dot ✨]      │
│                                    Right Card (Event 2)
│                                        │
│  Left Card (Event 3)     [Timeline]   │
│                          [Dot ✨]      │
│                                    Right Card (Event 4)
│                                        │
│  ... more events ...                   │
└────────────────────────────────────────┘
```

### Card Structure
```
┌─────────────────────────┐
│ 📅 February 14, 2020    │
│                         │
│ First Date              │ ← Title
│ A beautiful day in Paris│ ← Description
│                         │
│  [Image if exists]      │ ← Click to expand
│                         │
└─────────────────────────┘
```

### Features
- **Animations**: Cards fade in as you scroll
- **Timeline Dot**: Pulses continuously (scale animation)
- **Cards**: Scale up slightly on hover (1.02x)
- **Images**: Click to open lightbox modal
- **Header**: Sticky so logout always accessible
- **Empty State**: Shows message if no events

### Logout Flow
```
Click Logout Button
    ↓
POST /api/auth/logout
    ↓
Clear cookies
    ↓
Redirect to /
```

---

## 🔐 Admin Login Page (http://localhost:3000/admin)

### What You See
```
┌──────────────────────────────┐
│   Admin Login                │
│   Enter admin password to    │
│   manage timeline            │
├──────────────────────────────┤
│                              │
│  ┌────────────────────────┐  │
│  │ Admin Password         │  │
│  │                        │  │
│  │ [••••••••••      ]     │  │
│  │                        │  │
│  │ [Login Button]         │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

### User Actions
- Enter admin password (default: "Chandigarh")
- Click Login
- Success → Redirected to /admin/dashboard
- Wrong password → Red error message

### Technical Flow
```
form submit (password)
    ↓
POST /api/admin/login
    ↓
Password matches ADMIN_PASSWORD env var?
    ├─ YES → Set admin_token cookie → /admin/dashboard
    └─ NO → Error message
```

---

## 📊 Admin Dashboard (http://localhost:3000/admin/dashboard)

### Overall Layout
```
┌──────────────────────────────────────────────────┐
│ Admin Dashboard                    [Logout]      │
├──────────────────────────────────────────────────┤
│                                                  │
│ [Add New Event] ─ Creates form below            │
│                                                  │
│ ┌──────────────────────────────────────────────┐ │
│ │ Add/Edit Timeline Event Form                 │ │
│ │ (Only visible when adding/editing)           │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ Timeline Events (4 total)                       │
│ ┌──────────────────────────────────────────────┐ │
│ │ Event 1 Title              [Edit] [Delete]   │ │
│ │ 2020-02-14                                   │ │
│ │ Description text...                          │ │
│ │ [Thumbnail Image]                            │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ Security Question Settings                      │
│ ┌──────────────────────────────────────────────┐ │
│ │ Question: [________________]                 │ │
│ │ Answer:   [________________]                 │ │
│ │ [Update Security Question]                   │ │
│ └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### 1️⃣ Add Event Form (When "Add New Event" clicked)

```
┌─────────────────────────────────┐
│ Add New Timeline Event           │
├─────────────────────────────────┤
│                                 │
│ Title                           │
│ [First Date              ]      │
│                                 │
│ Date                            │
│ [2020-02-14             ]       │
│                                 │
│ Description                     │
│ [_______________________]       │
│ [_______________________]       │
│ [Wonderful day in Paris!_]      │
│                                 │
│ Upload Photo                    │
│ [Choose file...        ]        │
│                                 │
│ [Save Event] [Cancel]           │
│                                 │
└─────────────────────────────────┘
```

#### Form Actions
- **Save Event** → Creates new event or updates existing
- **Cancel** → Closes form, resets all fields
- **Upload Photo** → File input for image selection
- All fields required except image

#### Save Process
```
Fill form
    ↓
Submit
    ├─ Upload image to /api/upload → Get URL
    │       ↓
    │   POST /api/events (with image_url)
    │       ↓
    ├─ Create event in database
    │       ↓
    └─ Refresh events list, clear form
```

### 2️⃣ Events List Section

```
Timeline Events (4)

┌────────────────────────────────────────────────┐
│ First Date                    [Edit] [Delete]  │
│ 2020-02-14                                     │
│ Beautiful day in Paris. Started with morning  │
│ coffee and ended with dinner by the river.    │
│ [Image thumbnail]                              │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ Our Anniversary                [Edit] [Delete] │
│ 2021-02-14                                     │
│ One year of love and memories...               │
│ [Image thumbnail]                              │
└────────────────────────────────────────────────┘

... more events ...
```

#### Event Card Actions

**Edit Button**
```
Click [Edit]
    ↓
Form populated with event data
    ↓
Make changes
    ↓
Click Save Event
    ↓
PUT /api/events/[id]
    ↓
Update complete, form closes, list refreshes
```

**Delete Button**
```
Click [Delete]
    ↓
Confirmation dialog: "Are you sure?"
    ├─ YES → DELETE /api/events/[id] → Remove from list
    └─ NO  → Dialog closes, nothing happens
```

### 3️⃣ Security Question Settings

```
Security Question Settings

Question
[Where did we meet first?     ]

Answer
[Chandigarh              ]

[Update Security Question]
```

#### Actions
- Edit question and/or answer
- Click Update
- Process:
```
Enter new question/answer
    ↓
POST /api/config/security-question
    ↓
Validate admin_token
    ↓
Update database (auth_config)
    ↓
Success message shown
    ↓
Changes apply immediately for next login
```

### Logout
- Click Logout button (top right)
- Clears admin_token cookie
- Redirects to /admin login page

---

## 🖼️ Image Lightbox

### Trigger
- Any event card image on timeline
- Click to open

### Display
```
┌─────────────────────────────────────────┐
│ (Dark overlay covering entire screen)   │
│                                         │
│     [Full size image centered]          │
│                                         │
│ (Click anywhere to close)               │
└─────────────────────────────────────────┘
```

### Animation
- Image slides in from center (scale 0.8 → 1)
- Overlay fades in
- Click overlay to close (fade out)

---

## 🔄 Data Flow Summary

### User Accessing Timeline
```
Browser → Home Page → Enter Security Answer → 
→ API Check → Set Cookie → Timeline View → 
→ Load Events → Display Cards → User Scrolls → 
→ Animations Trigger
```

### Admin Creating Event
```
Admin Login → Dashboard → Click "Add New Event" → 
→ Fill Form → Select Image → Submit → 
→ Upload Image to Storage → Create Event in DB → 
→ Refresh List → New Event Appears
```

### Public View of Completed Timeline
```
Guest visits → Answers question → 
→ Sees beautiful animated timeline → 
→ Clicks images to expand → 
→ Scrolls to trigger animations → 
→ Logout when done
```

---

## 🎬 Animation Details

### Scroll-Triggered Fade-In
```
Before scroll: opacity: 0, translateY: 50px
User scrolls: Detected by whileInView
After scroll: opacity: 1, translateY: 0px
Duration: 0.6s easing
```

### Timeline Dot Pulse
```
Constant animation:
Scale: 1 → 1.2 → 1
Duration: 2 seconds
Repeat: Infinite
Effect: Pulsing red dot
```

### Card Hover Effect
```
Normal state: scale(1)
Hover state: scale(1.02)
Duration: Instant (whileHover)
Effect: Subtle zoom on interaction
```

### Image Lightbox
```
Opening:
  Overlay: opacity 0 → 1
  Image: scale 0.8 → 1
Duration: Simultaneous animations
```

---

## 📱 Mobile View

### Home Page
```
Full-width, single column
Form centered and optimized
Touch-friendly buttons
```

### Timeline
```
Single column (no left/right alternating)
Cards full width
Images responsive
Sticky header with logout
Touch-optimized scroll
```

### Admin Dashboard
```
Stacked layout
Form inputs full width
Buttons below content
Event list cards responsive
Mobile-optimized font sizes
```

---

## 🚨 Error States

### Login Errors
```
"Incorrect answer"
"An error occurred. Please try again."
```

### Event Errors
```
"Failed to create event"
"Failed to update event"
"Failed to delete event"
"Error loading events"
```

### Upload Errors
```
"Failed to upload image"
"Unable to upload file"
```

---

## ✨ Loading States

### Login
```
Button text changes: "Checking..." (disabled state)
```

### Save Event
```
Button text changes: "Saving..." (disabled state)
```

### Load Timeline
```
Loading message: "Loading your love story..."
```

### Update Security
```
Button text changes: "Updating..." (disabled state)
```

---

## 🎨 Color Scheme

- **Primary Red**: #EF4444 (buttons, highlights)
- **Secondary Red**: #DC2626 (hover state)
- **Background Pink**: #FDE2E4
- **Light Pink**: #FECDD3
- **Text Gray**: #374151
- **Border Gray**: #D1D5DB
- **White Cards**: #FFFFFF

---

## 📊 Complete User Journey Map

```
GUEST JOURNEY:
Home → Answer Question ✓ → Timeline ✓ → View Events ✓ → 
→ See Animations ✓ → Click Images ✓ → Logout ✓

ADMIN JOURNEY:
Admin Login → Password ✓ → Dashboard ✓ → Add Event ✓ → 
→ Upload Image ✓ → Update Security ✓ → View All → Logout ✓

FAILED ATTEMPT:
Home → Answer Question ✗ → Error Message → Try Again → Success ✓
```

---

This walkthrough covers every screen, button, animation, and interaction in your Valentine Timeline application!
