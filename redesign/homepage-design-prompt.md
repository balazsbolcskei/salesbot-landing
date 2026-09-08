# SalesBot Homepage — Claude Design Prompt

Build a single-page marketing homepage for **SalesBot**, an AI SDR platform. One self-contained HTML file (inline CSS + vanilla JS, no frameworks, no external assets except Google Fonts "Inter"). Production quality, fully responsive.

## Design direction — "aurora scrollytelling"

The site must feel like a living instrument the visitor plays by scrolling — not a SaaS template. Near-black ground, one signature aurora gradient (from the logo), huge typography, and **scroll-scrubbed graphics**: line art and scenes that draw themselves as you scroll down and un-draw when you scroll back. The scrollbar is the playhead. Bold, but disciplined: color lives ONLY in the aurora accents; everything else is monochrome.

**Brand system (derived from the official SalesBot logo — keep exactly):**
- Background: `#050507` (base, near-black — the black ground stays), `#0b0b12` (raised surfaces)
- Text: `#f7f7fa` (primary, the wordmark white), `#9b9bb0` (dim), `#63637a` (muted)
- Aurora accents (the logo mark gradient): `#a76bff` (purple) → `#45c6f2` (cyan) → `#2fdfa4` (green) → `#f29b3f` (amber)
- Signature gradient: `linear-gradient(115deg,#a76bff,#45c6f2 38%,#2fdfa4 68%,#f29b3f)` — used for drawn strokes, key words, button fills, node glows. Never as a full-section background wash.
- Hairlines: `rgba(255,255,255,.08)`; bright: `rgba(255,255,255,.2)`. Neutral — color is reserved for the aurora.
- Logo: official horizontal logo (gradient mark + white wordmark) in the navbar and footer.
- Type: display = a wide geometric futuristic face (e.g. "Unbounded" or similar), weight 500–700, used ONLY for h1/h2 and the giant closing lines; body = Inter 400; utility = mono stack for eyebrows, metrics, tabular numbers.

**Graphic language — the S-flow:**
- The logo mark is an S-shaped channel flowing through a tile. That S-curve is the page's drawing motif: **serpentine aurora paths** that snake through sections, connecting them — the visual metaphor is the pipeline itself (prospect flows in at the top, meeting comes out the bottom).
- These paths are SVG strokes with the aurora gradient, 2–3px, with soft glow; nodes sit on them like stations.
- Soft aurora light blooms bleeding from section edges (radial gradients at low opacity); faint film grain at ~3%.
- Hairline borders, no heavy card shadows, no glassmorphism.
- Metrics huge in mono with aurora-gradient text fill.

**Motion — scroll-scrubbing (this is the signature; NOT one-shot reveals):**
- All key animation is **linked to scroll position and fully reversible**: scroll down → draws; scroll up → un-draws. Implement by mapping each element's viewport progress (0→1) to `stroke-dashoffset`, `opacity`, `transform` in a single rAF loop. No animation libraries; vanilla only.
- Hero: a full-width serpentine aurora path draws itself on load behind the headline, then scrubs (shifts/extends) with the first scroll; headline words stagger in on load.
- **Pinned scrollytelling for the 6-step "solution"**: the section pins (sticky, ~500vh scroll length); a large S-path draws from node 01 to 06 as you scroll, each node ignites in sequence, step text crossfades in sync. Scrolling back rewinds the whole scene.
- Section content (headings, lists, cards): scrubbed fade+rise tied to progress — reversible, staggered by offsetting each child's progress window.
- Stats/results: numbers scrub with progress (they count up as you scroll in, down as you scroll out).
- ROI calculator: values update live as sliders move, odometer tick.
- Logo strip: slow infinite marquee (time-based is fine here), pauses on hover.
- Sticky translucent navbar (blur), hairline bottom border after 40px.
- Respect `prefers-reduced-motion`: static drawn state, no scrubbing, instant opacity.
- 60fps discipline: transform/opacity/stroke-dashoffset only; read scroll once per frame; no layout thrash.

**Buttons:** primary = aurora gradient fill with near-black text (high contrast against the dark page), glow on hover, arrow → nudges right; secondary = white hairline outline. Subtle magnetic hover (≤4px) on desktop only.

---

## Page structure & copy (use verbatim, don't rewrite)

