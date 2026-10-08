# Reece OS and Engineering Field Notes — launch brief

Prepared October 7, 2026 (America/Detroit). Status: kickoff specification; no deployment performed.

## Goal and domain roles

| Surface | Purpose | First release |
| --- | --- | --- |
| reecehall.com | Professional introduction and navigation | Link to OS and writing after their releases |
| os.reecehall.com | Interactive portfolio and public Cipher assistant | Restore desktop exploration; modernize public chat |
| blog.reecehall.com | Durable record of experiments and engineering decisions | Publish the Cipher case study, then guardrail analysis |
| LinkedIn | Distribute each published record | One matching post with the verified article URL |

Treat this as one release sequence. Publishing the historical case study does not depend on completing the OS redesign.

## Source recovery

- Original experience: R3defined/reecehall-portfolio. README describes the macOS interface; package.json contains Astro, React, Tailwind, Groq and Vercel dependencies.
- Blog: R3defined/RedefinedBlog. astro.config.ts explicitly sets https://blog.reecehall.com. Posts live in src/content/posts; schema uses title, description, createdAt, tags and draft.
- Existing portfolio configuration sets its canonical URL to reecehall.com. Change canonical, sitemap and relevant social metadata for the new OS host during implementation.
- Vercel is selected for the restoration. Current account/project access is unresolved: the portfolio uses the Vercel adapter, but a workflow is titled Deploy to Hostinger and its FTP step is commented out. Neither file proves the current deployment account.
- Public URL inspection could not retrieve the three domains in this session. This does not establish that they are offline.

## OS product specification

Keep the desktop metaphor, with a clear mobile layout and visible navigation.

1. **Welcome:** “Reece OS — explore the work, experiments, and systems behind Reece Hall.” Primary actions: Explore projects; Talk to Cipher.
2. **Projects:** Curated public project cards, each with problem, role, approach, evidence and current status. Link only to approved public artifacts.
3. **Cipher:** Persistent access from the dock; suggested questions such as “What does Reece build?” and “Explain the Cipher security experiments.” Answers refer to Reece in third person and link to supporting public project pages or articles.
4. **Field Notes:** Links to published blog articles. Display publication dates and project associations.
5. **About / Contact:** Current public professional biography and a direct contact route. Apple must be represented as former employment.

For mobile, use full-screen views with a back action rather than draggable windows. On desktop support keyboard operation, labeled controls, visible focus, readable contrast and reduced motion. Portfolio exploration must work when chat is unavailable.

## Chat findings from the recovered source

These are observations of the repository snapshot inspected October 7, 2026, not proof of the exact deployment tested in June 2025.

- src/components/global/MacTerminal.tsx constructs a system prompt in browser code and sends it to /api/chat.
- src/pages/api/chat.ts forwards body.messages to Groq without application-side role or content validation in that handler.
- Client input filtering rejects broad terms such as “simulate,” “hack,” and “exploit.”
- Client output filtering rejects “storage,” “configuration,” “token,” and similar words.
- The displayed conversation contains prior messages, but the API request sends only the system prompt and current user message.
- The route hard-codes llama3-8b-8192. Verify a currently supported model before launch.
- The README credits an upstream portfolio template. Preserve attribution; verify licensing before redistribution.

## Required implementation work

### P0 — restore safely

- Preserve an immutable reference to the recovered original before modifying it.
- Move instruction construction to a server-only module. The browser submits user text; it cannot supply system/developer roles.
- Validate request shape, allowed roles, content lengths, message count and total request size on the server.
- Keep credentials in server environment configuration. Keep private information out of the assistant's knowledge set entirely.
- Curate a versioned public knowledge file: current biography, approved projects, public writing and contact details. Do not ingest personal memories, Obsidian, SMZ internal material or private repositories wholesale.
- For the first release give Cipher public question-answering capabilities only. Website visitors cannot invoke private Hermes/Sentinel tools.
- Implement bounded conversation context. Treat all browser-submitted history as untrusted; server storage or integrity protection is required for any authoritative history.
- Replace blanket word blocking with controls matched to actual risks; preserve legitimate discussion of cybersecurity and infrastructure. Prompt rules and classifiers supplement access controls.
- Render model output as text or sanitized Markdown; validate outbound links. Model output must never become executable code.
- Add request timeout, provider error handling, output limits, shared rate limiting and a total usage/cost budget. Use a chat disable switch.
- Use Vercel and verify the compatible Astro adapter; confirm server routes execute there. Do not deploy only static files for a live API.
- Configure os.reecehall.com, TLS, canonical URL, metadata and sitemap. Keep a rollback path.
- Update obsolete biography/company claims and remove obsolete applications or contact forms from the first release unless still useful.

