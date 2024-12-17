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
          chapter: string | null
          contentURL: string | null
          id: number
          subjectId: number | null
        }
        Insert: {
          chapter?: string | null
          contentURL?: string | null
          id?: number
          subjectId?: number | null
        }
        Update: {
          chapter?: string | null
          contentURL?: string | null
          id?: number
          subjectId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Materials_subjectId_fkey"
            columns: ["subjectId"]
            isOneToOne: false
            referencedRelation: "Subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      PracticeTests: {
        Row: {
          created_at: string
          id: number
          name: string
          subjectId: number | null
          teacherId: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          subjectId?: number | null
          teacherId?: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          subjectId?: number | null
          teacherId?: number
        }
        Relationships: [
          {
            foreignKeyName: "PracticeTest_teacherId_fkey"
            columns: ["teacherId"]
            isOneToOne: false
            referencedRelation: "Teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PracticeTests_subjectId_fkey"
            columns: ["subjectId"]
            isOneToOne: false
            referencedRelation: "Subjects"
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
          studentId: number
        }
        Insert: {
          answer: string
          feedback?: string | null
          points?: number | null
          questionId: number
          studentId: number
        }
        Update: {
          answer?: string
          feedback?: string | null
          points?: number | null
          questionId?: number
          studentId?: number
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
            foreignKeyName: "QuestionsAnswersStudents_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "Students"
            referencedColumns: ["id"]
          },
        ]
      }
      Roles: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      Students: {
        Row: {
          creditPoints: number | null
          firstname: string | null
          id: number
          lastname: string | null
          userId: number | null
        }
        Insert: {
          creditPoints?: number | null
          firstname?: string | null
          id?: number
          lastname?: string | null
          userId?: number | null
        }
        Update: {
          creditPoints?: number | null
          firstname?: string | null
          id?: number
          lastname?: string | null
          userId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Students_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      StudentsTests: {
        Row: {
          grade: number | null
          studentId: number
          testId: number
        }
        Insert: {
          grade?: number | null
          studentId: number
          testId: number
        }
        Update: {
          grade?: number | null
          studentId?: number
          testId?: number
        }
        Relationships: [
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
      Subjects: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      Teachers: {
        Row: {
          firstname: string | null
          id: number
          lastname: string | null
          subjectId: number | null
          userId: number | null
        }
        Insert: {
          firstname?: string | null
          id?: number
          lastname?: string | null
          subjectId?: number | null
          userId?: number | null
        }
        Update: {
          firstname?: string | null
          id?: number
          lastname?: string | null
          subjectId?: number | null
          userId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Teacher_subjectId_fkey"
            columns: ["subjectId"]
            isOneToOne: false
            referencedRelation: "Subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Teachers_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Users: {
        Row: {
          email: string | null
          id: number
          password: string | null
          roleId: number | null
          username: string | null
        }
        Insert: {
          email?: string | null
          id?: number
          password?: string | null
          roleId?: number | null
          username?: string | null
        }
        Update: {
          email?: string | null
          id?: number
          password?: string | null
          roleId?: number | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "User_roleId_fkey"
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
