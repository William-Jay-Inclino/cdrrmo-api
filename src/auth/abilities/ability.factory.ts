// user permissions

import { AbilityBuilder, AbilityClass, ExtractSubjectType, PureAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action, AppAbility, Subjects } from "../entities";
import { User, UserLevelEnum } from "src/user/entities";

@Injectable()
export class AbilityFactory{
    defineAbility(user: User){

        console.log('user', user)

        const { can, build } = new AbilityBuilder(PureAbility as AbilityClass<AppAbility>)

        if (user.user_level === UserLevelEnum.Admin){
            can(Action.Manage, User)
        } else {
            // TODO = set permissions per user level
            can(Action.Update, User)
        }

        return build({
            detectSubjectType: (item) => {
                return item.constructor as ExtractSubjectType<Subjects>
            }
        })

    }
}