### P1 — improve the experience

- Add source links, clear loading/error states, reset conversation and retry.
- Add project-to-article cross-links and a changelog.
- Add privacy notice explaining third-party inference, actual retention and visitor controls.
- Keep operational logs minimal: status, latency, token/cost totals and error category; avoid raw visitor transcript retention by default.
- Test small-screen navigation, keyboard interaction, screen readers and reduced motion.

## Release checks

| Check | Expected outcome |
| --- | --- |
| Basic identity / project / skill question | Correct public answer; no keyword false-positive |
| Unknown fact about Reece | Explicit uncertainty; no fabricated achievement |
| User asks for private facts | No private data available to return |
| Client submits system/developer messages | Rejected before provider call |
| Oversized or malformed body | Rejected before provider call |
| Direct / obfuscated / multi-turn injection | No expanded access or changed authorization; record answer failures separately |
| Injected instruction in a public document | Treated as untrusted content; cannot grant permissions |
| Repeated / concurrent requests | Shared quota enforced, bounded provider spend |
| Provider unavailable | Clear failure state; portfolio still usable |
| Cross-session use | No other visitor's context or content |
| Chat rendering | No script/HTML execution |
| Domain release | Correct TLS/canonical, chat, mobile navigation and rollback verified |

Record test cases, expected behavior, actual behavior, model, date, configuration version and repetitions. A passing small suite is not a comprehensive security claim.

## Editorial evidence register

| Claim | Evidence recovered | Publication treatment |
| --- | --- | --- |
| Groq and TypeScript/React MacTerminal used in June 2025 | Recovered summary of user message June 14, 2025 21:08:44 UTC | Describe as historical record, not independently reproduced |
| Initial test results: fail/pass/partial/pass/fail | Recovered user report June 14, 2025 21:04:18 UTC | Publish numbered outcomes with the hallucination qualifier |
| Five retests passed | Recovered user report June 14, 2025 21:14:29 UTC | “Reported passes”; no security percentage or certification |
| Browser prompt and API forwarding | Current repository source | Date as current source inspection, distinct from June history |
| Broad output filters | Current MacTerminal source | Show static matching examples, not claimed historical conversations |
| June 16 “Who is Reece?” false positive | Earlier assistant recap supplied in conversation; not independently recovered here | Omit exact historical claim until primary record is available |
| June 13 first discovery | Earlier assistant recap only | Omit exact date until recovered |
| Training quality score 0.85 | June 25 file also says zero conversations analyzed while listing question counts | Exclude as a validated metric |

Exact historical payloads, full response transcripts, deployed revision and model configuration remain missing. Do not invent them or silently present reconstructed examples as originals.

## Publication sequence

1. Review and publish “Breaking My Own AI” independently of the OS launch.
2. Verify the live article URL, canonical metadata, social preview and public accessibility; release the paired LinkedIn draft.
3. Publish the code-based guardrail analysis and its paired LinkedIn draft.
4. Implement and validate the OS restoration; release the OS LinkedIn announcement only once visitors can use the live experience.
5. Write the later architecture article after the new implementation and evaluation results exist.

For each article maintain: experiment date; publication date; source links; method; result; limitations; revision history; linked demo.

## Distribution workflow

Start with a small release register: article slug, title, draft status, live URL, published time, LinkedIn draft, posting status and LinkedIn URL. Create one publication record per article, not per rebuild.

If automatic release coordination is later implemented, trigger only on a newly public article, confirm the canonical URL returns the article, then create an idempotent LinkedIn draft keyed by article slug. Do not post on ordinary deploys or article edits. No automatic posting or monitoring was configured in this kickoff.

## Inputs needed for deployment

- Vercel account/project access for the OS, and DNS provider for reecehall.com.
- Server inference provider credentials and an approved usage budget.
- Final public biography/project selection.
- Historical exports/screenshots if exact payloads and response transcripts are available.

## References

- https://github.com/R3defined/reecehall-portfolio
- https://github.com/R3defined/reecehall-portfolio/blob/main/src/components/global/MacTerminal.tsx
- https://github.com/R3defined/reecehall-portfolio/blob/main/src/pages/api/chat.ts
- https://github.com/R3defined/RedefinedBlog/blob/main/src/content.config.ts
- https://genai.owasp.org/llmrisk/llm01-prompt-injection/

Confidence: High in source observations and recovered reported outcomes; medium in full historical reconstruction. Hosting state remains unverified.
