CREATE TABLE `releases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project` text NOT NULL,
	`tag` text NOT NULL,
	`prev_tag` text,
	`environment` text NOT NULL,
	`trigger_user` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`release_id` integer NOT NULL,
	`ticket_key` text NOT NULL,
	FOREIGN KEY (`release_id`) REFERENCES `releases`(`id`) ON UPDATE no action ON DELETE cascade
);
