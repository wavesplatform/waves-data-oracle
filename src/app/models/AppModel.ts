export interface AppModel {
  loading: boolean;
  appError?: string|null;
  kepperError?: { code: number; message: string }|null;
  isAuthenticated: boolean;
  filters: Array<string>;
}
