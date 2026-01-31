# Governance Data Collection for GRS Training

## Overview
This document outlines all the governance data we collect from users on our platform. This data will be used to train and improve our unique Governance Reputation Score (GRS) system.

## Database Schema & Data Collection

### 1. User Profile Data (`users` table)
**Core Identity & Authentication:**
- `id` - Unique user identifier
- `username` - Platform username  
- `email` - User email (if provided)
- `firstName`, `lastName` - User's real name
- `profileImageUrl` - Avatar/profile picture
- `walletAddress` - Crypto wallet address
- `authProvider` - How they authenticated (email, twitter, replit)
- `emailVerified` - Email verification status
- `createdAt`, `updatedAt` - Account creation and last update timestamps

**Governance Reputation Metrics:**
- `totalScore` - Overall platform reputation score
- `grsScore` - AI-calculated Governance Reputation Score (300-850 scale)
- `grsPercentile` - User's percentile ranking (0-100)
- `onboardingCompletedAt` - When they completed platform onboarding

**Social Network Data:**
- `referralCode` - Unique code for referring others
- Connected referrals (tracked in `referrals` table)

### 2. Content Creation Data (`threads` & `comments` tables)

**Thread Creation Activity:**
- `title` - Discussion topic title
- `content` - Full discussion content/post
- `authorId` - Who created the thread
- `daoId` - Which DAO it belongs to (if any)
- `categoryId` - Forum category classification
- `tags` - Topic tags (array)
- `upvotes` - Community engagement metric
- `commentCount` - Discussion engagement level
- `isPinned`, `isLocked` - Moderation status
- `lastActivityAt` - When thread was last active
- `createdAt`, `updatedAt` - Creation and modification timestamps

**Comment Engagement:**
- `content` - Comment text content
- `authorId` - Comment author
- `threadId` - Which discussion it belongs to
- `upvotes` - Comment quality/agreement metric
- `createdAt`, `updatedAt` - Timing data

### 3. Voting Behavior Data (`votes` table)
**Democratic Participation:**
- `userId` - Who cast the vote
- `targetType` - What they voted on ('thread' or 'comment')
- `targetId` - Specific item they voted on
- `createdAt` - When the vote was cast

**Voting Patterns for GRS:**
- Frequency of voting
- Types of content voted on
- Timing patterns of voting behavior
- Consistency in voting participation

### 4. Community Engagement Data (`user_dao_follows` & `user_dao_scores`)

**DAO Following Behavior:**
- `userId` - Who is following
- `daoId` - Which DAO they follow
- `createdAt` - When they started following

**DAO-Specific Reputation:**
- `userId` - User identity
- `daoId` - Specific DAO
- `score` - Reputation score within that DAO
- `createdAt`, `updatedAt` - Score tracking timestamps

### 5. Social Network & Referral Data (`referrals` table)
**Community Building:**
- `referrerId` - Who made the referral
- `referredId` - Who was referred
- `referralCode` - Referral tracking code
- `pointsAwarded` - Incentive points given
- `createdAt` - When referral occurred

### 6. DAO & Community Data (`daos` & `forum_categories`)

**DAO Ecosystem:**
- `name`, `slug` - DAO identification
- `description` - DAO purpose/mission
- `logoUrl` - Visual branding
- `createdBy` - DAO founder
- `createdAt`, `updatedAt` - DAO lifecycle

**Forum Structure:**
- `name`, `slug` - Category identification
- `description` - Category purpose
- `color`, `icon` - Visual organization
- `daoId` - DAO association (if any)
- `threadCount` - Activity metric
- `lastActivityAt` - Engagement timing

## GRS Training Data Points

### User Behavior Patterns
1. **Content Quality Indicators:**
   - Thread upvotes vs. views
   - Comment engagement rates
   - Discussion thread length and depth
   - Use of relevant tags

2. **Community Engagement:**
   - Voting frequency and patterns
   - Response time to discussions
   - Cross-DAO participation
   - Following behavior

3. **Leadership & Influence:**
   - Thread creation rate
   - Comment response rates
   - Referral success rate
   - Community growth contribution

