CREATE TABLE "Skin" (
	"hash" varchar(64) NOT NULL,
	"data" bytea NOT NULL,
	PRIMARY KEY ("hash")
);

COMMENT ON TABLE "Skin" IS '皮肤';
COMMENT ON COLUMN "Skin"."hash" IS '哈希';
COMMENT ON COLUMN "Skin"."data" IS '数据';