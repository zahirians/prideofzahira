"use client";

import { useState } from "react";
import type { PersonType, Gender, AchievementType, CurriculumType, Category, Level, ParticipantRole } from "@/types/database";
import {
  CATEGORY_LABELS,
  CURRICULUM_LABELS,
  LEVEL_LABELS,
  PERSON_TYPE_LABELS,
  ACHIEVEMENT_TYPE_LABELS,
  PARTICIPANT_ROLE_LABELS,
  AGE_GROUP_OPTIONS,
  RESULT_POSITION_OPTIONS,
} from "@/types/database";

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [Category, string][];
const CURRICULUM_TYPES = Object.entries(CURRICULUM_LABELS) as [CurriculumType, string][];
const PERSON_TYPES = Object.entries(PERSON_TYPE_LABELS) as [PersonType, string][];
const ACHIEVEMENT_TYPES = Object.entries(ACHIEVEMENT_TYPE_LABELS) as [AchievementType, string][];
const LEVELS = Object.entries(LEVEL_LABELS) as [Level, string][];
const PARTICIPANT_ROLES = Object.entries(PARTICIPANT_ROLE_LABELS) as [ParticipantRole, string][];

interface AchievementWithRelations {
  id: string;
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
  students?: {
    full_name: string;
    index_number: string;
    gender: Gender;
    student_type: PersonType;
    batch_year: string;
  } | null;
  achievement_participants?: { role: ParticipantRole; name: string | null; students?: { index_number: string; full_name: string } | null }[];
}

interface AchievementFormProps {
  action: (formData: FormData) => Promise<void>;
  achievement?: AchievementWithRelations | null;
}

const defaultParticipantRows = (achievement: AchievementWithRelations | null | undefined) =>
  achievement?.achievement_participants?.length
    ? achievement.achievement_participants.map((p) => ({
        role: p.role,
        value: p.students?.index_number ?? p.name ?? "",
      }))
    : [{ role: "player" as ParticipantRole, value: "" }];

