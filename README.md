# Oasis TG Faucet Bot

## Installation

`npm i`

## Set-up

1. Copy the .env.example file as .env
2. Set all the .env vars in this file properly. Including your mnemonic key.
3. Copy over the correct `type.json` for your chain onto `src/types/types.json`. You can overwrite the current file since this is for the OAX chain.
4. If you want to change the Help or Error Messages, you can open `app.js` and make these changes

## Run

`npm run start`

## Usage

Either add your bot to a group chat, or directly send a message to your bot.

1. The `/help` command or `/start` command will send you the help text.

2. To request for tokens simple send `/request ADDRESS` where ADDRESS is your substrate address.