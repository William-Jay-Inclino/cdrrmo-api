import { PureAbility, InferSubjects } from "@casl/ability";
import { User } from "src/user/entities";

export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}

export type Subjects = InferSubjects<typeof User> | 'all' // TODO: Add each model in typeof User | Dispatch | Team etc...

export type AppAbility = PureAbility<[Action, Subjects]>


export interface IRequiredRule {
    action: Action
    subject: Subjects
}