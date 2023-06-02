import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AssistantsService } from './assistants.service';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Assistants')
@ApiBasicAuth()
@Controller('assistants')
export class AssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}

  @Post()
  create(@Body() createAssistantDto: CreateAssistantDto) {
    return this.assistantsService.create(createAssistantDto);
  }

  @Get()
  findAll() {
    return this.assistantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assistantsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssistantDto: UpdateAssistantDto,
  ) {
    return this.assistantsService.update(+id, updateAssistantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assistantsService.remove(+id);
  }
}
