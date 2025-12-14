/*
  Warnings:

  - You are about to drop the column `serieWeight` on the `exercise_series` table. All the data in the column will be lost.
  - Added the required column `seriesWeight` to the `exercise_series` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exercise_series" DROP COLUMN "serieWeight",
ADD COLUMN     "seriesWeight" DOUBLE PRECISION NOT NULL;
