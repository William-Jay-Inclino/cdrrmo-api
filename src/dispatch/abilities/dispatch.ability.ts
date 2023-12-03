
import { Action, IRequiredRule } from "../../auth/entities";
import { Dispatch } from "../entities";

export class CreateDispatchAbility implements IRequiredRule {
    action = Action.Create;
    subject = Dispatch;
}

export class ReadDispatchAbility implements IRequiredRule {
    action = Action.Read;
    subject = Dispatch;
}

export class UpdateDispatchAbility implements IRequiredRule {
    action = Action.Update;
    subject = Dispatch;
}

export class DeleteDispatchAbility implements IRequiredRule {
    action = Action.Delete;
    subject = Dispatch;
}
