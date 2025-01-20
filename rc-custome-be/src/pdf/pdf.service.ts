import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ActivityLogsService } from 'src/activity-logs/activity-logs.service';
import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';
import { ActivityLogType } from 'src/activity-logs/enum/activity-log-type.enum';

@Injectable()
export class PdfService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly activityLogsService: ActivityLogsService,
    ) { }

    async generateUserPdf(userId: number, res: Response): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['activityLogs'],
        });

        if (!user) {
            throw new Error('User not found');
        }

        const { metrics: { logins, downloads }
        } = await this.activityLogsService.getUserMetrics(userId);

        await this.activityLogsService.createLog(userId, ActivityLogType.PDF_DOWNLOAD, new Date());

        const pdfDirectory = join(__dirname, '..', '..', 'uploads', 'pdfs');
        if (!fs.existsSync(pdfDirectory)) {
            fs.mkdirSync(pdfDirectory, { recursive: true });
        }

        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const filename = `${user.name}-activity-report.pdf`;
        const filePath = join(pdfDirectory, filename);

        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        doc.fontSize(22).text('User Activity Report', { align: 'center' });
        doc.moveDown(2);

        doc.fontSize(14).text('User Details:', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Name: ${user.name}`);
        doc.text(`Email: ${user.email}`);
        doc.text(`Role: ${user.role}`);
        doc.moveDown(2);

        doc.fontSize(14).text('Metrics:', { underline: true });
        doc.moveDown(0.5);
        doc.text(`Total Logins: ${logins || 0}`);
        doc.text(`Total Downloads: ${downloads || 0}`);
        doc.moveDown(2);

        doc.fontSize(14).text('Recent Activity:', { underline: true });
        doc.moveDown(0.5);

        const tableStartX = doc.x;
        const tableStartY = doc.y;
        const columnWidths = { timestamp: 250, type: 200 };

        doc.rect(tableStartX, tableStartY, columnWidths.timestamp + columnWidths.type, 20).fill('#f0f0f0');
        doc.fillColor('#000');

        doc.fontSize(12).text('Timestamp', tableStartX + 5, tableStartY + 5, { width: columnWidths.timestamp - 10, align: 'left' });
        doc.text('Activity Type', tableStartX + columnWidths.timestamp + 5, tableStartY + 5, { width: columnWidths.type - 10, align: 'left' });
        doc.moveDown(1);

        doc.moveTo(tableStartX, tableStartY + 20).lineTo(tableStartX + columnWidths.timestamp + columnWidths.type, tableStartY + 20).stroke();

        let currentY = tableStartY + 30;
        user.activityLogs.forEach((log, index) => {
            if (currentY + 20 > doc.page.height - 50) {
                doc.addPage()
                currentY = 50
            }

            if (index % 2 === 0) {
                doc.rect(tableStartX, currentY - 5, columnWidths.timestamp + columnWidths.type, 20).fill('#f9f9f9');
                doc.fillColor('#000');
            }

            const formattedTimestamp = new Date(log.timestamp).toLocaleString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            });

            doc.text(formattedTimestamp, tableStartX + 5, currentY, { width: columnWidths.timestamp - 10, align: 'left' });
            doc.text(log.type, tableStartX + columnWidths.timestamp + 5, currentY, { width: columnWidths.type - 10, align: 'left' });

            currentY += 20
        });

        doc.moveTo(tableStartX, currentY).lineTo(tableStartX + columnWidths.timestamp + columnWidths.type, currentY).stroke();

        doc.end();

        writeStream.on('finish', () => {
            res.download(filePath, filename, (err) => {
                if (err) {
                    return err
                }
            });
        });
    }
}
