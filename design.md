# design.md
# Frontend Design System — Warm Teal Editorial

> Claude must read this file in full before touching any UI file.
> All rules below are non-negotiable.

---

## CSS Variables

Paste this entire block into `src/styles/globals.css` inside `:root {}`.

```css
:root {
  /* ── Color Palette ───────────────────────────────────────── */

  /* A warm, calming off-white to reduce eye strain */
  --bg: #fdfcfb;

  /* Pure white for components — subtle separation from background */
  --surface: #ffffff;

  /* Deep, trustworthy teal — ADA AAA contrast on white (7.2:1) */
  --accent: #115e59;

  /* High-contrast deep slate for primary text — softer than pure black */
  --text: #0f172a;

  /* Soft slate for secondary info, captions, and borders */
  --muted: #64748b;

  /* ── Typography ──────────────────────────────────────────── */

  --font-display: 'Playfair Display', serif;   /* headings only */
  --font-body:    'DM Sans', sans-serif;        /* all body text */
  --font-mono:    'DM Mono', monospace;         /* code, labels, data */

  /* Type scale */
  --text-xs:   0.75rem;    /* 12px — labels/captions only, never body */
  --text-sm:   0.875rem;   /* 14px */
  --text-base: 1rem;       /* 16px — minimum for body content */
  --text-lg:   1.125rem;
  --text-xl:   1.25rem;
  --text-2xl:  1.5rem;
  --text-3xl:  1.875rem;
  --text-4xl:  2.25rem;

  /* ── Spacing ─────────────────────────────────────────────── */

  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* ── Border Radius ───────────────────────────────────────── */

  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-full: 9999px;   /* pills only */

  /* ── Shadows ─────────────────────────────────────────────── */

  --shadow-sm:     0 1px 2px rgba(15, 23, 42, 0.06);
  --shadow-md:     0 4px 12px rgba(15, 23, 42, 0.08);
  --shadow-lg:     0 8px 24px rgba(15, 23, 42, 0.10);
  --shadow-accent: 0 4px 14px rgba(17, 94, 89, 0.25); /* teal glow for CTAs */
}
```

---

## Google Fonts Import

Add this inside `<head>` in `index.html` — before any other stylesheets:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&family=DM+Mono:wght@400&display=swap" rel="stylesheet" />
```

---

## Contrast Ratios (ADA Verified)

| Combination                        | Ratio  | WCAG Grade |
|------------------------------------|--------|------------|
| --text on --bg  (#0f172a / #fdfcfb)| ~18.5:1| AAA ✅     |
| --text on --surface (#0f172a / #fff)| ~19.6:1| AAA ✅    |
| --accent on --surface (#115e59 / #fff)| ~7.2:1| AAA ✅  |
| White text on --accent             | ~7.2:1 | AAA ✅     |
| --muted on --bg (#64748b / #fdfcfb)| ~4.6:1 | AA ✅      |

---

## Component Rules

### Buttons
- **Primary:** `--accent` background, white text, `--radius-md`, `--shadow-accent` on hover
- **Secondary:** transparent background, `--accent` border + `--accent` text
- **Ghost:** no border, `--accent` text, subtle `--bg` background on hover
- Minimum touch target: `44x44px` on all screen sizes
- Spring hover animation via Framer Motion on all variants

### Cards
- `--surface` background, `--shadow-sm` default, `--shadow-md` on hover
- Hover shadow transition via Framer Motion spring
- `--radius-lg` border radius
- Never use gray-50 or slate-100 as card backgrounds

### Inputs & Forms
- `--surface` background, `--muted` border by default
- On focus: `--accent` border + `box-shadow: 0 0 0 2px var(--accent)` ring
- **Never remove the focus ring** — it is required for ADA keyboard navigation
- No raw `outline: none` — always replace with the box-shadow ring above

### Navigation
- Sticky, `--surface` background, `--shadow-sm`
- Collapses to hamburger at `sm` breakpoint (≤640px)
- Font: `--font-body`, medium weight

### Typography Hierarchy
- Display headings (`h1`, `h2`): `--font-display`, `--text-3xl` / `--text-4xl`
- Section headings (`h3`, `h4`): `--font-body`, semibold
- Body text: `--font-body`, `--text-base` minimum
- Labels, captions, data: `--font-mono`, `--text-sm` or `--text-xs`
- Color for body: `--text`; color for secondary: `--muted`

---

## Animation Spec (Framer Motion)

```ts
// Page load stagger
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 }
  }
}
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

