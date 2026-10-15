---
title: "Planban CLI reference | Planban docs"
description: "Every Planban CLI command in v2.0.0: how to run the CLI from your marketplace folder, the shared options, and the commands for boards, Items, documents, online boards, updates and recovery."
path: /docs/cli/
updated: 2026-10-15
sources: src/cli.ts; bin/planban.mjs; package.json (bin, scripts.planban); src/core/protocol.ts (CLI fallback line); plugins/planban/skills/planban/references/planban-protocol.md (CLI examples); plugins/planban/skills/planban-create/SKILL.md; README.md (Manual Install, Install With Claude Code details); src/core/storage.ts; src/core/registry.ts; src/core/updatePreflight.ts; src/core/updateRunner.ts; src/cli.ts and src/core/online/login.ts (origin/release/v2.0.0); README.md (Online Boards, Local Storage; origin/release/v2.0.0); release/notes/v1.1.7.md; release/notes/v2.0.0.md
---

# Planban CLI reference

The Planban CLI is the `planban` program at `bin/planban.mjs` in your Planban marketplace checkout; Planban is not published to npm, so you run it with `node` from that checkout.

The CLI reads and changes the same boards as the board itself and the [MCP tools](/docs/mcp-tools/). Agents use it when the MCP tools are not available, and you can use it for scripting, set-up, recovery and [online boards](/docs/online-boards/).

## How do I run the CLI?

Run `bin/planban.mjs` with `node`, giving the command and its options:

```bash
node "$PLANBAN_ROOT/bin/planban.mjs" <command>
```

`PLANBAN_ROOT` is the folder of your Planban marketplace. The install commands set it; in a new terminal, set it again with the line for your host.

In Codex:

```bash
PLANBAN_ROOT="$(codex plugin marketplace list | awk '$1 == "planban" { print $2 }')"
```

In Claude Code:

```bash
PLANBAN_ROOT="$HOME/.claude/plugins/marketplaces/planban"
```

For a local clone, `PLANBAN_ROOT` is the clone itself. The CLI installs any missing runtime dependencies on first run. `--help` lists the commands, `<command> --help` lists a command's options, and `--version` prints the Planban version.

## Which options do most commands share?

| Option | Meaning |
| --- | --- |
| `--cwd <path>` | The project to work on. Defaults to the current folder. A subfolder or a linked git worktree of a set-up project finds that project's board; `init` sets up exactly the folder you give. |
| `-o, --output <format>` | `-o json` prints the result as JSON. Agents always pass it. |
| `--base-revision <revision>` | On commands that change Items: refuse the change if the board's revision is no longer this number. Optional on a board on your computer; required on an online board. |

A failed command prints its error message to stderr and exits with status 1. Statuses are written as `in-progress`, `up-next`, `pending`, `complete` and `archived`.

## Which commands manage boards?

| Command | What it does |
| --- | --- |
| `init` | Sets up Planban for a project. Options: `--cwd`, `--title <title>`, `--repo-id <id>`, `--no-agents` (leave `AGENTS.md` alone). See [Set up Planban for a project](/docs/set-up-a-project/). |
| `status` | Reports whether the project is set up, with its board id and the paths of its manifest, generated context, planning root and roadmap. For an online board it also reports where the board lives online. |
| `list-boards` | Lists the boards registered on this device. `--include-archived` adds archived boards. |
| `archive-board <repoId>` | Archives a whole board. It leaves normal board lists but keeps all its planning state. |
| `restore-board <repoId>` | Restores an archived board. |
| `duplicate-board <sourceRepoId>` | Copies a whole board into a new board, leaving the source untouched. Options: `--repo-id <id>`, `--title <title>`. |
| `delete-board <repoId>` | Deletes a whole board after writing a timestamped backup. Requires `--yes`. It never deletes your project repository. |
| `demo` | Creates or reuses the Planban Demo board. |
| `serve` | Runs the local board app in the terminal. Options: `--cwd`, `--port <port>` (default `4317`), `--no-vite`. |

Most people start the board through their agent or `node plugins/planban/scripts/launch-planban.mjs --cwd /path/to/repo`, which runs the app in the background and prints the verified URL.

## Which commands read Items?

| Command | What it does |
| --- | --- |
| `list-cards` | Prints every card on the board. |
| `get-card <cardId>` | Prints one card, with the board's `revision` to pass as `--base-revision` on your next change, and its `ancestry`: the Group that owns it, if any. |
| `query-cards` | Searches and filters cards without changing anything, and prints the matches with the board revision. |

`query-cards` takes these options, which combine:

| Option | Values |
| --- | --- |
| `--search <text>` | Matches id, title, summary, next action and tags |
| `--projection <projection>` | `main`, `group` or `flattened` |
| `--group <cardId>` | The Group for the `group` projection or the `selected-group` scope |
| `--scope <scope>` | `projection`, `root`, `owned`, `leaf` or `selected-group` |
| `--group-role <role>` | `any`, `group` or `item-only` |
| `--status <status>` | A Status; repeat for several |
| `--blocked <state>` | `any`, `blocked` or `unblocked` |
| `--tag <tag>` | A tag; repeat for several |

For example:

```bash
node "$PLANBAN_ROOT/bin/planban.mjs" get-card <card-id> --cwd /path/to/repo -o json
```

## Which commands create and change Items?

| Command | What it does |
| --- | --- |
| `create-card <title>` | Creates an Item. Options: `--status`, `--summary`, `--next-action`, `--tag` (repeat), `--metadata-json <json>`, `--spec-file <path>`, `--plan-file <path>`, `--position top` or `bottom`, `--after <cardId>`, `--parent <groupId>`, `--base-revision`. |
| `create-cards` | Creates several Items at once, each with a default Spec. Options: `--title <title>` (required; repeat), `--status`, `--parent <groupId>`, `--base-revision`. |
| `create-group <title>` | Creates a Group. Options: `--summary` (the Group objective), `--next-action`, `--status`, `--item <cardId>` (repeat), `--anchor <cardId>` (the Item whose Main Board position the Group takes), `--spec-file`, `--plan-file`, `--base-revision`. |
| `move-card <cardId>` | Changes Status, ownership or position in one step. Options: `--status <status>`, `--parent <groupId>` or `--board`, `--after <cardId>` or `--first`, `--base-revision`. Give at least one. |
| `update-card <cardId>` | Changes card fields other than Status. Options: `--title`, `--summary` or `--clear-summary`, `--next-action` or `--clear-next-action`, `--tag` (repeat; replaces all tags), `--blocked-by <cardId>` or `--clear-blocked-by`, `--metadata-json <json>` or `--clear-metadata`, `--base-revision`. |
| `complete-card <cardId>` | Moves a card to Complete. Option: `--base-revision`. |
| `archive-card <cardId>` | Moves a card to Archived. Option: `--base-revision`. |
| `restore-card <cardId>` | Moves an archived card to Pending. Option: `--base-revision`. |

New Items go to Pending unless you give `--status`. `create-card` writes a default Spec unless you give `--spec-file`, and creates a Plan only when you give `--plan-file`. For example:

```bash
node "$PLANBAN_ROOT/bin/planban.mjs" create-card "Title" --summary "..." --next-action "..." --cwd /path/to/repo -o json
node "$PLANBAN_ROOT/bin/planban.mjs" move-card <card-id> --status in-progress --cwd /path/to/repo -o json
```

Unlike the MCP tool, `complete-card` and `move-card --status complete` do not ask for confirmation. Agents follow the same rule either way: work is marked Complete only when you say so. See [How agents work with the board](/docs/agent-protocol/).

## Which commands read and write Specs and Plans?

| Command | What it does |
| --- | --- |
| `read-doc <cardId> <kind>` | Prints a card's `spec` or `plan`, with its path, whether it exists and its modification time. |
| `write-doc <cardId> <kind>` | Replaces a card's `spec` or `plan` with Markdown from `--file <path>`, or from standard input. Creates the document if the card has none. `--expected-mtime <mtimeMs>` refuses the write if the document has changed since you read it; give the `mtimeMs` from `read-doc`, or `new` for a document that does not exist yet. It is optional on a board on your computer and required on an online board. |

```bash
node "$PLANBAN_ROOT/bin/planban.mjs" read-doc <card-id> spec --cwd /path/to/repo -o json
node "$PLANBAN_ROOT/bin/planban.mjs" write-doc <card-id> spec --file spec.md --expected-mtime <mtimeMs> --cwd /path/to/repo -o json
```

## How do I move files out of a card?

Planban is an index, not file storage: a card holds only text. If a card's folder holds other files, Planban refuses changes to that card until they are moved out, although you can still read it. `move-files-out <cardId>` moves every file in the card's folder, except its Spec and Plan, to the folder you give with `--to`. It never overwrites or deletes anything, and adds a Files section to the card's Spec that refers to each file where it now lives. Run it with `--dry-run` first to see what would move and what would be added.

```bash
node "$PLANBAN_ROOT/bin/planban.mjs" move-files-out <card-id> --to <folder> --dry-run --cwd /path/to/repo
node "$PLANBAN_ROOT/bin/planban.mjs" move-files-out <card-id> --to <folder> --cwd /path/to/repo
```

