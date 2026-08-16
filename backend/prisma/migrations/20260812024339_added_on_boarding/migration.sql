/*
  Warnings:

  - A unique constraint covering the columns `[tmdbId]` on the table `Show` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ShowSource" AS ENUM ('TMDB', 'MANUAL');

-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "isGL" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "originalTitle" TEXT,
ADD COLUMN     "seasons" INTEGER,
ADD COLUMN     "source" "ShowSource" NOT NULL DEFAULT 'TMDB',
ADD COLUMN     "tmdbId" INTEGER,
ALTER COLUMN "episodes" DROP NOT NULL;

-- CreateTable
CREATE TABLE "OnboardingShow" (
    "id" TEXT NOT NULL,
    "showId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "OnboardingShow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingShow_showId_key" ON "OnboardingShow"("showId");

-- CreateIndex
CREATE UNIQUE INDEX "Show_tmdbId_key" ON "Show"("tmdbId");

-- AddForeignKey
ALTER TABLE "OnboardingShow" ADD CONSTRAINT "OnboardingShow_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;
