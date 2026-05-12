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

export interface SubscriptionResponse {
  id: number;
}

export interface UserSubscription {
  id: number;
  course: {
    id: number;
    name: string;
    year?: {
      id: number;
    };
  }
}
