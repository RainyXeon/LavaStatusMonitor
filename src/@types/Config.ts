export interface Config {
  bot: Bot;
}

export interface Bot {
  TOKEN: string;
  EMBED_COLOR: string;
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
  driver: string;
  auth: string;
  secure: boolean;
}
