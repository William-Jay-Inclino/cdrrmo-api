
import { Action, IRequiredRule } from "../../auth/entities";
import { TeamMember } from "../entities";

export class CreateTeamMemberAbility implements IRequiredRule {
    action = Action.Create;
    subject = TeamMember;
}

export class ReadTeamMemberAbility implements IRequiredRule {
    action = Action.Read;
    subject = TeamMember;
}

export class DeleteTeamMemberAbility implements IRequiredRule {
    action = Action.Delete;
    subject = TeamMember;
}
