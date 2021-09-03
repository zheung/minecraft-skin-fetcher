CREATE TABLE "SkinTag" (
	"SkinHash" char(64) NOT NULL,
	"TagID" int8 NOT NULL,
	"order" int2 NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX "undexSkinTag" ON "SkinTag" (
	"SkinHash",
	"TagID"
);

COMMENT ON TABLE "SkinTag" IS '皮肤-标签';
COMMENT ON COLUMN "SkinTag"."SkinHash" IS '皮肤哈希';
COMMENT ON COLUMN "SkinTag"."TagID" IS '标签ID';
COMMENT ON COLUMN "SkinTag"."order" IS '顺序';