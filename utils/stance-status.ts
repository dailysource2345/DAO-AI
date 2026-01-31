interface StanceStatusProps {
  stanceType: 'champion' | 'challenge';
  authorUsername: string;
  targetUsername?: string;
  targetName?: string;
  isActive: boolean;
  championVotes?: number;
  challengeVotes?: number;
  opposeVotes?: number;
  defendVotes?: number;
}

export function getSimpleStanceStatus(isActive: boolean): string {
  return isActive ? 'LIVE' : 'ENDED';
}

export function getStanceStatusText({
  stanceType,
  authorUsername,
  targetUsername,
  targetName,
  isActive,
  championVotes = 0,
  challengeVotes = 0,
  opposeVotes = 0,
  defendVotes = 0
}: StanceStatusProps): { text: string; indicator: string } {
  const target = targetName || targetUsername || 'target';
  
  if (isActive) {
    // Active stance states
    if (stanceType === 'champion') {
      return {
        text: `${authorUsername} is championing ${target}`,
        indicator: 'LIVE STANCE'
      };
    } else {
      return {
        text: `${authorUsername} is challenging ${target}`,
        indicator: 'LIVE STANCE'
      };
    }
  } else {
    // Expired stance states - determine outcome
    if (stanceType === 'champion') {
      const majoritySupports = championVotes > opposeVotes;
      if (majoritySupports) {
        return {
          text: `${authorUsername} championed ${target}`,
          indicator: 'COMMUNITY SUPPORTED'
        };
      } else {
        return {
          text: `${authorUsername} stance was opposed`,
          indicator: 'COMMUNITY DISAGREED'
        };
      }
    } else {
      // Challenge stance
      const majoritySupports = challengeVotes > defendVotes;
      if (majoritySupports) {
        return {
          text: `${authorUsername} challenged ${target}`,
          indicator: 'COMMUNITY AGREED'
        };
      } else {
        return {
          text: `${authorUsername} challenge was defended`,
          indicator: 'COMMUNITY DISAGREED'
        };
      }
    }
  }
}