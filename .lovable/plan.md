# Prakhar Parashar Portfolio

## Goal
Build a single-page, recruiter-focused portfolio that presents Prakhar’s operations leadership and Mann+Hummel automation record with a precise “control tower” visual language.

## Experience
- Create a sticky anchor navigation, commanding first screen, clear career narrative, metrics-led achievement grid, embedded VocabPro showcase, projects, categorized skills, credentials, awards, and contact area.
- Keep the two Mann+Hummel roles and dates distinct, and clearly separate 13+ years of international customer service from Mann+Hummel-specific automation expertise.
- Use the provided navy brand accent, off-white/light and near-black/dark themes, restrained motion, and recruiter-friendly mobile layouts.
- Make VocabPro the visual centerpiece with a lazy-loaded live app in a device frame and a full-app link. If no verified public URL can be found, ship the frame in a clearly marked awaiting-URL state rather than inventing a link.

## Contact and data
- Enable Lovable Cloud and create a protected contact-submissions table.
- Accept public submissions only, without exposing stored messages publicly.
- Validate name, email, and message before saving, with clear success and error states.

## Quality and metadata
- Add the requested title, description, Open Graph metadata, light/dark mode, accessible controls, and reduced-motion support.
- Verify the page at desktop and mobile sizes, test theme switching, anchor navigation, lazy loading, and contact submission.

## Technical details
- Keep the portfolio on `/` as one intentional scrolling page with anchor navigation.
- Use semantic design tokens in the shared stylesheet and reusable React sections/components.
- Store contact submissions through the browser client with database grants and row-level security allowing anonymous inserts only.
