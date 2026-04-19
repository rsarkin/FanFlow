# FANFLOW — DESIGN SYSTEM
### Inspired by CRED NeoPOP · Built for Antigravity

---

## PHILOSOPHY

This app should feel like **premium hardware meets stadium energy**.
Every screen is dark, deliberate, and dense with information — yet never cluttered.
Interactions have weight. Buttons feel physical. Numbers are the hero.

Core principles (taken directly from NeoPOP):
- **Information in the spotlight** — hierarchy is aggressive. One thing dominates per screen.
- **Mundane made dramatic** — even a food order confirmation should feel like an event.
- **Real world textures** — depth through elevation and shadow, not gradients.
- **Negative space is intentional** — don't fill every pixel. Let elements breathe with purpose.
- **No border-radius unless it means something** — most containers are sharp-cornered rectangles.

---

## COLOR PALETTE

### Base (Always Dark)
| Token              | Hex       | Usage                                  |
|--------------------|-----------|----------------------------------------|
| `bg-primary`       | `#0D0D0D` | Main screen background                 |
| `bg-secondary`     | `#141414` | Card backgrounds, bottom sheets        |
| `bg-tertiary`      | `#1C1C1C` | Elevated surfaces, modals              |
| `bg-elevated`      | `#242424` | Input fields, active states            |
| `surface-border`   | `#2E2E2E` | All borders, dividers                  |

### Typography Colors
| Token              | Hex       | Usage                                  |
|--------------------|-----------|----------------------------------------|
| `text-primary`     | `#FFFFFF` | Headlines, key numbers                 |
| `text-secondary`   | `#AAAAAA` | Body text, labels                      |
| `text-tertiary`    | `#666666` | Captions, placeholder text             |
| `text-disabled`    | `#3D3D3D` | Disabled state text                    |

### NeoPOP Accent Colors (Signature)
These are the CRED signature — high-contrast, bold, used sparingly as punches of energy.

| Token              | Hex       | Usage                                        |
|--------------------|-----------|----------------------------------------------|
| `accent-yellow`    | `#D5FF5C` | PRIMARY CTA buttons, key highlights          |
| `accent-green`     | `#29CC7A` | Success states, confirmed orders, live score |
| `accent-red`       | `#FF4141` | Errors, exit urgency, danger actions         |
| `accent-cyan`      | `#0EFFE4` | Navigation highlights, live indicators       |
| `accent-white`     | `#FFFFFF` | Secondary CTAs, icon strokes                 |

### Semantic Colors
| Token              | Hex       | Usage                                  |
|--------------------|-----------|----------------------------------------|
| `status-live`      | `#29CC7A` | Live match indicator dot               |
| `status-busy`      | `#FF4141` | High crowd density areas               |
| `status-moderate`  | `#FFB800` | Medium crowd density                   |
| `status-clear`     | `#29CC7A` | Low crowd / fastest exit               |
| `status-offline`   | `#666666` | Offline mode indicator                 |

---

## TYPOGRAPHY

### Font Stack
```
Primary (Headings):   "Cirka" → fallback → Georgia, serif
Secondary (Body/UI):  "Gilroy" → fallback → -apple-system, BlinkMacSystemFont, sans-serif
Mono (Numbers/Codes): "JetBrains Mono" → fallback → monospace
```

> In Antigravity / React Native: use `expo-google-fonts` or bundle locally.
> Circa equivalent available as: `PlayfairDisplay_700Bold` (closest Google Font match)
> Gilroy equivalent: `Nunito_600SemiBold` or `DMSans_500Medium`

### Type Scale
| Name         | Size  | Weight | Font      | Line Height | Usage                        |
|--------------|-------|--------|-----------|-------------|------------------------------|
| `display`    | 48px  | 700    | Serif     | 1.1         | Hero numbers, score          |
| `headline-1` | 32px  | 700    | Serif     | 1.2         | Screen titles                |
| `headline-2` | 24px  | 600    | Serif     | 1.3         | Section headers              |
| `title`      | 18px  | 600    | Sans      | 1.4         | Card titles, item names      |
| `body`       | 15px  | 400    | Sans      | 1.6         | Body copy, descriptions      |
| `label`      | 13px  | 500    | Sans      | 1.4         | Badges, tags, tab labels     |
| `caption`    | 11px  | 400    | Sans      | 1.4         | Timestamps, fine print       |
| `mono-data`  | 20px  | 700    | Mono      | 1.0         | Timers, prices, counts       |

### Typography Rules
- **Numbers are always mono** — queue times, prices, scores all use `mono-data`
- **Headings are always serif** — this is the signature NeoPOP contrast move
- **All caps** for tab labels, badge text, status indicators ONLY
- **No italics** anywhere in the UI
- **Letter spacing** on ALL CAPS text: `0.08em`

---

## SPACING SYSTEM

Base unit: **4px**