If a file of the same name already exists in the destination, the move is refused; choose another folder.

## Which commands work with online boards?

The `online` commands sign this computer in to Planban and move boards between your computer and app.planban.ai. Most take the service address, `https://app.planban.ai`, and the ones about one board take `--cwd` for its project. See [Online boards](/docs/online-boards/) for what an online board is and how sharing works.

Sign in and manage access:

| Command | What it does |
| --- | --- |
| `online login <url>` | Signs this computer in. It opens sign-in in your browser. `--no-browser` prints a short code and an approval link instead, for a remote, cloud or headless machine; `--device` does the same and also opens the link here when it can. `--key-env <name>` signs in with an access key held in that environment variable. |
| `online logout <url>` | Signs this computer out and cuts off its connection. |
| `online status` | Lists the Planban services this computer is signed in to. |
| `online connections <url>` | Lists the computers, agents and access keys signed in to your account. |
| `online revoke <url> <connectionId>` | Cuts off one computer, agent or key at once. |
| `online keys create <url>` | Creates an access key for one board. Requires `--board <id>`, `--level` (`read`, `plan` or `complete`) and `--name <name>`; `--expires-days <days>` sets when it stops working. The key is shown once. |

Move a board online and back:

| Command | What it does |
| --- | --- |
| `online take-online <url>` | Takes this project's board online, with its Specs, Plans and history. The board must hold no files. |
| `online stop-take-online` | Stops a take-online that did not finish; the board stays on this computer. |
| `online take-local` | Brings this project's online board back to this computer, with its history. On a shared board, `--remove-others` confirms that everyone else and their agents lose access. |
| `online export` | Saves a copy of this project's online board, with its history, to the file given by `--out <file>`. |
| `online attach <url> <boardId>` | Uses an online board in the project folder given by `--cwd`. `--replace-stale-copy` sets aside an out-of-date local copy of the board. |
| `online keep-local-copy` | Keeps an older local copy of an online board as a separate board, so the project uses the online board. Options: `--title`, `--new-id`, and `--in-this-project` (with `--new-id`) to keep using the separate board in this project instead. |
| `online restore-backup` | Makes a new local board from a backup this computer kept of an online board. Requires `--from <folder>`, `--cwd` (an empty project folder) and `--repo-id <id>`. |

Share a board:

| Command | What it does |
| --- | --- |
| `online invite` | Creates an invitation to this project's online board. The link works for 7 days. `--role` is `viewer` (the default) or `editor`; `--email <address>` makes it an invitation for one person. |
| `online join <link>` | Joins a board from an invitation link. `--cwd` also uses the board in that project folder. |
| `online people` | Lists who is on the board, their roles and what their agents may do. |
| `online my-agents <level>` | Chooses what your own agents may do on this board: `read`, `plan` or `complete`. |

For example, to sign in a computer with no browser and take a board online:

```bash
node "$PLANBAN_ROOT/bin/planban.mjs" online login https://app.planban.ai --no-browser
node "$PLANBAN_ROOT/bin/planban.mjs" online take-online https://app.planban.ai --cwd /path/to/repo
```

On an online board, the commands that change Items need `--base-revision`, and `write-doc` needs `--expected-mtime`.

## How do I check for updates from the CLI?

Run `update` from your Planban folder. On its own, or with `--dry-run`, it only inspects: it reports whether this install can update directly, what blocks it, and the steps an update would run. It changes nothing.

```bash
node "$PLANBAN_ROOT/bin/planban.mjs" update --dry-run --runtime-root "$PLANBAN_ROOT" -o json
```

`--execute` runs the direct update when the inspection allows it. `--current-board-url` names the board to reopen afterwards, and `--target-version`, `--target-ref` and `--target-commit` name the release to update to. In Claude Code, update with the plugin commands instead; see [Update Planban](/docs/updating/).

## Which commands are for recovery only?

These commands exist for migration and recovery. Use them when a recovery guide or the maintainers ask you to.

| Command | What it does |
| --- | --- |
| `export-flat-v1` | Writes a recoverable, history-backed export of the board in the older flat format, without changing the live board. Requires `--export-id <id>` (lower-case letters, numbers and hyphens). |
| `reconstruct-hierarchy` | Places existing Items into Groups in one change, from a JSON file of `{ "groups": [{ "id": ..., "childIds": [...] }] }`. Requires `--file <path>` and `--base-revision`. |
| `set-card-parent <cardId>` | Deprecated. Moves an Item into a Group (`--parent`) or to the Main Board (`--board`). Use `move-card` instead. |
