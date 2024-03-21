import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';

@Injectable()
export class SendEmailService {


    async sendEmail(
        to: string | string[],
        subject: string,
        message: string,
        attachments?: [],
    ) {
        // configurations
        const transporter = nodemailer.createTransport({
            host: 'localhost',
            port: 587,
            secure: false,
            service: 'gmail',
            auth: {
                // credentials
                user: 'gamesmooodshisham@gmail.com',
                pass: 'umbevxehposczbnh',
            },
        })

        const emailInfo = await transporter.sendMail({
            from: '"no-reply" <amiraezaat824@gmail.com>',
            to: to ? to : '',
            subject: subject ? subject : 'Hello',
            html: message ? message : '',
            attachments,
        })
        if (emailInfo.accepted.length) {
            return true
        }
        return false
    }
}