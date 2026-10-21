# Google Chat client and MCP plugin

Two pieces that read and send Google Chat messages for one Google Workspace
user, with the OAuth credentials kept outside the repository:

- **`app/google-chat/`**: a small Haskell command-line client using user OAuth
  with a Web application client. `cabal run google-chat -- login spaces` signs
  in; `cabal run google-chat -- spaces` lists accessible conversations. The
  [setup and command guide](app/google-chat/README.md) covers private
  credentials, message reading and sending. Two narrower executables,
  `google-chat-reader` and `google-chat-writer`, back the plugin.
- **`plugins/google-chat-readonly/`**: a local desktop MCP plugin (TypeScript,
  Node 22+) that exposes space listing, message and thread reading, authorized
  sending, and new-message events. See the
  [plugin README](plugins/google-chat-readonly/README.md) for installation into
  Codex or another MCP host, the launchd event service, and the trust model.

`.agents/plugins/marketplace.json` registers the plugin as a local marketplace
for this checkout.

## Build

The Haskell side builds with cabal (GHC 9.8.2, which ghcup installs):
`cabal.project` pins the compiler and `cabal.project.freeze` every
dependency's version.

```bash
cabal build all
cabal test
```

The plugin's `setup.mjs` builds the reader and writer with cabal from this
repository's root and copies them into the plugin's `bin/`.

## Secrets

Nothing private is tracked. `.private/`, `credentials.json`, `token.json`,
`client_secret*.json`, `.env*` and the plugin's generated `runtime.json`,
`bin/` and `dist/` are ignored.

## History

Split out of [HaskPlayground](https://github.com/hyperswine/HaskPlayground)
on 2026-10-21 with its history. The local marketplace name
`haskplayground-local` and the launchd label
`com.haskplayground.google-chat-events` are unchanged so existing
installations keep working.
