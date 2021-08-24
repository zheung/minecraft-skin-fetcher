CREATE TABLE "Player" (
	"id" serial8 NOT NULL,
	"nick" varchar(255) NOT NULL,
	PRIMARY KEY ("id")
);

COMMENT ON TABLE "Player" IS '玩家';
COMMENT ON COLUMN "Player"."id" IS 'ID';
COMMENT ON COLUMN "Player"."nick" IS '昵称';