4. **Time-Based Patterns:**
   - Account age and activity consistency
   - Onboarding completion rate
   - Sustained engagement over time
   - Activity during important discussions

### Governance-Specific Metrics
1. **Democratic Participation:**
   - Voting frequency across different content types
   - Participation in discussions before voting
   - Engagement with controversial topics

2. **Community Building:**
   - Successful referrals and their retention
   - Cross-DAO bridging activities
   - Mentoring newer members (comment patterns)

3. **Content Quality:**
   - Average upvotes per post
   - Thread-to-comment ratio
   - Constructive vs. destructive engagement

4. **Reputation Consistency:**
   - Score consistency across different DAOs
   - Temporal stability of reputation metrics
   - Peer validation through votes

## Data Export for ML Training

### Comprehensive User Profile
```sql
-- Complete user governance profile
SELECT 
  u.*,
  COUNT(DISTINCT t.id) as total_threads,
  COUNT(DISTINCT c.id) as total_comments,
  COUNT(DISTINCT v.id) as total_votes,
  AVG(t.upvotes) as avg_thread_upvotes,
  AVG(c.upvotes) as avg_comment_upvotes,
  COUNT(DISTINCT uds.dao_id) as active_daos,
  COUNT(DISTINCT udf.dao_id) as following_daos,
  COUNT(DISTINCT r1.id) as referrals_made,
  COUNT(DISTINCT r2.id) as referrals_received,
  EXTRACT(EPOCH FROM (NOW() - u.created_at)) / 86400 as account_age_days
FROM users u
LEFT JOIN threads t ON u.id = t.author_id
LEFT JOIN comments c ON u.id = c.author_id  
LEFT JOIN votes v ON u.id = v.user_id
LEFT JOIN user_dao_scores uds ON u.id = uds.user_id
LEFT JOIN user_dao_follows udf ON u.id = udf.user_id
LEFT JOIN referrals r1 ON u.id = r1.referrer_id
LEFT JOIN referrals r2 ON u.id = r2.referred_id
GROUP BY u.id;
```

### Activity Timeline Data
```sql
-- Time-series activity for pattern analysis
SELECT 
  user_id,
  'thread' as activity_type,
  created_at,
  upvotes as engagement_score,
  dao_id,
  category_id
FROM threads
UNION ALL
SELECT 
  author_id as user_id,
  'comment' as activity_type,
  created_at,
  upvotes as engagement_score,
  NULL as dao_id,
  NULL as category_id
FROM comments
UNION ALL
SELECT 
  user_id,
  'vote' as activity_type,
  created_at,
  1 as engagement_score,
  NULL as dao_id,
  NULL as category_id
FROM votes
ORDER BY user_id, created_at;
```

## Privacy & Security Considerations

### Data Anonymization for Training
- Hash user IDs for ML training datasets
- Remove personally identifiable information (emails, names)
- Aggregate behavioral patterns rather than individual actions
- Time-bucketed data to prevent timing attacks

### Consent & Transparency
- Users are informed their governance actions contribute to GRS
- Clear explanation of how their data improves the system
- Option to view their governance data profile
- Ability to understand their GRS score calculation

## Future Enhancements

### Additional Data Points to Consider
1. **Sentiment Analysis:** Content sentiment scoring
2. **Network Effects:** Social graph analysis
3. **Expertise Domains:** Topic-specific reputation
4. **Temporal Patterns:** Activity rhythms and consistency
5. **Cross-Platform Integration:** External governance participation
6. **Verification Status:** Identity verification levels
7. **Governance Outcomes:** Track decision effectiveness

### ML Model Improvements
1. **Behavioral Clustering:** Group similar governance styles
2. **Predictive Modeling:** Forecast governance behavior
3. **Anomaly Detection:** Identify unusual voting patterns
4. **Recommendation Systems:** Suggest relevant discussions
5. **Reputation Forecasting:** Predict future GRS scores

This comprehensive data collection system provides the foundation for training a sophisticated, AI-powered governance reputation system that can accurately assess and predict user behavior in decentralized communities.