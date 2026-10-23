# The Parent Kitchen — Beta acceptance checklist (23 October 2026)

Status: specification only. No test is marked passed without observed evidence.

## Critical parent journey

1. Sign in with Google and restore the same account after browser refresh.
2. Create or select a child profile; school hours and food preferences remain saved.
3. Search or browse foods; select a food and choose Add to meal with breakfast, school snack, lunch, evening snack, or dinner as destination.
4. Show selected food in the correct date and meal immediately, with clear edit/remove/undo behavior.
5. Display per-serving energy and available nutrients with units, source and missing-data indicators; do not fabricate zeros.
6. Save contextually beside changed content, with saving/saved/error states and retry; no floating global backup control.
7. Refresh, sign out, sign back in and verify that the plan and child profile restore accurately.
8. Sign in as a different parent and verify no first-parent records can be read or modified.
9. Test mobile viewport and keyboard-only navigation, including add-to-meal and save controls.

## Release gates

- Validate Supabase row-level security, function permissions and authentication security warnings.
- Validate staging vs production isolation and prevent test writes to production.
- Verify Food Truths sources and consent before public sharing; no unreviewed label claims.
- Record deployment SHA, browser, device, result and reproduction steps for each test.
- Do not call beta ready until all critical tests pass and no critical security issue remains.

## Next implementation order

1. Audit current add-to-meal controls and persistence path.
2. Implement destination selection and contextual save feedback where missing.
3. Connect staged nutrition validation only after unit tests.
4. Run two-account isolation and cross-session restore tests.
5. Complete mobile QA and release review.
