
import { Action, IRequiredRule } from "../../auth/entities";
import { Na } from "../entities";

export class CreateNaAbility implements IRequiredRule {
    action = Action.Create;
    subject = Na;
}

export class ReadNaAbility implements IRequiredRule {
    action = Action.Read;
    subject = Na;
}

export class UpdateNaAbility implements IRequiredRule {
    action = Action.Update;
    subject = Na;
}

export class DeleteNaAbility implements IRequiredRule {
    action = Action.Delete;
    subject = Na;
}
