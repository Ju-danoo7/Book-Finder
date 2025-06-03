import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in a .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a mock client for development if credentials are not available
const isMissingCredentials = !supabaseUrl || !supabaseAnonKey;

// Create a single supabase client for interacting with your database
export const supabase = isMissingCredentials
  ? createMockSupabaseClient()
  : createClient(supabaseUrl, supabaseAnonKey);

// Mock Supabase client for development without credentials
function createMockSupabaseClient() {
  console.warn(
    'Supabase credentials not found. Using mock client. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
  
  // This creates a mock client that won't throw errors but won't actually connect to Supabase
  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      signInWithPassword: async () => ({ data: null, error: new Error('Mock client: No credentials') }),
      signUp: async () => ({ data: null, error: new Error('Mock client: No credentials') }),
      signOut: async () => {},
      resetPasswordForEmail: async () => ({ error: new Error('Mock client: No credentials') }),
      updateUser: async () => ({ error: new Error('Mock client: No credentials') }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          execute: async () => ({ data: [], error: null }),
        }),
        execute: async () => ({ data: [], error: null }),
      }),
      insert: () => ({
        execute: async () => ({ data: null, error: null }),
      }),
      update: () => ({
        eq: () => ({
          execute: async () => ({ data: null, error: null }),
        }),
      }),
      upsert: () => ({
        execute: async () => ({ data: null, error: null }),
      }),
      delete: () => ({
        eq: () => ({
          execute: async () => ({ data: null, error: null }),
        }),
      }),
    }),
  } as any;
}

// Database types
export type Book = {
  id: string;
  title: string;
  authors: string[];
  publisher?: string;
  published_date?: string;
  description?: string;
  page_count?: number;
  categories?: string[];
  language?: string;
  isbn?: string;
  thumbnail?: string;
  created_at: string;
};

export type BookSource = {
  id: string;
  name: string;
  url: string;
  type: 'free' | 'paid' | 'library';
  source_type: 'public_domain' | 'borrowable' | 'preview' | 'purchase' | 'locate';
  created_at: string;
};

export type SavedBook = {
  id: string;
  book_id: string;
  user_id: string;
  created_at: string;
  book?: Book;
};

export type Profile = {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
};
