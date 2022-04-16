// Telegram API client
const { Telegraf } = require("telegraf");
const { ethers } = require("ethers");
// connect to the node
const { BN } = require("bn.js");

// this is the Generic Faucet Interface
class GenericFaucetInterface {
  constructor(config) {
    this.types = config.types;
    this.providerUrl = config.providerUrl;
    this.amount = config.amount;
    this.tokenName = config.tokenName;
    this.addressType = config.addressType;
    this.timeLimitHours = config.timeLimitHours;
    this.decimals = new BN(config.decimals);
    // Help message when user first starts or types help command
    this.helpMessage = `Welcome to the ${process.env.FAUCET_NAME}! 
    To request for tokens send the message: 
    "/request ADDRESS" 
    with your correct Oasis Emerald address`;
    // Error Messages
    this.timeLimitMessage = `Sorry please wait for ${this.timeLimitHours} hours, between token requests from the same telegram account!`;
    this.invalidAddressMessage = `Invalid address! Please enter a valid Oasis Emerald Address!`;
    // record storage (for time limit)
    this.records = {};
  }

  // tries to get valid address from message, if fails, returns undefined
  getAddressFromMessage(message) {
    const address = message.text.substring(9);
    try {
      ethers.utils.getIcapAddress(address);
      return address;
    } catch (e) {
      return undefined;
    }
  }

  // returns the help message
  getHelpMessage() {
    return this.helpMessage;
  }

  // This initializes api
  async initApi() {
    const provider = new ethers.providers.JsonRpcProvider(config.nodeRpcUrl);
  }
  async sendToken(address) {
    //  provider
    const provider = new ethers.providers.JsonRpcProvider(config.nodeRpcUrl);
    let wallet = new ethers.Wallet(config.privateKey, provider);
    let amountInEther = "0.01"

    let tx = {
      to: address,
      value: ethers.utils.parseEther(amountInEther)
    }
    
    return wallet.sendTransaction(tx)

  }
  // function that telgram bot calls
  async requestToken(message) {
    let response;
    const now = Date.now();
    //   const username = message["from"]["username"];
    const senderId = message["from"]["id"];
    // Get the senders record
    const senderRecords = this.records[senderId];
    console.log(message);
    const address = this.getAddressFromMessage(message);
    if (address) {
      response = `Sending 0.01 ${this.tokenName} to ${address}!`;
      // if exists
      if (senderRecords) {
        // make sure last request was long time ago
        const last = senderRecords.slice(-1)[0];
        // check if now - last > timeLimitHours * 60 * 60 * 1000
        if (now - last > this.timeLimitHours * 1000 * 60 * 60) {
          // yes limit has passed
          this.sendToken(address);
          // update the records to show this
          this.records[senderId].push(now);
          
          response = `Sent 0.01 ${this.tokenName} to ${address}!`;
        } else {
          // this means user requested tokens already
          response = this.timeLimitMessage;
        }
      } else {
        // this is users first request
        // yes limit has passed
        await this.sendToken(address);
        // create the record
        this.records[senderId] = [];
        // update the records to show this
        this.records[senderId].push(now);

        response = `Sent 0.01 ${this.tokenName} to ${address}!`;
      }
    } else {
      response = this.invalidAddressMessage;
    }
    console.log(response);
    return response;
  }
}

// load env vars
require("dotenv").config();

const config = {
  providerUrl: process.env.NODE_WS_URL,
  amount: parseFloat(process.env.AMOUNT),
  tokenName: process.env.TOKEN_NAME,
  addressType: parseInt(process.env.ADDRESS_TYPE),
  timeLimitHours: parseFloat(process.env.TIME_LIMIT_HOURS),
  decimals: parseInt(process.env.DECIMALS),
  mnemonic: process.env.MNEMONIC,
  privateKey: process.env.PRIVATE_KEY,
  nodeRpcUrl: process.env.NODE_RPC_URL
};

const faucet = new GenericFaucetInterface(config);

// Initialize telegram bot
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
// Initialize the faucet

// On user starting convo
bot.start(async (ctx) => {
  await ctx.reply(faucet.getHelpMessage());
});

// On user types help
bot.help(async (ctx) => {
  await ctx.reply(faucet.getHelpMessage());
});

// On request token command
bot.command("request", async (ctx) => {
  const resp = await faucet.requestToken(ctx.message);
  await ctx.reply(resp);
});

// Run the bot
bot.launch();
