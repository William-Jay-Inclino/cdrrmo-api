import { PureAbility, InferSubjects } from "@casl/ability";
import { User, UserSkill } from "src/user/entities";
import { Action } from ".";
import { CSO } from "src/cso/entities";
import { BART } from "src/bart/entities"
import { Dispatch } from "src/dispatch/entities";
import { Emergency } from "src/emergency/entities";
import { Na } from "src/na/entities";
import { PO } from "src/po/entities";
import { Team, TeamMember } from "src/team/entities";
import { TrainingSkill } from "src/training-skill/entities";
import { DispatchLocation } from "src/dispatch-location/entities";
import { ItemCategory } from "src/item-category/entities";

export type Subjects = InferSubjects<
    typeof BART | 
    typeof CSO | 
    typeof Dispatch | 
    typeof Emergency | 
    typeof Na | 
    typeof PO | 
    typeof Team | 
    typeof TeamMember | 
    typeof TrainingSkill | 
    typeof User | 
    typeof DispatchLocation | 
    typeof UserSkill | 
    typeof ItemCategory
> | 'all' 

export type AppAbility = PureAbility<[Action, Subjects]>


export interface IRequiredRule {
    action: Action
    subject: Subjects
}