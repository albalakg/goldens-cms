export const FIRST_NAME_RULE            = /.{2,30}/;
export const LAST_NAME_RULE             = /.{2,30}/;
export const EMAIL_RULE                 = /^.+@.+\..+$/;
export const PHONE_RULE                 = /^[\d+-]{7,13}$/;
export const PASSWORD_RULE              = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d#$@!%&*^?]{8,40}$/;
export const LESSON_DESCRIPTION_RULE    = /.{2,1000}/;
export const VIDEO_DESCRIPTION_RULE     = /.{0,1000}/;
export const SKILL_DESCRIPTION_RULE     = /.{0,1000}/;
export const TERM_DESCRIPTION_RULE      = /.{0,1000}/;
export const EQUIPMENT_DESCRIPTION_RULE = /.{0,1000}/;
export const VIDEO_FILE_SIZE_RULE       = 1000 * 1024 * 1000; // 1000 MB
export const TRAINER_DESCRIPTION_RULE   = /.{0,1000}/;
export const TRAINER_TITLE_RULE         = /.{2,100}/;
export const TRAILER_FILE_SIZE_RULE     = 1000 * 1024 * 10; // 10 MB
export const IMAGE_FILE_SIZE_RULE       = 1000 * 1024 * 50; // 50 MB
export const VIDEO_FILE_TYPES_RULE      = ['video/mp4'];
export const IMAGE_FILE_TYPES_RULE      = ['image/webp', 'image/png', 'image/jpeg'];
export const PRICE_RULE                 = /^\d{1,7}\.?\d{0,2}$/;
export const COUPON_TYPE_RULE           = /^[12]$/;
// eslint-disable-next-line no-useless-escape
export const DISCOUNT_RULE              = /^[\d\.]{1,4}$/;
// eslint-disable-next-line no-useless-escape
export const COURSE_DISCOUNT_RULE       = /[\d\.]{0,4}/;
export const NAME_RULE                  = /.{2,40}/;
export const TRAINING_OPTION_NAME_RULE  = /.{2,100}/;
export const TRAINING_OPTION_VALUE_RULE = /\d+/;
export const DESCRIPTION_RULE           = /.{2,40}/;
export const COMMENT_RULE               = /.{1,5000}/;
export const ID_RULE                    = /[1-9]\d{0,9}/;
