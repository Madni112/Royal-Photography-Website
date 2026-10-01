# ANTIGRAVITY // Luxury Creative Portfolio & Digital Art Atelier

> **Theme**: Luxury Dark & Crimson Red (`#050505` / `#FF0033`)  
> **Target Audience**: Elite Brands, Luxury Wedding Clients, Sovereign High-End Agencies  
> **Built strictly according to Product Requirement Document (PRD)**

---

## 🌟 Core Features & PRD Implementation Matrix

### 1. Antigravity Hero Section
- **Physics-Based Kinetic Drift**: Implements subtle floating typography and asset cards that drift dynamically based on mouse coordinate vectors using Framer Motion physics.
- **Particle Vector Canvas**: Real-time gravitational attraction field where particles react and cluster around the cursor.
- **Holographic 3D Specimen Card**: Multi-layered card with real-time tilt physics, Cannes Lions honors, and camera hardware specs.

### 2. Borderless Cinematic Reel
- **Streaming Engine**: HTML5 high-res video streaming engine with scene selectors (Haute Couture, Night Motorsport, Arctic Odyssey).
- **Soft Crimson Glowing Shadow Drop**: High-end cinematic backdrop glow (`shadow-[0_0_80px_rgba(255,0,51,0.35)]`).
- **Master Cinema HUD**: Custom interactive playback controls, sound toggle, Dolby Atmos tag, ACEScc color space badge, timecode counter (`00:01:24 // 24 FPS`), and resolution switcher (4K DCI / 8K RAW).

### 3. Staggered Portfolio Grid
- **Asymmetric Masonry Layout**: Multi-column staggered layout (`columns-1 md:columns-2 lg:columns-3`) optimized with WebP/AVIF imagery loading under 1.5s.
- **Interactive Lightbox Inspection Modal**: Click any artwork to open high-res optics details (ARRI Alexa 35, Hasselblad H6D-100c, Leica SL3), audience metrics, deliverables list, and direct commission action.
- **Curated Category Filters**: Seamless filtering for *Cinematography*, *Graphic Design*, *Premium Photography*, and *Art Direction*.

### 4. Interactive Antigravity Laboratory
- **Interactive Physics Playground**: Drag, fling, and toss interactive tokens across simulated gravitational vector fields.
- **Physics Modes**: Zero-G Inertia, Inverted Up-Draft, and Cursor Magnetic Field with live collision physics and connecting laser beams.

### 5. Qualifying Client Contact Funnel
- **Multi-Step Onboarding Questionnaire**: 4-phase vetting flow replacing standard basic inputs:
  1. *Artistic Scope & Discipline* (Commercial Cinema, Horology Art, Royal Nuptials, Spatial CGI)
  2. *Budget Bracket* ($15k-$30k, $30k-$75k, $75k-$150k, $150k+ Bespoke) & Target Timeline
  3. *Global Production Location & Hardware Scale* (Paris, Monaco, Lake Como, Swiss Alps, Multi-City)
  4. *Principal Client Credentials* with instant VIP lead qualification score and celebratory confetti.

### 6. Protected Administrative Panel (`/admin`)
- **Middleware Authentication Fence**: Restricts `/admin/*` routes with security headers and passcode vault lock (`antigravity2026`).
- **Live Project CRUD Form**: Add new assets, edit titles/categories/images/videos/camera rigs, or destroy records.
- **On-Demand Cache Revalidation**: Next.js Server Actions with `revalidatePath('/')` to instantly purge edge cache.
- **Inbound Lead Manager**: Review and update submitted client inquiries with lead scoring and status workflows.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 15.5+ (App Router) & React 19
- **Styling**: Tailwind CSS with custom luxury Dark (`#050505`) and Crimson Red (`#FF0033`) tokens
- **Animations & Physics**: Framer Motion (physics spring vectors) + HTML5 2D Canvas engine
- **Audio Engine**: Web Audio API spatial synthesizer (zero external mp3 asset latency)
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

Open [http://localhost:3000](http://localhost:3000) for the public gallery and [http://localhost:3000/admin](http://localhost:3000/admin) (passcode: `antigravity2026`) for the administrative vault.
