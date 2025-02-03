import { createClient } from "@/utils/supabase/server";

type ChapterInput = {
  name: string;
  subjectId: number;
}

// export async function getChapterById(chapterId: number) {
//   const supabase = await createClient();
//   const { data: chapter, error } = await supabase
//     .from("SubjectChapters")
//     .select("name")
//     .eq("id", chapterId)
//     .single();
//   return chapter?.name;
// }

// export async function getSubjectOfChapter(chapterId: number) {
//   const supabase = await createClient();
//   const { data: chapter, error } = await supabase
//     .from("SubjectChapters")
//     .select("subjectId")
//     .eq("id", chapterId)
//     .single();
//   return chapter?.subjectId;
// }

  