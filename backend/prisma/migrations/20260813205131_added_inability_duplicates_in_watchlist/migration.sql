/*
  Warnings:

  - A unique constraint covering the columns `[userID,showID]` on the table `WatchlistShowsItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WatchlistShowsItem_userID_showID_key" ON "WatchlistShowsItem"("userID", "showID");
