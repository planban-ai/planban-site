---
title: "Planban FAQ"
description: "Answers to common questions about Planban: accounts, supported agents, where data is stored, licence, offline use, other MCP hosts, and how to install."
path: /
updated: 2026-10-15
---

## What is Planban?

Planban is a Kanban board for you and your agents: ideas, to-dos, specs and plans for the whole project, in one place. It installs as a plugin in Codex and Claude Code, and your agents read it, work from it and keep it up to date. You own intent, priority, and acceptance. It is free on your computer; take a board online when you want to share it.

## Do I need an account?

No. Planban works on your computer with no account. You only need a free account to take a board online: to share it, use it on another device, or connect ChatGPT or Claude.

## Which agents does it work with?

Planban works with Codex and Claude today. In the Codex desktop app the board opens in the in-app browser with `/planban`, and in the Claude Code desktop app it opens in the browser pane with `/planban:planban`. `/pb`, or `/planban:pb` in Claude Code, is a quick shortcut that opens the board straight away. Both installs share the same boards on your device. ChatGPT and claude.ai can connect to a board you take online.

## Where is my planning data stored?

Boards on your computer stay there. Live board state lives under `~/.planban`, separate from your repo, and only small discovery files sit in `.planban/` in your project. Planban never uploads them. A board you take online lives at app.planban.ai instead, where only the people you invite, and the apps they connect, can see it.

## Is Planban free and open source?

Yes. Planban's local core is open source under the MIT licence, and the code is on GitHub at planban-ai/planban. It is not published on npm; you install it from GitHub as a plugin. Online boards are free too.

## Does it replace Linear, Jira, or Trello?

No. Planban is built for people directing project work with agents, alone or with a co-founder or small team, not for sprints or reporting. If you use those tools, you can ask your agent to turn their context into draft Planban Items for review.

## Does it work offline?

Yes, once it is installed. The board, local API, and MCP server run on your machine against `~/.planban`. Installing and updating need access to GitHub, and the open board checks GitHub for new versions when it can.

## Can other MCP hosts use it?

Yes. Any host that can run a local stdio MCP server can use the same Planban tools by pointing at `plugins/planban/scripts/start-planban-mcp.mjs` in a clone of the repo. Those hosts have no slash commands, and the board opens as a link.

## How do I install it?

Ask your agent to install it with one prompt from the README, or run the commands yourself. In Claude Code the key commands are `claude plugin marketplace add planban-ai/planban` and `claude plugin install planban@planban`, and in Codex they are `codex plugin marketplace add planban-ai/planban` and `codex plugin add planban@planban`. Planban needs Node.js 22.12.0 or later, and the full steps are on the [Codex](/codex/) and [Claude Code](/claude-code/) pages.
