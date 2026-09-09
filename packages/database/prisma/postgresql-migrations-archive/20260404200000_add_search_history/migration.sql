CREATE TABLE "SearchHistory" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SearchHistory_query_key" ON "SearchHistory"("query");
