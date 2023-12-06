
import { Action, IRequiredRule } from "../../auth/entities";
import { BART } from "../entities";

export class CreateBartAbility implements IRequiredRule {
    action = Action.Create;
    subject = BART;
}

export class ReadBartAbility implements IRequiredRule {
    action = Action.Read;
    subject = BART;
}

export class UpdateBartAbility implements IRequiredRule {
    action = Action.Update;
    subject = BART;
}

export class DeleteBartAbility implements IRequiredRule {
    action = Action.Delete;
    subject = BART;
}

// TODO = add CRUD Abilities