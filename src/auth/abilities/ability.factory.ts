// user permissions

import { AbilityBuilder, AbilityClass, ExtractSubjectType, PureAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action, AppAbility, Subjects } from "../entities";
import { User, UserLevelEnum, UserSkill } from "src/user/entities";
import { Dispatch } from "src/dispatch/entities";
import { Emergency } from "src/emergency/entities";
import { Team, TeamMember } from "src/team/entities";
import { TrainingSkill } from "src/training-skill/entities";

@Injectable()
export class AbilityFactory{
    defineAbility(user: User){

        console.log('user', user)

        const { can, cannot, build } = new AbilityBuilder(PureAbility as AbilityClass<AppAbility>)

        // admin can manage all
        if (user.user_level === UserLevelEnum.Admin){
            can(Action.Manage, 'all')
        } 
        
        // dispatcher can only manage dispatch module but allows to read other modules related in dispatch module;
        // dispatcher can also update own profile
        else if (user.user_level === UserLevelEnum.Dispatcher) {
            can(Action.Manage, Dispatch)
            can(Action.Read, [Emergency, Team, TeamMember, TrainingSkill, User, UserSkill])
            can(Action.Update, User, { id: user.id }); // Allow updating own profile
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
