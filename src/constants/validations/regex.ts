export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  CAPITAL_LETTER: /[A-Z]/,
  EIGHT_CHARACTERS: /^.{8,}$/,
  SPECIAL_CHARACTER: /[^A-Za-z0-9]/,
  LICENSE: /^[a-zA-Z0-9]{6}$/,
} as const;
