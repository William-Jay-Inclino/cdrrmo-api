
import { Action, IRequiredRule } from "../../auth/entities";
import { Item } from "../entities";

export class CreateItemAbility implements IRequiredRule {
    action = Action.Create;
    subject = Item;
}

export class ReadItemAbility implements IRequiredRule {
    action = Action.Read;
    subject = Item;
}

export class UpdateItemAbility implements IRequiredRule {
    action = Action.Update;
    subject = Item;
}

export class DeleteItemAbility implements IRequiredRule {
    action = Action.Delete;
    subject = Item;
}
