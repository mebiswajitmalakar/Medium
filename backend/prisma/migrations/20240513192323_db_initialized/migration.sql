-- CreateTable
CREATE TABLE "Users" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bio" TEXT,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "following" INTEGER NOT NULL DEFAULT 0,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "gender" TEXT NOT NULL,
    "date_of_birth" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Socials" (
    "id" TEXT NOT NULL,
    "instagram" TEXT,
    "email" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,

    CONSTRAINT "Socials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blogs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "last_modified" TIMESTAMP(3) NOT NULL,
    "read_minutes" INTEGER NOT NULL DEFAULT 0,
    "claps" INTEGER NOT NULL DEFAULT 0,
    "responds" INTEGER NOT NULL DEFAULT 0,
    "topics" TEXT[],

    CONSTRAINT "Blogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Socials_instagram_key" ON "Socials"("instagram");

-- CreateIndex
CREATE UNIQUE INDEX "Socials_email_key" ON "Socials"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Socials_twitter_key" ON "Socials"("twitter");

-- CreateIndex
CREATE UNIQUE INDEX "Socials_linkedin_key" ON "Socials"("linkedin");

-- AddForeignKey
ALTER TABLE "Socials" ADD CONSTRAINT "Socials_id_fkey" FOREIGN KEY ("id") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "Blogs_id_fkey" FOREIGN KEY ("id") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
