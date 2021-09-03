CREATE TABLE "TagMeta" (
	"id" serial8 NOT NULL,
	"text" varchar(255) NOT NULL,
	PRIMARY KEY ("id")
);

COMMENT ON TABLE "TagMeta" IS '标签元';
COMMENT ON COLUMN "TagMeta"."id" IS 'ID';
COMMENT ON COLUMN "TagMeta"."text" IS '内容';