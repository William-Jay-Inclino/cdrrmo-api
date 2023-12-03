
import { Action, IRequiredRule } from "../../auth/entities";
import { Team } from "../entities";

export class CreateTeamAbility implements IRequiredRule {
    action = Action.Create;
    subject = Team;
}

export class ReadTeamAbility implements IRequiredRule {
    action = Action.Read;
    subject = Team;
}

export class UpdateTeamAbility implements IRequiredRule {
    action = Action.Update;
    subject = Team;
}

export class DeleteTeamAbility implements IRequiredRule {
    action = Action.Delete;
    subject = Team;
}
