export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          nim: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          nim?: string | null;
          role: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          nim?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          course_name: string;
          created_by: string;
          created_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          course_name: string;
          created_by: string;
          created_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          course_name?: string;
          created_by?: string;
          created_at?: string;
          is_active?: boolean;
        };
      };
      attendance: {
        Row: {
          id: string;
          session_id: string;
          student_id: string;
          scanned_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          student_id: string;
          scanned_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          student_id?: string;
          scanned_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}