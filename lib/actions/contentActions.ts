"use server";

import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { getChapterContent } from "../controllers/contentController";
import { revalidatePath } from "next/cache";

export async function createSubjectAction(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;

  const subjectInsert = await supabase.from("Subjects")
    .insert({
      name
    });

  if (subjectInsert.error) {
    console.log("Insert subject", subjectInsert.error);
    return redirect("/admin/content/create-subject");
  }

  return redirect("/admin/content");
}

export async function createChapterAction(subjectId: number, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get('name') as string;
  
  const chapterInsert = await supabase.from("SubjectChapters")
    .insert({
      name,
      subjectId
    });

  if (chapterInsert.error) {
    console.log("Insert chapter", chapterInsert.error);
    return redirect(`/admin/content/create-chapter/${subjectId}`);
  }

  return redirect(`/admin/content/view-subject/${subjectId}`);
}

export async function editChapterAction(chapterId: number, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get('name') as string;

  const chapterUpdate = await supabase.from("SubjectChapters")
    .update({
      name
    })
    .eq("id", chapterId)
    .select("*")
    .single();
  
  if (chapterUpdate.error) {
    console.log("Update chapter", chapterUpdate.error);
    return redirect(`/admin/content/edit-chapter/${chapterId}`);
  }

  revalidatePath(`/admin/content/view-subject/${chapterUpdate.data.subjectId}`);
  return redirect(`/admin/content/view-subject/${chapterUpdate.data.subjectId}`);
}

export async function deleteChapterAction(chapterId: number) {
  const supabase = await createClient();
  const chapter = await getChapterContent(chapterId);

  if (!chapter) {
    return notFound();
  }
  
  const chapterDelete = await supabase.from("SubjectChapters").delete().eq("id", chapterId);
  if (chapterDelete.error) {
    console.log("Chapter delete", chapterDelete.error);
    return;
  }

  return revalidatePath(`/admin/content/view-subject/${chapter.subjectId}`);
}

export async function createMaterialAction(chapterId: number, formData: FormData) { 
  const title = formData.get('title') as string;
  const content = formData.get('content') as File;
  const errorRedirectPath = `/admin/content/create-material/${chapterId}`;

  // prepare file metedata
  const supabase = await createClient();
  const timestamp = Date.now();
  const fileExtension = content.name.split('.').pop();
  const fileName = `${timestamp}.${fileExtension}`;
  const filePath = `chapter-${chapterId}/${fileName}`;

  // upload file to storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from('LearningMaterials')
    .upload(filePath, content, {
      contentType: content.type,
      upsert: false
    });

  if (storageError) {
    console.log("Upload material", storageError);
    return redirect(errorRedirectPath);
  }

  // get file public url
  const { data: urlData } = supabase.storage
    .from('LearningMaterials')
    .getPublicUrl(storageData.path)

  // add file information into database
  const { error: dbError } = await supabase
    .from('Materials')
    .insert({
      chapterId,
      name: title,
      contentURL: urlData.publicUrl,
    });

  if (dbError) {
    console.log("Insert material data", dbError);
    return redirect(errorRedirectPath);
  }

  return redirect(`/admin/content/view-chapter/${chapterId}`);
}
