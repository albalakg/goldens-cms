export const FIRST_NAME_RULE        = /.{2,30}/;
export const LAST_NAME_RULE         = /.{2,30}/;
export const EMAIL_RULE             = /^.+@.+\..+$/;
export const PHONE_RULE             = /^[\d+\-]{7,13}$/;
export const PASSWORD_RULE          = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d#$@!%&*\^?]{8,40}$/;
export const VIDEO_NAME_RULE        = /.{2,40}/;
export const VIDEO_DESCRIPTION_RULE = /.{0,1000}/;
export const VIDEO_FILE_SIZE_RULE   = 1000 * 1024 * 20; // 20 MB
export const VIDEO_FILE_TYPES_RULE  = ['video/mp4'];
