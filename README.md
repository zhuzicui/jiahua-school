# Jia Hua School website

Public website for 蒙特利尔佳华学校 / Jia Hua School of Montreal, built from the
"Jia Hua School website redesign" PRD. Next.js (App Router) + Tailwind CSS +
[Untitled UI React](https://www.untitledui.com/react) components, deployed on Vercel.

## Run it

```bash
npm ci
npm run dev        # http://localhost:3000 (redirects to /zh)
npm run build      # production build; CI runs this on every pull request
```

Node 22 or newer.

## How it is organised

| Path | What it holds |
| --- | --- |
| `src/app/[locale]/…` | One folder per page. Every page exists at `/zh`, `/fr` and `/en`. |
| `src/content/*.json` | Site content (courses, teachers, calendar, FAQ, news…). Seeded from the CMS prototype in Oct 2026. |
| `src/lib/content.ts` | The only place pages read content from. The CMS milestone replaces these functions with database reads. |
| `src/i18n/dictionary.ts` | Interface text (menus, buttons, labels) in 中文 / FR / EN. |
| `src/components/site/` | Jia Hua components (header, footer, course finder, teacher directory…). |
| `src/components/base`, `application`, `foundations` | Untitled UI components from the starter kit. Prefer these over new ones. |
| `src/styles/theme.css` | Untitled UI tokens with the Jia Hua red scale (#E84A5F) in place of purple. |
| `public/illustrations/` | The 12 course illustrations. |

## Content rules

- **Languages**: Chinese is the source language. Every text field is `{ zh, fr?, en? }`.
  A missing translation shows the Chinese text with a small "中文" tag or notice, never an empty block.
- **Students' names**: first name + last initial only, until consent is recorded on the registration form.
- **Calendar**: `src/content/calendar.json` holds the terms and dated events (holidays, first/last days, exams).
  The weekly timetable is the "by day" view of Courses, not part of the calendar.
- **Promoted news**: a News post with `"promote": true` shows on the home page until `promoteUntil`, and always stays in the News list.
- **Hidden for now**: Summer Camps and Contest Results (PRD rec. 11 and 12).

## Changing things

Code changes are made with Claude Code on a branch, opened as a pull request, and deploy
automatically on merge once the repository is connected to Vercel.

1. Edit the JSON in `src/content/` for content, or the page in `src/app/[locale]/` for layout.
2. `npm run build` must pass.
3. Open a pull request; Vercel posts a preview link on it.

## Next milestone

Staff sign-in at `/admin` (emailed one-time link or Google, editor list kept by Admins),
inline editing for page text, a table editor with Excel import for courses/teachers/calendar,
bulk upload for art and essays, and a Translate button (Claude API) that drafts French and
English for review. Content moves from `src/content/` into Supabase (Postgres + Storage).
