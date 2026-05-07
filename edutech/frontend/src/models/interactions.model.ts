import { Student } from "./student.model";


export interface Comment {
  id: number;
  message: string;
  user: Student;
  created_at: string;
}

export interface LikeStatus {
  id: number;
  count: number;
}