| Token   | Value | Usage                               |
|---------|-------|-------------------------------------|
| `xs`    | 4px   | Icon padding, tight gaps            |
| `sm`    | 8px   | Inner element spacing               |
| `md`    | 12px  | Component internal padding          |
| `lg`    | 16px  | Standard padding, card inner        |
| `xl`    | 24px  | Section padding, major gaps         |
| `2xl`   | 32px  | Screen horizontal padding           |
| `3xl`   | 48px  | Between major sections              |
| `4xl`   | 64px  | Hero spacing                        |

**Screen edge padding**: always `24px` horizontal.

---

## BORDER & ELEVATION (NeoPOP Signature)

This is the defining NeoPOP visual — the **hard shadow / flat 3D elevation effect**.
No soft drop shadows. All shadows are solid-color, offset rectangles. Creates a physical, stamp-like feel.

### The NeoPOP Button Shadow Pattern
```
Standard elevation:
  shadowColor:  #FFFFFF (or accent color)
  shadowOffset: { width: 3, height: 3 }
  shadowOpacity: 1
  shadowRadius: 0        ← THIS IS KEY. Radius = 0. Hard edge.

Pressed state:
  shadowOffset: { width: 1, height: 1 }
  translateX: 2, translateY: 2   ← button shifts into the shadow
```

