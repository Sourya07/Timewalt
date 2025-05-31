import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

interface sendMailTypes {
    email: string;
    emailType: "VERIFY" | "RESET";
    id: number;
}

export const Sendemail = async ({ email, emailType, id }: sendMailTypes) => {
    try {
        // Generate token using uuid
        const token = uuidv4();
        const hashedToken = await bcrypt.hash(token, 10);

        // Update the user record with token & expiry
        if (emailType === "VERIFY") {
            await prisma.user.update({
                where: { id },
                data: {
                    verifytoken: hashedToken,
                    verifytokenExpiry: new Date(Date.now() + 3600000), // 1 hour expiry
                },
            });
        } else if (emailType === "RESET") {
            await prisma.user.update({
                where: { id },
                data: {
                    forgetPasswordToken: hashedToken,
                    forgetPasswordTokenExpiry: new Date(Date.now() + 3600000),
                },
            });
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "d0ebfc05d512fc",
                pass: "6c3214a3e948b1",
            },
        });

        const urlPath = emailType === "VERIFY" ? "verifyemail" : "resetpassword";
        const actionText = emailType === "VERIFY" ? "VERIFY YOUR EMAIL" : "RESET YOUR PASSWORD";
        const domain = process.env.DOMAIN;

        const mailOptions = {
            from: '"Hi there from Priyanshu 👋" <maddison53@ethereal.email>',
            to: email,
            subject: actionText,
            html: `
                <p>Click <a href="${domain}/${urlPath}?token=${hashedToken}">
                HERE</a> to ${actionText}</p>
            `,
        };

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;

    } catch (error: any) {
        console.error("Email error:", error);
        throw new Error(error.message);
    }
};