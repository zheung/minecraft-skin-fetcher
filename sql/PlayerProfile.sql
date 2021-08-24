CREATE TABLE "PlayerProfile" (
	"PlayerID" int8 NOT NULL,
	"ProfileID" char(32) NOT NULL,
	"isMain" bool NOT NULL
);

CREATE UNIQUE INDEX "undexPlayerProfile" ON "PlayerProfile" (
	"PlayerID",
	"ProfileID"
);

COMMENT ON TABLE "PlayerProfile" IS '玩家档案关系';
COMMENT ON COLUMN "PlayerProfile"."PlayerID" IS '玩家ID';
COMMENT ON COLUMN "PlayerProfile"."ProfileID" IS '档案ID';
COMMENT ON COLUMN "PlayerProfile"."isMain" IS '是否主档案';