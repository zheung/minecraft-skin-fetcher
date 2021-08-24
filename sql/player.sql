CREATE TABLE "player" (
	"id" serial8 NOT NULL,
	"nick" varchar(255) NOT NULL,
	"ProfileMainID" char(32) NOT NULL,
	"ProfileSubsIDs" char(32)[] NOT NULL,
	PRIMARY KEY ("id")
);

COMMENT ON TABLE "player" IS '玩家';
COMMENT ON COLUMN "player"."id" IS 'ID';
COMMENT ON COLUMN "player"."nick" IS '昵称';
COMMENT ON COLUMN "player"."ProfileMainID" IS '主档案ID';
COMMENT ON COLUMN "player"."ProfileSubsIDs" IS '次档案ID';