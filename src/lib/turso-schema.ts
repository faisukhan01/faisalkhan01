import { db } from "./turso";

export async function initDatabase() {
  console.log("Initializing Turso database schema...");

  // Site settings - key-value store for all editable text
  await db.execute(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general',
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Projects
  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT '/project-1.jpg',
      gallery TEXT NOT NULL DEFAULT '[]',
      tag TEXT NOT NULL DEFAULT 'Full-Stack',
      year TEXT NOT NULL DEFAULT '2025',
      client TEXT NOT NULL DEFAULT '',
      duration TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL DEFAULT 'Full-Stack Developer',
      overview TEXT NOT NULL DEFAULT '',
      challenge TEXT NOT NULL DEFAULT '',
      solution TEXT NOT NULL DEFAULT '',
      tech_stack TEXT NOT NULL DEFAULT '[]',
      results TEXT NOT NULL DEFAULT '[]',
      live_url TEXT NOT NULL DEFAULT '#',
      repo_url TEXT NOT NULL DEFAULT '#',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Articles
  await db.execute(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '[]',
      tag TEXT NOT NULL DEFAULT 'General',
      date TEXT NOT NULL DEFAULT '',
      read_time TEXT NOT NULL DEFAULT '5 min',
      author TEXT NOT NULL DEFAULT 'Faisal Khan',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Contact form submissions
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      subject TEXT DEFAULT '',
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Services
  await db.execute(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      features TEXT NOT NULL DEFAULT '[]',
      icon TEXT NOT NULL DEFAULT 'code',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Testimonials
  await db.execute(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT '',
      quote TEXT NOT NULL DEFAULT '',
      avatar TEXT DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Work Experience
  await db.execute(`
    CREATE TABLE IF NOT EXISTS work_experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year TEXT NOT NULL DEFAULT '',
      duration TEXT NOT NULL DEFAULT '',
      company TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL DEFAULT '',
      tech TEXT NOT NULL DEFAULT '',
      is_ongoing INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Achievements
  await db.execute(`
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value TEXT NOT NULL DEFAULT '',
      label TEXT NOT NULL DEFAULT '',
      detail TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Skills
  await db.execute(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL DEFAULT '',
      count TEXT NOT NULL DEFAULT '0',
      proficiency INTEGER NOT NULL DEFAULT 50,
      technologies TEXT NOT NULL DEFAULT '[]',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // FAQ
  await db.execute(`
    CREATE TABLE IF NOT EXISTS faq (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL DEFAULT '',
      answer TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Reading List
  await db.execute(`
    CREATE TABLE IF NOT EXISTS reading_list (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT '',
      progress INTEGER NOT NULL DEFAULT 0,
      gradient TEXT NOT NULL DEFAULT 'from-emerald-700/40 to-teal-900/40',
      accent TEXT NOT NULL DEFAULT 'bg-emerald-500/60',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Now Playing Widget
  await db.execute(`
    CREATE TABLE IF NOT EXISTS now_playing (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL DEFAULT 'learning',
      label TEXT NOT NULL DEFAULT '',
      title TEXT NOT NULL DEFAULT '',
      subtitle TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Tech Stack (Marquee)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tech_stack (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT '',
      icon TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Social Links
  await db.execute(`
    CREATE TABLE IF NOT EXISTS social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT '',
      platform TEXT NOT NULL DEFAULT '',
      url TEXT NOT NULL DEFAULT '',
      icon TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Admin Users
  await db.execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Hero Typing Roles
  await db.execute(`
    CREATE TABLE IF NOT EXISTS hero_roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1
    )
  `);

  // Process Timeline
  await db.execute(`
    CREATE TABLE IF NOT EXISTS process_timeline (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      step INTEGER NOT NULL DEFAULT 1,
      title TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Skills Radar
  await db.execute(`
    CREATE TABLE IF NOT EXISTS skills_radar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      skill TEXT NOT NULL DEFAULT '',
      value INTEGER NOT NULL DEFAULT 50,
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1
    )
  `);

  // Live Clock Timezones
  await db.execute(`
    CREATE TABLE IF NOT EXISTS timezones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL DEFAULT '',
      timezone TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1
    )
  `);

  // Newsletter CTA
  await db.execute(`
    CREATE TABLE IF NOT EXISTS newsletter_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stat_key TEXT NOT NULL DEFAULT '',
      stat_value TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `);

  console.log("Database schema initialized successfully!");
}
