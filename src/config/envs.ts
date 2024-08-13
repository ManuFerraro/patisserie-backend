import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  JWT_SECRET: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    JWT_SECRET: joi.string().required(),
    EMAIL_USER: joi.string().required(),
    EMAIL_PASS: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  jwtSecret : envVars.JWT_SECRET,
  emailUser: envVars.EMAIL_USER,
  emailPassword: envVars.EMAIL_PASS,
};
