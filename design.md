# Webbing design system

Hallmark v2, brand-preserving redesign. The existing Webbing logo, local lake photograph, SF Pro Display and Neue Montreal fonts, Stone palette, real project images, routes and contact behavior are the source of truth.

## Direction

A Swiss web studio with clear typography, generous but purposeful space and visible work. Modern-minimal genre, hire job. The homepage opens with a Poster: the real lake photograph, left-aligned explicit offer and contact action. Internal pages use compact Banner intros. No decorative motion, gradient text, floating cards, uppercase tracked labels, invented metrics or testimonials.

SelfCamp is the lead application: feature its real screenshot and UFT collaboration on the homepage and lead the Applications page with it. Wisp, PlanniKeeper and OpenWind remain secondary application examples.

Pattùs Hotel is the lead website example in the homepage Sites Internet block, using its real project screenshot and multilingual booking presentation.

## Shared layout

- `.site-container`: centered, capped at 1360px, responsive gutters.
- `.site-section`: responsive vertical spacing.
- `.section-heading`: large left-aligned h2.
- `.page-intro`: compact introduction on the existing warm neutral surface.
- `.page-title`: responsive h1, seven words or fewer.
- `.page-lead`: readable introductory paragraph.
- Primary actions use the existing Button; secondary actions use its outline variant. No client-colored buttons.
- Content grids must use minmax(0, 1fr), never overflowing negative margins.
- Images use existing assets, preserve aspect ratio and remain unobscured. Names and project descriptions remain visible without hover.
- At least 16px body copy, 44px controls, visible focus, sufficient contrast. Labels remain sentence case.
- Content is visible on initial server render. No opacity-zero reveals. Any necessary transitions respect reduced motion.

## Scope and ownership

Edit existing pages and components in place. No deleted files, routes, destinations, contact fields or analytics hooks. Homepage layout changes; internal pages receive the audit's focused layout and accessibility corrections. Existing claims are preserved as supplied; no new claims are introduced.

Shared CSS, layout, navigation, footer, homepage and about page belong to the primary agent. Individual page agents edit only their assigned page source. Use semantic shared classes above or Tailwind utilities backed by existing tokens. Do not modify shared styles, dependency files or API logic.
