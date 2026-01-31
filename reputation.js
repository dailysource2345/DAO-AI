/**
 * Deterministic Reputation Scoring Module
 * 
 * This module implements a deterministic, stateless reputation scoring algorithm.
 * All computations are reproducible given the same input - no randomness.
 * 
 * SCORING MODEL:
 * - Cross-platform presence: Weight based on number of verified platforms
 * - Account longevity: Older accounts indicate established identity
 * - Engagement consistency: Activity metrics across platforms
 * - Quality signals: Followers, contributions, etc.
 * 
 * OUTPUT:
 * - reputation_score: Integer (0-1000 scale)
 * - confidence_score: Float (0-1), how confident we are in the score
 * 
 * @module reputation
 */

// Scoring weights (deterministic constants)
const WEIGHTS = {
  // Platform presence weights
  PLATFORM_TWITTER: 0.25,
  PLATFORM_GITHUB: 0.30,
  PLATFORM_DISCORD: 0.15,
  PLATFORM_TELEGRAM: 0.10,
  PLATFORM_LINKEDIN: 0.20,

  // Metric weights within platforms
  ACCOUNT_AGE: 0.30,
  FOLLOWERS: 0.25,
  ENGAGEMENT: 0.25,
  ACTIVITY: 0.20
};

// Thresholds for scoring tiers
const THRESHOLDS = {
  // Twitter
  TWITTER_FOLLOWERS_LOW: 100,
  TWITTER_FOLLOWERS_MED: 1000,
  TWITTER_FOLLOWERS_HIGH: 10000,
  TWITTER_AGE_DAYS_MIN: 30,
  TWITTER_AGE_DAYS_ESTABLISHED: 365,
  TWITTER_AGE_DAYS_VETERAN: 1095, // 3 years

  // GitHub
  GITHUB_REPOS_MIN: 1,
  GITHUB_REPOS_ACTIVE: 5,
  GITHUB_REPOS_PROLIFIC: 20,
  GITHUB_STARS_MIN: 10,
  GITHUB_STARS_NOTABLE: 100,
  GITHUB_STARS_SIGNIFICANT: 1000,

  // General
  MIN_PLATFORMS_FOR_CONFIDENCE: 2,
  HIGH_CONFIDENCE_PLATFORMS: 3
};

/**
 * Compute reputation score from social profiles
 * 
 * @param {Object} socialProfiles - Social profile data
 * @returns {Object} Reputation result with score, confidence, and breakdown
 */
