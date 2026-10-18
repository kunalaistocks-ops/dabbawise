# Public sharing consent — design and release gate (18 Oct 2026)

Status: PROPOSED; not enabled. No production schema or RLS changes authorised.

## Parent-facing choice
Private by default. During Cook Together publishing, show a separate unchecked option: “I agree to share this recipe and its approved photo publicly on The Parent Kitchen. I understand other people may see and share what I publish.” Explain that the display name is optional, and let the parent choose a public nickname or “Parent Kitchen member”. Include a preview and a clear Remove public recipe control. Do not make consent a prerequisite for using private plans, nutrition tools, or account features.

## Data boundaries
Consent allows publication only of whitelisted recipe fields, the chosen public nickname and approved media. Never expose auth.uid, author_id, storage private paths, email, child names/age/school/schedule, accounts, individual like user IDs, or precise location through public API queries. Consent never bypasses RLS. Use a narrowly scoped public feed projection with safe like counts; verify direct table access does not leak disallowed fields. Explicitly forbid uploading photos of children by default until a separate child-safety review and release decision.

## Persisted consent receipt
Record authenticated user ID on a protected table only, recipe ID, disclosure version, granular publication flags (recipe, nickname, photo), affirmative decision, UTC time and withdrawal. The public feed must not expose receipt or user ID. Version wording and allow granular withdrawal. No pre-ticked boxes; re-prompt if scope changes. Removal must hide content promptly and trigger public-photo deletion with retries and audit trail.

## Before enabling
1. Review and approve restricted SELECT policies and safe feed/RPC; test as anon, parent A, parent B, moderator.
2. Check server-side author ownership and consent receipt during publish and edit.
3. Strip image EXIF/location metadata before upload, enforce image validation, implement compensating cleanup for partial failures.
4. Allow narrowly scoped moderator DELETE for the public photo bucket; test rollback and deletion.
5. Browser-test OAuth, sharing/withdrawal, mobile UI, private cloud data isolation, nutrition invalid inputs.
6. Keep all eight Food Truths research drafts unpublished and verified=false until independent current-pack checks.

This document changes no deployed behaviour.