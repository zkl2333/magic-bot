import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AiProxyService } from 'src/common/aiProxy/ai-proxy.service'

@Controller('test')
@ApiTags('test')
export class TestController {
  constructor(private readonly aiproxyService: AiProxyService) {}

  @Post('createLibrary')
  @ApiOperation({ summary: '测试创建库' })
  async test(@Body() { name, description }: { name: string; description: string }) {
    return this.aiproxyService.createLibrary(name, description)
  }

  @Post('createDocumentByUrl')
  @ApiOperation({ summary: '测试创建文档' })
  async test2(@Body() { libraryId, url }: { libraryId: number; url: string }) {
    return this.aiproxyService.createDocumentByURL(libraryId, url)
  }

  @Post('createDocumentByText')
  @ApiOperation({ summary: '测试创建文档' })
  async test4(@Body() { libraryId, title, text }: { libraryId: number; title: string; text: string }) {
    return this.aiproxyService.createDocumentByText(libraryId, title, text)
  }

  @Post('library/ask')
  @ApiOperation({ summary: '测试问答' })
  async test3(@Body() { libraryId, question }: { libraryId: number; question: string }) {
    return this.aiproxyService.libraryAsk(libraryId, question)
  }
}
