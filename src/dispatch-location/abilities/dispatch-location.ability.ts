
import { Action, IRequiredRule } from "../../auth/entities";
import { DispatchLocation } from "../entities";

export class CreateLocationAbility implements IRequiredRule {
    action = Action.Create;
    subject = DispatchLocation;
}

export class ReadLocationAbility implements IRequiredRule {
    action = Action.Read;
    subject = DispatchLocation;
}

export class UpdateLocationAbility implements IRequiredRule {
    action = Action.Update;
    subject = DispatchLocation;
}

export class DeleteLocationAbility implements IRequiredRule {
    action = Action.Delete;
    subject = DispatchLocation;
}
