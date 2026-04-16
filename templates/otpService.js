import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
const app = express();
const port = process.env.PORT || 3030;
dotenv.configDotenv();
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { readData, writeData } from './crudhelper/crudhelper.js';

// Nouman Collection ipv4 address: 192.168.29.155

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

function invalidJsonHandler(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON format",
            error: err.message
        });
    }
    next(err);
}

app.use(invalidJsonHandler);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

function getHtmlTemplate(otp) {
    return `
    <div style="font-family: Arial, sans-serif; background:#f8f8f8; padding:30px;">
      <div style="max-width:420px; margin:auto; background:white; padding:25px; border-radius:10px; border:1px solid #eee;">
        
        <h2 style="text-align:center; margin:0; color:#333;">Your OTP Code</h2>
        <p style="text-align:center; margin-top:5px; color:#555; font-size:14px;">
          Use this One-Time Password to complete your verification.
        </p>

        <div style="margin-top:25px; text-align:center;">
          <div style="
            display:inline-block;
            padding:12px 28px;
            font-size:28px;
            letter-spacing:6px;
            font-weight:bold;
            color:#111;
            border:2px dashed #000;
            border-radius:8px;">
            ${otp}
          </div>
        </div>

        <p style="margin-top:25px; color:#666; font-size:12px; text-align:center;">
          This OTP is valid for 5 minutes. Do not share it with anyone.
        </p>

      </div>
      <p style="text-align:center; margin-top:18px; color:#aaa; font-size:11px;">
        If you didn’t request this, please ignore this email.
      </p>
    </div>
  `;
}

const expiredKiller = (req, res, next) => {
    let dataToVerify = readData() || [];
    let remainingOtps = dataToVerify.filter(o => Date.now() - o.enrollTime < 5 * 60 * 1000);
    let success = writeData(remainingOtps)
    if (!success) {
        return console.log("Write error");
    };
    console.log("Filtered Expired");
    next();
};

app.use(expiredKiller);

const usedKiller = (otp) => {
    let dataToVerify = readData() || [];
    let remainingOtps = dataToVerify.filter(o => o.oneTimePassword != otp);
    let success = writeData(remainingOtps);
    if (!success) {
        return console.log("Write error");
    };
    console.log("Filtered Used");
}

app.post("/api/emitotp", async (req, res) => {
    const { recipient } = req.body || {};
    let otp = Math.floor(100000 + Math.random() * 900000);
    let otpId = Math.floor(1000000000 + Math.random() * 9000000000);
    let htmlTemplate = getHtmlTemplate(otp);
    const mailOptions = {
        from: "(L-M-T) Local Microservices Test",
        to: process.env.MAIL_RECE,
        subject: "Your Verification OTP",
        html: htmlTemplate
    };
    if (!recipient) {
        return res.status(400).json({ isEmitted: false, message: "recipient required", error: true });
    } else {
        try {
            let info = await transporter.sendMail(mailOptions);
            console.log("OTP Email sent → ", info.messageId);
            let data = readData() || [];
            const newObj = {
                otpId: otpId,
                oneTimePassword: otp,
                recipient: recipient,
                enrollTime: Date.now(),
                isExpired: false,
                isUsed: false
            }
            data.push(newObj);
            let writeStatus = writeData(data);
            if (!writeStatus) {
                return res.json({ isEmitted: false, message: "write Error", error: true });
            }
            return res.json({ isEmitted: true, message: "successfull", error: false });
        } catch (err) {
            console.error("Mail Send Error: ", err);
            return res.json({ isEmitted: false, message: "Internal Server Error", error: true });
        };
    };
});

app.post('/api/checkrecipient', (req, res) => {
    const { recipient } = req.body || {};
    if (!recipient) {
        return res.status(400).json({ isValidRecipient: false })
    }
    let data = readData() || [];
    let foundRecipient = data.find(r => r.recipient === recipient);
    if (!foundRecipient) {
        return res.status(404).json({ isValidRecipient: false })
    }
    res.json({ isValidRecipient: true });
})

app.get("/verifyotp", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'verifyotp.html'));
})

app.post("/api/verifyotp", (req, res) => {
    const { otp, recipient } = req.body || {};
    if (!otp) {
        return res.status(400).send("bad request: OTP is Required");
    } else if (!Number(otp)) {
        return res.status(400).send("Invalid OTP Format");
    } else if (otp.length > 6 || otp.length < 6) {
        return res.status(400).send("OTP must be exact 6 digits");
    }
    let persistenData = readData() || [];
    let persistentOtp = persistenData.find(o => o.oneTimePassword == Number(otp));
    if (!persistentOtp) {
        return res.status(404).json({ isVerified: false, message: "Not Found" });
    }
    if (persistentOtp.recipient !== recipient) {
        return res.status(404).json({ isVerified: false, message: "Not Found" });
    }
    res.json({isVerified: true, message: "OTP Verified"});
    usedKiller(Number(otp));
})



app.listen(port, () => {
    console.log('OTP service live at =>', port);
});