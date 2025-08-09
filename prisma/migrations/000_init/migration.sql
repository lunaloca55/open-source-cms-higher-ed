-- Prisma migration for initial schema
CREATE TABLE "User" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "name" TEXT,
  "email" TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT,
  "role" TEXT NOT NULL DEFAULT 'EnrollmentSpecialist',
  "phone" TEXT,
  "notificationPrefs" JSONB
);

CREATE TABLE "Program" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "code" TEXT UNIQUE NOT NULL,
  "school" TEXT,
  "level" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TYPE "LeadStage" AS ENUM ('Lead','Interested','Applied','Accepted','Deposited','Matriculated');
CREATE TYPE "LeadTemperature" AS ENUM ('Cold','Warm','Hot','Nonresponsive');

CREATE TABLE "Lead" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "phone" TEXT,
  "street" TEXT,
  "city" TEXT,
  "state" TEXT,
  "postal" TEXT,
  "country" TEXT,
  "programOfInterestId" UUID NOT NULL REFERENCES "Program"("id"),
  "birthDate" DATE,
  "stage" "LeadStage" NOT NULL DEFAULT 'Lead',
  "temperature" "LeadTemperature" NOT NULL DEFAULT 'Cold',
  "ownerId" UUID REFERENCES "User"("id"),
  "consentEmail" BOOLEAN NOT NULL,
  "consentSms" BOOLEAN NOT NULL,
  "privacyAcceptedAt" TIMESTAMP,
  "utmSource" TEXT,
  "utmMedium" TEXT,
  "utmCampaign" TEXT,
  "utmContent" TEXT,
  "utmTerm" TEXT,
  "referrer" TEXT,
  "firstTouchAt" TIMESTAMP,
  "lastTouchAt" TIMESTAMP
);

CREATE TYPE "CommunicationType" AS ENUM ('sms','email');
CREATE TYPE "CommunicationDirection" AS ENUM ('out','in');
CREATE TYPE "CommunicationStatus" AS ENUM ('queued','sent','delivered','failed','bounced');
CREATE TABLE "Communication" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "leadId" UUID NOT NULL REFERENCES "Lead"("id"),
  "userId" UUID REFERENCES "User"("id"),
  "type" "CommunicationType" NOT NULL,
  "direction" "CommunicationDirection" NOT NULL,
  "status" "CommunicationStatus" NOT NULL,
  "subject" TEXT,
  "body" TEXT,
  "providerMessageId" TEXT,
  "sentAt" TIMESTAMP,
  "error" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TYPE "FormStatus" AS ENUM ('draft','published');
CREATE TABLE "Form" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "status" "FormStatus" NOT NULL DEFAULT 'draft',
  "embedScript" TEXT,
  "createdById" UUID REFERENCES "User"("id")
);

CREATE TABLE "FormField" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "formId" UUID NOT NULL REFERENCES "Form"("id"),
  "key" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "required" BOOLEAN NOT NULL DEFAULT FALSE,
  "options" JSONB,
  "mapToLeadField" TEXT
);

CREATE TABLE "Submission" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "formId" UUID NOT NULL REFERENCES "Form"("id"),
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "leadId" UUID REFERENCES "Lead"("id"),
  "matchedBy" TEXT
);

CREATE TYPE "TrackingEventType" AS ENUM ('page_view','form_view','form_submit','email_open','sms_click','email_reply','sms_reply','custom');
CREATE TABLE "TrackingEvent" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "occurredAt" TIMESTAMP NOT NULL,
  "event" "TrackingEventType" NOT NULL,
  "meta" JSONB,
  "sessionId" TEXT,
  "leadId" UUID REFERENCES "Lead"("id")
);

CREATE TABLE "Report" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "ownerId" UUID REFERENCES "User"("id"),
  "filters" JSONB,
  "columns" JSONB,
  "sorts" JSONB,
  "shared" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "AuditLog" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "occurredAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "userId" UUID REFERENCES "User"("id"),
  "entity" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "diff" JSONB
);

CREATE TABLE "Config" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" TEXT UNIQUE NOT NULL,
  "value" JSONB
);
