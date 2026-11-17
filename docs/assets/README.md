# Visual roles

| Role | Light | Dark | Icon | Meaning |
|---|---|---|---|---|
| You decide | `#b51f33` | `#ff6470` | person | Your core message, choices, activity, verdict and own words |
| Your agent | `#2f5bea` | `#7c9cff` | checkbox | Technical work: building, testing, hosting and checks |
| Route and what you keep | `#0e7c7b` | `#2fb8b0` | knotted thread | The route, named methods, the method card and what you keep |
| Neutral | `#59636e` | `#9198a1` | none | Infrastructure, notes and facts |

Where each role appears:

- **Badges** double as the legend: `you decide` carmine, `your agent` blue, `you keep` teal, then the
  licence in grey.
- **Pictures:** `route-*` is the main diagram (one route, two roles), `competence-*` the coaching
  principle, `reveal-*` Lea's predict-then-reveal example (teal for interest on interest, grey for the
  comparison). The social preview is the riso print.
- **Icons:** a 14 px `icon-you.svg` marks the four moments where your view comes first
  (`alt="your view first"`), in the README and in the route of `docs/START-HERE.md`.
- **Mermaid:** role strokes on GitHub's theme fills (`README.md`, setup and cost); the sequence diagram
  in `docs/START-HERE.md` groups its actors in transparent role tints.

For new visuals:

- Supply matching light and dark SVGs with the same geometry and wording, viewBox width 1100.
- Font stack: `-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif`.
- `role="img"`, a title and a description (a title suffices for an icon), full alt text where
  embedded, no metadata or editor attributes.
- Colour never works alone: pair it with a label or icon. No coloured emoji, gradients or tinted
  fills.
- Preview both themes at 1100 and 830 px; keep PNG previews outside the repository.
