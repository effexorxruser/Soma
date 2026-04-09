export type AppEnv = 'local' | 'dev' | 'test' | 'prod';

export interface AppContext {
  appName: 'Soma';
  environment: AppEnv;
  startedAt: Date;
}
