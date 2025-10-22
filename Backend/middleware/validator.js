import { body, validationResult } from 'express-validator';

export const signupValidationRules = () => [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/(?=.*[A-Z])/).withMessage('Must contain an uppercase letter')
    .matches(/(?=.*[a-z])/).withMessage('Must contain a lowercase letter')
    .matches(/(?=.*\d)/).withMessage('Must contain a number')
    .matches(/(?=.*[!@#$%^&*])/).withMessage('Must contain a special character'),
];

export const loginValidationRules = () => [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password cannot be empty'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(e => e.msg) });
  }
  next();
};