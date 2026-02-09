"use client";

import { createClient } from "@/lib/supabase/client";
import type {
  AchievementType,
  Category,
  CurriculumType,
  Level,
  PersonType,
  ParticipantRole,
} from "@/types/database";

function parseFormData(formData: FormData) {
  const roles = formData.getAll("participant_role") as string[];
  const values = formData.getAll("participant_value") as string[];
  const participants: { role: ParticipantRole; value: string }[] = [];
  for (let i = 0; i < Math.max(roles.length, values.length); i++) {
    const role = roles[i];
    const value = (values[i] ?? "").trim();
    if (role && ["player", "captain", "coach", "mic"].includes(role) && value) {
      participants.push({ role: role as ParticipantRole, value });
    }
  }
  return {
    full_name: formData.get("full_name") as string,
    index_number: formData.get("index_number") as string,
    gender: formData.get("gender") as "male" | "female",
    student_type: formData.get("student_type") as PersonType,
    batch_year: formData.get("batch_year") as string,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    category: formData.get("category") as Category,
    curriculum_type: formData.get("curriculum_type") as CurriculumType,
    achievement_type: formData.get("achievement_type") as AchievementType,
    level: formData.get("level") as Level,
    event_name: (formData.get("event_name") as string) || undefined,
    year: parseInt(formData.get("year") as string, 10),
    is_published: formData.get("is_published") === "true",
    age_group: (formData.get("age_group") as string) || undefined,
    result_position: (formData.get("result_position") as string) || undefined,
    timing: (formData.get("timing") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
    participants,
  };
}

async function upsertParticipants(
  supabase: ReturnType<typeof createClient>,
  achievementId: string,
  participants: { role: ParticipantRole; value: string }[]
) {
  await supabase.from("achievement_participants").delete().eq("achievement_id", achievementId);
  for (let order = 0; order < participants.length; order++) {
    const { role, value } = participants[order];
    const { data: byIndex } = await supabase.from("students").select("id").eq("index_number", value).single();
    if (byIndex) {
      await supabase.from("achievement_participants").insert({
        achievement_id: achievementId,
        role,
        student_id: byIndex.id,
        name: null,
        display_order: order,
      });
    } else {
      await supabase.from("achievement_participants").insert({
        achievement_id: achievementId,
        role,
        student_id: null,
        name: value,
        display_order: order,
      });
    }
  }
}

export async function getAllAchievementsClient() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("*, students(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAchievementForEditClient(id: string) {
  const supabase = createClient();
  const { data: achievement, error } = await supabase
    .from("achievements")
    .select("*, students(*)")
    .eq("id", id)
    .single();
  if (error || !achievement) return null;
  const [{ data: media }, { data: participants }] = await Promise.all([
    supabase.from("media").select("*").eq("achievement_id", id),
    supabase
      .from("achievement_participants")
      .select("*, students(*)")
      .eq("achievement_id", id)
      .order("display_order")
      .order("role"),
  ]);
  return { ...achievement, media: media || [], achievement_participants: participants || [] };
}

export async function createAchievementClient(formData: FormData) {
  const data = parseFormData(formData);
  const supabase = createClient();

  const { data: existingStudent } = await supabase.from("students").select("id").eq("index_number", data.index_number).single();
  let studentId: string;

  if (existingStudent) {
    studentId = existingStudent.id;
    await supabase.from("students").update({
      full_name: data.full_name,
      gender: data.gender,
      student_type: data.student_type,
      batch_year: data.batch_year,
    }).eq("id", studentId);
  } else {
    const { data: newStudent, error: studentError } = await supabase
      .from("students")
      .insert({
        full_name: data.full_name,
        index_number: data.index_number,
        gender: data.gender,
        student_type: data.student_type,
        batch_year: data.batch_year,
      })
      .select("id")
      .single();
    if (studentError) throw studentError;
    studentId = newStudent!.id;
  }

  const { data: achievement, error: achievementError } = await supabase
    .from("achievements")
    .insert({
      student_id: studentId,
      title: data.title,
      description: data.description || null,
      category: data.category,
      curriculum_type: data.curriculum_type,
      achievement_type: data.achievement_type,
      level: data.level,
      event_name: data.event_name || null,
      year: data.year,
      is_published: data.is_published,
      age_group: data.age_group || null,
      result_position: data.result_position || null,
      timing: data.timing || null,
      notes: data.notes || null,
    })
    .select("id")
    .single();
  if (achievementError) throw achievementError;

  await upsertParticipants(supabase, achievement!.id, data.participants);
}

export async function updateAchievementClient(id: string, formData: FormData) {
  const data = parseFormData(formData);
  const supabase = createClient();

  const { data: existing } = await supabase.from("achievements").select("student_id").eq("id", id).single();
  if (!existing) throw new Error("Achievement not found");

  let studentId: string | null = existing.student_id;
  const { data: existingStudentData } = await supabase.from("students").select("id").eq("index_number", data.index_number).single();

  if (existingStudentData) {
    studentId = existingStudentData.id;
    await supabase.from("students").update({
      full_name: data.full_name,
      gender: data.gender,
      student_type: data.student_type,
      batch_year: data.batch_year,
    }).eq("id", studentId);
  } else {
    const { data: newStudent, error: studentError } = await supabase
      .from("students")
      .insert({
        full_name: data.full_name,
        index_number: data.index_number,
        gender: data.gender,
        student_type: data.student_type,
        batch_year: data.batch_year,
      })
      .select("id")
      .single();
    if (studentError) throw studentError;
    studentId = newStudent!.id;
  }

  const { error } = await supabase
    .from("achievements")
    .update({
      student_id: studentId,
      title: data.title,
      description: data.description || null,
      category: data.category,
      curriculum_type: data.curriculum_type,
      achievement_type: data.achievement_type,
      level: data.level,
      event_name: data.event_name || null,
      year: data.year,
      is_published: data.is_published,
      age_group: data.age_group || null,
      result_position: data.result_position || null,
      timing: data.timing || null,
      notes: data.notes || null,
    })
    .eq("id", id);
  if (error) throw error;

  await upsertParticipants(supabase, id, data.participants);
}

export async function deleteAchievementClient(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("achievements").delete().eq("id", id);
  if (error) throw error;
}

export async function togglePublishStatusClient(id: string, is_published: boolean) {
  const supabase = createClient();
  const { error } = await supabase.from("achievements").update({ is_published }).eq("id", id);
  if (error) throw error;
}
