import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { UsersModule } from 'src/users/users.module';
import { ActivityLogsModule } from 'src/activity-logs/activity-logs.module';

@Module({
    imports: [
        UsersModule,
        ActivityLogsModule
    ],
    controllers: [PdfController],
    providers: [PdfService],
})
export class PdfModule { }
