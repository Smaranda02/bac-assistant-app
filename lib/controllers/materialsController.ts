import { createClient } from "@/utils/supabase/server";
import { getSubjectOfChapter } from "./chapterController";



export async function addMaterial({
  chapterId,
  title,
  content
}: {
  chapterId: number
  title: string
  content: File
}) {
  const supabase = await createClient()
  try {
    const timestamp = Date.now()
    const fileExtension = content.name.split('.').pop()
    const fileName = `${timestamp}.${fileExtension}`
    const filePath = `chapter-${chapterId}/${fileName}`
    const subjectId = await getSubjectOfChapter(chapterId)
    if (!subjectId) throw new Error('Subject not found')

    const { data: storageData, error: storageError } = await supabase.storage
      .from('LearningMaterials')
      .upload(filePath, content, {
        contentType: content.type,
        upsert: false
      })

    if (storageError) throw new Error(`Storage error: ${storageError.message}`)

    const { data: urlData } = supabase.storage
      .from('LearningMaterials')
      .getPublicUrl(storageData.path)

    const { data: dbData, error: dbError } = await supabase
      .from('Materials')
      .insert([
        {
          chapterId: chapterId,
          contentURL: urlData.publicUrl,
          subjectId: subjectId,
        }
      ])
      .select()

    if (dbError) throw new Error(`Database error: ${dbError.message}`)

    return dbData[0]
  } catch (error) {
    console.error('Error adding material:', error)
    throw error
  }
}
