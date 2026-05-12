import { Course } from "../courses/course.model";
import { Student } from "../student/student.model";

export interface CreateStudySessionPayload {
  courseId: string | null;
  creatorId: number;
  title: string;
  description: string;
  scheduledAt: string;
  twitchLink: string;
}

export interface GetStudySessionsParams {
  courseIds?: (number | string)[];
  studentId?: number | null;
  starred?: boolean;
}

export interface StudySessionComment {
  id: number;
  user: Student;
  message: string;
  created_at: Date;
}

export interface StudySession {
  id: number;
  title: string;
  description: string;
  scheduled_at: Date;
  created_at: Date;
  creator: Student;
  course?: Course;
  participants: number[];
  is_starred: boolean;
  twitch_link: string;
  stream_task_id: string;
}