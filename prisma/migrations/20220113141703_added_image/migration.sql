/*
  Warnings:

  - Added the required column `image` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "bestpost" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "image" TEXT NOT NULL;
