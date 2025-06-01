// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcryptjs';
// import nodemailer from 'nodemailer';
// import { v4 as uuidv4 } from 'uuid';

// const prisma = new PrismaClient();

// interface sendMailTypes {
//     email: string;
//     emailType: "VERIFY" | "RESET";
//     id: number;
// }

// export const Sendemail = async ({ email, emailType, id }: sendMailTypes) => {
//     try {
//         // Generate token using uuid
//         const token = uuidv4();
//         const hashedToken = await bcrypt.hash(token, 10);

//         // Update the user record with token & expiry
//         if (emailType === "VERIFY") {
//             await prisma.user.update({
//                 where: { id },
//                 data: {
//                     verifytoken: hashedToken,
//                     verifytokenExpiry: new Date(Date.now() + 3600000), // 1 hour expiry
//                 },
//             });
//         } else if (emailType === "RESET") {
//             await prisma.user.update({
//                 where: { id },
//                 data: {
//                     forgetPasswordToken: hashedToken,
//                     forgetPasswordTokenExpiry: new Date(Date.now() + 3600000),
//                 },
//             });
//         }

//         const transport = nodemailer.createTransport({
//             host: "sandbox.smtp.mailtrap.io",
//             port: 2525,
//             auth: {
//                 user: "d0ebfc05d512fc",
//                 pass: "6c3214a3e948b1",
//             },
//         });

//         const urlPath = emailType === "VERIFY" ? "verifyemail" : "resetpassword";
//         const actionText = emailType === "VERIFY" ? "VERIFY YOUR EMAIL" : "RESET YOUR PASSWORD";
//         const domain = process.env.DOMAIN;

//         const mailOptions = {
//             from: '"Hi there from Priyanshu 👋" <maddison53@ethereal.email>',
//             to: email,
//             subject: actionText,
//             html: `
//                 <p>Click <a href="${domain}/${urlPath}?token=${hashedToken}">
//                 HERE</a> to ${actionText}</p>
//             `,
//         };

//         const mailResponse = await transport.sendMail(mailOptions);
//         return mailResponse;

//     } catch (error: any) {
//         console.error("Email error:", error);
//         throw new Error(error.message);
//     }
// };





import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import sgMail from '@sendgrid/mail';

const prisma = new PrismaClient();

interface sendMailTypes {
    email: string;
    emailType: 'VERIFY' | 'RESET';
    id: number;
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const Sendemail = async ({ email, emailType, id }: sendMailTypes) => {
    try {
        const token = uuidv4();
        const hashedToken = await bcrypt.hash(token, 10);

        const expiryDate = new Date(Date.now() + 3600000); // 1 hour

        // Save hashed token and expiry
        const updateData =
            emailType === 'VERIFY'
                ? { verifytoken: hashedToken, verifytokenExpiry: expiryDate }
                : { forgetPasswordToken: hashedToken, forgetPasswordTokenExpiry: expiryDate };

        await prisma.user.update({
            where: { id },
            data: updateData,
        });



        // Use unhashed token in URL, but hashed token is stored in DB for security
        const domain = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'; // fallback for dev
        const urlPath = emailType === 'VERIFY' ? 'verifyemail' : 'resetpassword';
        const actionText = emailType === 'VERIFY' ? 'Verify Your Email' : 'Reset Your Password';

        console.log("SENDGRID_API_KEY is set:", !!process.env.SENDGRID_API_KEY);

        const msg = {
            to: email,
            from: 'souryavardhan.23b1531158@abes.ac.in', // Must match your verified sender in SendGrid
            subject: actionText,
            html: `
                <p>Click <a href="${domain}/${urlPath}?token=${hashedToken}">here</a> to ${actionText.toLowerCase()}.</p>
                <p>This link will expire in 1 hour.</p>
            `,
        };
        console.log(hashedToken)

        const response = await sgMail.send(msg);
        return response;
    } catch (error: any) {
        console.error('SendGrid Email Error:', error);
        if (error.response) {
            console.error('SendGrid Response Body:', error.response.body);
        }
        throw new Error('Failed to send email.');
    }
};


///////////////////////////