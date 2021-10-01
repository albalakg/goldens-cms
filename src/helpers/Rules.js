export const FIRST_NAME_RULE            = /.{2,30}/;
export const LAST_NAME_RULE             = /.{2,30}/;
export const EMAIL_RULE                 = /^.+@.+\..+$/;
export const PHONE_RULE                 = /^[\d+\-]{7,13}$/;
export const PASSWORD_RULE              = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d#$@!%&*\^?]{8,40}$/;
export const VIDEO_NAME_RULE            = /.{2,40}/;
export const VIDEO_DESCRIPTION_RULE     = /.{0,1000}/;
export const VIDEO_FILE_SIZE_RULE       = 1000 * 1024 * 20; // 20 MB
export const TRAILER_FILE_SIZE_RULE     = 1000 * 1024 * 10; // 10 MB
export const IMAGE_FILE_SIZE_RULE       = 1000 * 1024 * 5; // 5 MB
export const VIDEO_FILE_TYPES_RULE      = ['video/mp4'];
export const IMAGE_FILE_TYPES_RULE      = ['image/webp', 'image/png', 'image/jpeg'];
export const PRICE_RULE                 = /^\d{0,7}\.?\d{0,2}$/;
export const DISCOUNT_RULE              = /^[\d\.]{0,3}$/;
export const COURSE_NAME_RULE           = /.{2,40}/;
export const COURSE_DESCRIPTION_RULE    = /.{2,40}/;
export const COMMENT_RULE               = /.{1,5000}/;
export const ID_RULE                    = /\d{1,10}/;
