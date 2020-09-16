import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

const config = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
};

/**
 * Classe responsável pelo envio de e-mail
 */
@Injectable()
export class Nodemailer {
    /**
     * Envia o e-mail contendo os dados extraídos da NFE
     * @param email Email de destino
     * @param attachment Anexo
     */
    async enviarEmailExportacaoXlsx(email: string, attachment: Attachment) {
        return new Promise((resolve, reject) => {
            try {
                const html = `
                    <p>${process.env.APP_NAME}</p>
                    <p>Segue em anexo um arquivo xlsx com todos os seus dados exportados.</p>
                `;
                
                const mailOptions = {
                    from: `${process.env.APP_NAME} <${config.auth.user}>`,
                    to: email,
                    subject: `Exportação de dados`,
                    html: html,
                    attachments: [attachment]
                };
                
                const nodemailerTransport = nodemailer.createTransport(config);
                
                nodemailerTransport.sendMail(mailOptions, (err: Error, info) => {
                    if (err) return reject(err);
                    resolve(info);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

interface Attachment {
    filename: string;
    content: Buffer;
}