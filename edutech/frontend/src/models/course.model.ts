export interface Year {
  id: number;
  year: number;
  degree: number;
}

export interface Course {
  id: number;
  name: string;
  year: Year; 
  semester: number;
}

export interface Subscription {
  user: number;
  course: number;
}

export interface CreateCoursePayload {
  name: string;
  year_id: number;
  semester: number;
}