export function computeReputation(socialProfiles) {
  const breakdown = {};
  let totalScore = 0;
  let totalWeight = 0;
  let platformCount = 0;

  // Score Twitter profile
  if (socialProfiles.twitter) {
    const twitterScore = scoreTwitterProfile(socialProfiles.twitter);
    breakdown.twitter = twitterScore;
    totalScore += twitterScore.score * WEIGHTS.PLATFORM_TWITTER;
    totalWeight += WEIGHTS.PLATFORM_TWITTER;
    platformCount++;
  }

  // Score GitHub profile
  if (socialProfiles.github) {
    const githubScore = scoreGitHubProfile(socialProfiles.github);
    breakdown.github = githubScore;
    totalScore += githubScore.score * WEIGHTS.PLATFORM_GITHUB;
    totalWeight += WEIGHTS.PLATFORM_GITHUB;
    platformCount++;
  }

  // Score Discord profile
  if (socialProfiles.discord) {
    const discordScore = scoreDiscordProfile(socialProfiles.discord);
    breakdown.discord = discordScore;
    totalScore += discordScore.score * WEIGHTS.PLATFORM_DISCORD;
    totalWeight += WEIGHTS.PLATFORM_DISCORD;
    platformCount++;
  }

  // Score Telegram profile
  if (socialProfiles.telegram) {
    const telegramScore = scoreTelegramProfile(socialProfiles.telegram);
    breakdown.telegram = telegramScore;
    totalScore += telegramScore.score * WEIGHTS.PLATFORM_TELEGRAM;
    totalWeight += WEIGHTS.PLATFORM_TELEGRAM;
    platformCount++;
  }

  // Score LinkedIn profile
  if (socialProfiles.linkedin) {
    const linkedinScore = scoreLinkedInProfile(socialProfiles.linkedin);
    breakdown.linkedin = linkedinScore;
    totalScore += linkedinScore.score * WEIGHTS.PLATFORM_LINKEDIN;
    totalWeight += WEIGHTS.PLATFORM_LINKEDIN;
    platformCount++;
  }

  // Normalize score if we have any platforms
  // Platform scores are 0-100, we multiply by 10 to get 0-1000 scale
  let normalizedScore = 0;
  if (totalWeight > 0) {
    normalizedScore = Math.round((totalScore / totalWeight) * 10);
  }

  // Calculate confidence based on platform coverage and data quality
  const confidence = calculateConfidence(platformCount, breakdown);

  // Apply cross-platform bonus only if there's a base score
  const crossPlatformBonus = normalizedScore > 0 ? calculateCrossPlatformBonus(platformCount) : 0;
  const finalScore = Math.min(1000, normalizedScore + crossPlatformBonus);

  return {
    reputation_score: finalScore,
    confidence_score: confidence,
    breakdown: {
      platforms: breakdown,
      platform_count: platformCount,
      base_score: normalizedScore,
      cross_platform_bonus: crossPlatformBonus,
      weights_used: totalWeight
    }
  };
}

/**
 * Score a Twitter profile
 * 
 * @param {Object} twitter - Twitter profile data
 * @returns {Object} Score breakdown for Twitter
 */
function scoreTwitterProfile(twitter) {
  const { followers = 0, account_age_days = 0, tweets = 0, following = 0 } = twitter;

  // Followers score (0-100)
  let followersScore = 0;
  if (followers >= THRESHOLDS.TWITTER_FOLLOWERS_HIGH) {
    followersScore = 100;
  } else if (followers >= THRESHOLDS.TWITTER_FOLLOWERS_MED) {
    followersScore = 60 + (followers - THRESHOLDS.TWITTER_FOLLOWERS_MED) / 
                     (THRESHOLDS.TWITTER_FOLLOWERS_HIGH - THRESHOLDS.TWITTER_FOLLOWERS_MED) * 40;
  } else if (followers >= THRESHOLDS.TWITTER_FOLLOWERS_LOW) {
    followersScore = 20 + (followers - THRESHOLDS.TWITTER_FOLLOWERS_LOW) / 
                     (THRESHOLDS.TWITTER_FOLLOWERS_MED - THRESHOLDS.TWITTER_FOLLOWERS_LOW) * 40;
  } else {
    followersScore = (followers / THRESHOLDS.TWITTER_FOLLOWERS_LOW) * 20;
  }

  // Account age score (0-100)
  let ageScore = 0;
  if (account_age_days >= THRESHOLDS.TWITTER_AGE_DAYS_VETERAN) {
    ageScore = 100;
  } else if (account_age_days >= THRESHOLDS.TWITTER_AGE_DAYS_ESTABLISHED) {
    ageScore = 60 + (account_age_days - THRESHOLDS.TWITTER_AGE_DAYS_ESTABLISHED) / 
               (THRESHOLDS.TWITTER_AGE_DAYS_VETERAN - THRESHOLDS.TWITTER_AGE_DAYS_ESTABLISHED) * 40;
  } else if (account_age_days >= THRESHOLDS.TWITTER_AGE_DAYS_MIN) {
    ageScore = 20 + (account_age_days - THRESHOLDS.TWITTER_AGE_DAYS_MIN) / 
               (THRESHOLDS.TWITTER_AGE_DAYS_ESTABLISHED - THRESHOLDS.TWITTER_AGE_DAYS_MIN) * 40;
  } else {
    ageScore = (account_age_days / THRESHOLDS.TWITTER_AGE_DAYS_MIN) * 20;
  }

  // Activity score based on tweets
  let activityScore = Math.min(100, (tweets / 1000) * 100);

  // Engagement ratio (followers to following)
  let engagementScore = 50; // Default
  if (following > 0) {
    const ratio = followers / following;
    if (ratio >= 10) engagementScore = 100;
    else if (ratio >= 2) engagementScore = 70;
    else if (ratio >= 1) engagementScore = 50;
    else engagementScore = 30;
  }

  const score = (
    followersScore * WEIGHTS.FOLLOWERS +
    ageScore * WEIGHTS.ACCOUNT_AGE +
    activityScore * WEIGHTS.ACTIVITY +
    engagementScore * WEIGHTS.ENGAGEMENT
  ) / (WEIGHTS.FOLLOWERS + WEIGHTS.ACCOUNT_AGE + WEIGHTS.ACTIVITY + WEIGHTS.ENGAGEMENT);

  return {
    score: Math.round(score),
    components: {
      followers: Math.round(followersScore),
      account_age: Math.round(ageScore),
      activity: Math.round(activityScore),
      engagement: Math.round(engagementScore)
    }
  };
}

