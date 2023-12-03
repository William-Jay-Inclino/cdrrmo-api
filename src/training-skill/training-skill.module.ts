import { Module } from '@nestjs/common';
import { TrainingSkillService } from './training-skill.service';
import { TrainingSkillController } from './training-skill.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrainingSkillController],
  providers: [TrainingSkillService],
})
export class TrainingSkillModule {}
