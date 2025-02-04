import { createClient } from "@/utils/supabase/server";

export async function getSubjects() {
  const supabase = await createClient();
  
  const subjects = await supabase.from("Subjects")
    .select("*");
  
  if (subjects.error) {
    console.log("Subjects", subjects.error);
    return [];
  }

  return subjects.data;
}

export async function getSubjectContent(subjectId: number) {
  const supabase = await createClient();
  const subjectQuerry = await supabase.from("Subjects")
    .select(`
      name,
      chapters:SubjectChapters(id, name),
      tests:PracticeTests(id, name)
    `)
    .eq("id", subjectId)
    .single();

  if (subjectQuerry.error) {
    console.log("Get subject content", subjectQuerry.error);
    return null;
  }

  return subjectQuerry.data;
}

export async function getChapterContent(chapterId: number) {
  const supabase = await createClient();
  const chapterQuery = await supabase.from("SubjectChapters")
    .select(`
      name,
      subjectId,
      documents:Materials(id, name, contentURL)
    `)
    .eq("id", chapterId)
    .not("Materials.contentURL", "is", null)
    .single();

  if (chapterQuery.error) {
    console.log("Get chapter content", chapterQuery.error);
    return null;
  }

  return chapterQuery.data;
}

export async function getDocument(documentId: number) {
  const supabase = await createClient();
  const documentQuery = await supabase.from("Materials").select("*").eq("id", documentId).single();

  if (documentQuery.error) {
    console.log("Get document", documentQuery.error);
    return null;
  }

  return documentQuery.data;
}
