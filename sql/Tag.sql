CREATE TABLE "Tag" (
	"id" serial8 NOT NULL,
	"text" varchar(255) NOT NULL,
	"TagMetaID" varchar(255) NOT NULL,
	PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "undexTag" ON "Tag" (
	"text",
	"TagMetaID"
);

COMMENT ON TABLE "Tag" IS '标签';
COMMENT ON COLUMN "Tag"."id" IS 'ID';
COMMENT ON COLUMN "Tag"."text" IS '内容';
COMMENT ON COLUMN "Tag"."TagMetaID" IS '标签元ID';