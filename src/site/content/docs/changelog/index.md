---
title: "Planban changelog | Planban docs"
description: "Every public Planban release, newest first: what changed in the latest version, earlier releases back to v1.0.0, and how to update."
path: /docs/changelog/
updated: 2026-10-15
sources: gh release list --repo planban-ai/planban; release/notes/*.md; release/latest.json (changelogSummary); src/site/releases.ts
---

# Planban changelog

The Planban changelog lists every public Planban release, with a page for each release from v1.1.6 onwards and a link to the GitHub release notes for earlier versions.

Releases are listed newest first. Each date is the day the release was published on GitHub.

## What changed in the latest release?

Planban v2.0.0 adds online boards: take a board online to share it, open it in any browser or on your phone, and connect ChatGPT and Claude to it. Boards on your computer stay exactly as they are, free and with no account.

- Invite people as editors or viewers, by email or with a link. They need nothing installed.
- Every online board has its own address at app.planban.ai, with live updates and a layout for phones.
- ChatGPT and claude.ai connect at `https://app.planban.ai/mcp`, and Codex and Claude Code work with online boards through the same tools as local ones.

Read the full notes on the [Planban v2.0.0](/docs/changelog/v2-0-0/) page, and see [Online boards](/docs/online-boards/) for how to use them. The release before it, [Planban v1.1.7](/docs/changelog/v1-1-7/), stopped the board page reloading in a loop and added Needs you and out-of-date warnings.

## Which releases came before v1.1.6?

Earlier releases predate Claude Code support, and their notes are on GitHub. Some of those notes include install or update steps that no longer apply; follow the current [install](/docs/install-codex/) and [update](/docs/updating/) pages instead.

<!-- component: release-history -->

## How do I update to the latest release?

The board shows an update notice when a new release is out. In Codex, choose **Update now** or **Update with Codex** on the board, or run the marketplace commands. In Claude Code, run the plugin update commands. Then start a new session. See [Update Planban](/docs/updating/) for the exact commands.
