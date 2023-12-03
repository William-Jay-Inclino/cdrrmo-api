
import { Action, IRequiredRule } from "../../auth/entities";
import { Emergency } from "../entities";

export class CreateEmergencyAbility implements IRequiredRule {
    action = Action.Create;
    subject = Emergency;
}

export class ReadEmergencyAbility implements IRequiredRule {
    action = Action.Read;
    subject = Emergency;
}

export class UpdateEmergencyAbility implements IRequiredRule {
    action = Action.Update;
    subject = Emergency;
}

export class DeleteEmergencyAbility implements IRequiredRule {
    action = Action.Delete;
    subject = Emergency;
}
