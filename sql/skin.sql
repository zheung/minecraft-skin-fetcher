CREATE TABLE "skin" (
	"hash" varchar(64) NOT NULL,
	"data" bytea NOT NULL,
	PRIMARY KEY ("hash")
);

COMMENT ON TABLE "skin" IS '皮肤';
COMMENT ON COLUMN "skin"."hash" IS '哈希';
COMMENT ON COLUMN "skin"."data" IS '数据';