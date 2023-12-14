
import { Action, IRequiredRule } from "../../auth/entities";
import { ItemCategory } from "../entities";

export class CreateItemCategoryAbility implements IRequiredRule {
    action = Action.Create;
    subject = ItemCategory;
}

export class ReadItemCategoryAbility implements IRequiredRule {
    action = Action.Read;
    subject = ItemCategory;
}

export class UpdateItemCategoryAbility implements IRequiredRule {
    action = Action.Update;
    subject = ItemCategory;
}

export class DeleteItemCategoryAbility implements IRequiredRule {
    action = Action.Delete;
    subject = ItemCategory;
}
