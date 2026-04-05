# Cowlace Wiki — Schema

This wiki follows the LLM Wiki pattern (inspired by Karpathy's gist).
It is the living knowledge base for the Cowlace project — a cattle GPS
tracking system built for Indian free-grazing conditions, starting in Telangana.

## Three Layers

### 1. Raw Sources (read-only, never modified)
- Research links, datasheets, screenshots, field photos
- Stored in `wiki/sources/` or linked externally
- The LLM reads these but never edits them

### 2. The Wiki (LLM-maintained)
- Structured markdown files in `wiki/`
- Organized by domain: `hardware/`, `software/`, `field/`, `business/`
- Interlinked with `[[page-name]]` references
- The LLM owns this layer — updates pages on every new learning

### 3. This Schema (the rules)
- Defines structure, conventions, and workflows

---

## Directory Structure

```
wiki/
├── SCHEMA.md           # This file — rules and conventions
├── index.md            # Directory of all pages with summaries
├── log.md              # Chronological record of ingests and decisions
├── hardware/           # Trackers, components, protocols, power
├── software/           # Server, API, dashboard, mobile app
├── field/              # Real-world deployment, cattle behavior, terrain
└── business/           # Costs, scaling, regulations, market
```

## Page Conventions

Each wiki page uses this format:

```markdown
# Page Title

> One-line summary of what this page covers.

## Content sections...

## Open Questions
- Unanswered questions to investigate

## Related Pages
- [[other-page]] — why it's related
```

## Operations

### Ingest
When new information arrives (research, field test results, user feedback):
1. Read and understand the source
2. Update all relevant wiki pages (a single source may touch 5-10 pages)
3. Add cross-references between pages
4. Log the ingest in `log.md`
5. Update `index.md`

### Query
When answering questions about the project:
1. Search relevant wiki pages
2. Synthesize answer with context
3. If the answer reveals new insight, file it back into the wiki

### Lint
Periodically check for:
- Contradictions between pages
- Stale information (prices, availability, specs that may have changed)
- Orphan pages with no cross-references
- Missing pages (concepts referenced but not yet written)
