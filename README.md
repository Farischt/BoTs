# 🚀 Discord Bot by @Farischt

---

## Informations

If you find any error in my code, please feel free to reach me here : faris.manage@gmail.com

---

## Tech

- Discordjs v14
- Typescript
- Yarn
- Node.js

## Requirements

1. You need **your bot to be configured** before anything. Please follow the instructions given by discord on their [guide](https://discordjs.guide/).
2. Make sure to have Discordjs **v14** !!!

## Installation

In the root directory create a `config.json` file and follow the instructions given in `config.example.json` [here](config.example.json).

In your terminal, run the following command:

```bash
yarn install
```

You can now start the lavalink server:

```bash
yarn lavalink
```

You can now start the development server:

```bash
yarn dev
```

That's it ! You should see your bot logged in into your discord server. You can know run the provided commands.

## Commands

**For the moment here are the provided commands.** New commands are being implemented.

- `/owner`: `returns the owner tag`
  - permission: none.
  - options: none.
- `/ban`: `bans a member for a reason`
  - permission: ban permission, or admin.
  - options:
    - member: `user`, the member to ban.
    - reason: `string`, the reason of the ban.
- `/ping`: `returns the latence in ms`
  - permission: none.
  - options: none.
- `/emit`: `emits an event` This is a dev only command.
  - permission: admin.
  - options:
    - event: `string`, the name of the discord event.
- `/play`: `plays the provided song the voice channel`
  - permission: none.
  - options:
    - song: `string`, the name of the song to play.

## Events

- `messageCreate`: event fired up when a new message is sent.
- `interactionCreate`: event fired up when a new interaction is done.
- `ready`: event fired up when the bot is ready.
- `guildMemberAdd`: event fired up when a new member joins the server.
