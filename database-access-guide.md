# Database Access Guide

## Your Database Details

**Database Type:** PostgreSQL (Neon Serverless)
**Connection:** Available via DATABASE_URL environment variable
**Location:** Your database is hosted on Neon's cloud infrastructure

## Current Data Storage

### Your Database Contains:
```
📊 Current Data Summary:
- 2 users (1 Twitter OAuth, 1 email)
- 7 DAOs (including Uniswap, Compound, Aave, MakerDAO, Jupiter, Test Today, Ledger 1)
- 2 discussion threads with governance proposals
- 1 comment on discussions
- 2 votes cast by users
- 7 user-DAO score records
- 3 DAO follows
- 6 forum categories
- 9 active user sessions
```

### Your Actual Users:
| User ID | Username | Email | Total Score | GRS Score | Auth Provider | Created |
|---------|----------|-------|-------------|-----------|---------------|---------|
| 1940567468453367808 | Masterlife_24 | - | 16 | 550 | twitter | 2025-07-03 |
| 44327194 | - | ceo@daoagents.io | 11 | 550 | email | 2025-06-30 |

### Your DAOs:
| ID | Name | Slug | Description | Created By | Created |
|----|------|------|-------------|------------|---------|
| 1 | Uniswap DAO | uniswap | Decentralized exchange protocol governed by UNI token holders | - | 2025-06-27 |
| 2 | Compound DAO | compound | Algorithmic money market protocol with community governance | - | 2025-06-27 |
| 3 | Aave DAO | aave | Open source and non-custodial liquidity protocol | - | 2025-06-27 |
| 4 | MakerDAO | makerdao | Decentralized credit platform on Ethereum that supports Dai stablecoin | - | 2025-06-27 |
| 5 | Jupiter DAO | jupiter-dao | Life is good | - | 2025-06-30 |
| 6 | Test Today | test-today | This is a test that we can see in the middle of the day | - | 2025-07-06 |
| 9 | Ledger 1 | ledger-1 | [Long description about Ledger governance] | 1940567468453367808 | 2025-07-06 |

## How to Access Your Database

### Method 1: Using the SQL Tool (Recommended)
You can query your database directly using the SQL tool I'm using. Here are key queries:

```sql
-- Get all users with their governance metrics
SELECT 
  u.id,
  u.username,
  u.email,
  u.total_score,
  u.grs_score,
  u.grs_percentile,
  u.auth_provider,
  u.created_at,
  COUNT(DISTINCT t.id) as threads_created,
  COUNT(DISTINCT c.id) as comments_made,
  COUNT(DISTINCT v.id) as votes_cast
FROM users u
LEFT JOIN threads t ON u.id = t.author_id
LEFT JOIN comments c ON u.id = c.author_id
LEFT JOIN votes v ON u.id = v.user_id
GROUP BY u.id, u.username, u.email, u.total_score, u.grs_score, u.grs_percentile, u.auth_provider, u.created_at;

-- Get all governance discussions
SELECT 
  t.id,
  t.title,
  t.content,
  t.author_id,
  t.dao_id,
  t.upvotes,
  t.comment_count,
  t.created_at,
  d.name as dao_name
FROM threads t
LEFT JOIN daos d ON t.dao_id = d.id
ORDER BY t.created_at DESC;

-- Get voting patterns
SELECT 
  v.user_id,
  v.target_type,
  v.target_id,
  v.created_at,
  u.username
FROM votes v
JOIN users u ON v.user_id = u.id
ORDER BY v.created_at DESC;
```

### Method 2: Through Your Application Code
Your database is accessible through the Drizzle ORM in your application:

```typescript
// In server/storage.ts
import { storage } from './storage';

// Get all users
const users = await storage.getAllUsers();

// Get user governance data
const userStats = await storage.getDetailedUserStats(userId);

// Get all DAOs
const daos = await storage.getAllDaos();

// Get user's threads
const threads = await storage.getUserThreads(userId);
```

