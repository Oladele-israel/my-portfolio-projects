import Joi from "joi";

interface UserInput {
  user_name: string;
  email: string;
  password: string;
}

interface ValidationResult {
  error?: {
    details: Array<{ message: string }>;
  };
  value?: UserInput;
}

export const validateUserInput = (data: UserInput): ValidationResult => {
  const schema = Joi.object({
    user_name: Joi.string().min(3).max(30).required().messages({
      "string.empty": "User name is required.",
      "string.min": "User name must be at least 3 characters.",
      "string.max": "User name must not exceed 30 characters.",
      "any.required": "User name is required.",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required.",
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
    password: Joi.string().min(8).required().messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 8 characters long.",
      "any.required": "Password is required.",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};
