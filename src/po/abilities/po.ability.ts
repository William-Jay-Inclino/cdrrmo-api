
import { Action, IRequiredRule } from "../../auth/entities";
import { PO } from "../entities";

export class CreatePoAbility implements IRequiredRule {
    action = Action.Create;
    subject = PO;
}

export class ReadPoAbility implements IRequiredRule {
    action = Action.Read;
    subject = PO;
}

export class UpdatePoAbility implements IRequiredRule {
    action = Action.Update;
    subject = PO;
}

export class DeletePoAbility implements IRequiredRule {
    action = Action.Delete;
    subject = PO;
}