### Method 3: Direct Database Connection
Your database connection string is stored in the `DATABASE_URL` environment variable:
```
DATABASE_URL=postgresql://neondb_owner:npg_ZUmu4wLA3WJa@ep-bold-credit-a2tst7er.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

You can connect to it using:
- **psql command line:** `psql $DATABASE_URL`
- **Database GUI tools:** DBeaver, pgAdmin, etc.
- **Programming languages:** Any PostgreSQL client library

## Key Tables for GRS Training

### 1. `users` - User profiles and reputation
```sql
SELECT * FROM users;
```

### 2. `threads` - Governance discussions
```sql
SELECT * FROM threads;
```

### 3. `comments` - User responses and engagement
```sql
SELECT * FROM comments;
```

### 4. `votes` - Democratic participation
```sql
SELECT * FROM votes;
```

### 5. `user_dao_scores` - Per-DAO reputation
```sql
SELECT * FROM user_dao_scores;
```

### 6. `user_dao_follows` - Community engagement
```sql
SELECT * FROM user_dao_follows;
```

### 7. `referrals` - Social network building
```sql
SELECT * FROM referrals;
```

## Data Export for ML Training

### Complete User Governance Profile Export
```sql
SELECT 
  u.id,
  u.username,
  u.total_score,
  u.grs_score,
  u.grs_percentile,
  u.auth_provider,
  EXTRACT(EPOCH FROM (NOW() - u.created_at)) / 86400 as account_age_days,
  
  -- Activity metrics
  COUNT(DISTINCT t.id) as threads_created,
  COUNT(DISTINCT c.id) as comments_made,
  COUNT(DISTINCT v.id) as votes_cast,
  
  -- Quality metrics
  COALESCE(AVG(t.upvotes), 0) as avg_thread_upvotes,
  COALESCE(AVG(c.upvotes), 0) as avg_comment_upvotes,
  
  -- Engagement metrics
  COUNT(DISTINCT uds.dao_id) as daos_active_in,
  COUNT(DISTINCT udf.dao_id) as daos_following,
  
  -- Network metrics
  COUNT(DISTINCT r1.id) as referrals_made,
  COUNT(DISTINCT r2.id) as referrals_received

FROM users u
LEFT JOIN threads t ON u.id = t.author_id
LEFT JOIN comments c ON u.id = c.author_id
LEFT JOIN votes v ON u.id = v.user_id
LEFT JOIN user_dao_scores uds ON u.id = uds.user_id
LEFT JOIN user_dao_follows udf ON u.id = udf.user_id
LEFT JOIN referrals r1 ON u.id = r1.referrer_id
LEFT JOIN referrals r2 ON u.id = r2.referred_id
GROUP BY u.id, u.username, u.total_score, u.grs_score, u.grs_percentile, u.auth_provider, u.created_at;
```

## Database Management

### Backup Your Data
```sql
-- Create a backup of all governance data
SELECT 'users' as table_name, array_to_json(array_agg(row_to_json(u))) as data FROM users u
UNION ALL
SELECT 'threads', array_to_json(array_agg(row_to_json(t))) FROM threads t
UNION ALL
SELECT 'comments', array_to_json(array_agg(row_to_json(c))) FROM comments c
UNION ALL
SELECT 'votes', array_to_json(array_agg(row_to_json(v))) FROM votes v;
```

### Monitor Database Growth
```sql
-- Check database size and growth
SELECT 
  schemaname,
  relname as table_name,
  n_live_tup as current_rows,
  pg_size_pretty(pg_total_relation_size(relid)) as size
FROM pg_stat_user_tables 
ORDER BY pg_total_relation_size(relid) DESC;
```

## Next Steps for GRS Training

1. **Export your current data** using the queries above
2. **Set up regular data exports** to track user behavior over time
3. **Implement data anonymization** for privacy-compliant ML training
4. **Create training datasets** with behavioral patterns and outcomes
5. **Set up monitoring** to track data quality and completeness

Your database is growing with real governance data that will provide excellent training material for your unique GRS system!