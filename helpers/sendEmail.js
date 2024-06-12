import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export const sendEmail = async(options) => {
    const transport =  nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        // secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
      });

    //   configure email message
    const emailOptions = {
        from: "Angelina Opoku<ticketsInc.com>",
        to: options.email,
        subject: options.subject,
        text: options.text
      };

    return await transport.sendMail(emailOptions);

    
      
}