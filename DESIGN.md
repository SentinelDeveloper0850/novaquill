# Design System Specification: Architectural Dark Mode

## 1. Overview & Creative North Star

### The Creative North Star: "The Obsidian Ledger"
The design system for this e-signing platform is built upon the concept of the **Obsidian Ledger**. In a world of digital clutter, this system stands as an authoritative, monolithic, yet ethereal space for high-stakes decisions. It moves beyond "standard dark mode" by treating the interface not as a flat screen, but as a series of depth-mapped, architectural layers.

By utilizing intentional asymmetry—where content is weighted to drive the eye toward specific actions—and a high-contrast typographic scale, we break the "template" feel. We favor editorial air over grid density, ensuring every signature feels like a momentous event rather than a chore.

---

## 2. Colors & Surface Philosophy

The palette is anchored in a deep, void-like charcoal, punctuated by a vibrant, "electric" teal that signifies activity and progress.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders for sectioning are strictly prohibited. The system must define boundaries through background color shifts or tonal transitions. To separate a document preview from the dashboard, use `surface-container-low` against the `surface` background. 

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-translucent materials.
- **Base:** `surface` (#0b0f0f) – The foundation.
- **Sectioning:** `surface-container-low` (#101414) – Sub-navigation or large content areas.
- **Interaction Hubs:** `surface-container-highest` (#212727) – Primary cards or signature fields.

### The "Glass & Gradient" Rule
To add "soul" to the professional atmosphere:
- **Glassmorphism:** Use `surface-bright` at 60% opacity with a `24px` backdrop-blur for floating headers or modal overlays.
- **Signature Gradients:** For primary CTAs, transition from `primary` (#58e7fb) to `primary-container` (#1cc2d6) at a 135° angle. This creates a subtle metallic "glow" that feels premium and tactile.

---

## 3. Typography

The system utilizes a dual-font strategy to balance character with utility.

| Role | Font Family | Style | Intent |
| :--- | :--- | :--- | :--- |
| **Display** | Manrope | Bold / Extra Bold | Editorial impact; high-contrast "moments." |
| **Headline** | Manrope | Semi-Bold | Authoritative section headings. |
| **Body** | Inter | Regular | Maximum legibility for legal text and data. |
| **Label** | Inter | Medium / All Caps | Technical metadata and micro-copy. |

**The Hierarchy Logic:** 
We use `display-lg` (3.5rem) sparingly to create "Hero" moments that welcome the user. This is paired with `body-lg` (1rem) for an airy, sophisticated contrast that feels like a high-end magazine rather than a software dashboard.

---

## 4. Elevation & Depth

We achieve hierarchy through **Tonal Layering**, mimicking the way light interacts with dark surfaces.

- **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` (#000000) card placed on a `surface-container-low` (#101414) section creates an inverted "well" effect, perfect for secure input fields.
- **Ambient Shadows:** Shadows are never black. Use a tinted version of `on-surface` at 6% opacity with a blur of `32px` and a `12px` Y-offset. This mimics a soft glow emanating from the background.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at **15% opacity**. A solid 100% opaque border is considered a design failure in this system.

---

## 5. Components

### Buttons
- **Primary:** Gradient-filled (`primary` to `primary-container`), `8px` rounded corners. On hover, apply a `primary` outer glow (8px blur, 20% opacity).
- **Secondary:** Ghost style. `Ghost Border` (15% outline-variant) with `on-surface` text.
- **Tertiary:** Text-only using `primary` color, bold weight, with a `2px` underline on hover.

### Input Fields
- **Base State:** `surface-container-highest` background. No border. `8px` radius.
- **Active State:** A subtle `1px` inner glow using the `primary` token at 40% opacity.
- **Error State:** Background shifts to a desaturated `error_container` (#9f0519) at 20% opacity.

### Chips & Badges
- **Status Chips:** Use a "dot" indicator. For "Completed," use a `primary` dot next to `body-sm` text. Avoid solid-colored pill backgrounds to keep the UI clean.

### Cards & Lists
- **Rule:** Forbid divider lines.
- **Separation:** Use `Spacing Scale 6` (2rem) between list items. For cards, use the tonal shift between `surface-container-low` and `surface-container-high`.

### Specialized Component: The Signature Pad
- **Style:** A `surface-container-lowest` (pure black) canvas nested within a `surface-container-highest` frame. Use the `primary` teal for the "ink" to make the act of signing feel digital and modern.

---

## 6. Do's and Don'ts

### Do
- **DO** use the `24` spacing token (8.5rem) for hero section padding to create an "Editorial" feel.
- **DO** use asymmetry. Align your primary CTA to the right of a container while the headline sits left to create visual tension.
- **DO** use `primary_dim` for secondary interaction states to maintain the dark-mode aesthetic without losing the brand color.

### Don't
- **DON'T** use 100% white (#FFFFFF) for text. Use `on_surface` (#fafdfc) to reduce eye strain in dark environments.
- **DON'T** use standard "drop shadows." If a component needs to pop, use Tonal Layering or a light-tinted ambient glow.
- **DON'T** crowd the interface. If a screen feels busy, increase the spacing tokens (e.g., move from `spacing-4` to `spacing-8`).