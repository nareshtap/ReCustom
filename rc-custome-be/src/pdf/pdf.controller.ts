import { Controller, Get, Param, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';

@Controller('pdf')
export class PdfController {
    constructor(private readonly pdfService: PdfService) { }

    @Get('download/:userId')
    async downloadUserPdf(@Param('userId') userId: number, @Res() res: Response): Promise<void> {
        await this.pdfService.generateUserPdf(userId, res);
    }
}
