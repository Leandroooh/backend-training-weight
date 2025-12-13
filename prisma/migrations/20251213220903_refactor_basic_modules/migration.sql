/*
  Warnings:

  - You are about to drop the column `series` on the `exercise_entries` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `exercise_entries` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exercise_entries" DROP COLUMN "series",
DROP COLUMN "weight";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "exercise_series" (
    "id" TEXT NOT NULL,
    "serie" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "serieWeight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exerciseEntryId" TEXT NOT NULL,

    CONSTRAINT "exercise_series_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exercise_series_serie_exerciseEntryId_key" ON "exercise_series"("serie", "exerciseEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "exercise_series" ADD CONSTRAINT "exercise_series_exerciseEntryId_fkey" FOREIGN KEY ("exerciseEntryId") REFERENCES "exercise_entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
