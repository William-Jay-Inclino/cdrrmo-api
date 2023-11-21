-- CreateTable
CREATE TABLE "dispatch" (
    "id" TEXT NOT NULL,
    "dispatcher_id" TEXT NOT NULL,
    "emergency_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "caller_name" TEXT NOT NULL,
    "caller_number" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "num_people_involved" INTEGER NOT NULL,
    "hazard" TEXT NOT NULL,
    "time_dispatch" TIMESTAMP(3),
    "time_proceeding" TIMESTAMP(3),
    "time_arrival" TIMESTAMP(3),
    "time_proceeding_hospital" TIMESTAMP(3),
    "time_arrival_hospital" TIMESTAMP(3),
    "time_back_to_base" TIMESTAMP(3),
    "time_arrival_to_base" TIMESTAMP(3),
    "remarks" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dispatch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_dispatcher_id_fkey" FOREIGN KEY ("dispatcher_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_emergency_id_fkey" FOREIGN KEY ("emergency_id") REFERENCES "emergencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