// Hover spring (buttons, cards, interactive elements)
const hoverSpring = { stiffness: 300, damping: 20, mass: 0.8 }

// Page transitions
const pageTransition = { duration: 0.3, ease: 'easeOut' }
// animate: { opacity: 1, y: 0 } from { opacity: 0, y: 8 }

// layoutId transitions (position changes)
const layoutSpring = { stiffness: 350, damping: 30 }

// Modal / Drawer
// Mobile: slide up from bottom
// Desktop: fade + scale from 0.95 to 1
```

### prefers-reduced-motion (ADA required)

```tsx
const prefersReduced = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

const safeTransition = prefersReduced
  ? { duration: 0.01 }
  : { stiffness: 300, damping: 20 }

// Also add to globals.css:
// @media (prefers-reduced-motion: reduce) {
//   *, *::before, *::after { animation-duration: 0.01ms !important; }
// }
```

All Framer Motion animations must pass `safeTransition` instead of hardcoded spring values.

---

## Loading, Empty & Error States

**Every data-fetching component must implement all three.** Claude must not skip these.

### Loading
- Skeleton shimmer using `--muted` at 20% opacity
- Animated CSS pulse on skeleton blocks
- Match the skeleton shape to the real content layout

### Empty
- Centered icon (SVG, `--muted` color) + heading + subtext in `--muted`
- No broken or collapsed layouts — empty state fills the same space as content

### Error
- Card with `2px solid var(--accent)` left border
- Error message in `--text`, details in `--muted`
- Retry button (secondary variant)

---

## Mobile-First Rules

- Build every component at **375px width first**
- Then scale up using Tailwind breakpoints: `sm:` (640px) → `md:` (768px) → `lg:` (1024px)
- Never use fixed pixel widths on containers — use `w-full` + `max-w-*`
- All touch targets minimum `44x44px`
- Modals: full-screen slide-up on mobile, centered dialog on desktop

---

## ADA Compliance Rules (Non-Negotiable)

```
NEVER:
- Remove focus indicators. Replace outline with box-shadow ring using --accent.
- Use color as the only indicator of meaning.
  Error states need: icon + text + color. Not color alone.
- Use font sizes below --text-base (1rem) for any body or readable content.
- Animate without checking prefers-reduced-motion.
- Render images without alt attributes.
  Claude must add descriptive placeholder alt text on every <img />.
- Use touch targets smaller than 44x44px.
```

---

## Banned Patterns

```
NEVER USE:
- Inter, Roboto, Arial, Space Grotesk, or system fonts
- Purple-to-blue gradients on white backgrounds
- Default Shadcn/Radix visual styling without heavy overrides
- Box shadows larger than --shadow-lg
- Border radius larger than --radius-lg (except --radius-full for pills)
- Pure black (#000000) — use --text instead
- gray-50 or slate-100 as card or surface backgrounds — use --surface
- Hardcoded hex values anywhere — always use CSS variables
- outline: none without a box-shadow focus replacement
```

---

## Component Build Order

When overhauling the frontend, Claude must build in this order:

1. `src/styles/globals.css` — all CSS variables
2. `index.html` — Google Fonts import
3. Layout / Nav
4. Button (primary, secondary, ghost)
5. Card
6. Input / Form elements
7. Data-fetching components (with loading/empty/error states)
8. Pages (apply stagger animations)

After each component, confirm it was updated before moving to the next.
Never open files outside the currently active component.
