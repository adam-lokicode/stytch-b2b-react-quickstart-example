// server/index.ts
import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import { B2BClient } from "stytch";

dotenv.config();

const {
  STYTCH_PROJECT_ID,
  STYTCH_SECRET,
  SCIM_BEARER_TOKEN,
  PORT = "4000",
} = process.env;

if (!STYTCH_PROJECT_ID || !STYTCH_SECRET || !SCIM_BEARER_TOKEN) {
  console.error(
    "❌ Please set STYTCH_PROJECT_ID, STYTCH_SECRET, and SCIM_BEARER_TOKEN in your .env"
  );
  process.exit(1);
}

const stytchClient = new B2BClient({
  project_id: STYTCH_PROJECT_ID,
  secret:     STYTCH_SECRET,
});

const app = express();
app.use(express.json());

app.get("/scim-connection", async (_req: Request, res: Response) => {
  try {
    const resp = await stytchClient.scim!.connection.get(
      { organization_id: "organization-test-07971b06-ac8b-4cdb-9c15-63b17e653931" },
      { authorization: { session_token: SCIM_BEARER_TOKEN } }
    );
    return res.status(200).json({ connection: resp.connection });
  } catch (err: any) {
    console.error("❌ Error fetching SCIM connection:", err);
    if (err.status_code === 404) {
      return res.status(404).json({ error: "Connection not found" });
    }
    return res
      .status(err.status_code || 500)
      .json({ error: err.error_message || "Failed to get SCIM connection" });
  }
});

app.listen(Number(PORT), () => {
  console.log(`🚀 SCIM server listening on http://localhost:${PORT}`);
});