import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/UpdateTransactionDto';


@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // Endpoint to create a transaction
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  // Endpoint to get all transactions
  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }
  @Get('compte-resultat')
  getCompteResultat() {
      return this.transactionsService.getCompteResultat();
  }

  // Endpoint to get a specific transaction by its ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  // Endpoint to update a transaction
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  // Endpoint to remove a transaction by its ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
<<<<<<< HEAD
  
  

}
=======
}
>>>>>>> d0c5e5d5800e28ed728221b648e9d533228c8fa6
