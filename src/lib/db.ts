import { neon } from '@neondatabase/serverless';
import { RegisteredUser, UserRole, UserActivityLog } from '../types';

export const SUPER_ADMIN_EMAILS = [
  'mraaziqp@gmail.com',
  'raziashade4@gmail.com'
];

export function isSuperAdminEmail(email?: string): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

// Obtain the Neon database URL from environment variables
const dbUrl = (import.meta as any).env?.VITE_DATABASE_URL || 'postgresql://neondb_owner:npg_OE1Xqvgy3bnD@ep-polished-night-za5la761.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require';

// Initialize the Neon SQL client
export const sql = neon(dbUrl);

// Helper to initialize users and activity_logs tables if they don't exist
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

    await sql`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        user_email VARCHAR(255) NOT NULL,
        action VARCHAR(255) NOT NULL,
        details TEXT NOT NULL,
        log_type VARCHAR(50) NOT NULL DEFAULT 'system',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('Neon database & activity tables initialized successfully.');
  } catch (err) {
    console.error('Error initializing Neon database:', err);
  }
}

// Log a user activity in Neon DB
export async function logUserActivity(
  userEmail: string,
  action: string,
  details: string,
  logType: 'auth' | 'booking' | 'payout' | 'document' | 'admin' | 'system' = 'system',
  userId?: string
): Promise<void> {
  try {
    await initDb();
    const id = 'act_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    await sql`
      INSERT INTO activity_logs (id, user_id, user_email, action, details, log_type)
      VALUES (${id}, ${userId || null}, ${userEmail}, ${action}, ${details}, ${logType});
    `;
  } catch (err) {
    console.warn('Failed to record activity log to Neon:', err);
  }
}

// Fetch activity logs for a specific user or all users
export async function fetchUserActivities(userEmail?: string): Promise<UserActivityLog[]> {
  try {
    await initDb();
    let result;
    if (userEmail) {
      result = await sql`
        SELECT * FROM activity_logs WHERE user_email = ${userEmail.toLowerCase()} ORDER BY created_at DESC LIMIT 50;
      `;
    } else {
      result = await sql`
        SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 100;
      `;
    }

    return result.map(r => ({
      id: r.id,
      userId: r.user_id,
      userEmail: r.user_email,
      action: r.action,
      details: r.details,
      type: r.log_type as any,
      timestamp: r.created_at ? new Date(r.created_at).toLocaleString() : new Date().toLocaleString()
    }));
  } catch (err) {
    console.warn('Failed to fetch activity logs:', err);
    return [];
  }
}

// Fetch all registered users for Admin panel
export async function fetchAllUsersFromDb(): Promise<RegisteredUser[]> {
  try {
    await initDb();
    const rows = await sql`SELECT * FROM users ORDER BY created_at DESC LIMIT 200;`;
    return rows.map(r => ({
      id: r.id,
      fullName: r.full_name,
      email: r.email,
      role: isSuperAdminEmail(r.email) ? 'admin' : (r.role as UserRole),
      businessOrOrgName: r.business_or_org_name,
      categoryOrVenue: r.category_or_venue,
      city: r.city,
      phone: r.phone,
      interests: typeof r.interests === 'string' ? JSON.parse(r.interests) : (r.interests || []),
      registeredAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString()
    }));
  } catch (err) {
    console.warn('Failed to fetch users from Neon:', err);
    return [];
  }
}

// Update user role in Neon DB
export async function updateUserRoleInDb(userId: string, newRole: UserRole): Promise<void> {
  try {
    await initDb();
    await sql`UPDATE users SET role = ${newRole} WHERE id = ${userId};`;
  } catch (err) {
    console.error('Failed to update user role in Neon DB:', err);
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
  const passwordHash = btoa(userData.password);

  const existing = await sql`
    SELECT id FROM users WHERE email = ${userData.email.toLowerCase()} LIMIT 1
  `;
  
  if (existing.length > 0) {
    throw new Error('An account with this email already exists.');
  }

  // Force Super Admin role for designated email addresses
  const assignedRole: UserRole = isSuperAdminEmail(userData.email) ? 'admin' : userData.role;
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
      ${assignedRole},
      ${userData.businessOrOrgName || ''},
      ${userData.categoryOrVenue || ''},
      ${userData.city || 'Cape Town & Winelands'},
      ${userData.phone || ''},
      ${interestsJson}::jsonb
    )
    RETURNING *;
  `;

  const row = result[0];
  const newUser: RegisteredUser = {
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

  await logUserActivity(newUser.email, 'Account Registration', `New ${newUser.role} account created for ${newUser.fullName}`, 'auth', newUser.id);

  return newUser;
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

  // Force Super Admin role if email matches super admin list
  const userRole: UserRole = isSuperAdminEmail(row.email) ? 'admin' : (row.role as UserRole);

  const loggedUser: RegisteredUser = {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: userRole,
    businessOrOrgName: row.business_or_org_name,
    categoryOrVenue: row.category_or_venue,
    city: row.city,
    phone: row.phone,
    interests: typeof row.interests === 'string' ? JSON.parse(row.interests) : (row.interests || []),
    registeredAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()
  };

  await logUserActivity(loggedUser.email, 'User Login', `Signed into Plazr dashboard`, 'auth', loggedUser.id);

  return loggedUser;
}
