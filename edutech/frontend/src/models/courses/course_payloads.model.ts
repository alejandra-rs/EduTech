export interface CreateCoursePayload {
  name: string;
  year_id: number;
  semester: number;
}

export interface CreateStudySessionCommentPayload {
  student_id: number;
  message: string;
}

export interface CreateStudySessionPayload {
  title: string;
  description: string;
  scheduled_at: string;
  creator_id: number;
  course_id?: number | null;
}

export interface CreateSubscriptionPayload {
  user: number;
  course: number;
}