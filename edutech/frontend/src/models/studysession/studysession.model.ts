export interface CreateStudySessionPayload {
  courseId?: number;
  creatorId: number;
  title: string;
  description: string;
  scheduledAt: Date;
}

export interface GetStudySessionsParams {
  courseIds?: (number | string)[];
  studentId?: number | null;
  starred?: boolean;
}