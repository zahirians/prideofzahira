export type PersonType = "old_boy" | "old_girl" | "current_student";
export type Gender = "male" | "female";
export type AchievementType = "individual" | "group";
export type CurriculumType = "curricular" | "co_curricular" | "extra_curricular";
export type Category =
  | "academic"
  | "sports"
  | "arts_culture"
  | "leadership"
  | "competitions"
  | "other";
export type Level =
  | "school"
  | "zonal"
  | "provincial"
  | "national"
  | "international";
export type PublishStatus = "draft" | "published";

export interface Student {
  id: string;
  full_name: string;
  index_number: string;
  gender: Gender;
  student_type: PersonType;
  batch_year: string;
  created_at: string;
}

export type ParticipantRole = "player" | "captain" | "coach" | "mic";

export interface Achievement {
  id: string;
  student_id: string | null;
  title: string;
  description?: string | null;
  category: Category;
  curriculum_type: CurriculumType;
  achievement_type: AchievementType;
  level: Level;
  event_name?: string | null;
  year: number;
  is_published: boolean;
  age_group?: string | null;
  result_position?: string | null;
  timing?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface AchievementParticipant {
  id: string;
  achievement_id: string;
  role: ParticipantRole;
  student_id: string | null;
  name: string | null;
  display_order: number;
  created_at: string;
}

export interface Media {
  id: string;
  achievement_id: string;
  file_url: string;
  file_type: string;
}

export interface AchievementWithRelations extends Achievement {
  students?: Student | null;
  media: Media[];
  achievement_participants?: (AchievementParticipant & { students?: Student | null })[];
}

export const PARTICIPANT_ROLE_LABELS: Record<ParticipantRole, string> = {
  player: "Player",
  captain: "Captain",
  coach: "Coach",
  mic: "MIC (Master in Charge)",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  academic: "Academic",
  sports: "Sports",
  arts_culture: "Arts & Culture",
  leadership: "Leadership",
  competitions: "Competitions",
  other: "Other",
};

export const CURRICULUM_LABELS: Record<CurriculumType, string> = {
  curricular: "Curricular",
  co_curricular: "Co-Curricular",
  extra_curricular: "Extra-Curricular",
};

export const LEVEL_LABELS: Record<Level, string> = {
  school: "School",
  zonal: "Zonal",
  provincial: "Provincial",
  national: "National",
  international: "International",
};

export const PERSON_TYPE_LABELS: Record<PersonType, string> = {
  old_boy: "Old Boy",
  old_girl: "Old Girl",
  current_student: "Current Student",
};

export const ACHIEVEMENT_TYPE_LABELS: Record<AchievementType, string> = {
  individual: "Individual",
  group: "Group",
};

export const AGE_GROUP_OPTIONS = [
  "Under 15",
  "Under 16",
  "Under 18",
  "Under 20",
  "Open",
] as const;

export const RESULT_POSITION_OPTIONS = [
  "Champion",
  "Runners-up",
  "First place",
  "Second place",
  "Third place",
  "Leading goal scorer",
  "Best player (tournament)",
  "Selected for national team",
  "Participant",
  "Track champion",
  "Field champion",
] as const;
