import { UID } from "@strapi/strapi"

export default ({ env }) => {
  return {
    auth: {
      secret: env("ADMIN_JWT_SECRET"),
    },
    apiToken: {
      salt: env("API_TOKEN_SALT"),
    },
    transfer: {
      token: {
        salt: env("TRANSFER_TOKEN_SALT"),
      },
    },
    preview: {
      enabled: true,
      config: {
        allowedOrigins: env("PREVIEW_ALLOWED_ORIGINS", "http://localhost:3000"),
      },
    },
    watchIgnoreFiles: ["**/config/sync/**"],
  }
}
