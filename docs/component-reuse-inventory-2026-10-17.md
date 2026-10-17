# The Parent Kitchen — cross-project component inventory
Snapshot: 17 October 2026. Evidence-based, not a claim of production completeness.

| Capability | Origin | Status | Reuse approach | Gate to release |
| --- | --- | --- | --- | --- |
| Google OAuth and email magic link | Parent Kitchen `account.js` | Previously reported tested; not retested this run | Keep the current app's Supabase Auth instance, callback URL and account-specific configuration | Verify sign in/out, callback, mobile redirect with two accounts |
| Auth-state unsubscribe and error handling | FollowTheMoney `app/account/page.jsx` | Implemented; inspected, not runtime-verified | Adapt lifecycle and error-handling patterns, not the React component | Test session restore and navigation |
| Supabase client initialization | FollowTheMoney `lib/supabase.js`; Parent Kitchen `account.js` | Implemented; inspected | Keep one client per project with app-specific env, never copy credentials | Verify project separation and OAuth routes |
| Cloud snapshot allowlist, owner-only RLS | Parent Kitchen `cloud-sync.js`, `app_snapshots` | Implementation and DB policies inspected; round-trip unverified | Use explicit consent and per-user ownership | Browser restore using two independent parents |
| Consent-before-analytics | kunalai-site `consent.js` | Implemented; inspected, not browser-tested | Reuse consent pattern only if optional analytics are introduced | Opt-in and revocation test |
| Cook Together approved photo renderer | Parent Kitchen `cook-together-photos-v30.js` | **Locally tested** (4 positive/negative Node cases, 16 Oct); **not integrated** | Render only public-bucket HTTPS URLs from this Supabase origin | Wire JS and CSS into index; browser and moderation tests |
| Cook Together moderator photo workflow | Parent Kitchen `recipe-review-v23.js` | Implemented; end-to-end unverified | Review then publish; preserve private source images | Resolve public orphan cleanup before enabling photo publication |
| Food Truths evidence workflow | Parent Kitchen `food-truth-editor-v27.js` | Implemented; no verified catalogue records as of this snapshot | Source-backed editorial intake, no fabricated labels | Review real evidence and verify records |
| USDA ingredient match | Parent Kitchen `usda-ingredient-matcher-v26.js` | Implemented; edge function ACTIVE; remote functional test pending | Require explicit parent match and raw/cooked selection | Test real API success/failure with signed-in user |
| Nutrition worksheet | Parent Kitchen `recipe-nutrition-worksheet-v25.js` | Implemented; calculations not independently validated | Reuse per-100g scaling, keep missing nutrients as missing | Unit-test servings, blank values, out-of-range, NaN |
| React component reuse | FollowTheMoney -> Parent Kitchen | **Proposed** | Translate logic into plain JS only where valuable | Manual review, browser regressions |

Security boundaries: never reuse Supabase project IDs, keys, database sessions or user data across apps. Do not share OAuth redirect allowlists across sites. Treat a Vercel READY state as deployment success, not functional test success.

## 17 October read-only checks
- GitHub repositories accessible: `dabbawise`, `followthemoney`, `kunalai-site`, `equity-research`. No repository for TheVix or Mental Maths was visible.
- Parent Kitchen production database: 0 community recipes, 0 published recipes, 0 Food Truths records, 0 verified products; 1 moderator.
- USDA edge function: ACTIVE, JWT verification enabled.
- Latest inspected Parent Kitchen Vercel production deployment: READY from main branch.
- Storage policies do **not** currently include a moderator DELETE policy for the `parent-recipe-public` bucket. Therefore a failed DB update after a public-image upload cannot reliably clean up an orphan from the browser.
- Public recipe table SELECT policies expose published rows; column-level minimization still needs review.

## Release gates
1. Integrate approved photo renderer (current branch includes JS+CSS but `index.html` update was rejected by the integration safety check).
2. Add safe moderator public-photo cleanup permissions and compensation, or disable photo publication pending a server-side transactional workflow. Do not deploy photo publishing without this safeguard.
3. Retest private-to-public photo lifecycle, including upload failure, DB failure, rejection, deletion and anonymous access.
4. Gather current, attributable Food Truths label evidence and verify manually.
5. Confirm parent data export, deletion process, cloud restore, mobile navigation and accessibility.

## Staging observation
17 October: Vercel reported READY for a non-production preview from this working branch. The new photo assets are present on the branch but have not been wired into the main HTML, so this is not a successful end-to-end feature test.
