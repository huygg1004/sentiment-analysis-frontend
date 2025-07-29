import { handlers } from "~/server/auth";

export const runtime = "nodejs"; // Force Node.js runtime

export const { GET, POST } = handlers;