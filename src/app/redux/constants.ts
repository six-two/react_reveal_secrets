export const DEBUG = false;

export const SECRET_TYPE_RAW = "SECRET_TYPE_RAW";
export const SECRET_TYPE_HEX = "SECRET_TYPE_HEX";
export const SECRET_TYPE_BASE64 = "SECRET_TYPE_BASE64";

// Modes
export const MODE_EASIEST = "MODE_EASIEST";
export const MODE_ADVANCED = "MODE_ADVANCED";

// Action types
export const SET_SCREEN = "SET_SCREEN";
export const SET_TOTAL_SHARE_COUNT = "SET_TOTAL_SHARE_COUNT";
export const SET_THRESHOLD_SHARE_COUNT = "SET_THRESHOLD_SHARE_COUNT";
export const SET_SECRET_TEXT = "SET_SECRET_TEXT";
export const SET_SECRET_FORMAT = "SET_SECRET_FORMAT";
export const SET_MODE = "SET_MODE";
export const SET_CONSTANT_SHARE_SIZE = "SET_CONSTANT_SHARE_SIZE";
export const SET_SECRET_IS_FILE = "SET_SECRET_IS_FILE";
export const ON_SECRET_UPLOAD_DONE = "ON_SECRET_UPLOAD_DONE";

// SCREENS
export const SCREEN_MODE = "SCREEN_MODE";
export const SCREEN_SECRET_TYPE = "SCREEN_SECRET_TYPE";
export const SCREEN_SECRET_VALUE = "SCREEN_SECRET_VALUE";
export const SCREEN_SHARE_COUNTS = "SCREEN_SHARE_COUNTS";
export const SCREEN_SHOW_SHARES = "SCREEN_SHOW_SHARES";

/// Use constant size shares by default, if the secret is bigger than this many bytes
/// The encryption key is 32 bytes long, so this value should be at least 32
export const USE_CONST_SIZE_THRESHOLD = 64;

