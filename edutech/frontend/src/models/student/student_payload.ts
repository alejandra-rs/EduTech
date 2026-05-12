export interface UpdateStudentPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  picture?: File | string;
  degree?: number;
}