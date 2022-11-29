import { TagGroupModel } from "./TagGroupModel";

export interface TagModel {
    id: string;
    name: string,
    group: TagGroupModel,
}