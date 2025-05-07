import { Prop } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class ChatSession extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user1: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user2: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}
function Schema(): (target: typeof ChatSession) => void | typeof ChatSession {
    throw new Error("Function not implemented.");
}

