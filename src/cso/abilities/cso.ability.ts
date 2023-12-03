
import { Action, IRequiredRule } from "../../auth/entities";
import { CSO } from "../entities";

export class CreateCsoAbility implements IRequiredRule {
    action = Action.Create;
    subject = CSO;
}

export class ReadCsoAbility implements IRequiredRule {
    action = Action.Read;
    subject = CSO;
}

export class UpdateCsoAbility implements IRequiredRule {
    action = Action.Update;
    subject = CSO;
}

export class DeleteCsoAbility implements IRequiredRule {
    action = Action.Delete;
    subject = CSO;
}

// TODO = add CRUD Abilities