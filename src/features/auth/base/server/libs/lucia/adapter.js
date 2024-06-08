import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { sessions, users } from "../../../../../../server/db/schema";
import { db } from "../../../../../../server/db";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export default adapter;
