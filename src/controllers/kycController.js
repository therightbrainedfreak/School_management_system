import path, { dirname } from 'node:path';
import fs from 'node:fs';
import AdmZip from 'adm-zip';
import { fileURLToPath } from 'node:url';
import xpath from 'xpath';
import { DOMParser } from '@xmldom/xmldom';
import { SignedXml } from 'xml-crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const localAadharPath = path.join(__dirname, "../", "offlineaadhaar20260411050834251.zip");

function extractAadharXmlFromLocalFile(path, password) {
    try {
        // Input validations.
        if (!path) throw new Error("Path not specified.");
        if (!password) throw new Error("Password not specified");
        if (Number(password)) { password = password.toString() };
        // Initialise adm-zip.
        const zip = new AdmZip(path);
        const zipEntries = zip.getEntries();
        // Check if the zip contains a xml file.
        const xmlEntry = zipEntries.find(entry => entry.entryName.endsWith('.xml'));

        if (!xmlEntry) throw new Error("No XMl file found in the ZIP.");
        // Decode the xml using password.
        const xmlBuffer = zip.readFile(xmlEntry, password);
        if (!xmlBuffer || !xmlBuffer.includes('<?xml')) throw new Error("Invalid password or corrupted ZIP.");

        return xmlBuffer.toString('utf-8');

    } catch (error) {
        throw new Error(`Extractions halted: ${error.message}`);
    };
};

function verifyXML(XMLString) {
    try {
        if (!XMLString) throw new Error("XML string not found.");
        
        const doc = new DOMParser().parseFromString(XMLString, 'application/xml');

        const signNode = xpath.select("//*[local-name(.)='Signature']", doc)[0];

        if (!signNode) throw new Error("No signature element in XML.");

        const certNode = xpath.select("//*[local-name(.)='X509Certificate']", doc)[0];
        if (!certNode) throw new Error("No X509Certificate found in XML.");

        const b64 = certNode.textContent.replace(/\s+/g, '')
        const pem = `-----BEGIN CERTIFICATE-----\n${b64.match(/.{1,64}/g).join('\n')}\n-----END CERTIFICATE-----`

        const sig = new SignedXml({ publicCert: pem })

        sig.loadSignature(signNode)

        const valid = sig.checkSignature(XMLString)
        if (!valid) throw new Error(`Signature invalid: ${sig.validationErrors.join(', ')}`)

        return { valid: true };

    } catch (error) {
        throw new Error(`Cannot verify: ${error.message}`);
    };
};

function extractKycData(xmlString) {
    const doc = new DOMParser().parseFromString(xmlString, 'application/xml');

    const root = doc.getElementsByTagName('OfflinePaperlessKyc')[0];
    const poi  = doc.getElementsByTagName('Poi')[0];
    const poa  = doc.getElementsByTagName('Poa')[0];
    const pht  = doc.getElementsByTagName('Pht')[0];

    return {
        referenceId : root?.getAttribute('referenceId'),
        timestamp   : root?.getAttribute('ts'),
        identity: {
            name   : poi?.getAttribute('name'),
            gender : poi?.getAttribute('gender'),
            dob    : poi?.getAttribute('dob'),
            phone  : poi?.getAttribute('phone'),
            email  : poi?.getAttribute('email'),
        },
        address: {
            careOf   : poa?.getAttribute('careof'),
            house    : poa?.getAttribute('house'),
            street   : poa?.getAttribute('street'),
            landmark : poa?.getAttribute('landmark'),
            locality : poa?.getAttribute('loc'),
            vtc      : poa?.getAttribute('vtc'),
            district : poa?.getAttribute('dist'),
            state    : poa?.getAttribute('state'),
            pincode  : poa?.getAttribute('pc'),
            country  : poa?.getAttribute('country'),
        },
        photoBase64: pht?.textContent?.trim() ?? null
    };
};

function main() {
    try {
        const XMLString = extractAadharXmlFromLocalFile(localAadharPath, 3648);

        const result = verifyXML(XMLString);

        const kyc = extractKycData(XMLString);

        console.log(result);
    } catch (error) {
        console.log(error.message)
    }
};

// fs.writeFileSync('photo.jpg', Buffer.from(kyc.photoBase64, 'base64'));