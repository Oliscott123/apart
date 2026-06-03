import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { createAccount } from "@convex-dev/auth/server";

export const seedAdmin = action({
  handler: async (ctx) => {
    const adminUser = process.env.ADMIN_USER;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminUser || !adminPassword) {
      console.warn("ADMIN_USER or ADMIN_PASSWORD env vars not set. Skipping seed.");
      return;
    }

    const existing = await ctx.runQuery(api.users.list);
    if (existing.length > 0) return;

    await createAccount(ctx, {
      provider: "password",
      account: { id: adminUser, secret: adminPassword },
      profile: { email: `${adminUser}@admin.local`, name: "Admin" },
    });

    console.log("Admin account created successfully");
  },
});
