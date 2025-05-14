

import { Transform, Type } from "class-transformer"
import { IsMongoId, IsNotEmpty, IsDate, IsIn, IsBoolean, ValidateIf } from "class-validator"
import { Types } from "mongoose"
import { BadRequestException } from "@nestjs/common"

export class CreateAppointmentDto {
  @IsMongoId({ message: "receiverId doit être un ID MongoDB valide" })
  @Transform(({ value }) => {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException("ID MongoDB invalide")
    }
    return new Types.ObjectId(value)
  })
  receiverId: Types.ObjectId

  @IsNotEmpty()
  title: string

  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return new Date(value)
    }
    return value
  })
  start: Date

  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return new Date(value)
    }
    return value
  })
  end: Date

  @IsIn(["meeting", "fiscal_deadline", "client_meeting"])
  type: string

  @ValidateIf((o) => o.type === "fiscal_deadline")
  @IsBoolean()
  isFiscalDeadline: boolean
}
