CREATE TABLE "PlayerProfileMap" (
	"PlayerID" int8 NOT NULL,
	"ProfileID" char(32) NOT NULL,
	"isMain" bool NOT NULL DEFAULT false
);

CREATE UNIQUE INDEX "undexPlayerProfileMap" ON "PlayerProfileMap" (
	"PlayerID",
	"ProfileID"
);

COMMENT ON TABLE "PlayerProfileMap" IS '玩家-档案';
COMMENT ON COLUMN "PlayerProfileMap"."PlayerID" IS '玩家ID';
COMMENT ON COLUMN "PlayerProfileMap"."ProfileID" IS '档案ID';
COMMENT ON COLUMN "PlayerProfileMap"."isMain" IS '是否主档案';