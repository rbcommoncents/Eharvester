-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "company" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Applied',
    "source" TEXT,
    "jobUrl" TEXT,
    "location" TEXT,
    "salary" TEXT,
    "notes" TEXT,
    "dateApplied" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT,
    "headline" TEXT,
    "remoteOnly" BOOLEAN NOT NULL DEFAULT false,
    "salaryTarget" TEXT,
    "yearsExperience" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileTargetTitle" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileTargetTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileLocation" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileSkill" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileCertification" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilePreferredSource" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfilePreferredSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileExcludedSource" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileExcludedSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSource" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "companyKey" TEXT NOT NULL,
    "baseUrl" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "lastStatus" TEXT,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPosting" (
    "id" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "applyUrl" TEXT NOT NULL,
    "source" TEXT,
    "sourceType" TEXT,
    "sourceKey" TEXT,
    "sourceJobId" TEXT,
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "postedAt" TIMESTAMP(3),
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPosting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobRecommendation" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "jobPostingId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "reasons" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileTargetTitle_value_key" ON "ProfileTargetTitle"("value");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileLocation_value_key" ON "ProfileLocation"("value");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileSkill_value_key" ON "ProfileSkill"("value");

-- CreateIndex
CREATE INDEX "JobSource_enabled_sourceType_idx" ON "JobSource"("enabled", "sourceType");

-- CreateIndex
CREATE UNIQUE INDEX "JobSource_sourceType_companyKey_key" ON "JobSource"("sourceType", "companyKey");

-- CreateIndex
CREATE UNIQUE INDEX "JobPosting_externalId_key" ON "JobPosting"("externalId");

-- CreateIndex
CREATE INDEX "JobPosting_company_idx" ON "JobPosting"("company");

-- CreateIndex
CREATE INDEX "JobPosting_title_idx" ON "JobPosting"("title");

-- CreateIndex
CREATE INDEX "JobPosting_sourceType_sourceKey_idx" ON "JobPosting"("sourceType", "sourceKey");

-- CreateIndex
CREATE INDEX "JobPosting_postedAt_idx" ON "JobPosting"("postedAt");

-- CreateIndex
CREATE INDEX "JobRecommendation_profileId_score_idx" ON "JobRecommendation"("profileId", "score");

-- CreateIndex
CREATE UNIQUE INDEX "JobRecommendation_profileId_jobPostingId_key" ON "JobRecommendation"("profileId", "jobPostingId");

-- AddForeignKey
ALTER TABLE "JobRecommendation" ADD CONSTRAINT "JobRecommendation_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRecommendation" ADD CONSTRAINT "JobRecommendation_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