### 1. Hero
- H1: **Stop chasing leads. Start closing deals.**
- Sub: SalesBot is an AI SDR that identifies key B2B decision-makers, starts authentic conversations, qualifies prospect interest, and hands off ready meetings to your team.
- CTA 1 (primary): **Book a free demo** · CTA 2 (secondary): **See how it works**
- Background: the serpentine aurora path draws itself behind the headline on load; one node on it pulses brighter — a "meeting booked" moment.

### 2. What is B2B outreach? (two-column contrast block)
Left — heading: **B2B outreach is not…**
- Posting on LinkedIn and praying someone messages you. *(That's hope marketing.)*
- Blasting 10,000 emails to purchased lists. *(That's spam.)*
- Running Google Ads and waiting for clicks. *(That's inbound marketing.)*
- Cold-calling executives during dinner. *(That's telemarketing.)*
- Sending a monthly newsletter to existing contacts. *(That's audience nurturing.)*

Right — heading: **B2B outreach is…**
Hand-picking your exact target decision-maker, starting a 1-on-1 conversation on LinkedIn or email, and securing a meeting if they have the problem you solve.
In short, you go straight to the person holding the budget and start a business conversation.

Design: the "not" list dimmed/struck-through styling with muted labels; the "is" side glowing, elevated. Items stagger in alternately.

### 3. The solution — 6 steps (scroll-drawn vertical line)
Heading: **SalesBot is an agency-grade outreach engine (minus the agency retainer)**
Intro: Forget traditional LinkedIn messaging. SalesBot is an all-in-one AI platform, backed by thousands of campaigns, ~500 clients, and billions in actual revenue.

Steps (numbered nodes on the drawn line):
1. **LinkedIn Optimization** — We optimize your profile so prospects trust you the second they click.
2. **Campaign Design** — We craft messaging and follow-up sequences built around your target buyers, industry, and pitch.
3. **Database Building** — We research and identify the decision-makers most relevant to your business.
4. **Campaign Launch** — We reach thousands of decision-makers directly every month on LinkedIn and email.
5. **Lead Qualification** — The AI pre-screens leads, manages conversations, and answers questions automatically, always staying true to your custom tone of voice.
6. **Meeting Handoff** — It books confirmed sales calls directly into your calendar. You just show up and close.

### 4. What you get
Heading: **A complete sales engine to stop you from living in LinkedIn DMs**
- A compelling LinkedIn presence that stands out in your market
- A complete lead generation strategy from a proven B2B agency
- A continuously growing database of potential buyers
- Direct connections with the right decision-makers
- Genuine, double-qualified leads and proposal requests
- A CRM with every lead, conversation, and booked meeting in one place, including pipeline, timeline, and AI analysis of where things stand.
- An AI sales assistant that follows up in your own tone of voice and books meetings

Design: minimal checklist grid, hairline separators, tiny violet check nodes.

### 5. CTA block
Heading: **Ready to put your cold outreach on autopilot?**
In a free 30-minute demo, we show exactly how SalesBot would work for your market and your ideal clients.
CTA: **Book a demo now**

### 6. ROI Calculator (interactive)
Heading: **Calculate the volume of business SalesBot can generate for you**
Sub: Set the parameters and see the estimated results in real time.
Inputs: number of LinkedIn profiles (slider 1–10), lead→proposal % (default 30), proposal→close % (default 40), average deal value (€, default 5,000).
Live outputs (odometer tick): database size (profiles×500), monthly reach (profiles×2000+), decision-makers reached (profiles×200+), warm leads (profiles×10–15), proposals, closed deals, projected revenue range.
Design: dark instrument panel, violet slider tracks, tabular numbers.

### 7. Companies & results
Heading: **Good company? You'll be in great company.**
Sub: SalesBot has supported roughly 500 businesses, driving billions in total generated revenue.
Label: *Trusted by industry leaders* → logo marquee: SAP, Hexagon, Generali, Mitsubishi Electric, Wellis, BNI (render as clean text placeholders in muted tone; grayscale, brighten on hover) — caption: *— and hundreds of international SMEs*

Stat trio (count-up):
- **3M €** — Extra revenue in 9 months, with a single client.
- **72** — New clients in the first year with one SalesBot campaign.
- **300k USD+** — Sales pipeline generated typically within the first 3 months.

### 8. Who it's for
Heading: **Is SalesBot right for you?**
If you sell to other businesses and have at least 50 potential clients on your radar, yes.
- **Primary users:** Business owners, sales leaders, and growth marketers.
- **Industry fit:** Professional services, manufacturing, trade, consulting, or any B2B sector.

### 9. Success stories
Heading: **Explore how our client partnerships translate into pipeline growth**
3 case-study cards (placeholder title + one-line result + "Read the story →"), hairline cards that lift 4px + glow border on hover.

### 10. How to get started + Pricing (one combined section, two columns)
Heading: **Up and running in 3 simple steps**
Left — steps:
1. **See it in action** — Book a quick demo to see how SalesBot works for your specific target buyers.
2. **Fill out a questionnaire** — Answer a few simple questions about your offer. We build your entire campaign from scratch.
3. **Turn on autopilot** — SalesBot handles outreach, follow-ups, and pre-screening. You just show up to sales calls.

Right — price card (the ONLY pricing on this page):
- Label: Pricing → **149€** */ month* (rendered huge, € as violet italic)
- Bullets: No marketing expertise required · Only one LinkedIn profile needed · Works for local and international markets · Continuously new campaigns
- CTA: **Book a demo now →**
- Card: raised surface `#0c0820`, hairline border, soft violet glow.

### 11. FAQ (accordion, thin +/− toggles)
Heading: **Frequently Asked Questions** — sub: Everything you need to know about SalesBot before getting started.
Use these 10 Q&As verbatim:
1. **Is SalesBot safe for my LinkedIn account?** Yes. SalesBot mimics natural human messaging rhythms, uses official APIs and proven tools, and every client runs in their own dedicated environment.
2. **Do I need marketing experience to use SalesBot?** No marketing experience or internal team is required. SalesBot and our team handle everything, from audience research and campaign planning to copywriting and execution. You only step in to take the sales calls.
3. **What parts of the B2B sales process does SalesBot automate?** SalesBot automates the entire outbound B2B pipeline: ideal customer profiling, message copywriting, multi-channel outreach, follow-up sequences, lead qualification, and calendar booking.
4. **What reporting and analytics does the SalesBot dashboard provide?** SalesBot provides real-time dashboard transparency. You can track targeted decision-makers, outgoing sequences, active reply rates, conversation statuses, and AI qualification notes.
5. **What languages does SalesBot support for B2B outreach?** SalesBot natively communicates in English and Hungarian out of the box, and can be configured to run campaigns in any target market language worldwide.
6. **What average results and pipeline growth can I expect from SalesBot?** Most SalesBot clients see significant pipeline growth within 3 months, typically closing 30–70+ new business clients in their first year depending on market size and offer value.
7. **Is my target audience active on LinkedIn?** Almost certainly. LinkedIn hosts over 1 billion professionals, including decision-makers in B2B services, manufacturing, consulting, and trade. We confirm your exact audience size during the initial demo call.
8. **What is the onboarding process and timeline for SalesBot?** Onboarding takes 1–2 weeks: after a demo call and a 5-minute setup questionnaire, our team builds your strategy and launches your continuous, automated background campaigns.
9. **What exactly does the SalesBot AI do?** The SalesBot AI acts as an automated sales assistant: it answers technical questions, addresses common objections, maintains your exact brand tone, pre-screens warm leads, and books meetings directly to your calendar. Every message operates under human oversight using our proprietary ruleset.
10. **Can I scale or launch new target campaigns on SalesBot continuously?** Yes. SalesBot is designed for long-term growth, allowing you to launch new campaigns, test new markets, try international targeting and new strategies at any time.

### 12. Closing CTA (full-viewport moment)
Three stacked lines revealing on scroll, each larger:
**AI speed.**
**World-class B2B strategy.**
**A fraction of the cost of a traditional sales rep.**
CTA: **Book a demo** — the S-flow path returns behind it, scrubbing toward and converging on the button as you scroll.

### Navbar & footer
- Navbar: "SalesBot" wordmark (dot on the "o" pulses violet) · links: How it works, Features, Pricing, About, Contact · right: "Book a demo" primary button + "HU" language toggle.
- Footer: minimal — wordmark, nav links, legal links (Privacy Policy, Terms), © SalesBot.

## Hard rules
- All "Book a demo" CTAs open a modal or link to `#demo` (stub is fine).
- No stock illustrations, no emoji icons, no generic SaaS gradients beyond the official aurora; the S-flow paths + typography carry the visual identity.
- Mobile: single column, paths simplified (shorter, pre-drawn where pinning is impractical), marquee still runs, tap targets ≥44px.
- Semantic HTML, accessible accordions (`<details>` ok), visible focus states, WCAG AA contrast for body text.