/**
 * Score a GitHub profile
 * 
 * @param {Object} github - GitHub profile data
 * @returns {Object} Score breakdown for GitHub
 */
function scoreGitHubProfile(github) {
  const { repos = 0, stars = 0, contributions = 0, account_age_days = 0 } = github;

  // Repos score (0-100)
  let reposScore = 0;
  if (repos >= THRESHOLDS.GITHUB_REPOS_PROLIFIC) {
    reposScore = 100;
  } else if (repos >= THRESHOLDS.GITHUB_REPOS_ACTIVE) {
    reposScore = 50 + (repos - THRESHOLDS.GITHUB_REPOS_ACTIVE) / 
                 (THRESHOLDS.GITHUB_REPOS_PROLIFIC - THRESHOLDS.GITHUB_REPOS_ACTIVE) * 50;
  } else if (repos >= THRESHOLDS.GITHUB_REPOS_MIN) {
    reposScore = 20 + (repos - THRESHOLDS.GITHUB_REPOS_MIN) / 
                 (THRESHOLDS.GITHUB_REPOS_ACTIVE - THRESHOLDS.GITHUB_REPOS_MIN) * 30;
  } else {
    reposScore = repos * 20;
  }

  // Stars score (0-100)
  let starsScore = 0;
  if (stars >= THRESHOLDS.GITHUB_STARS_SIGNIFICANT) {
    starsScore = 100;
  } else if (stars >= THRESHOLDS.GITHUB_STARS_NOTABLE) {
    starsScore = 60 + (stars - THRESHOLDS.GITHUB_STARS_NOTABLE) / 
                 (THRESHOLDS.GITHUB_STARS_SIGNIFICANT - THRESHOLDS.GITHUB_STARS_NOTABLE) * 40;
  } else if (stars >= THRESHOLDS.GITHUB_STARS_MIN) {
    starsScore = 20 + (stars - THRESHOLDS.GITHUB_STARS_MIN) / 
                 (THRESHOLDS.GITHUB_STARS_NOTABLE - THRESHOLDS.GITHUB_STARS_MIN) * 40;
  } else {
    starsScore = (stars / THRESHOLDS.GITHUB_STARS_MIN) * 20;
  }

  // Contributions score
  let contributionsScore = Math.min(100, (contributions / 500) * 100);

  // Account age score
  let ageScore = Math.min(100, (account_age_days / 1095) * 100); // 3 years = 100

  const score = (
    starsScore * WEIGHTS.FOLLOWERS +
    ageScore * WEIGHTS.ACCOUNT_AGE +
    reposScore * WEIGHTS.ACTIVITY +
    contributionsScore * WEIGHTS.ENGAGEMENT
  ) / (WEIGHTS.FOLLOWERS + WEIGHTS.ACCOUNT_AGE + WEIGHTS.ACTIVITY + WEIGHTS.ENGAGEMENT);

  return {
    score: Math.round(score),
    components: {
      repos: Math.round(reposScore),
      stars: Math.round(starsScore),
      contributions: Math.round(contributionsScore),
      account_age: Math.round(ageScore)
    }
  };
}

