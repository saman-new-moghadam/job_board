/*
  Warnings:

  - You are about to drop the column `resume` on the `application` table. All the data in the column will be lost.
  - Added the required column `resumeKey` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `application` DROP COLUMN `resume`,
    ADD COLUMN `resumeKey` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `job` ADD COLUMN `imageKey` VARCHAR(191) NULL;