export function AchievementForm({ action, achievement }: AchievementFormProps) {
  const student = achievement?.students;
  const [participantRows, setParticipantRows] = useState<{ role: ParticipantRole; value: string }[]>(
    () => defaultParticipantRows(achievement)
  );

  const addParticipantRow = () => setParticipantRows((r) => [...r, { role: "player", value: "" }]);
  const removeParticipantRow = (i: number) =>
    setParticipantRows((r) => r.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await action(new FormData(e.currentTarget));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-8"
    >
      {/* Person Type */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Person Type</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {PERSON_TYPES.map(([value, label]) => (
            <label key={value} className="flex items-center gap-2">
              <input
                type="radio"
                name="student_type"
                value={value}
                defaultChecked={student?.student_type === value}
                required
                className="rounded border-[#0e4d8d] text-[#0e4d8d] focus:ring-[#0e4d8d]"
              />
              <span className="text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Gender */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Gender</h2>
        <div className="mt-4 flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="male"
              defaultChecked={student?.gender === "male"}
              required
              className="rounded border-[#0e4d8d] text-[#0e4d8d] focus:ring-[#0e4d8d]"
            />
            <span className="text-slate-700">Male</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="female"
              defaultChecked={student?.gender === "female"}
              className="rounded border-[#0e4d8d] text-[#0e4d8d] focus:ring-[#0e4d8d]"
            />
            <span className="text-slate-700">Female</span>
          </label>
        </div>
      </section>

      {/* Achievement Type */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Achievement Type</h2>
        <div className="mt-4 flex gap-6">
          {ACHIEVEMENT_TYPES.map(([value, label]) => (
            <label key={value} className="flex items-center gap-2">
              <input
                type="radio"
                name="achievement_type"
                value={value}
                defaultChecked={achievement?.achievement_type === value}
                required
                className="rounded border-[#0e4d8d] text-[#0e4d8d] focus:ring-[#0e4d8d]"
              />
              <span className="text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Curriculum Type */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Curriculum Type</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {CURRICULUM_TYPES.map(([value, label]) => (
            <label key={value} className="flex items-center gap-2">
              <input
                type="radio"
                name="curriculum_type"
                value={value}
                defaultChecked={achievement?.curriculum_type === value}
                required
                className="rounded border-[#0e4d8d] text-[#0e4d8d] focus:ring-[#0e4d8d]"
              />
              <span className="text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Category */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Category</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {CATEGORIES.map(([value, label]) => (
            <label key={value} className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                value={value}
                defaultChecked={achievement?.category === value}
                required
                className="rounded border-[#0e4d8d] text-[#0e4d8d] focus:ring-[#0e4d8d]"
              />
              <span className="text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Student Information */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Student Information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              name="full_name"
              required
              defaultValue={student?.full_name}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">School Index Number</label>
            <input
              type="text"
              name="index_number"
              required
              defaultValue={student?.index_number}
              placeholder="Unique identifier"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Batch / Year</label>
            <input
              type="text"
              name="batch_year"
              required
              defaultValue={student?.batch_year}
              placeholder="e.g. 2020"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Achievement Details */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Achievement Details</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Title</label>
            <input
              type="text"
              name="title"
              required
              defaultValue={achievement?.title}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Description (optional)</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={achievement?.description ?? ""}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Event / Competition Name (optional)</label>
            <input
              type="text"
              name="event_name"
              defaultValue={achievement?.event_name ?? ""}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
            />
          </div>
            <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Level</label>
              <select
                name="level"
                required
                defaultValue={achievement?.level}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
              >
                {LEVELS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Year Achieved</label>
              <input
                type="number"
                name="year"
                required
                min={1900}
                max={2100}
                defaultValue={achievement?.year ?? new Date().getFullYear()}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Age group (optional)</label>
              <select
                name="age_group"
                defaultValue={achievement?.age_group ?? ""}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
              >
                <option value="">—</option>
                {AGE_GROUP_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Result / position (optional)</label>
              <select
                name="result_position"
                defaultValue={achievement?.result_position ?? ""}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
              >
                <option value="">—</option>
                {RESULT_POSITION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Timing (optional, e.g. 11.2s)</label>
              <input
                type="text"
                name="timing"
                defaultValue={achievement?.timing ?? ""}
                placeholder="e.g. 11.2s, 22.8s"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700">Notes (optional)</label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={achievement?.notes ?? ""}
              placeholder="Anything special not covered by the fields above"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Team / Participants (for group achievements) */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Team / Participants (optional)</h2>
        <p className="mt-1 text-sm text-slate-500">
          Add players, captain, coach, MIC. Use index number for students (e.g. 2022-101) or full name for staff.
        </p>
        <div className="mt-4 space-y-3">
          {participantRows.map((row, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <select
                name="participant_role"
                defaultValue={row.role}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
              >
                {PARTICIPANT_ROLES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="participant_value"
                defaultValue={row.value}
                placeholder="Index no. or name"
                className="min-w-[180px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-[#0e4d8d] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeParticipantRow(i)}
                className="rounded border border-slate-300 px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addParticipantRow}
            className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            + Add participant
          </button>
        </div>
      </section>

      {/* Publish Status */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Publish Status</h2>
        <div className="mt-4 flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="is_published"
              value="false"
              defaultChecked={!achievement?.is_published}
              className="rounded border-[#0e4d8d] text-[#0e4d8d] focus:ring-[#0e4d8d]"
            />
            <span className="text-slate-700">Draft</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="is_published"
              value="true"
              defaultChecked={achievement?.is_published}
              className="rounded border-[#0e4d8d] text-[#0e4d8d] focus:ring-[#0e4d8d]"
            />
            <span className="text-slate-700">Published</span>
          </label>
        </div>
      </section>

      <div className="flex gap-4">
        <button
          type="submit"
          className="rounded-lg bg-[#820000] px-6 py-2 font-medium text-white transition hover:bg-[#a31f1f]"
        >
          {achievement ? "Update Achievement" : "Add Achievement"}
        </button>
        <a
          href="/admin/dashboard"
          className="rounded-lg border border-slate-300 px-6 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
