# AGENTS.md

## UI changes: follow the Afram design repo

Before any change to UI (markup, styles, copy, layout, components), read and follow
**[Afram-Tech/afram-design](https://github.com/Afram-Tech/afram-design)**. It holds the design
principles, UI rules (spacing, type, colour, tone, accessibility), tokens, component notes,
prototypes, and the PR design checklist.

How to reach it:

1. **MCP (preferred):** the `afram-design` server in [.mcp.json](.mcp.json). Call
   `design_overview` first, then `read_design_doc` for the principles and
   `apps/afram-website.md`. It needs the design repo cloned beside this one (`../afram-design`).
2. **Files:** read `../afram-design/README.md` and follow its order.
3. **Ticket designs:** files attached to the Linear ticket win for that screen's layout and
   content. The design repo's rules still apply.

Paste the completed `templates/pr-design-checklist.md` from the design repo into every PR that
changes UI.

## This repo

The marketing site shares the brand but has its own scales (`brand-*`, `ink-*`); read
`apps/afram-website.md` in the design repo. Ignore the brand section of `.claude/UI_UX/SKILL.md`:
it was written for a different product.
