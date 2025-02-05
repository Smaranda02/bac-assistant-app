import { createClient } from "@/utils/supabase/server";
import { fillMissingWeeks, generateLastNWeeks, getMonthRangeString, groupByWeekAndSum, mergeWeeklyData } from "../utils";

export async function getTeacherStatistics() {
  const supabase = await createClient();
  const teachersQuery = await supabase.from('Teachers')
    .select(`
      id.count(),
      ...Subjects!inner(subject:name)
    `);

  if (teachersQuery.error) {
    console.log("Teachers statistics", teachersQuery.error);
    return [];
  }

  return teachersQuery.data;
}

export async function getUserStatistics() {
  const supabase = await createClient();
  const usersQuery = await supabase.from('Users')
    .select(`
      id.count(),
      ...Roles!inner(role:name)
    `);

  if (usersQuery.error) {
    console.log("Users statistics", usersQuery.error);
    return [];
  }

  return usersQuery.data;
}

export async function getActivityStatistics() {
  const supabase = await createClient();
  const createdTestsQuery = await supabase.from("PracticeTests").select("data:created_at");
  const submittedTestsQuery = await supabase.from("StudentsTests").select("data:submittedAt");

  if (createdTestsQuery.error) {
    console.log("Activity statistics", createdTestsQuery.error);
    return { data: [], period: "" };
  }

  if (submittedTestsQuery.error) {
    console.log("Activity statistics", submittedTestsQuery.error);
    return { data: [], period: "" };
  }

  const result1 = groupByWeekAndSum(createdTestsQuery.data);
  const result2 = groupByWeekAndSum(submittedTestsQuery.data);
  const mergedData = mergeWeeklyData(result1, result2, "total1", "total2");
  const last10Weeks = generateLastNWeeks(8);
  const filledData = fillMissingWeeks(mergedData, last10Weeks);
  const rangeString = getMonthRangeString(filledData[0].week, filledData[filledData.length - 1].week, "ro-RO");

  return {
    data: filledData,
    period: rangeString
  }
}

export async function getUnconfirmedTeachers() {
  const supabase = await createClient();
  const teachersQuery = await supabase.from("Teachers")
    .select(`
      id,
      firstname,
      lastname,
      ...Subjects!inner(subject:name),
      ...Users!inner(email)
    `)
    .eq("confirmed", false);

  if (teachersQuery.error) {
    console.log("Unconfirmed teachers", teachersQuery.error);
    return [];
  }

  return teachersQuery.data;
}
