
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
  

