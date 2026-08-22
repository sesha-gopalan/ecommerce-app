-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "specs" TEXT[] DEFAULT ARRAY[]::TEXT[];
