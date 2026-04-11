import {
	timestamp,
	pgTable,
	uuid,
	varchar,
	numeric,
	index,
} from "drizzle-orm/pg-core";

export const customers = pgTable("customers", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const transactions = pgTable(
	"transactions",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		customerId: uuid("customer_id")
			.notNull()
			.references(() => customers.id, { onDelete: "cascade" }),
		amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	table => ({
		transactionsCustomerIdIdx: index("transactions_customer_id_idx").on(
			table.customerId,
		),
		transactionsCreatedAtIdx: index("transactions_created_at_idx").on(
			table.createdAt,
		),
	}),
);
