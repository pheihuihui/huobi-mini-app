import { CUSTOMCONNSTR_cosmosstring } from "./credentials";

export const mongodbstr = process.env.CUSTOMCONNSTR_cosmosstring ?? CUSTOMCONNSTR_cosmosstring
