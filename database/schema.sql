DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

CREATE TABLE "public"."users" (
	"userId" serial NOT NULL,
	"userName" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"hash" TEXT NOT NULL,
	"streamKey" TEXT NOT NULL,
	"createdAt" timestamp with time zone NOT NULL DEFAULT NOW()
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."streams" (
	"streamId" integer NOT NULL,
	"channelId" integer NOT NULL,
	"viewers" integer NOT NULL DEFAULT '0',
	"previewImage" TEXT,
	"ip" inet NOT NULL,
	"createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
	CONSTRAINT "streams_pk" PRIMARY KEY ("streamId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."messages" (
	"messageId" serial,
	"userId" integer NOT NULL,
	"channelId" integer NOT NULL,
	"content" TEXT NOT NULL,
	"deleted" BOOLEAN NOT NULL DEFAULT 'false',
	"createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
	CONSTRAINT "messages_pk" PRIMARY KEY ("messageId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."bans" (
	"banId" serial NOT NULL,
	"userId" integer NOT NULL,
	"channelId" integer NOT NULL,
	"expires" timestamp with time zone,
	"createdAt" timestamp with time zone NOT NULL DEFAULT NOW()
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."emotes" (
	"emoteId" serial NOT NULL,
	"creatorId" integer NOT NULL,
	"urlLarge" TEXT NOT NULL,
	"match" TEXT NOT NULL,
	"public" BOOLEAN NOT NULL DEFAULT 'false',
	"createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
	CONSTRAINT "emotes_pk" PRIMARY KEY ("emoteId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."userEmotes" (
	"emoteId" integer NOT NULL,
	"userId" integer NOT NULL,
	"addedAt" timestamp with time zone NOT NULL DEFAULT NOW()
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."moderators" (
	"moderatorId" integer NOT NULL,
	"channelId" integer NOT NULL,
	CONSTRAINT "moderators_pk" PRIMARY KEY ("moderatorId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."followers" (
	"userId" integer NOT NULL,
	"followerId" integer NOT NULL,
	"createdAt" timestamp with time zone NOT NULL DEFAULT NOW()
) WITH (
  OIDS=FALSE
);

ALTER TABLE "streams" ADD CONSTRAINT "streams_fk0" FOREIGN KEY ("channelId") REFERENCES "users"("userId");

ALTER TABLE "userEmotes" ADD CONSTRAINT "userEmotes_fk0" FOREIGN KEY ("emoteId") REFERENCES "emotes"("emoteId");
