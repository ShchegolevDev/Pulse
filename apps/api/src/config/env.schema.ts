import { z } from 'zod';

/**
 * Схема переменных окружения. Единственный источник правды о том,
 * какой конфиг нужен приложению: если чего-то не хватает или значение
 * неверного типа, приложение падает на старте с понятным списком ошибок,
 * а не в случайный момент в рантайме.
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  // z.coerce: переменные окружения всегда строки, приводим к числу.
  PORT: z.coerce.number().int().positive().default(3000),

  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),

  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Функция для опции `validate` в ConfigModule.forRoot.
 * Принимает «сырой» объект (process.env + .env-файл), возвращает
 * распарсенный и типизированный; при ошибке бросает исключение,
 * из-за чего Nest не стартует.
 */
export function validateEnv(raw: Record<string, unknown>): Env {
  const result = envSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Неверная конфигурация окружения:\n${issues}`);
  }
  return result.data;
}
