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
      activity_logs: {
        Row: {
          action_description: string
          action_type: string
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action_description: string
          action_type: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action_description?: string
          action_type?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      addresses: {
        Row: {
          address_type: string
          city: string
          country: string
          created_at: string | null
          id: string
          is_default: boolean | null
          state: string
          street: string
          updated_at: string | null
          user_id: string
          zip_code: string
        }
        Insert: {
          address_type: string
          city: string
          country: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          state: string
          street: string
          updated_at?: string | null
          user_id: string
          zip_code: string
        }
        Update: {
          address_type?: string
          city?: string
          country?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          state?: string
          street?: string
          updated_at?: string | null
          user_id?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          id: string
          is_resolved: boolean | null
          message: string
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          title: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          message: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          title: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          message?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string | null
          key: string
          value: string
        }
        Insert: {
          created_at?: string | null
          key: string
          value: string
        }
        Update: {
          created_at?: string | null
          key?: string
          value?: string
        }
        Relationships: []
      }
      bitcoin_addresses: {
        Row: {
          address: string
          assigned_at: string | null
          assigned_to_order: string | null
          created_at: string | null
          derivation_index: number | null
          id: string
          is_multisig: boolean | null
          is_used: boolean | null
          multisig_wallet_id: string | null
          payment_confirmed: boolean | null
          reserved_until: string | null
          xpub_id: string | null
        }
        Insert: {
          address: string
          assigned_at?: string | null
          assigned_to_order?: string | null
          created_at?: string | null
          derivation_index?: number | null
          id?: string
          is_multisig?: boolean | null
          is_used?: boolean | null
          multisig_wallet_id?: string | null
          payment_confirmed?: boolean | null
          reserved_until?: string | null
          xpub_id?: string | null
        }
        Update: {
          address?: string
          assigned_at?: string | null
          assigned_to_order?: string | null
          created_at?: string | null
          derivation_index?: number | null
          id?: string
          is_multisig?: boolean | null
          is_used?: boolean | null
          multisig_wallet_id?: string | null
          payment_confirmed?: boolean | null
          reserved_until?: string | null
          xpub_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bitcoin_addresses_assigned_to_order_fkey"
            columns: ["assigned_to_order"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bitcoin_addresses_multisig_wallet_id_fkey"
            columns: ["multisig_wallet_id"]
            isOneToOne: false
            referencedRelation: "bitcoin_multisig_wallets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bitcoin_addresses_xpub_id_fkey"
            columns: ["xpub_id"]
            isOneToOne: false
            referencedRelation: "bitcoin_xpubs"
            referencedColumns: ["id"]
          },
        ]
      }
      bitcoin_hourly_analytics: {
        Row: {
          avg_btc_price: number | null
          created_at: string | null
          hour_timestamp: string
          id: string
          orders_created: number | null
          payments_confirmed: number | null
          payments_failed: number | null
          revenue_btc: number | null
          revenue_usd: number | null
        }
        Insert: {
          avg_btc_price?: number | null
          created_at?: string | null
          hour_timestamp: string
          id?: string
          orders_created?: number | null
          payments_confirmed?: number | null
          payments_failed?: number | null
          revenue_btc?: number | null
          revenue_usd?: number | null
        }
        Update: {
          avg_btc_price?: number | null
          created_at?: string | null
          hour_timestamp?: string
          id?: string
          orders_created?: number | null
          payments_confirmed?: number | null
          payments_failed?: number | null
          revenue_btc?: number | null
          revenue_usd?: number | null
        }
        Relationships: []
      }
      bitcoin_multisig_wallets: {
        Row: {
          created_at: string | null
          derivation_path: string
          id: string
          is_active: boolean | null
          name: string
          network: string
          next_index: number | null
          notes: string | null
          required_signatures: number
          total_cosigners: number
          updated_at: string | null
          xpubs: Json
        }
        Insert: {
          created_at?: string | null
          derivation_path?: string
          id?: string
          is_active?: boolean | null
          name: string
          network?: string
          next_index?: number | null
          notes?: string | null
          required_signatures?: number
          total_cosigners?: number
          updated_at?: string | null
          xpubs?: Json
        }
        Update: {
          created_at?: string | null
          derivation_path?: string
          id?: string
          is_active?: boolean | null
          name?: string
          network?: string
          next_index?: number | null
          notes?: string | null
          required_signatures?: number
          total_cosigners?: number
          updated_at?: string | null
          xpubs?: Json
        }
        Relationships: []
      }
      bitcoin_payment_analytics: {
        Row: {
          avg_confirmation_time_minutes: number | null
          avg_payment_amount_usd: number | null
          created_at: string | null
          date: string
          expired_payments: number | null
          failed_payments: number | null
          id: string
          successful_payments: number | null
          total_orders: number | null
          total_revenue_btc: number | null
          total_revenue_usd: number | null
          unique_users: number | null
          updated_at: string | null
        }
        Insert: {
          avg_confirmation_time_minutes?: number | null
          avg_payment_amount_usd?: number | null
          created_at?: string | null
          date: string
          expired_payments?: number | null
          failed_payments?: number | null
          id?: string
          successful_payments?: number | null
          total_orders?: number | null
          total_revenue_btc?: number | null
          total_revenue_usd?: number | null
          unique_users?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_confirmation_time_minutes?: number | null
          avg_payment_amount_usd?: number | null
          created_at?: string | null
          date?: string
          expired_payments?: number | null
          failed_payments?: number | null
          id?: string
          successful_payments?: number | null
          total_orders?: number | null
          total_revenue_btc?: number | null
          total_revenue_usd?: number | null
          unique_users?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bitcoin_payment_config: {
        Row: {
          config_key: string
          config_value: Json
          created_at: string | null
          description: string | null
          id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          config_key: string
          config_value?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          config_key?: string
          config_value?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      bitcoin_payment_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          order_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bitcoin_payment_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      bitcoin_xpubs: {
        Row: {
          created_at: string
          derivation_path: string
          id: string
          is_active: boolean
          network: string
          next_index: number
          notes: string | null
          updated_at: string
          xpub: string
        }
        Insert: {
          created_at?: string
          derivation_path?: string
          id?: string
          is_active?: boolean
          network?: string
          next_index?: number
          notes?: string | null
          updated_at?: string
          xpub: string
        }
        Update: {
          created_at?: string
          derivation_path?: string
          id?: string
          is_active?: boolean
          network?: string
          next_index?: number
          notes?: string | null
          updated_at?: string
          xpub?: string
        }
        Relationships: []
      }
      blockchain_webhook_events: {
        Row: {
          address: string
          confirmations: number | null
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
          processed_at: string | null
          received_at: string
          transaction_hash: string | null
          webhook_id: string
        }
        Insert: {
          address: string
          confirmations?: number | null
          event_type: string
          id?: string
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
          received_at?: string
          transaction_hash?: string | null
          webhook_id: string
        }
        Update: {
          address?: string
          confirmations?: number | null
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
          received_at?: string
          transaction_hash?: string | null
          webhook_id?: string
        }
        Relationships: []
      }
      bulk_payment_operations: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string
          error_log: Json | null
          failed_items: number | null
          id: string
          metadata: Json | null
          operation_type: string
          processed_items: number | null
          started_at: string | null
          status: string
          successful_items: number | null
          total_items: number | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by: string
          error_log?: Json | null
          failed_items?: number | null
          id?: string
          metadata?: Json | null
          operation_type: string
          processed_items?: number | null
          started_at?: string | null
          status?: string
          successful_items?: number | null
          total_items?: number | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string
          error_log?: Json | null
          failed_items?: number | null
          id?: string
          metadata?: Json | null
          operation_type?: string
          processed_items?: number | null
          started_at?: string | null
          status?: string
          successful_items?: number | null
          total_items?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_blog_posts: {
        Row: {
          author_id: string | null
          canonical_url: string | null
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          focus_keyword: string | null
          id: string
          noindex: boolean | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          published_at: string | null
          readability_score: number | null
          related_keywords: string[] | null
          scheduled_publish_at: string | null
          schema_type: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_score: number | null
          seo_title: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          twitter_card_type: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          canonical_url?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          focus_keyword?: string | null
          id?: string
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          published_at?: string | null
          readability_score?: number | null
          related_keywords?: string[] | null
          scheduled_publish_at?: string | null
          schema_type?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_score?: number | null
          seo_title?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          twitter_card_type?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          canonical_url?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          focus_keyword?: string | null
          id?: string
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          published_at?: string | null
          readability_score?: number | null
          related_keywords?: string[] | null
          scheduled_publish_at?: string | null
          schema_type?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_score?: number | null
          seo_title?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          twitter_card_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_pages: {
        Row: {
          canonical_url: string | null
          content: string
          created_at: string | null
          focus_keyword: string | null
          id: string
          noindex: boolean | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          readability_score: number | null
          related_keywords: string[] | null
          scheduled_publish_at: string | null
          schema_type: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_score: number | null
          seo_title: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          twitter_card_type: string | null
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          content: string
          created_at?: string | null
          focus_keyword?: string | null
          id?: string
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          readability_score?: number | null
          related_keywords?: string[] | null
          scheduled_publish_at?: string | null
          schema_type?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_score?: number | null
          seo_title?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          twitter_card_type?: string | null
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          content?: string
          created_at?: string | null
          focus_keyword?: string | null
          id?: string
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          readability_score?: number | null
          related_keywords?: string[] | null
          scheduled_publish_at?: string | null
          schema_type?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_score?: number | null
          seo_title?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          twitter_card_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_products: {
        Row: {
          canonical_url: string | null
          category_id: string | null
          category_type: string
          country: string | null
          created_at: string | null
          description: string
          features: Json | null
          focus_keyword: string | null
          gallery_images: Json | null
          id: string
          image_url: string | null
          name: string
          noindex: boolean | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          price: number | null
          readability_score: number | null
          related_keywords: string[] | null
          related_products: Json | null
          scheduled_publish_at: string | null
          schema_type: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_score: number | null
          seo_title: string | null
          sku: string | null
          slug: string
          status: string
          stock_quantity: number | null
          stock_status: string | null
          tags: string[] | null
          twitter_card_type: string | null
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          category_id?: string | null
          category_type: string
          country?: string | null
          created_at?: string | null
          description: string
          features?: Json | null
          focus_keyword?: string | null
          gallery_images?: Json | null
          id?: string
          image_url?: string | null
          name: string
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          price?: number | null
          readability_score?: number | null
          related_keywords?: string[] | null
          related_products?: Json | null
          scheduled_publish_at?: string | null
          schema_type?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_score?: number | null
          seo_title?: string | null
          sku?: string | null
          slug: string
          status?: string
          stock_quantity?: number | null
          stock_status?: string | null
          tags?: string[] | null
          twitter_card_type?: string | null
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          category_id?: string | null
          category_type?: string
          country?: string | null
          created_at?: string | null
          description?: string
          features?: Json | null
          focus_keyword?: string | null
          gallery_images?: Json | null
          id?: string
          image_url?: string | null
          name?: string
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          price?: number | null
          readability_score?: number | null
          related_keywords?: string[] | null
          related_products?: Json | null
          scheduled_publish_at?: string | null
          schema_type?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_score?: number | null
          seo_title?: string | null
          sku?: string | null
          slug?: string
          status?: string
          stock_quantity?: number | null
          stock_status?: string | null
          tags?: string[] | null
          twitter_card_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_inquiries: {
        Row: {
          agency: string
          created_at: string | null
          department: string
          document_type: string
          email: string
          id: string
          name: string
          phone: string
          position: string
          quantity: string
          specifications: string
          status: string | null
          updated_at: string | null
          urgency: string
        }
        Insert: {
          agency: string
          created_at?: string | null
          department: string
          document_type: string
          email: string
          id?: string
          name: string
          phone: string
          position: string
          quantity: string
          specifications: string
          status?: string | null
          updated_at?: string | null
          urgency: string
        }
        Update: {
          agency?: string
          created_at?: string | null
          department?: string
          document_type?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          position?: string
          quantity?: string
          specifications?: string
          status?: string | null
          updated_at?: string | null
          urgency?: string
        }
        Relationships: []
      }
      content_analytics: {
        Row: {
          avg_time_on_page: number | null
          bounce_rate: number | null
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          unique_views: number | null
          updated_at: string | null
          views: number | null
        }
        Insert: {
          avg_time_on_page?: number | null
          bounce_rate?: number | null
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          unique_views?: number | null
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          avg_time_on_page?: number | null
          bounce_rate?: number | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          unique_views?: number | null
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      content_auto_saves: {
        Row: {
          content_data: Json
          content_id: string | null
          content_type: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content_data: Json
          content_id?: string | null
          content_type: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content_data?: Json
          content_id?: string | null
          content_type?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      content_revisions: {
        Row: {
          content_data: Json
          content_id: string
          content_type: string
          created_at: string
          created_by: string
          id: string
          notes: string | null
          revision_number: number
        }
        Insert: {
          content_data: Json
          content_id: string
          content_type: string
          created_at?: string
          created_by: string
          id?: string
          notes?: string | null
          revision_number: number
        }
        Update: {
          content_data?: Json
          content_id?: string
          content_type?: string
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          revision_number?: number
        }
        Relationships: []
      }
      content_tags: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          tag_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          tag_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      content_templates: {
        Row: {
          content_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          template_data: Json
          thumbnail: string | null
          updated_at: string | null
        }
        Insert: {
          content_type: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          template_data: Json
          thumbnail?: string | null
          updated_at?: string | null
        }
        Update: {
          content_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          template_data?: Json
          thumbnail?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      document_applications: {
        Row: {
          country: string
          created_at: string | null
          document_type: string
          id: string
          notes: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          country: string
          created_at?: string | null
          document_type: string
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          country?: string
          created_at?: string | null
          document_type?: string
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          dispute_reason: string | null
          held_at: string | null
          id: string
          order_id: string | null
          refunded_at: string | null
          released_at: string | null
          resolution_notes: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          dispute_reason?: string | null
          held_at?: string | null
          id?: string
          order_id?: string | null
          refunded_at?: string | null
          released_at?: string | null
          resolution_notes?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          dispute_reason?: string | null
          held_at?: string | null
          id?: string
          order_id?: string | null
          refunded_at?: string | null
          released_at?: string | null
          resolution_notes?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "escrow_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiry_replies: {
        Row: {
          admin_id: string
          created_at: string | null
          id: string
          inquiry_id: string
          message: string
        }
        Insert: {
          admin_id: string
          created_at?: string | null
          id?: string
          inquiry_id: string
          message: string
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          id?: string
          inquiry_id?: string
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiry_replies_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "contact_inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      job_execution_log: {
        Row: {
          completed_at: string | null
          duration_ms: number | null
          error_message: string | null
          id: string
          items_processed: number | null
          job_id: string
          result: Json | null
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          items_processed?: number | null
          job_id: string
          result?: Json | null
          started_at?: string
          status: string
        }
        Update: {
          completed_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          items_processed?: number | null
          job_id?: string
          result?: Json | null
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_execution_log_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "scheduled_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_themes: {
        Row: {
          accent_color: string
          background_gradient: string
          config: Json | null
          created_at: string | null
          description: string | null
          font_family: string | null
          id: string
          is_active: boolean | null
          layout_style: string | null
          name: string
          primary_color: string
          secondary_color: string
          slug: string
          thumbnail: string | null
          updated_at: string | null
        }
        Insert: {
          accent_color: string
          background_gradient: string
          config?: Json | null
          created_at?: string | null
          description?: string | null
          font_family?: string | null
          id?: string
          is_active?: boolean | null
          layout_style?: string | null
          name: string
          primary_color: string
          secondary_color: string
          slug: string
          thumbnail?: string | null
          updated_at?: string | null
        }
        Update: {
          accent_color?: string
          background_gradient?: string
          config?: Json | null
          created_at?: string | null
          description?: string | null
          font_family?: string | null
          id?: string
          is_active?: boolean | null
          layout_style?: string | null
          name?: string
          primary_color?: string
          secondary_color?: string
          slug?: string
          thumbnail?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      loyalty_points: {
        Row: {
          created_at: string
          id: string
          lifetime_points: number
          points: number
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lifetime_points?: number
          points?: number
          tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lifetime_points?: number
          points?: number
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loyalty_transactions: {
        Row: {
          created_at: string
          description: string
          id: string
          points: number
          reference_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          points: number
          reference_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          points?: number
          reference_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      media_library: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          height: number | null
          id: string
          mime_type: string
          updated_at: string
          user_id: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          height?: number | null
          id?: string
          mime_type: string
          updated_at?: string
          user_id: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          height?: number | null
          id?: string
          mime_type?: string
          updated_at?: string
          user_id?: string
          width?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          read?: boolean | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          btc_price_at_order: number | null
          country: string | null
          created_at: string | null
          escrow_fee: number | null
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          order_number: string | null
          payment_method: string | null
          product_name: string
          product_type: string
          status: string | null
          status_history: Json | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          btc_price_at_order?: number | null
          country?: string | null
          created_at?: string | null
          escrow_fee?: number | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          order_number?: string | null
          payment_method?: string | null
          product_name: string
          product_type: string
          status?: string | null
          status_history?: Json | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          btc_price_at_order?: number | null
          country?: string | null
          created_at?: string | null
          escrow_fee?: number | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          order_number?: string | null
          payment_method?: string | null
          product_name?: string
          product_type?: string
          status?: string | null
          status_history?: Json | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          method_type: string
          updated_at: string | null
          user_id: string
          wallet_address: string | null
          wallet_nickname: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          method_type: string
          updated_at?: string | null
          user_id: string
          wallet_address?: string | null
          wallet_nickname?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          method_type?: string
          updated_at?: string | null
          user_id?: string
          wallet_address?: string | null
          wallet_nickname?: string | null
        }
        Relationships: []
      }
      payment_reminders: {
        Row: {
          email_sent: boolean | null
          id: string
          metadata: Json | null
          notification_sent: boolean | null
          order_id: string
          reminder_type: string
          sent_at: string
        }
        Insert: {
          email_sent?: boolean | null
          id?: string
          metadata?: Json | null
          notification_sent?: boolean | null
          order_id: string
          reminder_type: string
          sent_at?: string
        }
        Update: {
          email_sent?: boolean | null
          id?: string
          metadata?: Json | null
          notification_sent?: boolean | null
          order_id?: string
          reminder_type?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_reminders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      pgp_keys: {
        Row: {
          created_at: string | null
          id: string
          public_key: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          public_key: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          public_key?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pgp_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pgp_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attributes: {
        Row: {
          attribute_name: string
          attribute_value: string
          created_at: string
          id: string
          product_id: string
        }
        Insert: {
          attribute_name: string
          attribute_value: string
          created_at?: string
          id?: string
          product_id: string
        }
        Update: {
          attribute_name?: string
          attribute_value?: string
          created_at?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_attributes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "cms_products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_visible_in_menu: boolean | null
          name: string
          og_image: string | null
          parent_id: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_visible_in_menu?: boolean | null
          name: string
          og_image?: string | null
          parent_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_visible_in_menu?: boolean | null
          name?: string
          og_image?: string | null
          parent_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_email: string
          referrer_id: string
          reward_amount: number | null
          reward_claimed: boolean | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_email: string
          referrer_id: string
          reward_amount?: number | null
          reward_claimed?: boolean | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_email?: string
          referrer_id?: string
          reward_amount?: number | null
          reward_claimed?: boolean | null
          status?: string
        }
        Relationships: []
      }
      review_replies: {
        Row: {
          created_at: string | null
          id: string
          reply_text: string
          review_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reply_text: string
          review_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reply_text?: string
          review_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_replies_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "public_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_replies_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          product_type: string
          rating: number
          review_text: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          product_type: string
          rating: number
          review_text: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          product_type?: string
          rating?: number
          review_text?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      scheduled_jobs: {
        Row: {
          config: Json | null
          created_at: string
          id: string
          is_active: boolean
          job_name: string
          job_type: string
          last_duration_ms: number | null
          last_run_at: string | null
          last_status: string | null
          next_run_at: string | null
          schedule_cron: string
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          job_name: string
          job_type: string
          last_duration_ms?: number | null
          last_run_at?: string | null
          last_status?: string | null
          next_run_at?: string | null
          schedule_cron: string
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          job_name?: string
          job_type?: string
          last_duration_ms?: number | null
          last_run_at?: string | null
          last_status?: string | null
          next_run_at?: string | null
          schedule_cron?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string
          id: string
          message: string
          priority: string
          resolved_at: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          message: string
          priority?: string
          resolved_at?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          message?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string
          created_at: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      ticket_replies: {
        Row: {
          created_at: string | null
          id: string
          is_staff_reply: boolean | null
          message: string
          ticket_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_staff_reply?: boolean | null
          message: string
          ticket_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_staff_reply?: boolean | null
          message?: string
          ticket_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_replies_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          bitcoin_tx_hash: string | null
          completed_at: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          order_id: string | null
          payment_method_id: string | null
          status: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          bitcoin_tx_hash?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string | null
          payment_method_id?: string | null
          status?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          bitcoin_tx_hash?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string | null
          payment_method_id?: string | null
          status?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      two_factor_auth: {
        Row: {
          backup_codes: string[] | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          secret_key: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          secret_key: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          secret_key?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "two_factor_auth_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "two_factor_auth_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_documents: {
        Row: {
          document_name: string
          document_type: string
          expires_at: string | null
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          notes: string | null
          uploaded_at: string | null
          user_id: string
          verification_status: string | null
          verified_at: string | null
        }
        Insert: {
          document_name: string
          document_type: string
          expires_at?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          notes?: string | null
          uploaded_at?: string | null
          user_id: string
          verification_status?: string | null
          verified_at?: string | null
        }
        Update: {
          document_name?: string
          document_type?: string
          expires_at?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          notes?: string | null
          uploaded_at?: string | null
          user_id?: string
          verification_status?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          currency: string | null
          email_notifications: boolean | null
          id: string
          language: string | null
          marketing_emails: boolean | null
          sms_notifications: boolean | null
          theme: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          marketing_emails?: boolean | null
          sms_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          marketing_emails?: boolean | null
          sms_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_deliveries: {
        Row: {
          attempt_number: number
          created_at: string
          delivered_at: string | null
          event_type: string
          id: string
          payload: Json
          response_body: string | null
          response_code: number | null
          status: string
          subscription_id: string
        }
        Insert: {
          attempt_number?: number
          created_at?: string
          delivered_at?: string | null
          event_type: string
          id?: string
          payload: Json
          response_body?: string | null
          response_code?: number | null
          status?: string
          subscription_id: string
        }
        Update: {
          attempt_number?: number
          created_at?: string
          delivered_at?: string | null
          event_type?: string
          id?: string
          payload?: Json
          response_body?: string | null
          response_code?: number | null
          status?: string
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "webhook_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_subscriptions: {
        Row: {
          created_at: string
          created_by: string
          events: string[]
          id: string
          is_active: boolean
          last_triggered_at: string | null
          max_retries: number | null
          retry_count: number | null
          secret_key: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          created_by: string
          events?: string[]
          id?: string
          is_active?: boolean
          last_triggered_at?: string | null
          max_retries?: number | null
          retry_count?: number | null
          secret_key: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          created_by?: string
          events?: string[]
          id?: string
          is_active?: boolean
          last_triggered_at?: string | null
          max_retries?: number | null
          retry_count?: number | null
          secret_key?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
        }
        Relationships: []
      }
      public_reviews: {
        Row: {
          anonymous_user_id: string | null
          created_at: string | null
          id: string | null
          product_id: string | null
          product_type: string | null
          rating: number | null
          review_text: string | null
          status: string | null
        }
        Insert: {
          anonymous_user_id?: never
          created_at?: string | null
          id?: string | null
          product_id?: string | null
          product_type?: string | null
          rating?: number | null
          review_text?: string | null
          status?: string | null
        }
        Update: {
          anonymous_user_id?: never
          created_at?: string | null
          id?: string | null
          product_id?: string | null
          product_type?: string | null
          rating?: number | null
          review_text?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      aggregate_bitcoin_daily_analytics: {
        Args: { target_date?: string }
        Returns: undefined
      }
      bulk_verify_pending_payments: {
        Args: { p_operation_id: string; p_order_ids?: string[] }
        Returns: Json
      }
      create_notification: {
        Args: {
          p_link?: string
          p_message: string
          p_title: string
          p_type?: string
          p_user_id: string
        }
        Returns: string
      }
      generate_order_number: { Args: never; Returns: string }
      get_available_bitcoin_address: {
        Args: never
        Returns: {
          address: string
          id: string
        }[]
      }
      get_bitcoin_config: { Args: { p_config_key: string }; Returns: Json }
      get_next_derivation_index: {
        Args: { p_xpub_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_bitcoin_payment_event: {
        Args: { p_event_type: string; p_metadata?: Json; p_order_id: string }
        Returns: string
      }
      log_job_execution: {
        Args: {
          p_duration_ms?: number
          p_error_message?: string
          p_items_processed?: number
          p_job_name: string
          p_result?: Json
          p_status: string
        }
        Returns: string
      }
      release_expired_bitcoin_addresses: { Args: never; Returns: undefined }
      should_run_scheduled_job: { Args: { p_job_id: string }; Returns: boolean }
      trigger_webhook_notification: {
        Args: { p_event_type: string; p_payload: Json }
        Returns: number
      }
      update_bitcoin_config: {
        Args: { p_config_key: string; p_config_value: Json; p_user_id?: string }
        Returns: boolean
      }
      verify_2fa_code: { Args: { p_code: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
