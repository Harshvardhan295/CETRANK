

# CETRANK: The Admission Intelligence Engine

## Page 1 — Landing Page (Hero)
- **Hero section** with animated headline "Your Admission Intelligence Engine" and a glowing CTA button "Get Started"
- Deep Navy (#0A192F) background with glassmorphic floating cards showcasing key features (4 lakh+ data points, AI-powered, multi-round support)
- Subtle particle/grid animation in the background
- Feature highlights in a bento grid: Prediction Engine, AI Counselor, Smart Filters, Explainable Reports
- Smooth scroll-down to a "How It Works" section with a 3-step vertical timeline animation
- Dark/Light mode toggle in the navbar

## Page 2 — Prediction Dashboard
### Top: Intelligent Filter Bar
- Glassmorphic filter bar with Apple Spotlight-style type-to-filter inputs
- Fields: Category (GOPEN, OBC, SC, etc.), Home University, Gender, City/Division, Percentile Range (slider), Branch filters (Tech, Electronic, Civil, etc.), Minority status, EWS toggle
- "Pulse" animation on filter change indicating recalculation
- Connected to all 3 API endpoints: `/colleges`, `/branches`, `/eligible-cutoffs`

### Center: Prediction Results (Bento Grid)
- College cards with probability gauges (based on cutoff proximity to user's percentile)
- Cards expand on click to show historical cutoff sparkline charts (2023-2025 data from API)
- Framer Motion `layoutId` transitions for smooth card expand/collapse
- Skeleton loading screens during API calls
- "Scanner" animation sweeping across results when data loads

### Right: AI Counselor Sidebar (Collapsible)
- Persistent collapsible sidebar with chat-like UI
- "Thought Stream" terminal animation showing mock RAG reasoning steps
- Placeholder responses with typing indicator animation
- Styled as a glassmorphic panel with Electric Blue (#0070F3) accents

### Bottom: Report Center
- 3D card flip animation toggling between digital view and PDF preview mockup
- Download button (non-functional, shows toast notification "Coming soon")

## Design System
- **Colors**: Deep Navy (#0A192F), Electric Blue (#0070F3), Soft Slate (#F8FAFC), with light mode variants
- **Font**: Inter (variable)
- **Animations**: Framer Motion for layout transitions, card expansions, filter pulses, scanner reveal, timeline step validation
- **Glassmorphism**: Translucent containers with backdrop-blur and subtle border glow
- **Round-transition morphing**: Background color shifts (calm greens → focused oranges) based on selected CAP round

## Key Interactions
- Sequential Allocation Timeline: vertical animated timeline showing rule validation steps (Home University → Category → Seat Status) when viewing a college detail
- Filter changes trigger a subtle UI "pulse" effect
- Smooth page transition from Landing → Dashboard

