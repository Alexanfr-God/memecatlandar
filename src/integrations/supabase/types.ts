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
      Likes: {
        Row: {
          created_at: string
          id: number
          meme_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: never
          meme_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: never
          meme_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_meme_id_fkey"
            columns: ["meme_id"]
            isOneToOne: false
            referencedRelation: "Memes"
            referencedColumns: ["id"]
          },
        ]
      }
      Memes: {
        Row: {
          blockchain: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          image_url: string | null
          is_deleted: boolean | null
          is_featured: boolean | null
          likes: number | null
          telegram_link: string | null
          time_until_listing: string | null
          title: string | null
          trade_link: string | null
          tuzemoon_until: string | null
          twitter_link: string | null
          updated_at: string | null
        }
        Insert: {
          blockchain?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: never
          image_url?: string | null
          is_deleted?: boolean | null
          is_featured?: boolean | null
          likes?: number | null
          telegram_link?: string | null
          time_until_listing?: string | null
          title?: string | null
          trade_link?: string | null
          tuzemoon_until?: string | null
          twitter_link?: string | null
          updated_at?: string | null
        }
        Update: {
          blockchain?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: never
          image_url?: string | null
          is_deleted?: boolean | null
          is_featured?: boolean | null
          likes?: number | null
          telegram_link?: string | null
          time_until_listing?: string | null
          title?: string | null
          trade_link?: string | null
          tuzemoon_until?: string | null
          twitter_link?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      Sessions: {
        Row: {
          created_at: string
          id: number
          is_active: boolean | null
          last_seen_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: never
          is_active?: boolean | null
          last_seen_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: never
          is_active?: boolean | null
          last_seen_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      TransactionLogs: {
        Row: {
          amount: number | null
          created_at: string | null
          error_message: string | null
          id: number
          meme_id: number | null
          meme_metadata: Json | null
          transaction_signature: string | null
          transaction_status: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: number
          meme_id?: number | null
          meme_metadata?: Json | null
          transaction_signature?: string | null
          transaction_status: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: number
          meme_id?: number | null
          meme_metadata?: Json | null
          transaction_signature?: string | null
          transaction_status?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "TransactionLogs_meme_id_fkey"
            columns: ["meme_id"]
            isOneToOne: false
            referencedRelation: "Memes"
            referencedColumns: ["id"]
          },
        ]
      }
      TuzemoonPayments: {
        Row: {
          amount: number
          created_at: string
          id: number
          meme_id: number | null
          meme_metadata: Json | null
          transaction_signature: string | null
          transaction_status: string | null
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: never
          meme_id?: number | null
          meme_metadata?: Json | null
          transaction_signature?: string | null
          transaction_status?: string | null
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: never
          meme_id?: number | null
          meme_metadata?: Json | null
          transaction_signature?: string | null
          transaction_status?: string | null
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "TuzemoonPayments_meme_id_fkey"
            columns: ["meme_id"]
            isOneToOne: false
            referencedRelation: "Memes"
            referencedColumns: ["id"]
          },
        ]
      }
      Users: {
        Row: {
          auth_id: string | null
          created_at: string
          email: string | null
          id: number
          is_admin: boolean | null
          is_verified: boolean | null
          name: string | null
          profile_image: string | null
          wallet_address: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string
          email?: string | null
          id?: number
          is_admin?: boolean | null
          is_verified?: boolean | null
          name?: string | null
          profile_image?: string | null
          wallet_address?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string
          email?: string | null
          id?: number
          is_admin?: boolean | null
          is_verified?: boolean | null
          name?: string | null
          profile_image?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      WalletNonces: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: number
          is_used: boolean | null
          nonce: string
          wallet_address: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: number
          is_used?: boolean | null
          nonce: string
          wallet_address: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: number
          is_used?: boolean | null
          nonce?: string
          wallet_address?: string
        }
        Relationships: []
      }
      Watchlist: {
        Row: {
          created_at: string
          id: number
          meme_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          meme_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          meme_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Watchlist_meme_id_fkey"
            columns: ["meme_id"]
            isOneToOne: false
            referencedRelation: "Memes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_if_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      check_tuzemoon_expiry: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      verify_admin_key: {
        Args: { input_key: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
