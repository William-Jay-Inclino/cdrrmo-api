
import { Action, IRequiredRule } from "../../auth/entities";
import { TrainingSkill } from "../entities";

export class CreateTrainingSkillAbility implements IRequiredRule {
    action = Action.Create;
    subject = TrainingSkill;
}

export class ReadTrainingSkillAbility implements IRequiredRule {
    action = Action.Read;
    subject = TrainingSkill;
}

export class UpdateTrainingSkillAbility implements IRequiredRule {
    action = Action.Update;
    subject = TrainingSkill;
}

export class DeleteTrainingSkillAbility implements IRequiredRule {
    action = Action.Delete;
    subject = TrainingSkill;
}
