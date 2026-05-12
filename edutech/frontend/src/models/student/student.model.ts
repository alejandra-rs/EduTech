export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  picture?: string;
  degree?: number[];
  is_admin: boolean;
}