/**
 * Score a Discord profile
 */
function scoreDiscordProfile(discord) {
  const { servers = 0, account_age_days = 0, nitro = false } = discord;

  let serversScore = Math.min(100, (servers / 20) * 100);
  let ageScore = Math.min(100, (account_age_days / 730) * 100); // 2 years = 100
  let nitroBonus = nitro ? 20 : 0;

  const score = Math.min(100, (serversScore + ageScore) / 2 + nitroBonus);

  return {
    score: Math.round(score),
    components: {
      servers: Math.round(serversScore),
      account_age: Math.round(ageScore),
      nitro_bonus: nitroBonus
    }
  };
}

/**
 * Score a Telegram profile
 */
function scoreTelegramProfile(telegram) {
  const { groups = 0, account_age_days = 0, premium = false } = telegram;

  let groupsScore = Math.min(100, (groups / 30) * 100);
  let ageScore = Math.min(100, (account_age_days / 730) * 100);
  let premiumBonus = premium ? 15 : 0;

  const score = Math.min(100, (groupsScore + ageScore) / 2 + premiumBonus);

  return {
    score: Math.round(score),
    components: {
      groups: Math.round(groupsScore),
      account_age: Math.round(ageScore),
      premium_bonus: premiumBonus
    }
  };
}

/**
 * Score a LinkedIn profile
 */
function scoreLinkedInProfile(linkedin) {
  const { connections = 0, account_age_days = 0, posts = 0, endorsements = 0 } = linkedin;

  let connectionsScore = Math.min(100, (connections / 500) * 100);
  let ageScore = Math.min(100, (account_age_days / 1825) * 100); // 5 years = 100
  let activityScore = Math.min(100, (posts / 50) * 100);
  let endorsementsScore = Math.min(100, (endorsements / 50) * 100);

  const score = (connectionsScore + ageScore + activityScore + endorsementsScore) / 4;

  return {
    score: Math.round(score),
    components: {
      connections: Math.round(connectionsScore),
      account_age: Math.round(ageScore),
      activity: Math.round(activityScore),
      endorsements: Math.round(endorsementsScore)
    }
  };
}

/**
 * Calculate confidence score based on data quality
 */
function calculateConfidence(platformCount, breakdown) {
  // Base confidence from platform count
  let confidence = 0;
  
  if (platformCount === 0) {
    return 0;
  } else if (platformCount === 1) {
    confidence = 0.4;
  } else if (platformCount === 2) {
    confidence = 0.6;
  } else if (platformCount >= THRESHOLDS.HIGH_CONFIDENCE_PLATFORMS) {
    confidence = 0.75 + Math.min(0.20, (platformCount - 3) * 0.05);
  }

  // Boost confidence if scores are consistent across platforms
  const scores = Object.values(breakdown).map(b => b.score);
  if (scores.length >= 2) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    
    // Low variance = high consistency = higher confidence
    if (stdDev < 10) {
      confidence += 0.05;
    } else if (stdDev > 30) {
      confidence -= 0.05;
    }
  }

  return Math.round(Math.max(0, Math.min(1, confidence)) * 100) / 100;
}

/**
 * Calculate cross-platform bonus for having multiple verified identities
 */
function calculateCrossPlatformBonus(platformCount) {
  if (platformCount <= 1) return 0;
  if (platformCount === 2) return 25;
  if (platformCount === 3) return 50;
  if (platformCount === 4) return 75;
  return 100; // 5+ platforms
}

export { WEIGHTS, THRESHOLDS };
