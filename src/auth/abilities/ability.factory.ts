// user permissions

import { AbilityBuilder, AbilityClass, ExtractSubjectType, PureAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action, AppAbility, Subjects } from "../entities";
import { User, UserLevelEnum } from "src/user/entities";
import { Dispatch } from "src/dispatch/entities";

@Injectable()
export class AbilityFactory{
    defineAbility(user: User){

        console.log('AbilityFactory: defineAbility')

        const { can, cannot, build } = new AbilityBuilder(PureAbility as AbilityClass<AppAbility>)

        // admin can manage all
        if (user.user_level === UserLevelEnum.Admin){
            can(Action.Manage, 'all')
        } 
        
        // dispatcher can only manage dispatch module
        // allow dispatcher to read and update user; There is a validation in controller wherein only dispatcher can read/update own data
        else if (user.user_level === UserLevelEnum.Dispatcher) {
            can(Action.Manage, Dispatch)
            can(Action.Read, User)
            can(Action.Update, User)
        } 
        
        // TODO: Set permissions for other user levels (Team lead & Field operator)
        // for now disallow permissions...
        else {
            cannot(Action.Manage, 'all')
        }

        return build({
            detectSubjectType: (item) => {
                return item.constructor as ExtractSubjectType<Subjects>
            }
        })

    }
}
