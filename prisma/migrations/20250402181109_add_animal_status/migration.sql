-- CreateEnum
CREATE TYPE "AnimalStatus" AS ENUM ('FOSTER', 'ADOPTION');

-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "status" "AnimalStatus" NOT NULL DEFAULT 'ADOPTION';
