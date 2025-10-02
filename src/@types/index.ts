type Presence = {
    id: number;
    name: string;
    document: string;
    church_id: number;
    church: {
      fullName: string;
    }
}

type PresenceList = Record<string, { total: number, list: Presence[] }>;

type User = {
  id: number;
  fullName?: string;
  city: string;
  username: string;
  isAdmin: boolean;
}

type AuthState = {
    token?: string,
    user?: User,
}

type Store = {
  auth: AuthState;
}