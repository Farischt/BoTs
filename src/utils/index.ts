import { ENV } from "../config.json"

export { default as Logger } from "./Logger"
export const fileExtension = ENV === "production" ? ".js" : ".ts"
