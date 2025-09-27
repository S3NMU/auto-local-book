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
      bookings: {
        Row: {
          additional_fees: number | null
          created_at: string
          currency: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          dropoff_address: string | null
          dropoff_fee: number | null
          dropoff_requested: boolean | null
          duration_minutes: number | null
          id: string
          location_address: string | null
          location_city: string | null
          location_state: string | null
          location_zip_code: string | null
          notes: string | null
          pickup_address: string | null
          pickup_fee: number | null
          pickup_requested: boolean | null
          price_final: number | null
          price_quoted: number | null
          provider_id: string
          scheduled_date: string
          service_description: string | null
          service_ids: string[] | null
          service_type: string
          status: string
          total_service_cost: number | null
          updated_at: string
        }
        Insert: {
          additional_fees?: number | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          dropoff_address?: string | null
          dropoff_fee?: number | null
          dropoff_requested?: boolean | null
          duration_minutes?: number | null
          id?: string
          location_address?: string | null
          location_city?: string | null
          location_state?: string | null
          location_zip_code?: string | null
          notes?: string | null
          pickup_address?: string | null
          pickup_fee?: number | null
          pickup_requested?: boolean | null
          price_final?: number | null
          price_quoted?: number | null
          provider_id: string
          scheduled_date: string
          service_description?: string | null
          service_ids?: string[] | null
          service_type: string
          status?: string
          total_service_cost?: number | null
          updated_at?: string
        }
        Update: {
          additional_fees?: number | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          dropoff_address?: string | null
          dropoff_fee?: number | null
          dropoff_requested?: boolean | null
          duration_minutes?: number | null
          id?: string
          location_address?: string | null
          location_city?: string | null
          location_state?: string | null
          location_zip_code?: string | null
          notes?: string | null
          pickup_address?: string | null
          pickup_fee?: number | null
          pickup_requested?: boolean | null
          price_final?: number | null
          price_quoted?: number | null
          provider_id?: string
          scheduled_date?: string
          service_description?: string | null
          service_ids?: string[] | null
          service_type?: string
          status?: string
          total_service_cost?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      customer_records: {
        Row: {
          created_at: string
          customer_address: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          last_service_date: string | null
          notes: string | null
          provider_id: string
          total_services: number | null
          total_spent: number | null
          updated_at: string
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_vin: string | null
          vehicle_year: number | null
        }
        Insert: {
          created_at?: string
          customer_address?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          last_service_date?: string | null
          notes?: string | null
          provider_id: string
          total_services?: number | null
          total_spent?: number | null
          updated_at?: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_vin?: string | null
          vehicle_year?: number | null
        }
        Update: {
          created_at?: string
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          last_service_date?: string | null
          notes?: string | null
          provider_id?: string
          total_services?: number | null
          total_spent?: number | null
          updated_at?: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_vin?: string | null
          vehicle_year?: number | null
        }
        Relationships: []
      }
      provider_profiles: {
        Row: {
          business_address: string | null
          business_city: string | null
          business_description: string | null
          business_hours: Json | null
          business_name: string | null
          business_phone: string | null
          business_state: string | null
          business_zip_code: string | null
          created_at: string
          id: string
          is_mobile_service: boolean | null
          license_number: string | null
          service_radius_miles: number | null
          specialties: string[] | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          business_address?: string | null
          business_city?: string | null
          business_description?: string | null
          business_hours?: Json | null
          business_name?: string | null
          business_phone?: string | null
          business_state?: string | null
          business_zip_code?: string | null
          created_at?: string
          id?: string
          is_mobile_service?: boolean | null
          license_number?: string | null
          service_radius_miles?: number | null
          specialties?: string[] | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          business_address?: string | null
          business_city?: string | null
          business_description?: string | null
          business_hours?: Json | null
          business_name?: string | null
          business_phone?: string | null
          business_state?: string | null
          business_zip_code?: string | null
          created_at?: string
          id?: string
          is_mobile_service?: boolean | null
          license_number?: string | null
          service_radius_miles?: number | null
          specialties?: string[] | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      provider_requests: {
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
          latitude: number
          longitude: number
          owner_name: string | null
          phone: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          specialties: string[] | null
          state: string
          status: string | null
          submitted_by: string | null
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
          latitude: number
          longitude: number
          owner_name?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialties?: string[] | null
          state: string
          status?: string | null
          submitted_by?: string | null
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
          latitude?: number
          longitude?: number
          owner_name?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialties?: string[] | null
          state?: string
          status?: string | null
          submitted_by?: string | null
          updated_at?: string
          website_url?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      provider_services: {
        Row: {
          created_at: string
          currency: string | null
          dropoff_available: boolean | null
          dropoff_fee: number | null
          duration_minutes: number | null
          id: string
          is_available: boolean | null
          notes: string | null
          pickup_available: boolean | null
          pickup_fee: number | null
          price_max: number | null
          price_min: number | null
          provider_id: string
          service_id: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          dropoff_available?: boolean | null
          dropoff_fee?: number | null
          duration_minutes?: number | null
          id?: string
          is_available?: boolean | null
          notes?: string | null
          pickup_available?: boolean | null
          pickup_fee?: number | null
          price_max?: number | null
          price_min?: number | null
          provider_id: string
          service_id: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          dropoff_available?: boolean | null
          dropoff_fee?: number | null
          duration_minutes?: number | null
          id?: string
          is_available?: boolean | null
          notes?: string | null
          pickup_available?: boolean | null
          pickup_fee?: number | null
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
          status: string | null
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
          status?: string | null
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
          status?: string | null
          updated_at?: string
          website_url?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      revenue_entries: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          description: string
          entry_date: string
          id: string
          is_paid: boolean | null
          notes: string | null
          payment_method: string | null
          provider_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          description: string
          entry_date?: string
          id?: string
          is_paid?: boolean | null
          notes?: string | null
          payment_method?: string | null
          provider_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          description?: string
          entry_date?: string
          id?: string
          is_paid?: boolean | null
          notes?: string | null
          payment_method?: string | null
          provider_id?: string
          updated_at?: string
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_providers_with_contact_protection: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string
          business_hours: Json
          business_name: string
          city: string
          created_at: string
          description: string
          email: string
          id: string
          is_mobile: boolean
          is_verified: boolean
          latitude: number
          longitude: number
          owner_name: string
          phone: string
          rating: number
          review_count: number
          specialties: string[]
          state: string
          status: string
          updated_at: string
          website_url: string
          zip_code: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      make_me_provider: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user" | "provider"
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
    Enums: {
      app_role: ["admin", "user", "provider"],
    },
  },
} as const
