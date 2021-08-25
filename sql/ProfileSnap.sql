CREATE TABLE "ProfileSnap" (
	"timeInsert" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"ProfileID" char(32) NOT NULL,
	"ProfileName" varchar(255) NOT NULL,
	"SkinHash" char(64) NOT NULL,
	"SkinModel" int8 NOT NULL
);

CREATE UNIQUE INDEX "undexProfileSnap" ON "ProfileSnap" (
	"ProfileID",
	"ProfileName",
	"SkinHash",
	"SkinModel"
);

COMMENT ON TABLE "ProfileSnap" IS '档案快照';
COMMENT ON COLUMN "ProfileSnap"."timeInsert" IS '插入时间';
COMMENT ON COLUMN "ProfileSnap"."ProfileID" IS '档案ID';
COMMENT ON COLUMN "ProfileSnap"."ProfileName" IS '档案名称';
COMMENT ON COLUMN "ProfileSnap"."SkinHash" IS '皮肤哈希';
COMMENT ON COLUMN "ProfileSnap"."SkinModel" IS '皮肤模型：0，经典；1，纤细';