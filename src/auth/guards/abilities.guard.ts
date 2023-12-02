// guard for user permissions

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AbilityFactory } from "../abilities/ability.factory";
import { IRequiredRule } from "../entities";
import { CHECK_ABILITY } from "../abilities/ability.decorator";


@Injectable()
export class AbilitiesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: AbilityFactory,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const rules = this.reflector.get<IRequiredRule[]>(CHECK_ABILITY, context.getHandler()) || []
        const { user } = context.switchToHttp().getRequest()

        console.log('user', user)
        const ability = this.caslAbilityFactory.defineAbility(user)

        try {
            
            // rules.forEach( (rule) => ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject))
            // return true

            return rules.every( (rule) => ability.can(rule.action, rule.subject))

        } catch (error) {
            throw new ForbiddenException()
        }

    }

}