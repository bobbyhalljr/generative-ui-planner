# Generative UI Planner

A tiny TypeScript component planner inspired by CopilotKit's October 9, 2026 Open Intelligent UI announcement.

It selects an owned line-chart or data-table plan without inventing missing measurements. No API key, dependencies, or generated code execution.

## Article

Article URL will be added after publication. The complete preview is in [article.md](article.md).

## Prerequisites and commands

Node.js 22.20 or later. Native type stripping executes TypeScript without compiling it and does not perform type checking.

```bash
git clone https://github.com/bobbyhalljr/generative-ui-planner.git
cd generative-ui-planner
node --experimental-strip-types test.ts
```

Expected final output:

```text
18/18 checks passed
complete: line-chart (complete-regular-series)
missing: data-table (missing-values)
```

See [test-output.txt](test-output.txt) for all checks.

## Policy

Malformed envelopes or rows throw. Valid rows select a table unless they form a complete, strictly chronological, equally spaced series of at least three points in one exact unit string. Zero and negative numbers are valid. Null stays null. Extra fields are excluded and input is not mutated. Input is limited to 100 rows.

[fixtures.json](fixtures.json) is an illustrative missing-value payload. Numbers are synthetic.

## Files

- planner.ts: runtime validation and component choice.
- test.ts: 18 behavioral checks and two output examples.
- fixtures.json: illustrative input.
- images/: cover and explanatory diagrams, plus editable SVG sources.
- article.md: full article.
- social-cuts.md: publishing cuts.

## Limits

Returns plans only, with no React renderer, API integration, or model evaluation. It is not an AG-UI or A2UI implementation, sandbox, CSP, or authorization layer. Chart eligibility is a deliberately conservative local product policy. Real renderers need escaping, accessibility, units, provenance, gap semantics, and honest axes. This policy does not establish statistical validity or source truth.

## Primary references

- https://www.copilotkit.ai/blog/introducing-open-intelligent-ui (October 9, 2026)
- https://github.com/CopilotKit/OpenIntelligentUI
- https://nodejs.org/api/typescript.html

MIT license.
