export interface Config {
  bot: Bot;
}

export interface Bot {
  TOKEN: string;
  EMBED_COLOR: string;
  OWNER_ID: string;
  DEBUG_MODE: boolean;
  CHANNEL_ID: string;
  NODES: NODE_CREDENTIALS[];
}

export interface Commands {
  enable: boolean;
  prefix: string;
}

export interface NODE_CREDENTIALS {
  name: string;
  host: string;
  port: number;
  version: number;
  auth: string;
  secure: boolean;
}
