# Design Guidelines: CareerConnect PWA

## Design Approach

**Selected Approach:** Hybrid Reference + Apple HIG System

**Primary References:**
- LinkedIn (professional networking, clean profiles)
- Indeed (job listings, application flow)
- Notion (modern card-based layouts)
- Apple HIG (iOS-native feel, gesture interactions)

**Core Principles:**
1. Mobile-first, iOS-optimized interface
2. Professional, trust-building aesthetic
3. Information hierarchy for scanning efficiency
4. Seamless role-based experiences (applicant vs recruiter)

---

## Typography System

**Font Families:**
- Primary: SF Pro Display (via system fonts)
- Secondary: Inter (Google Fonts) for body text
- Monospace: SF Mono for technical details (job IDs, codes)

**Type Scale:**
- Hero Headlines: 32px / Bold / Tight line-height (1.1)
- Section Headers: 24px / Semibold / 1.2
- Card Titles: 18px / Semibold / 1.3
- Body Text: 16px / Regular / 1.5
- Captions/Meta: 14px / Regular / 1.4
- Small Labels: 12px / Medium / 1.3

**Hierarchy Rules:**
- Job titles always bold, companies regular weight
- Tab labels use 10px uppercase tracking for clarity
- Form labels 14px medium weight above inputs

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Micro spacing (icons, badges): 2
- Component padding: 4, 6
- Card spacing: 8
- Section spacing: 12, 16
- Large vertical rhythm: 16, 24

**Grid System:**
- Mobile: Single column, 4 unit side padding
- Content max-width: 1280px
- Cards: 100% width on mobile, preserve breathing room

**Safe Areas:**
- iOS notch: pb-safe implementation
- Tab bar: Fixed bottom navigation with safe area padding
- Scrollable content stops above tab bar

---

## Component Library

### Navigation
**Bottom Tab Bar:**
- Fixed position, 4 tabs: Home, Networking, Jobs, Courses
- Icon + label (12px)
- Active state: filled icon, emphasized text
- Height: 64px with safe area padding
- Subtle top border separator

**Top Navigation:**
- Logo left, profile/settings icon right
- Height: 56px with status bar padding
- Shadow on scroll for depth

### Cards

**Job Listing Card:**
- Company logo (48px circular avatar, top-left)
- Job title (18px semibold)
- Company name + location (14px, secondary text)
- Employment type badge (Full-time/Part-time pill)
- Skill level indicator
- Apply button (full-width, primary style)
- Card padding: 4 units, rounded corners (12px)
- Divider between cards (1px, subtle)

**Professional Profile Card (Networking):**
- Profile photo (64px circular)
- Name + title + company (hierarchical text)
- Expertise tags (pill badges)
- Two action buttons: "Send Email" + "Schedule Zoom"
- Card layout: horizontal on larger screens, vertical on mobile

**Course Card:**
- Course provider logo/icon
- Course title (18px semibold)
- Certification type (badge)
- Duration estimate
- "Start Course" button (external link icon)
- Visual indicator for popular/recommended courses

### Forms & Inputs

**Text Inputs:**
- Height: 48px
- Border: 1px solid, rounded (8px)
- Label above (14px medium)
- Padding: 3 units horizontal
- Focus state: border emphasis, no glow

**File Upload (Resume):**
- Dropzone area with dashed border
- Icon + "Upload Resume" text centered
- Accepted formats note below (14px)
- Success state: green checkmark + filename
- Size: minimum 200px height

**Buttons:**
- Primary: Height 48px, rounded (8px), bold text (16px)
- Secondary: Outlined variant, same dimensions
- Icon buttons: 40px square, rounded (8px)
- Full-width on mobile for main actions

### Lists

**Job Listings View:**
- Infinite scroll with load indicator
- Filter chips at top (location, type, level)
- Sort dropdown (top-right)
- Each card tappable to detail view

**Networking Professionals Grid:**
- Search bar at top (48px height)
- Filter by company/expertise dropdowns
- 1 column mobile, cards with 4 unit spacing

---

## Screen-Specific Layouts

### Applicant Home Tab
**Structure (Top to Bottom):**
1. Welcome header with user name
2. Resume upload card (prominent, if no resume uploaded)
3. "Upcoming Networking Events" section (horizontal scroll cards)
4. "Recommended Jobs" preview (3 cards, "View All" link)
5. Quick stats cards (applications sent, responses, etc.)

### Recruiter Home Tab
**Structure:**
1. Company dashboard header
2. "Post New Job" primary CTA card
3. Active job listings (mini cards, manage options)
4. "Networking Requests" section
5. Analytics cards (views, applications)

### Jobs Tab
- Filter bar (sticky below nav)
- Sort controls
- Job cards list
- "Load More" at bottom

### Networking Tab
- Search + filters sticky top
- Professional cards grid
- Empty state: illustration + "No professionals found"

### Courses Tab
- Category filters (Cloud, Design, Development, etc.)
- Featured course banner (top)
- Course cards grid
- Each links to external provider

---

## Role-Based UI Differences

**Applicant Interface:**
- Upload resume functionality
- Apply buttons on jobs
- Request meeting actions on networking
- Course enrollment focus

**Recruiter Interface:**
- Post job CTA prominent on Home
- Manage listings controls
- Accept/schedule networking requests
- No course enrollment (hidden tab or modified)

---

## Interactive Patterns

**Micro-interactions:**
- Card tap: subtle scale (0.98) + shadow
- Button press: slight opacity change
- Tab switch: smooth content fade transition
- Pull-to-refresh on lists

**Gestures:**
- Swipe back navigation (iOS standard)
- Pull-to-refresh on Home and Jobs
- Horizontal scroll for event cards

**Loading States:**
- Skeleton screens for cards while loading
- Spinner for button actions
- Progressive image loading

---

## PWA-Specific Elements

**Install Prompt:**
- Bottom sheet modal (first visit)
- Icon + "Install CareerConnect" text
- "Add to Home Screen" instructions

**Splash Screen:**
- App icon centered
- App name below (24px)
- Minimal, matches system style

**Offline State:**
- Banner notification at top
- Cached content still viewable
- "You're offline" message for actions

---

## Accessibility

**Touch Targets:**
- Minimum 44px height/width for all interactive elements
- Adequate spacing between tappable items (8px minimum)

**Text Contrast:**
- Maintain WCAG AA standards throughout
- Test readability on all backgrounds

**Form Accessibility:**
- Labels always visible (not placeholder-only)
- Error messages below inputs (red accent, 14px)
- Success indicators clear and persistent

---

## Content Guidelines

**Empty States:**
- Friendly illustration or icon
- Helpful message (16px)
- Clear CTA to resolve (e.g., "Upload your resume to get started")

**Error States:**
- Icon + message
- Retry button when applicable
- Support contact for critical errors

**Job Listings:**
- Standardized format across all cards
- Required fields: title, company, location, type
- Optional: salary range, application deadline

---

## Images

**Profile Photos:**
- Circular avatars throughout
- Fallback: initials on solid background
- Sizes: 32px (small), 48px (medium), 64px (large), 96px (detail view)

**Company Logos:**
- Square or circular containers
- Consistent sizing within card type
- Default placeholder for missing logos

**Hero/Marketing:**
- No large hero images in app (utility-focused)
- Icons and avatars prioritized over photography
- Course cards may include provider branding

This design creates a professional, iOS-native feeling job platform that balances information density with usability, ensuring both applicants and recruiters have efficient, role-appropriate experiences.