import { neon } from '@neondatabase/serverless';
import { RegisteredUser, UserRole } from '../types';

// Obtain the Neon database URL from environment variables
const dbUrl = (import.meta as any).env?.VITE_DATABASE_URL || 'postgresql://neondb_owner:npg_OE1Xqvgy3bnD@ep-polished-night-za5la761.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require';

// Initialize the Neon SQL client
export const sql = neon(dbUrl);

// Helper to initialize users table if it doesn't exist
export async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'vendor',
        business_or_org_name VARCHAR(255),
        category_or_venue VARCHAR(255),
        city VARCHAR(255),
        phone VARCHAR(255),
        interests JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Neon database initialized successfully.');
  } catch (err) {
    console.error('Error initializing Neon database:', err);
  }
}

// Register a new user in Neon DB
export async function registerUser(userData: {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  businessOrOrgName?: string;
  categoryOrVenue?: string;
  city?: string;
  phone?: string;
  interests?: string[];
}): Promise<RegisteredUser> {
  await initDb();
  
  const id = 'usr_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  // Basic encode for client demo security layer
  const passwordHash = btoa(userData.password);

  const existing = await sql`
    SELECT id FROM users WHERE email = ${userData.email.toLowerCase()} LIMIT 1
  `;
  
  if (existing.length > 0) {
    throw new Error('An account with this email already exists.');
  }

  const interestsJson = JSON.stringify(userData.interests || []);

  const result = await sql`
    INSERT INTO users (
      id, email, password_hash, full_name, role,
      business_or_org_name, category_or_venue, city, phone, interests
    ) VALUES (
      ${id},
      ${userData.email.toLowerCase()},
      ${passwordHash},
      ${userData.fullName},
      ${userData.role},
      ${userData.businessOrOrgName || ''},
      ${userData.categoryOrVenue || ''},
      ${userData.city || 'Cape Town & Winelands'},
      ${userData.phone || ''},
      ${interestsJson}::jsonb
    )
    RETURNING *;
  `;

  const row = result[0];
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role as UserRole,
    businessOrOrgName: row.business_or_org_name,
    categoryOrVenue: row.category_or_venue,
    city: row.city,
    phone: row.phone,
    interests: typeof row.interests === 'string' ? JSON.parse(row.interests) : (row.interests || []),
    registeredAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()
  };
}

// Authenticate user against Neon DB
export async function loginUser(email: string, password: string): Promise<RegisteredUser> {
  await initDb();
  
  const result = await sql`
    SELECT * FROM users WHERE email = ${email.toLowerCase()} LIMIT 1
  `;

  if (result.length === 0) {
    throw new Error('No account found with this email address.');
  }

  const row = result[0];
  const inputHash = btoa(password);

  if (row.password_hash !== inputHash && row.password_hash !== password) {
    throw new Error('Incorrect password. Please try again.');
  }

  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role as UserRole,
    businessOrOrgName: row.business_or_org_name,
    categoryOrVenue: row.category_or_venue,
    city: row.city,
    phone: row.phone,
    interests: typeof row.interests === 'string' ? JSON.parse(row.interests) : (row.interests || []),
    registeredAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()
  };
}
