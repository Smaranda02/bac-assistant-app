export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Materials: {
        Row: {
          chapterId: number
          contentURL: string
          id: number
          name: string
        }
        Insert: {
          chapterId: number
          contentURL: string
          id?: number
          name: string
        }
        Update: {
          chapterId?: number
          contentURL?: string
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "Materials_chapterId_fkey"
            columns: ["chapterId"]
            isOneToOne: false
            referencedRelation: "SubjectChapters"
            referencedColumns: ["id"]
          },
        ]
      }
      PracticeTests: {
        Row: {
          created_at: string
          id: number
          name: string
          subjectId: number
          teacherId: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          subjectId: number
          teacherId: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          subjectId?: number
          teacherId?: number
        }
        Relationships: [
          {
            foreignKeyName: "PracticeTests_subjectId_fkey"
            columns: ["subjectId"]
            isOneToOne: false
            referencedRelation: "Subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PracticeTests_teacherId_fkey"
            columns: ["teacherId"]
            isOneToOne: false
            referencedRelation: "Teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      QuestionsAnswers: {
        Row: {
          answer: string
          id: number
          points: number
          question: string
          testId: number
        }
        Insert: {
          answer: string
          id?: number
          points: number
          question: string
          testId: number
        }
        Update: {
          answer?: string
          id?: number
          points?: number
          question?: string
          testId?: number
        }
        Relationships: [
          {
            foreignKeyName: "QuestionsAnswers_testId_fkey"
            columns: ["testId"]
            isOneToOne: false
            referencedRelation: "PracticeTests"
            referencedColumns: ["id"]
          },
        ]
      }
      QuestionsAnswersStudents: {
        Row: {
          answer: string
          feedback: string | null
          points: number | null
          questionId: number
          submissionId: number
        }
        Insert: {
          answer: string
          feedback?: string | null
          points?: number | null
          questionId: number
          submissionId: number
        }
        Update: {
          answer?: string
          feedback?: string | null
          points?: number | null
          questionId?: number
          submissionId?: number
        }
        Relationships: [
          {
            foreignKeyName: "QuestionsAnswersStudents_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "QuestionsAnswers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "QuestionsAnswersStudents_submissionId_fkey"
            columns: ["submissionId"]
            isOneToOne: false
            referencedRelation: "StudentsTests"
            referencedColumns: ["submissionId"]
          },
        ]
      }
      Roles: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      Students: {
        Row: {
          creditPoints: number
          firstname: string
          id: number
          lastname: string
          userId: number
        }
        Insert: {
          creditPoints: number
          firstname: string
          id?: number
          lastname: string
          userId: number
        }
        Update: {
          creditPoints?: number
          firstname?: string
          id?: number
          lastname?: string
          userId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Students_userId_fkey"
            columns: ["userId"]
            isOneToOne: true
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      StudentsTests: {
        Row: {
          chapterId: number | null
          creditsReceived: number | null
          grade: number | null
          gradedAt: string | null
          studentId: number
          submissionId: number
          submittedAt: string
          testId: number
        }
        Insert: {
          chapterId?: number | null
          creditsReceived?: number | null
          grade?: number | null
          gradedAt?: string | null
          studentId: number
          submissionId?: number
          submittedAt?: string
          testId: number
        }
        Update: {
          chapterId?: number | null
          creditsReceived?: number | null
          grade?: number | null
          gradedAt?: string | null
          studentId?: number
          submissionId?: number
          submittedAt?: string
          testId?: number
        }
        Relationships: [
          {
            foreignKeyName: "StudentsTests_chapterId_fkey"
            columns: ["chapterId"]
            isOneToOne: false
            referencedRelation: "SubjectChapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "StudentsTests_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "Students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "StudentsTests_testId_fkey"
            columns: ["testId"]
            isOneToOne: false
            referencedRelation: "PracticeTests"
            referencedColumns: ["id"]
          },
        ]
      }
      SubjectChapters: {
        Row: {
          id: number
          name: string
          subjectId: number
        }
        Insert: {
          id?: number
          name: string
          subjectId: number
        }
        Update: {
          id?: number
          name?: string
          subjectId?: number
        }
        Relationships: [
          {
            foreignKeyName: "SubjectChapters_subjectId_fkey"
            columns: ["subjectId"]
            isOneToOne: false
            referencedRelation: "Subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      Subjects: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      Teachers: {
        Row: {
          confirmed: boolean
          firstname: string
          id: number
          lastname: string
          subjectId: number
          userId: number
        }
        Insert: {
          confirmed?: boolean
          firstname: string
          id?: number
          lastname: string
          subjectId: number
          userId: number
        }
        Update: {
          confirmed?: boolean
          firstname?: string
          id?: number
          lastname?: string
          subjectId?: number
          userId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Teachers_subjectId_fkey"
            columns: ["subjectId"]
            isOneToOne: false
            referencedRelation: "Subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Teachers_userId_fkey"
            columns: ["userId"]
            isOneToOne: true
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Users: {
        Row: {
          email: string
          id: number
          roleId: number
        }
        Insert: {
          email: string
          id?: number
          roleId: number
        }
        Update: {
          email?: string
          id?: number
          roleId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Users_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
