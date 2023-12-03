import { User } from "src/user/entities";
import { Action, IRequiredRule } from "../../auth/entities";

export class CreateUserAbility implements IRequiredRule {
    action = Action.Create;
    subject = User;
}

export class ReadUserAbility implements IRequiredRule {
    action = Action.Read;
    subject = User;
}

export class UpdateUserAbility implements IRequiredRule {
    action = Action.Update;
    subject = User;
}

export class DeleteUserAbility implements IRequiredRule {
    action = Action.Delete;
    subject = User;
}
