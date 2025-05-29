CREATE TABLE `clipboard_services` (
	`session_id` text NOT NULL,
	`service_id` text NOT NULL,
	PRIMARY KEY(`session_id`, `service_id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`address` text NOT NULL
);
