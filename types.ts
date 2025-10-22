
export enum AppView {
  SCHEDULE = 'schedule',
  QUERY = 'query',
  ADMIN = 'admin',
  STATS = 'stats',
}

export interface InvigilatorData {
  name: string;
  schedule: { [key: string]: string };
}