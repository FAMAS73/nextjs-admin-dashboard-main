import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database schema for ACC server configurations
export const createTables = async () => {
  // Server configurations table
  await supabase.rpc('create_table_if_not_exists', {
    table_name: 'server_configs',
    schema: `
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      config_type VARCHAR(50) NOT NULL,
      config_data JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    `
  });

  // Race results table
  await supabase.rpc('create_table_if_not_exists', {
    table_name: 'race_results',
    schema: `
      id SERIAL PRIMARY KEY,
      session_type VARCHAR(10) NOT NULL,
      track_name VARCHAR(100) NOT NULL,
      server_name VARCHAR(255) NOT NULL,
      session_data JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    `
  });

  // Leaderboard table
  await supabase.rpc('create_table_if_not_exists', {
    table_name: 'leaderboard',
    schema: `
      id SERIAL PRIMARY KEY,
      driver_name VARCHAR(255) NOT NULL,
      car_model VARCHAR(100) NOT NULL,
      best_lap_time INTEGER NOT NULL,
      track_name VARCHAR(100) NOT NULL,
      session_type VARCHAR(10) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    `
  });
};