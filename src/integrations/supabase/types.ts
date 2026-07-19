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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      categorias_finanzas: {
        Row: {
          activa: boolean | null
          categoria_padre: string | null
          color: string | null
          created_at: string | null
          descripcion: string | null
          es_retiro_personal: boolean | null
          icono: string | null
          id: string
          nombre: string
          presupuesto_mensual: number | null
          tipo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activa?: boolean | null
          categoria_padre?: string | null
          color?: string | null
          created_at?: string | null
          descripcion?: string | null
          es_retiro_personal?: boolean | null
          icono?: string | null
          id?: string
          nombre: string
          presupuesto_mensual?: number | null
          tipo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activa?: boolean | null
          categoria_padre?: string | null
          color?: string | null
          created_at?: string | null
          descripcion?: string | null
          es_retiro_personal?: boolean | null
          icono?: string | null
          id?: string
          nombre?: string
          presupuesto_mensual?: number | null
          tipo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_finanzas_categoria_padre_fkey"
            columns: ["categoria_padre"]
            isOneToOne: false
            referencedRelation: "categorias_finanzas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categorias_finanzas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          correo: string
          created_at: string
          estado: Database["public"]["Enums"]["estado_suscripcion"]
          fecha_inicio: string
          fecha_vencimiento: string | null
          id: string
          medio_pago: Database["public"]["Enums"]["medio_pago"]
          motivo_cancelacion: string | null
          nombre: string
          notas: string | null
          producto: string
          tipo_suscripcion: Database["public"]["Enums"]["tipo_suscripcion"]
          total_renovaciones: number
          updated_at: string
          user_id: string
          valor_cobrado: number
          whatsapp: string | null
        }
        Insert: {
          correo: string
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_suscripcion"]
          fecha_inicio: string
          fecha_vencimiento?: string | null
          id?: string
          medio_pago: Database["public"]["Enums"]["medio_pago"]
          motivo_cancelacion?: string | null
          nombre: string
          notas?: string | null
          producto: string
          tipo_suscripcion: Database["public"]["Enums"]["tipo_suscripcion"]
          total_renovaciones?: number
          updated_at?: string
          user_id: string
          valor_cobrado: number
          whatsapp?: string | null
        }
        Update: {
          correo?: string
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_suscripcion"]
          fecha_inicio?: string
          fecha_vencimiento?: string | null
          id?: string
          medio_pago?: Database["public"]["Enums"]["medio_pago"]
          motivo_cancelacion?: string | null
          nombre?: string
          notas?: string | null
          producto?: string
          tipo_suscripcion?: Database["public"]["Enums"]["tipo_suscripcion"]
          total_renovaciones?: number
          updated_at?: string
          user_id?: string
          valor_cobrado?: number
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cuentas: {
        Row: {
          activa: boolean | null
          color: string | null
          created_at: string | null
          descripcion: string | null
          icono: string | null
          id: string
          moneda: string
          nombre: string
          saldo_actual: number | null
          saldo_inicial: number | null
          tipo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activa?: boolean | null
          color?: string | null
          created_at?: string | null
          descripcion?: string | null
          icono?: string | null
          id?: string
          moneda?: string
          nombre: string
          saldo_actual?: number | null
          saldo_inicial?: number | null
          tipo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activa?: boolean | null
          color?: string | null
          created_at?: string | null
          descripcion?: string | null
          icono?: string | null
          id?: string
          moneda?: string
          nombre?: string
          saldo_actual?: number | null
          saldo_inicial?: number | null
          tipo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cuentas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notas_cliente: {
        Row: {
          cliente_id: string
          contenido: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          cliente_id: string
          contenido: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          cliente_id?: string
          contenido?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notas_cliente_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_cliente_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos: {
        Row: {
          cliente_id: string
          cliente_nombre: string
          concepto: Database["public"]["Enums"]["concepto_pago"]
          created_at: string
          fecha: string
          id: string
          medio_pago: Database["public"]["Enums"]["medio_pago"]
          monto: number
          user_id: string
        }
        Insert: {
          cliente_id: string
          cliente_nombre: string
          concepto: Database["public"]["Enums"]["concepto_pago"]
          created_at?: string
          fecha: string
          id?: string
          medio_pago: Database["public"]["Enums"]["medio_pago"]
          monto: number
          user_id: string
        }
        Update: {
          cliente_id?: string
          cliente_nombre?: string
          concepto?: Database["public"]["Enums"]["concepto_pago"]
          created_at?: string
          fecha?: string
          id?: string
          medio_pago?: Database["public"]["Enums"]["medio_pago"]
          monto?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pagos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          nombre: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasas_cambio: {
        Row: {
          created_at: string | null
          es_manual: boolean | null
          fecha: string
          fuente: string | null
          id: string
          moneda_destino: string
          moneda_origen: string
          tasa: number
        }
        Insert: {
          created_at?: string | null
          es_manual?: boolean | null
          fecha?: string
          fuente?: string | null
          id?: string
          moneda_destino: string
          moneda_origen: string
          tasa: number
        }
        Update: {
          created_at?: string | null
          es_manual?: boolean | null
          fecha?: string
          fuente?: string | null
          id?: string
          moneda_destino?: string
          moneda_origen?: string
          tasa?: number
        }
        Relationships: []
      }
      transacciones: {
        Row: {
          adjunto_url: string | null
          categoria_id: string | null
          concepto: string
          created_at: string | null
          cuenta_id: string | null
          descripcion: string | null
          es_retiro_personal: boolean | null
          etiquetas: string[] | null
          fecha: string
          id: string
          moneda: string
          monto: number
          monto_usd: number
          pago_cliente_id: string | null
          tasa_cambio: number | null
          tipo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          adjunto_url?: string | null
          categoria_id?: string | null
          concepto: string
          created_at?: string | null
          cuenta_id?: string | null
          descripcion?: string | null
          es_retiro_personal?: boolean | null
          etiquetas?: string[] | null
          fecha?: string
          id?: string
          moneda?: string
          monto: number
          monto_usd: number
          pago_cliente_id?: string | null
          tasa_cambio?: number | null
          tipo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          adjunto_url?: string | null
          categoria_id?: string | null
          concepto?: string
          created_at?: string | null
          cuenta_id?: string | null
          descripcion?: string | null
          es_retiro_personal?: boolean | null
          etiquetas?: string[] | null
          fecha?: string
          id?: string
          moneda?: string
          monto?: number
          monto_usd?: number
          pago_cliente_id?: string | null
          tasa_cambio?: number | null
          tipo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transacciones_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_finanzas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacciones_cuenta_id_fkey"
            columns: ["cuenta_id"]
            isOneToOne: false
            referencedRelation: "cuentas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacciones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      concepto_pago: "nuevo" | "renovacion"
      estado_suscripcion: "activa" | "vencida" | "pendiente" | "cancelada"
      medio_pago: "stripe" | "binance" | "paypal" | "hotmart"
      tipo_suscripcion:
        | "mensual"
        | "trimestral"
        | "semestral"
        | "anual"
        | "vitalicio"
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
      concepto_pago: ["nuevo", "renovacion"],
      estado_suscripcion: ["activa", "vencida", "pendiente", "cancelada"],
      medio_pago: ["stripe", "binance", "paypal", "hotmart"],
      tipo_suscripcion: [
        "mensual",
        "trimestral",
        "semestral",
        "anual",
        "vitalicio",
      ],
    },
  },
} as const
