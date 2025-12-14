/*
  Warnings:

  - You are about to drop the column `serie` on the `exercise_series` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[series,exerciseEntryId]` on the table `exercise_series` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `series` to the `exercise_series` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "exercise_series_serie_exerciseEntryId_key";

-- AlterTable
ALTER TABLE "exercise_series" DROP COLUMN "serie",
ADD COLUMN     "series" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "exercise_series_series_exerciseEntryId_key" ON "exercise_series"("series", "exerciseEntryId");
