-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('GRADE', 'THEME', 'SEASONAL', 'DIFFICULTY', 'AUDIENCE', 'PRESS_BRAND', 'COMBO');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'EDITOR');

-- CreateTable
CREATE TABLE "grades" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age_range" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "default_grid_size" INTEGER NOT NULL,
    "seo_title" TEXT,
    "meta_description" TEXT,
    "intro_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "themes" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "icon_url" TEXT,
    "is_seasonal" BOOLEAN NOT NULL DEFAULT false,
    "active_date_start" TEXT,
    "active_date_end" TEXT,
    "seo_title" TEXT,
    "meta_description" TEXT,
    "intro_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theme_words" (
    "id" TEXT NOT NULL,
    "theme_id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "min_grade_order" INTEGER NOT NULL,

    CONSTRAINT "theme_words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "difficulties" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grid_size_min" INTEGER NOT NULL,
    "grid_size_max" INTEGER NOT NULL,
    "word_count_min" INTEGER NOT NULL,
    "word_count_max" INTEGER NOT NULL,
    "directions" TEXT[],

    CONSTRAINT "difficulties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "press_brands" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "seo_title" TEXT,
    "meta_description" TEXT,

    CONSTRAINT "press_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "type" "CategoryType" NOT NULL,
    "slug" TEXT NOT NULL,
    "parent_category_id" TEXT,
    "grade_id" TEXT,
    "theme_id" TEXT,
    "difficulty_id" TEXT,
    "press_brand_id" TEXT,
    "seo_title" TEXT NOT NULL,
    "meta_description" TEXT NOT NULL,
    "h1" TEXT NOT NULL,
    "intro_text" TEXT NOT NULL,
    "faq_json" JSONB,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "min_puzzle_threshold" INTEGER NOT NULL DEFAULT 4,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "puzzles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "grid_data" JSONB NOT NULL,
    "word_list" JSONB NOT NULL,
    "solution_data" JSONB NOT NULL,
    "size" INTEGER NOT NULL,
    "difficulty_id" TEXT NOT NULL,
    "grade_id" TEXT,
    "theme_id" TEXT,
    "language" TEXT NOT NULL DEFAULT 'fr',
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "large_print" BOOLEAN NOT NULL DEFAULT false,
    "pdf_url" TEXT,
    "thumbnail_url" TEXT,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "print_count" INTEGER NOT NULL DEFAULT 0,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "puzzles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_puzzles" (
    "category_id" TEXT NOT NULL,
    "puzzle_id" TEXT NOT NULL,

    CONSTRAINT "category_puzzles_pkey" PRIMARY KEY ("category_id","puzzle_id")
);

-- CreateTable
CREATE TABLE "redirects" (
    "id" TEXT NOT NULL,
    "from_path" TEXT NOT NULL,
    "to_path" TEXT NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 301,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redirects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_meta_overrides" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "title" TEXT,
    "meta_description" TEXT,
    "og_image" TEXT,
    "canonical_override" TEXT,

    CONSTRAINT "seo_meta_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "puzzle_id" TEXT,
    "session_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'EDITOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "grades_slug_key" ON "grades"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "themes_slug_key" ON "themes"("slug");

-- CreateIndex
CREATE INDEX "theme_words_theme_id_idx" ON "theme_words"("theme_id");

-- CreateIndex
CREATE UNIQUE INDEX "difficulties_slug_key" ON "difficulties"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "press_brands_slug_key" ON "press_brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_press_brand_id_key" ON "categories"("press_brand_id");

-- CreateIndex
CREATE INDEX "categories_type_idx" ON "categories"("type");

-- CreateIndex
CREATE INDEX "categories_status_idx" ON "categories"("status");

-- CreateIndex
CREATE UNIQUE INDEX "puzzles_slug_key" ON "puzzles"("slug");

-- CreateIndex
CREATE INDEX "puzzles_slug_idx" ON "puzzles"("slug");

-- CreateIndex
CREATE INDEX "puzzles_theme_id_idx" ON "puzzles"("theme_id");

-- CreateIndex
CREATE INDEX "puzzles_grade_id_idx" ON "puzzles"("grade_id");

-- CreateIndex
CREATE INDEX "puzzles_difficulty_id_idx" ON "puzzles"("difficulty_id");

-- CreateIndex
CREATE INDEX "puzzles_status_idx" ON "puzzles"("status");

-- CreateIndex
CREATE INDEX "category_puzzles_category_id_idx" ON "category_puzzles"("category_id");

-- CreateIndex
CREATE INDEX "category_puzzles_puzzle_id_idx" ON "category_puzzles"("puzzle_id");

-- CreateIndex
CREATE UNIQUE INDEX "redirects_from_path_key" ON "redirects"("from_path");

-- CreateIndex
CREATE UNIQUE INDEX "seo_meta_overrides_path_key" ON "seo_meta_overrides"("path");

-- CreateIndex
CREATE INDEX "analytics_events_puzzle_id_idx" ON "analytics_events"("puzzle_id");

-- CreateIndex
CREATE INDEX "analytics_events_event_type_idx" ON "analytics_events"("event_type");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- AddForeignKey
ALTER TABLE "theme_words" ADD CONSTRAINT "theme_words_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_difficulty_id_fkey" FOREIGN KEY ("difficulty_id") REFERENCES "difficulties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_press_brand_id_fkey" FOREIGN KEY ("press_brand_id") REFERENCES "press_brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "puzzles" ADD CONSTRAINT "puzzles_difficulty_id_fkey" FOREIGN KEY ("difficulty_id") REFERENCES "difficulties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "puzzles" ADD CONSTRAINT "puzzles_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "puzzles" ADD CONSTRAINT "puzzles_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_puzzles" ADD CONSTRAINT "category_puzzles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_puzzles" ADD CONSTRAINT "category_puzzles_puzzle_id_fkey" FOREIGN KEY ("puzzle_id") REFERENCES "puzzles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
