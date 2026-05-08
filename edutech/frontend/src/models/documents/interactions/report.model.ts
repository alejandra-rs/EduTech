import { Student } from "../../student/student.model";

export interface ReportReason {
  id: number;
  reason: string;
}

export interface PostInReport {
  id: number;
  title: string;
  post_type: string;
  course: number;
  course_name: string;
  year_id: number;
}

export interface ReportResolution {
  id: number;
  message: string;
  created_at: Date;
  resolved_by: Student;
}

export interface Report {
  id: number;
  reason: ReportReason;
  description: string;
  created_at: Date;
  user: Student;
  post: PostInReport;
  resolution?: ReportResolution;
}

export interface CommentReport {
  id: number;
  reason: ReportReason;
  description: string;
  created_at: Date;
  user: Student;
  comment: number;
}