/*
  Warnings:

  - You are about to drop the column `series` on the `exercise_series` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[set,exerciseEntryId]` on the table `exercise_series` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `set` to the `exercise_series` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "exercise_entries" DROP CONSTRAINT "exercise_entries_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "exercise_series" DROP CONSTRAINT "exercise_series_exerciseEntryId_fkey";

-- DropIndex
DROP INDEX "exercise_series_series_exerciseEntryId_key";

-- AlterTable
ALTER TABLE "exercise_series" DROP COLUMN "series",
ADD COLUMN     "set" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "exercise_series_set_exerciseEntryId_key" ON "exercise_series"("set", "exerciseEntryId");

-- AddForeignKey
ALTER TABLE "exercise_entries" ADD CONSTRAINT "exercise_entries_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_series" ADD CONSTRAINT "exercise_series_exerciseEntryId_fkey" FOREIGN KEY ("exerciseEntryId") REFERENCES "exercise_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
