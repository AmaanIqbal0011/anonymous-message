import { Message } from "@/model/User";

export interface ApiResponse {
success : boolean;
message : string;
isAcceptingMessages ?: boolean | any
messages ?: Array<Message>

}