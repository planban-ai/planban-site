---
title: "Planban MCP tools reference | Planban docs"
description: "Every Planban MCP tool in v2.0.0: the 14 default tools, their inputs and results, the board link every result carries, and the admin and recovery profiles."
path: /docs/mcp-tools/
updated: 2026-10-15
sources: plugins/planban/mcp/server.mjs (tools, PROFILE_TOOL_NAMES, advertisedTools, PLANBAN_MCP_INSTRUCTIONS, boardHandoff, verifiedLaunchResult, launchBoard); src/core/storage.ts; src/core/registry.ts (deleteBoard); release/notes/v1.1.6.md (Host-neutral agent handoff); plugins/planban/mcp/server.mjs (origin/release/v2.0.0: planban_move_files_out, INDEX_RULE, staleness, metadataNotes); src/core/staleness.ts; src/core/storage.ts (getStatus); release/notes/v1.1.7.md; release/notes/v2.0.0.md
---

# Planban MCP tools reference

Planban's MCP server exposes 14 tools by default for reading boards, changing Items and opening the board, and seven more administration, recovery and legacy tools only when the `PLANBAN_MCP_PROFILE` environment variable asks for them.

The server runs locally over stdio. Codex and Claude Code start it through the Planban plugin; other hosts start it directly, as described in [Use Planban from other MCP hosts](/docs/other-mcp-hosts/). Hosts may add their own prefix to the tool names, but each name ends in `planban_<operation>`.

The same tools work on [online boards](/docs/online-boards/) once your computer is signed in, with two stricter rules described below.

## Which tools are available by default?

| Tool | What it does |
| --- | --- |
| `planban_status` | Checks whether Planban is set up for a repository, whether its board is local or online, and reports its live state paths |
| `planban_list_boards` | Lists the boards registered on this device, local and online |
| `planban_get_board` | Loads one board: its project, columns, revision and every card |
| `planban_query_cards` | Searches and filters cards without changing anything |
| `planban_get_card` | Reads one card, with its metadata and owning Group, and its document paths on a local board |
| `planban_read_doc` | Reads a card's Spec or Plan |
| `planban_create_card` | Creates an Item, with optional placement, tags, metadata, Spec and Plan |
| `planban_create_cards` | Creates several sibling Items in one change, optionally inside a Group |
| `planban_create_group` | Creates a Group and places existing Main Board Items inside it |
| `planban_move_card` | Changes an Item's Status, ownership or position in one change |
| `planban_update_card` | Changes fields other than Status: title, summary, next action, tags, blocked-by, metadata |
| `planban_write_doc` | Replaces a card's Spec or Plan, with stale-file protection |
| `planban_move_files_out` | Moves files out of a card's folder and refers to them from its Spec |
| `planban_launch_board` | Starts or finds the local board app and returns a verified board URL |

## What does each tool take and return?

Every tool except `planban_list_boards` also needs the board: `cwd`, the absolute path of a set-up repository, or `repoId`, a registered board id, used only when `cwd` is absent. The table lists the other inputs. Tools that change Items accept `baseRevision`, the board revision you last read, and refuse the change if the board has moved on. It is optional on a local board and required on an online board.

| Tool | Required inputs | Optional inputs |
| --- | --- | --- |
| `planban_status` | | |
| `planban_list_boards` | | `includeArchived` |
| `planban_get_board` | | |
| `planban_query_cards` | | `search`, `projection` (`main`, `group`, `flattened`), `groupId`, `hierarchyScope` (`projection`, `root`, `owned`, `leaf`, `selected-group`), `groupRole` (`any`, `group`, `item-only`), `statuses`, `blocked` (`any`, `blocked`, `unblocked`), `tags` |
| `planban_get_card` | `cardId` | |
| `planban_read_doc` | `cardId`, `kind` (`spec` or `plan`) | |
| `planban_create_card` | `title` | `status` (default `pending`), `summary`, `nextAction`, `tags`, `metadata`, `specMarkdown`, `planMarkdown`, `position` (`top`, `bottom`), `afterId`, `parentId`, `baseRevision` |
| `planban_create_cards` | `titles` | `status` (default `pending`), `parentId`, `baseRevision` |
| `planban_create_group` | `title` | `summary` (the Group objective), `nextAction`, `status`, `itemIds`, `anchorId`, `specMarkdown`, `planMarkdown`, `baseRevision` |
| `planban_move_card` | `cardId`, and one of `status`, `parentId`, `afterId` | `baseRevision`, `completionConfirmed` |
| `planban_update_card` | `cardId` | `title`, `summary`, `nextAction`, `tags`, `blockedBy`, `metadata`, `baseRevision` |
| `planban_write_doc` | `cardId`, `kind`, `markdown` | `expectedMtimeMs` (required on an online board) |
| `planban_move_files_out` | `cardId`, `to` | `dryRun` |
| `planban_launch_board` | | `demo` (then no board is needed), `port` (default `4317`) |

A few rules the tools enforce:

