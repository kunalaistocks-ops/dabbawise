# Cross-project component reuse register

Updated: 2026-10-16. Evidence levels: **tested by user**, **code inspected**, **planned/unverified**.

| Capability | Source project | Evidence | Reuse action |
|---|---|---|---|
| Google OAuth and Supabase session | dabbawise | User confirmed successful Google sign-in; account.js inspected | Retain existing working integration. Extract provider-neutral session helper only after regression tests. |
| Email magic-link login | dabbawise | account.js inspected | Reuse UI/session error patterns, test link redirects independently. |
| Email login and saved follow state | followthemoney | Previously user-tested; package.json inspected, implementation files not yet located | Compare Supabase persistence, error states, and account UX once source located. |
| Cloud backup with explicit consent | dabbawise | cloud-sync.js inspected; earlier failures reported | Reuse consent/allowlist pattern, not unverified restore correctness. |
| USDA authenticated lookup | dabbawise | usda-live.js inspected; prior banana lookup test reported | Reuse authenticated edge-function pattern for nutrition worksheet; validate CORS and data basis. |
| Recipe moderation and RLS | dabbawise | DB policies inspected in earlier development | Reuse review/approval pattern, never share privileges across projects. |
| Responsive navigation and feature carousel | dabbawise | Code built, visual feedback received | Extract styling and accessibility patterns after mobile QA. |
| Kunal AI site components | kunalai-site | Repository discovered, not audited | Inspect before reuse. |
| TheVix and mental maths | Not found in current accessible GitHub owner listing | Product concepts known; no source verified | Do not claim reusable tested code until connected/retrieved. |

## Rules
1. Reuse **patterns and reviewed code**, never Supabase project URLs/IDs, OAuth credentials, secrets, user profiles or tokens across applications.
2. Keep separate OAuth redirect allowlists, row-level security, environment variables and consent/privacy policies.
3. Require a functional test in the destination application before labelling a reused feature complete.
4. Prefer small, versioned shared modules and regression tests over copying entire pages.
5. Maintain per-project checklists for auth, session restore, login/logout, error handling, cloud persistence, mobile and accessibility.

## Next actions
- Locate FollowTheMoney implementation files and compare auth/session and persistence behavior.
- Add regression tests for Dabbawise Google login and cloud backup before refactoring.
- Extract a reusable Supabase client/session helper only after proving no regression.
- Review kunalai-site navigation components; no wholesale copying.
