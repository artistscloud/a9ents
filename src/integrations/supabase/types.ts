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
      agents: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          knowledgebase_id: string | null
          name: string
          selected_tools: string[] | null
          tools: Json | null
          workflow_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          knowledgebase_id?: string | null
          name: string
          selected_tools?: string[] | null
          tools?: Json | null
          workflow_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          knowledgebase_id?: string | null
          name?: string
          selected_tools?: string[] | null
          tools?: Json | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_knowledgebase_id_fkey"
            columns: ["knowledgebase_id"]
            isOneToOne: false
            referencedRelation: "knowledgebase"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agents_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          key: string
          last_used_at: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          key: string
          last_used_at?: string | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          key?: string
          last_used_at?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      knowledgebase: {
        Row: {
          content: string | null
          created_at: string | null
          file_path: string | null
          file_type: string | null
          id: string
          source_type: string
          tags: string[] | null
          title: string
          url: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          file_type?: string | null
          id?: string
          source_type?: string
          tags?: string[] | null
          title: string
          url?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          file_type?: string | null
          id?: string
          source_type?: string
          tags?: string[] | null
          title?: string
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      llm_configurations: {
        Row: {
          api_key: string
          created_at: string
          created_by: string
          id: string
          is_enabled: boolean | null
          provider: Database["public"]["Enums"]["llm_provider"]
          updated_at: string
        }
        Insert: {
          api_key: string
          created_at?: string
          created_by: string
          id?: string
          is_enabled?: boolean | null
          provider: Database["public"]["Enums"]["llm_provider"]
          updated_at?: string
        }
        Update: {
          api_key?: string
          created_at?: string
          created_by?: string
          id?: string
          is_enabled?: boolean | null
          provider?: Database["public"]["Enums"]["llm_provider"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      site_notifications: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          message: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          message: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          message?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          api_config: Json | null
          created_at: string | null
          description: string | null
          function: string | null
          icon_url: string | null
          id: string
          instruction: string | null
          name: string
          tags: string[] | null
        }
        Insert: {
          api_config?: Json | null
          created_at?: string | null
          description?: string | null
          function?: string | null
          icon_url?: string | null
          id?: string
          instruction?: string | null
          name: string
          tags?: string[] | null
        }
        Update: {
          api_config?: Json | null
          created_at?: string | null
          description?: string | null
          function?: string | null
          icon_url?: string | null
          id?: string
          instruction?: string | null
          name?: string
          tags?: string[] | null
        }
        Relationships: []
      }
      workflow_edges: {
        Row: {
          condition: string | null
          created_at: string
          id: string
          source_node_id: string | null
          target_node_id: string | null
          workflow_id: string | null
        }
        Insert: {
          condition?: string | null
          created_at?: string
          id?: string
          source_node_id?: string | null
          target_node_id?: string | null
          workflow_id?: string | null
        }
        Update: {
          condition?: string | null
          created_at?: string
          id?: string
          source_node_id?: string | null
          target_node_id?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_edges_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "workflow_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_edges_target_node_id_fkey"
            columns: ["target_node_id"]
            isOneToOne: false
            referencedRelation: "workflow_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_edges_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_nodes: {
        Row: {
          action_type: Database["public"]["Enums"]["action_type"] | null
          condition_type: Database["public"]["Enums"]["condition_type"] | null
          created_at: string
          data: Json | null
          id: string
          label: string | null
          node_type: Database["public"]["Enums"]["workflow_node_type"]
          position: Json | null
          trigger_type: Database["public"]["Enums"]["trigger_type"] | null
          workflow_id: string | null
        }
        Insert: {
          action_type?: Database["public"]["Enums"]["action_type"] | null
          condition_type?: Database["public"]["Enums"]["condition_type"] | null
          created_at?: string
          data?: Json | null
          id?: string
          label?: string | null
          node_type: Database["public"]["Enums"]["workflow_node_type"]
          position?: Json | null
          trigger_type?: Database["public"]["Enums"]["trigger_type"] | null
          workflow_id?: string | null
        }
        Update: {
          action_type?: Database["public"]["Enums"]["action_type"] | null
          condition_type?: Database["public"]["Enums"]["condition_type"] | null
          created_at?: string
          data?: Json | null
          id?: string
          label?: string | null
          node_type?: Database["public"]["Enums"]["workflow_node_type"]
          position?: Json | null
          trigger_type?: Database["public"]["Enums"]["trigger_type"] | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_nodes_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string | null
          id: string
          name: string
          steps: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          steps?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          steps?: Json | null
          user_id?: string | null
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
      action_type: "api" | "email" | "agent" | "llm" | "tool"
      condition_type: "if" | "switch" | "wait"
      llm_provider:
        | "openai"
        | "anthropic"
        | "gemini"
        | "grok"
        | "openrouter"
        | "mistral"
        | "groq"
        | "llama"
      trigger_type: "webhook" | "schedule" | "manual" | "event"
      user_role: "admin" | "user"
      workflow_node_type: "trigger" | "action" | "condition"
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
