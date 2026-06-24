export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      village_settings: {
        Row: {
          id: string;
          village_name: string;
          district: string;
          regency: string | null;
          province: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          whatsapp: string | null;
          map_url: string | null;
          logo_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          village_name: string;
          district: string;
          regency?: string | null;
          province?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          whatsapp?: string | null;
          map_url?: string | null;
          logo_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          village_name?: string;
          district?: string;
          regency?: string | null;
          province?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          whatsapp?: string | null;
          map_url?: string | null;
          logo_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      home_sections: {
        Row: {
          id: string;
          hero_title: string;
          hero_subtitle: string;
          hero_image_url: string | null;
          hero_cta_label: string | null;
          hero_cta_href: string | null;
          stats: Json | null;
          featured_services: Json | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hero_title: string;
          hero_subtitle: string;
          hero_image_url?: string | null;
          hero_cta_label?: string | null;
          hero_cta_href?: string | null;
          stats?: Json | null;
          featured_services?: Json | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hero_title?: string;
          hero_subtitle?: string;
          hero_image_url?: string | null;
          hero_cta_label?: string | null;
          hero_cta_href?: string | null;
          stats?: Json | null;
          featured_services?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          history: string;
          vision: string;
          missions: string[] | null;
          government_structure: Json | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          history: string;
          vision: string;
          missions?: string[] | null;
          government_structure?: Json | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          history?: string;
          vision?: string;
          missions?: string[] | null;
          government_structure?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          category: Database["public"]["Enums"]["post_category"];
          status: Database["public"]["Enums"]["post_status"];
          cover_url: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          category?: Database["public"]["Enums"]["post_category"];
          status?: Database["public"]["Enums"]["post_status"];
          cover_url?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          category?: Database["public"]["Enums"]["post_category"];
          status?: Database["public"]["Enums"]["post_status"];
          cover_url?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          requirements: string[] | null;
          flow: string[] | null;
          contact: string | null;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          requirements?: string[] | null;
          flow?: string[] | null;
          contact?: string | null;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          requirements?: string[] | null;
          flow?: string[] | null;
          contact?: string | null;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      service_requests: {
        Row: {
          id: string;
          service_type: string;
          resident_name: string;
          nik: string;
          phone: string;
          address: string;
          notes: string | null;
          status: Database["public"]["Enums"]["request_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_type: string;
          resident_name: string;
          nik: string;
          phone: string;
          address: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["request_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_type?: string;
          resident_name?: string;
          nik?: string;
          phone?: string;
          address?: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["request_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      gallery: {
        Row: {
          id: string;
          title: string;
          image_url: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          image_url: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          image_url?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          message: string;
          reply: string | null;
          status: Database["public"]["Enums"]["message_status"];
          created_at: string;
          replied_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          message: string;
          reply?: string | null;
          status?: Database["public"]["Enums"]["message_status"];
          created_at?: string;
          replied_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          message?: string;
          reply?: string | null;
          status?: Database["public"]["Enums"]["message_status"];
          created_at?: string;
          replied_at?: string | null;
        };
        Relationships: [];
      };
      umkm: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          owner_name: string;
          cover_url: string | null;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          instagram: string | null;
          facebook: string | null;
          address: string | null;
          maps_url: string | null;
          template_id: string | null;
          accent_color: string | null;
          status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          owner_name: string;
          cover_url?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          address?: string | null;
          maps_url?: string | null;
          template_id?: string | null;
          accent_color?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          owner_name?: string;
          cover_url?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          address?: string | null;
          maps_url?: string | null;
          template_id?: string | null;
          accent_color?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      umkm_products: {
        Row: {
          id: string;
          umkm_id: string;
          name: string;
          description: string;
          image_url: string | null;
          price: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          umkm_id: string;
          name: string;
          description: string;
          image_url?: string | null;
          price?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          umkm_id?: string;
          name?: string;
          description?: string;
          image_url?: string | null;
          price?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "umkm_products_umkm_id_fkey";
            columns: ["umkm_id"];
            isOneToOne: false;
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      post_category: "berita" | "pengumuman";
      post_status: "draft" | "published";
      request_status: "masuk" | "diproses" | "selesai" | "ditolak";
      message_status: "baru" | "dibalas" | "diarsipkan";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<
  TableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][TableName]["Row"];

export type Inserts<
  TableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][TableName]["Insert"];

export type Updates<
  TableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][TableName]["Update"];
