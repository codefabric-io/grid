export default () => ({
  port: Number(process.env.PORT) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
  },
});
