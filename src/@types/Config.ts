export interface Config {
  bot: Bot;
  features: Features;
}

export interface Bot {
  TOKEN: string;
  EMBED_COLOR: string;
  OWNER_ID: string;
  DEBUG_MODE: boolean;
}

export interface Features {
  MESSAGE_CONTENT: MessageContent;
}

export interface MessageContent {
  enable: boolean;
  commands: Commands;
}

export interface Commands {
  enable: boolean;
  prefix: string;
}
