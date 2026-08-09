-- DropIndex
DROP INDEX "categories_slug_key";

-- DropIndex
DROP INDEX "difficulties_slug_key";

-- DropIndex
DROP INDEX "grades_slug_key";

-- DropIndex
DROP INDEX "themes_slug_key";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'fr';

-- AlterTable
ALTER TABLE "difficulties" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'fr';

-- AlterTable
ALTER TABLE "grades" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'fr';

-- AlterTable
ALTER TABLE "themes" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'fr';

-- CreateIndex
CREATE INDEX "categories_locale_idx" ON "categories"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "categories_locale_slug_key" ON "categories"("locale", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "difficulties_locale_slug_key" ON "difficulties"("locale", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "grades_locale_slug_key" ON "grades"("locale", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "themes_locale_slug_key" ON "themes"("locale", "slug");