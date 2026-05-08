import { Student } from "../student/student.model";

export interface University {
  id: number;
  name: string;
  location: string;
  logo?: null;
}

export interface Degree {
  id: number;
  name: string;
  university: number;
  university_name: string;
}

export interface DegreeInfo{
  name: string,
  universityName: string,
}

export interface GroupedDegrees {
  id: number;
  name: string;
  universityName: string | null;
  years: Year[];
}

export interface Year {
  id: number;
  year: number;
  degree: number;
}


export interface Course {
  id: number;
  name: string;
  semester: number;
  year: Year;
}

export interface Subscription {
  id: number;
  user: number;
  course: Course;
}

export interface StudySessionComment {
  id: number;
  student: Student;
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
}
