import { Student } from "../../student/student.model";

export interface Comment {
  id: number;
  message: string;
  user: Student;
  created_at: Date;
}

export interface CreateCommentPayload {
  user: number;
  post: number;
  message: string;
}