### Border Rules
- **Stroke weight**: always `1px`. Never thicker.
- **Color**: `surface-border` (#2E2E2E) for structural borders
- **Accent borders**: use full accent color at 100% opacity for highlighted/active cards
- **Border radius**:
  - `0px` — Default for all buttons, cards, major containers (SHARP corners)
  - `4px` — Input fields, small chips only
  - `100px` — Pill badges, status dots only
  - NO in-between values.

---

## COMPONENTS

### Button — Primary CTA
```
Background:     accent-yellow (#D5FF5C)
Text color:     #0D0D0D (black on yellow)
Text style:     label, ALL CAPS, letter-spacing 0.08em
Padding:        16px vertical, 24px horizontal
Border radius:  0px (sharp)
Shadow:         3px 3px 0px #FFFFFF (hard white shadow)
Pressed:        shift +2px +2px, shadow shrinks to 1px 1px
```

### Button — Secondary
```
Background:     transparent
Text color:     #FFFFFF
Border:         1px solid #FFFFFF
Text style:     label, ALL CAPS
Shadow:         3px 3px 0px #2E2E2E
Pressed:        same shift pattern
```

### Button — Danger
```
Background:     accent-red (#FF4141)
Text color:     #FFFFFF
Shadow:         3px 3px 0px #7A0000
```

### Card
```
Background:     bg-secondary (#141414)
Border:         1px solid surface-border (#2E2E2E)
Border radius:  0px
Padding:        16px
Active/hover:   border-color changes to accent-yellow
Shadow:         none by default; add 4px 4px 0px accent-color for highlighted state
```

### Input Field
```
Background:     bg-elevated (#242424)
Border:         1px solid surface-border (#2E2E2E)
Border radius:  4px
Text:           text-primary, body size
Placeholder:    text-tertiary
Focus border:   accent-cyan (#0EFFE4)
Padding:        12px 16px
```

### Badge / Tag
```
Background:     accent-color at 15% opacity (use hex + alpha)
Text:           accent-color, label size, ALL CAPS, letter-spacing 0.08em
Border:         1px solid accent-color at 40% opacity
Border radius:  0px (sharp)
Padding:        4px 8px
```

### Crowd Heatmap Dot
```
Clear:    #29CC7A, radius 6px, no border
Moderate: #FFB800, radius 6px, no border
Busy:     #FF4141, radius 6px + pulse animation (scale 1→1.3, opacity 1→0, 1.5s loop)
```

### Bottom Tab Bar
```
Background:     bg-primary (#0D0D0D)
Border top:     1px solid surface-border
Active icon:    accent-yellow tint, label below in accent-yellow
Inactive icon:  text-tertiary (#666666)
Label:          caption size, ALL CAPS, no letter-spacing
```

### Live Indicator
```
Dot:          status-live (#29CC7A), 8px circle
Animation:    pulse — scale 1→1.5, opacity 1→0, infinite 1.2s ease-out
Label:        "LIVE" in accent-green, label size, ALL CAPS
```

---

## ICONOGRAPHY

- **Style**: Line icons only. Stroke weight `1.5px`. No filled icons except for active/selected states.
- **Size grid**: 16px / 20px / 24px / 32px only.
- **Active state**: filled version of the same icon in `accent-yellow`.
- **Recommended library**: `@expo/vector-icons` → Feather icons set (closest to NeoPOP line style).
- **No rounded icon containers**. Icons sit naked or inside a sharp-cornered `bg-tertiary` square.

---

## MOTION & ANIMATION

NeoPOP animation principles — **physical and intentional**:

| Interaction          | Animation                                  | Duration  | Easing             |
|----------------------|--------------------------------------------|-----------|--------------------|
| Button press         | Scale 0.97 + shadow shrink                 | 80ms      | `ease-in`          |
| Screen transition    | Slide from right (standard push)           | 300ms     | `ease-in-out`      |
| Bottom sheet appear  | Slide up from bottom                       | 350ms     | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Card tap             | Scale 0.98                                 | 100ms     | `ease-in`          |
| Success state        | Scale 1→1.05→1 + color flash               | 400ms     | `spring`           |
| Number change        | Count-up animation                         | 600ms     | `ease-out`         |
| Live pulse dot       | Scale + opacity loop                       | 1200ms    | `ease-out infinite`|
| QR reveal            | Fade in + scale from 0.8                   | 250ms     | `ease-out`         |

**Rules:**
- No slide-left/right for tabs — use **fade + scale** (0.95 → 1)
- All transitions under **400ms**
- Haptic feedback on every primary CTA tap (use `expo-haptics`, `impactAsync('medium')`)
- Loading states: use **skeleton screens**, never spinners

---

## SCREEN LAYOUT TEMPLATES

### Standard Screen
```
StatusBar:        dark background, light icons
Header:           24px padding, back arrow (left), title (serif, headline-2), optional action (right)
Content:          24px horizontal padding, scrollable
Bottom action:    fixed, 24px padding all sides, primary CTA full width
Safe area:        respect top and bottom insets
```

### Data-Dense Screen (Map, Stats)
```
Header:           minimal — icon + title only, no padding waste
Content:          edge-to-edge, no horizontal padding on the map/canvas
Overlay cards:    float above content, bg-secondary, sharp borders, 16px padding
```

### Full-Screen Modal / Bottom Sheet
```
Handle:           2px × 32px bar, surface-border color, centered, 12px from top
Background:       bg-secondary
Max height:       85% of screen
Content:          24px padding
```

---

## FANFLOW-SPECIFIC PATTERNS

### Crowd Density Display
Use a row of color-coded bars (not a pie chart, not circles) — horizontal bars that fill based on density percentage. Sharp corners. Color transitions from `status-clear` → `status-moderate` → `status-busy`.

### Queue Time — The Hero Number
When showing wait time, it must be:
- `display` size (48px), mono font, `text-primary` white
- Unit ("min") in `body` size, `text-secondary`, same line
- Gate label in `caption` size, `text-tertiary`, above the number
- Zero decoration around it — just the number, dominating the card.

### Food Order QR Card
```
Card: bg-tertiary, sharp border, accent-yellow border (1px)
QR code: white on black, centered, 200×200px, 16px internal padding
Order ID: mono-data style, below QR
Status badge: top-right corner, sharp, accent-green for confirmed
```

### Score / Live Match Widget
```
Team names:     title size, text-secondary
Score numbers:  display size (48px), serif, text-primary
Separator:      thin vertical line, surface-border
Live dot:       top-right, animated pulse, accent-green
Background:     bg-tertiary card, accent-cyan left border (4px thick)
```

---

## ANTIGRAVITY PROMPT HEADER

Paste this at the start of every Antigravity / Cursor / Windsurf session:

```
You are building FanFlow — a dark-themed stadium companion app.

DESIGN RULES (non-negotiable):
1. Background is always #0D0D0D. Never white. Never light mode.
2. No border-radius on cards, buttons, or containers. Sharp corners only. Exception: input fields use 4px.
3. Primary CTA uses #D5FF5C (yellow-green) text, black (#0D0D0D) text on top, 0px border-radius, hard shadow: 3px 3px 0px #FFFFFF.
4. Buttons have a physical pressed state: shadowOffset shrinks + component shifts 2px right/down.
5. Headings use serif font (PlayfairDisplay or Cirka). Body uses sans-serif (DM Sans or Gilroy).
6. Numbers (prices, times, scores, counts) always use monospace font (JetBrains Mono).
7. All badge/tag/label text is ALL CAPS with letter-spacing 0.08em.
8. Colors: bg #0D0D0D, cards #141414, elevated #1C1C1C, borders #2E2E2E, accent yellow #D5FF5C, accent green #29CC7A, accent red #FF4141, accent cyan #0EFFE4.
9. Icons: Feather icon set, stroke only (1.5px), no filled icons except active state.
10. Haptic feedback on every primary button press using expo-haptics impactAsync medium.
11. Loading states use skeleton screens. No spinners.
12. Animations are fast and physical: button press 80ms, screen transitions 300ms, springs for success states.
```

---

## DO / DON'T QUICK REFERENCE

| DO                                          | DON'T                                      |
|---------------------------------------------|--------------------------------------------|
| Sharp corners on everything                 | Round cards or buttons                     |
| Serif headings                              | Sans-serif everywhere                      |
| Mono font for all numbers                   | Regular font for timers/prices             |
| Hard 3px solid-color shadows on CTAs        | Soft drop shadows (blur > 0)               |
| Dark background (#0D0D0D) throughout        | Light mode or mixed theme                  |
| Single dominant accent color per screen     | Rainbow of colors on one screen            |
| Aggressive whitespace around hero elements  | Filling every pixel                        |
| Physical button press (shift + shrink)      | Simple opacity change on press             |
| Skeleton loading screens                    | Spinners or loading text                   |
| Haptic feedback on CTA tap                  | No haptics                                 |
| Status indicators as small dots with labels | Full-color banners for status              |
| Numbers as the visual hero                  | Icons as the visual hero                   |
