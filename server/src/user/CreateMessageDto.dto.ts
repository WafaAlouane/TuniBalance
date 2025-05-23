import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  sender: string;

  @IsNotEmpty()
  receiver: string;

  @IsNotEmpty()
  content: string;
}
