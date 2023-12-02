import { SetMetadata } from "@nestjs/common";
import { IRequiredRule } from "../entities";

export const CHECK_ABILITY = 'check_ability'

export const CheckAbilities = (...requirements: IRequiredRule[]) => {
    return SetMetadata(CHECK_ABILITY, requirements)
}


