declare global {
  namespace NodeJS {
    interface ProcessEnv {
      botToken: string;
      guildId?: string;
      environment: "dev" | "prod" | "debug";
      DATABASE_URL: string;
      db_name: string;
      db_user: string;
      db_pass: string;
      db_host: string;
      db_port: string;
    }
  }
}
export {};
