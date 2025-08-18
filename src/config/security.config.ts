// src/config/security.config.ts
const parseOrigins = (raw?: string): string[] =>
  (raw ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const ALLOWED_ORIGINS = new Set(parseOrigins(process.env.FRONTEND_URLS));

// Optional: allow any localhost port during dev
const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

export const SecurityConfig = {
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
    legacyHeaders: false,
    standardHeaders: true,
  },

  // CORS configuration
  cors: {
    credentials: true,
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow non-browser tools (no Origin header), e.g. curl/Postman/health checks
      if (!origin) return callback(null, true);

      // Allow if explicitly listed
      if (ALLOWED_ORIGINS.has(origin)) return callback(null, true);

      // (Optional) allow localhost on any port in development
      if (
        process.env.NODE_ENV !== 'production' &&
        localhostPattern.test(origin)
      ) {
        return callback(null, true);
      }

      // Otherwise block
      callback(new Error(`CORS blocked: ${origin} not allowed`));
    },
    // You can also specify methods/headers if needed:
    // methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    // allowedHeaders: ['Content-Type','Authorization'],
  },

  // Helmet security headers
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, // helps Swagger UI
  },

  // Input validation
  validation: {
    maxStringLength: 1000,
    maxArrayLength: 100,
  },
};
