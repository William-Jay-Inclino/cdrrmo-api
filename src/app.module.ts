import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TrainingSkillModule } from './training-skill/training-skill.module';
import { EmergencyModule } from './emergency/emergency.module';
import { BartModule } from './bart/bart.module';
import { CsoModule } from './cso/cso.module';
import { PoModule } from './po/po.module';
import { NaModule } from './na/na.module';
import { UserModule } from './user/user.module';
import { SeederModule } from './prisma/seeder/seeder.module';
import { TeamModule } from './team/team.module';
import { DispatchModule } from './dispatch/dispatch.module';
import { AuthModule } from './auth/auth.module';
import { ReportModule } from './report/report.module';
import { LocationModule } from './dispatch-location/location.module';
import { ItemCategoryModule } from './item-category/item-category.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule, 
    TrainingSkillModule, 
    EmergencyModule, 
    BartModule, 
    CsoModule, 
    PoModule, 
    NaModule, 
    UserModule, 
    SeederModule,
    TeamModule,
    DispatchModule,
    AuthModule,
    ReportModule,
    LocationModule,
    ItemCategoryModule,
    ItemModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
