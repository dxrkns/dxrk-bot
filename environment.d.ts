declare global {
  namespace NodeJS {
    interface ProcessEnv {
      botToken: string;
      guildId?: string;
      environment: "dev|prod|debug";
      db_Url: string;
    }
  }
}
export {};
