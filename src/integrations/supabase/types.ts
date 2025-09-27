export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      provider_services: {
        Row: {
          created_at: string
          duration_minutes: number | null
          id: string
          is_available: boolean | null
          notes: string | null
          price_max: number | null
          price_min: number | null
          provider_id: string
          service_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_available?: boolean | null
          notes?: string | null
          price_max?: number | null
          price_min?: number | null
          provider_id: string
          service_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_available?: boolean | null
          notes?: string | null
          price_max?: number | null
          price_min?: number | null
          provider_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          address: string
          business_hours: Json | null
          business_name: string
          city: string
          created_at: string
          description: string | null
          email: string | null
          id: string
          is_mobile: boolean | null
          is_verified: boolean | null
          latitude: number
          longitude: number
          owner_name: string | null
          phone: string | null
          rating: number | null
          review_count: number | null
          specialties: string[] | null
          state: string
          updated_at: string
          website_url: string | null
          zip_code: string
        }
        Insert: {
          address: string
          business_hours?: Json | null
          business_name: string
          city: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_mobile?: boolean | null
          is_verified?: boolean | null
          latitude: number
          longitude: number
          owner_name?: string | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          state: string
          updated_at?: string
          website_url?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          business_hours?: Json | null
          business_name?: string
          city?: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_mobile?: boolean | null
          is_verified?: boolean | null
          latitude?: number
          longitude?: number
          owner_name?: string | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          state?: string
          updated_at?: string
          website_url?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          customer_name: string
          id: string
          provider_id: string
          rating: number
          review_text: string | null
          service_type: string | null
        }
        Insert: {
          created_at?: string
          customer_name: string
          id?: string
          provider_id: string
          rating: number
          review_text?: string | null
          service_type?: string | null
        }
        Update: {
          created_at?: string
          customer_name?: string
          id?: string
          provider_id?: string
          rating?: number
          review_text?: string | null
          service_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          base_price_max: number | null
          base_price_min: number | null
          category: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_mobile_available: boolean | null
          name: string
        }
        Insert: {
          base_price_max?: number | null
          base_price_min?: number | null
          category: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_mobile_available?: boolean | null
          name: string
        }
        Update: {
          base_price_max?: number | null
          base_price_min?: number | null
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_mobile_available?: boolean | null
          name?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
