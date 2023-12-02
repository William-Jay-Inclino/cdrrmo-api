import { User } from "src/user/entities";
import { Action, IRequiredRule } from "../entities";

export class ReadUserAbility implements IRequiredRule {
    action = Action.Read;
    subject = User;
}


// TODO = add CRUD Abilities