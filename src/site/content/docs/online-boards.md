---
title: "Online boards | Planban docs"
description: "Take a Planban board online to share it, open it in any browser or on your phone at app.planban.ai, connect ChatGPT and claude.ai, and bring it back to your computer at any time."
path: /docs/online-boards/
updated: 2026-10-15
sources: release/notes/v2.0.0.md (origin/release/v2.0.0); src/cli.ts (online commands); online/README.md; online/service/convex/schema.ts (invites, members, connections); online/service/convex/transfers.ts (fence); Spec: explore-hosted-planban-web-app (points 2, 6, 7, 9, 15, 16)
---

# Online boards

An online board is a Planban board that lives in your Planban account at app.planban.ai instead of on your computer, so you can share it, open it in any browser or on your phone, and connect ChatGPT and claude.ai to it.

Online boards arrived in Planban v2.0.0. Boards on your computer stay exactly as they are, free and with no account. Nothing about a local board is sent anywhere unless you take that board online, and you choose one board at a time.

## How do I take a board online?

Open the board on your computer and choose **Board settings**, then **Take online**, or ask your agent to do it. You need a free Planban account, and you log in with GitHub or an email code.

The whole board moves to your account: its Items, Groups, Specs, Plans and history. Your computer keeps a backup copy. Afterwards the board on your computer shows an **Open on the web** link in the board menu and in Board settings.

Planban is an index, not file storage, so a board goes online only once it holds text alone. If any card has files in its folder, Planban lists what to tidy first. The CLI's `move-files-out` command can move those files somewhere else and note where they went in the card's Spec.

You can also start a new, empty online board on the web, from **Your boards**.

## How do I bring a board back to my computer?

In the Planban app on your computer, choose **Take local** in Board settings, or run `planban online take-local` in the project. The board comes back to your computer with its full history. Only the board's owner can take it online or bring it back, from their own signed-in computer. Connected apps and access keys cannot do it.

On a shared board, everyone else, and their agents, lose access when you bring it back, and Planban asks you to confirm who that is first. The online copy stays in your account, read-only, for you.

## How do I invite people?

On an online board, the owner invites people as **editors** or **viewers**, by email or with a link. An invitation link works for 7 days.

- **Editors** can change cards, Specs and Plans, restore from history and mark work Complete.
- **Viewers** can read everything and change nothing.
- **The owner** is the only person who invites people, changes roles, and takes the board online or back.

Invited people need nothing installed. The invitation leads them to sign in and then straight to the board in their browser. Invitations waiting for someone appear at the top of their **Your boards** page.

## What can each person's agents do?

Each person chooses what their own agents may do on a board: **read**, **plan**, or **plan and complete**. An agent can never do more than its person, so a viewer's agents can only read. Every change in the board's history records who made it, and whether it was them or their agent.

Agents still follow the same rule as on a local board: they move a card to Complete only when a person on the board asks them to, confirms it after review, or clearly waives review.

## How do I use a board in a browser or on my phone?

Every online board has its own address at app.planban.ai. Everyone on the board can read it there in any browser, with nothing to install, and owners and editors can edit it. **Your boards** lists your boards and the ones shared with you, with how many cards need you.

- **Live updates.** When someone else, or an agent, changes the board, you see it without reloading.
- **Editing the same document.** If someone saves a Spec or Plan while you are editing it, your text is kept and Planban shows you their version before you save again.
- **On a phone,** the board is one scrolling list grouped by column. A card opens full screen, **Status** and **Move** replace dragging, Save stays above the keyboard, and dialogs open as sheets.

The Planban app on your computer still opens online boards beside your agent, as it does for local boards.

## How do Codex and Claude Code work with an online board?

Codex and Claude Code, with the Planban plugin installed, work with online boards through the same tools as local boards once your computer is signed in. Run this once on each computer:

```sh
planban online login https://app.planban.ai
```

## How do I connect ChatGPT or claude.ai?

Add `https://app.planban.ai/mcp` as a custom connector in ChatGPT or claude.ai, sign in to Planban, and click **Allow**. The app can then work with your online boards, within what you let your agents do on each board. Its search results link straight to the card on the web page.

## How do I sign in a computer that has no browser?

A remote, cloud or headless machine can sign in by approval from another device:

```sh
planban online login https://app.planban.ai --no-browser
```

Planban shows a short code and a link. Open the link on any device where you are signed in, your phone included, check that the code matches, and tap **Allow**.

## What are Connections and access keys?

**Connections** in the web page's account menu, and **Your connections** in the board's menu on your computer, list every computer, browser, app and key signed in to your account, with when each was last used. You can cut any of them off, or cut off everything at once.

**Access keys** are for agents that cannot sign in themselves. You create one on the web page, in Connections. A key reaches one board, says what it may do, and has an expiry date. Planban shows the key once, so copy it when you create it.

A browser stays signed in for at most 7 days. Signing out, or cutting a browser off in Connections, ends its session at once, and it needs a fresh sign-in.

## What does it cost, and what are the limits?

Online boards are free at launch, with usage limits that protect the service:

- An online board holds up to 256 MB of text, history included.
- Each account can make up to 5,000 changes a day.
- Each account can write up to 64 MB of text a day.

Local boards have none of these limits and need no account.

## Where can I read more?

- [Planban v2.0.0 release notes](/docs/changelog/v2-0-0/)
- [Where Planban stores your data](/docs/data-storage/)
- [Privacy policy](/privacy/)