- `planban_create_card` writes a default Spec when `specMarkdown` is omitted, and creates a Plan only when `planMarkdown` is supplied.
- `planban_move_card` takes `parentId: null` for the Main Board and `afterId: null` for the first position. A move to `complete` requires `completionConfirmed: true`. A Group cannot be placed inside a Group.
- `planban_update_card` clears `summary`, `nextAction`, `blockedBy` or `metadata` when given `null`, and replaces the whole tag list when given `tags`.
- `planban_write_doc` replaces the whole document. With `expectedMtimeMs` set to the `mtimeMs` from the last read, or `null` for a new document, it refuses to overwrite a newer one. Documents are limited to 1 MB, and pictures stored inside a document (`data:` addresses) and base64 are refused.
- Planban is an index, not file storage: a card holds only text. A card whose folder holds other files refuses changes until they are moved out. `planban_move_files_out` moves every file except the Spec and Plan to the folder given in `to` (an absolute path, or one relative to the repository), never overwriting or deleting anything, and adds a Files section to the Spec that refers to each file where it now lives. With `dryRun: true` it reports what would move without changing anything; agents run that first and let you choose the destination.
- `planban_launch_board` with `demo: true` creates or reuses the Planban Demo board. If another program holds the port, it fails with `Port 4317 is already in use by another service.`

Each tool returns a one-line text summary and the full data as structured content. A change returns the board summary with `itemCount` and the changed card, rather than every card; `planban_get_board` remains the full read. When a card's metadata grows past about 4 KB, `planban_create_card` and `planban_update_card` add a short note suggesting the detail move into the Spec or Plan. A failed call returns an error whose message says what was wrong, such as `Card not found: <id>`.

## What does every result include?

Results that concern one board carry a board link. This covers `planban_status` for a set-up project, `planban_get_board`, and every tool that creates or changes Items or documents:

| Field | Meaning |
| --- | --- |
| `boardUrl` | The board's URL, such as `http://127.0.0.1:4317/boards/<repo-id>` |
| `boardUrlVerified` | `true` when the local app answered a health check for this board |
| `userReply` | A ready-made link for the agent's reply: `url`, `markdown` and `urlRequired: true` |

When the URL is verified, `userReply.markdown` reads `[Open the verified board](URL)`. When it is not, it reads `[Open the board](URL)` and `userReply.verifyWith` names `planban_launch_board`. These results never start the app themselves.

`planban_launch_board` returns `url`, `urlVerified: true`, `serviceReady: true`, `started` (whether it started the app or reused a running one), and the same `userReply`.

## How do the tools flag cards that are out of date?

Reads also report signs that an In Progress or Up Next card may no longer match reality, and flag any card whose folder holds files. These signals are advice only: they never block or fail a read, and they come from local git and board history without fetching anything.

| Signal | Meaning |
| --- | --- |
| `merged` | A pull request the card mentions merged after the card last changed |
| `doc-edited` | Its Spec or Plan was edited outside Planban |
| `quiet` | No update for five days |
| `group-behind` | A Group's child cards changed more than a day after the Group did |
| `awaiting-owner` | Its next action starts with `Owner:`, so it waits on you |
| `holds-files` | Its folder holds files, so changes are refused until they are moved out |

`planban_get_card` returns the card's signals as `staleness`, and `planban_query_cards` returns `staleness` for the matched cards that have any. `planban_status` and `planban_get_board` return an `attention` summary: up to ten out-of-date cards, how many cards wait on you, which cards hold files, and the number of Items In Progress when it is over 12.

## Which tools only read?

`planban_status`, `planban_list_boards`, `planban_get_board`, `planban_query_cards`, `planban_get_card` and `planban_read_doc` are marked read-only. The others change a board, except `planban_launch_board`, which changes no board but can start the local app. No default tool is marked destructive, including `planban_move_files_out`, which never deletes or overwrites a file.

## How do I enable the administration and recovery tools?

Set `PLANBAN_MCP_PROFILE` in the MCP server's environment to one or more of these profile names, separated by commas:

| Profile | Adds |
| --- | --- |
| `admin` | `planban_archive_board`, `planban_restore_board`, `planban_duplicate_board`, `planban_delete_board` |
| `maintenance` | `planban_export_flat_v1`, `planban_reconstruct_hierarchy` |
| `legacy` | `planban_set_card_parent`, the older form of moving an Item into or out of a Group |
| `full` | Every tool above |

`planban_delete_board` needs `confirmRepoId` to match `repoId` exactly. Before it deletes the board's planning state, it copies it to a timestamped backup under `~/.planban/backups/boards/`. It never deletes your project repository. These tools match the CLI's [board and recovery commands](/docs/cli/#which-commands-manage-boards).

## What instructions does the server give the agent?

When a host connects, the server sends instructions that every agent receives, with or without the Planban skills. They tell the agent to:

- prefer the Planban tools for all board, card and document reads and writes;
- pass `cwd` as the absolute repository path, or `repoId` for a registered board;
- treat Planban as an index, not file storage: link to files, and use `planban_move_files_out` to tidy cards that hold them;
- on online boards, pass `baseRevision` and `expectedMtimeMs`, and read only through these tools;
- read `.planban/agent-context.md` before creating or materially editing owner-facing content, and follow the Planban protocol and house style when installed;
- make one change at a time on each board;
- move cards to Complete only when a person on the board asks, confirms after review, or waives review;
- use `planban_move_card` for all placement;
- include the exact clickable board URL from `userReply.markdown` after opening the board or finishing a batch of changes;
- make at most one attempt to show the board in an in-app browser, and never reopen it after every write;
- call `planban_launch_board` once when `boardUrlVerified` is `false`;
- resolve a `planban:<board>/<item>` reference with `planban_get_card`, trusting the id over any title beside it.
