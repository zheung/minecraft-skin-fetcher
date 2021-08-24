CREATE TABLE "profileSnap" (
	"timeInsert" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"ProfileID" char(32) NOT NULL,
	"ProfileName" varchar(255) NOT NULL,
	"SkinHash" varchar(64) NOT NULL,
	"SkinModel" int8 NOT NULL
);

CREATE UNIQUE INDEX "indexProfileSnap" ON "profileSnap" (
	"ProfileID",
	"ProfileName",
	"SkinHash",
	"SkinModel"
);

COMMENT ON TABLE "profileSnap" IS '档案快照';
COMMENT ON COLUMN "profileSnap"."timeInsert" IS '插入时间';
COMMENT ON COLUMN "profileSnap"."ProfileID" IS '档案ID';
COMMENT ON COLUMN "profileSnap"."ProfileName" IS '档案名称';
COMMENT ON COLUMN "profileSnap"."SkinHash" IS '皮肤哈希';
COMMENT ON COLUMN "profileSnap"."SkinModel" IS '皮肤模型：0，经典；1，纤细';