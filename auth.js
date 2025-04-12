// Supabase Authentication Module
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Import Cloudflare authentication handler
import { getCloudflareSupabaseCredentials } from './cloudflare-auth.js';

// Debug logging function
function logAuthDebug(message) {
  console.log(`[Auth] ${message}`);
}

// Initialize Supabase client
let supabaseClient = null;

// Get Supabase credentials from various sources
async function getSupabaseCredentials() {
  logAuthDebug('Getting Supabase credentials from various sources...');

  // Try to get from headers (set by Cloudflare middleware)
  const supabaseUrlHeader = document.querySelector('meta[name="x-supabase-url"]')?.content;
  const supabaseAnonKeyHeader = document.querySelector('meta[name="x-supabase-anon-key"]')?.content;

  if (supabaseUrlHeader && supabaseAnonKeyHeader) {
    logAuthDebug('Found Supabase credentials in meta headers');
    return {
      supabaseUrl: supabaseUrlHeader,
      supabaseAnonKey: supabaseAnonKeyHeader
    };
  }

  // Try to get from Cloudflare environment
  try {
    logAuthDebug('Trying to get Supabase credentials from Cloudflare...');
    const cloudflareCredentials = await getCloudflareSupabaseCredentials();
    if (cloudflareCredentials) {
      logAuthDebug('Found Supabase credentials from Cloudflare');
      return cloudflareCredentials;
    }
  } catch (error) {
    logAuthDebug(`Error getting Cloudflare credentials: ${error.message}`);
    console.error('Error getting Cloudflare credentials:', error);
  }

  // Try to get from environment variables
  if (typeof process !== 'undefined' && process.env) {
    logAuthDebug('Trying to get Supabase credentials from environment variables...');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      logAuthDebug('Found Supabase credentials in environment variables');
      return { supabaseUrl, supabaseAnonKey };
    }
  }

  // Try to get from global variables (set by script)
  if (typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_ANON_KEY !== 'undefined') {
    logAuthDebug('Found Supabase credentials in global variables');
    return {
      supabaseUrl: SUPABASE_URL,
      supabaseAnonKey: SUPABASE_ANON_KEY
    };
  }

  // Fallback to hardcoded values (from .env)
  logAuthDebug('Using fallback hardcoded Supabase credentials');
  return {
    supabaseUrl: 'https://alcheqbohkjbgbjfuenb.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsY2hlcWJvaGtqYmdiamZ1ZW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzOTI5NzYsImV4cCI6MjA1ODk2ODk3Nn0.BO-cQ92hcnFuG9HgcwaVXjFtwDL10fn7CPZneC6DAs8'
  };
}

// Initialize Supabase with environment variables or Cloudflare Variables
async function initSupabase() {
  logAuthDebug('Initializing Supabase client...');
  try {
    // Get credentials from various sources
    logAuthDebug('Getting Supabase credentials...');
    const { supabaseUrl, supabaseAnonKey } = await getSupabaseCredentials();

    logAuthDebug(`Using Supabase URL: ${supabaseUrl}`);
    logAuthDebug(`Using Supabase Anon Key: ${supabaseAnonKey.substring(0, 10)}...`);

    // Create Supabase client
    logAuthDebug('Creating Supabase client...');
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    if (!supabaseClient) {
      logAuthDebug('Error: Failed to create Supabase client');
      return null;
    }

    logAuthDebug('Supabase client initialized successfully');
    return supabaseClient;
  } catch (error) {
    logAuthDebug(`Error initializing Supabase: ${error.message}`);
    console.error('Supabase initialization error:', error);
    return null;
  }
}

// Get the Supabase client (initialize if needed)
async function getSupabaseClient() {
  if (!supabaseClient) {
    logAuthDebug('No existing Supabase client, initializing...');
    return await initSupabase();
  }
  logAuthDebug('Using existing Supabase client');
  return supabaseClient;
}

// Sign up a new user
async function signUp(email, password, metadata = {}) {
  const supabase = await getSupabaseClient();

  try {
    // Add signup timestamp to metadata
    const userMetadata = {
      ...metadata,
      signupTimestamp: new Date().toISOString(),
    };

    // If user is an instructor, add pending verification status
    if (userMetadata.isInstructor) {
      userMetadata.instructorVerificationStatus = 'pending';
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata
      }
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error signing up:', error.message);
    return { success: false, error: error.message };
  }
}

// Sign in a user
async function signIn(email, password) {
  logAuthDebug(`Attempting to sign in user: ${email.substring(0, 3)}...`);

  try {
    logAuthDebug('Getting Supabase client...');
    const supabase = await getSupabaseClient();

    if (!supabase) {
      logAuthDebug('Error: Supabase client is null');
      return { success: false, error: 'Authentication service unavailable' };
    }

    logAuthDebug('Calling Supabase auth.signInWithPassword...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logAuthDebug(`Sign in error: ${error.message}`);
      throw error;
    }

    logAuthDebug('Sign in successful');
    return { success: true, data };
  } catch (error) {
    logAuthDebug(`Error signing in: ${error.message}`);
    console.error('Error signing in details:', error);
    return { success: false, error: error.message };
  }
}

// Sign out the current user
async function signOut() {
  const supabase = await getSupabaseClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error.message);
    return { success: false, error: error.message };
  }
}

// Get the current user session
async function getSession() {
  const supabase = await getSupabaseClient();

  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    return { success: true, session: data.session, user: data.session?.user };
  } catch (error) {
    console.error('Error getting session:', error.message);
    return { success: false, error: error.message };
  }
}

// Reset password
async function resetPassword(email) {
  const supabase = await getSupabaseClient();

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error.message);
    return { success: false, error: error.message };
  }
}

// Update user profile
async function updateProfile(profile) {
  const supabase = await getSupabaseClient();

  try {
    const { data, error } = await supabase.auth.updateUser({
      data: profile,
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return { success: false, error: error.message };
  }
}

// Set up auth state change listener
async function onAuthStateChange(callback) {
  const supabase = await getSupabaseClient();

  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

// Export authentication functions
export {
  initSupabase,
  getSupabaseClient,
  signUp,
  signIn,
  signOut,
  getSession,
  resetPassword,
  updateProfile,
  onAuthStateChange,
};
