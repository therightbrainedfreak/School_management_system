import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOMParser } from '@xmldom/xmldom';
import { SignedXml } from 'xml-crypto';

import fs from 'node:fs';
import AdmZip from 'adm-zip';
import xpath from 'xpath';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const localAadharPath = path.join(__dirname, "../", "offlineaadhaar20260411050834251.zip");

/**
 * Extracts xml from aadhar zip.
 * @param {string} path Path to the saved zip aadhar.
 * @param {*} password Password or sharecode for unlocking the encrypted aadhar zip.
 * @returns Xml as a String.
 */

export function extractAadharXmlFromLocalFile(path, password) {
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

        if (!xmlEntry) {
            return {
                success: false,
                message: "No XMl file found in the ZIP."
            }
        }

        // Decode the xml using password.
        const xmlBuffer = zip.readFile(xmlEntry, password);

        if (!xmlBuffer || !xmlBuffer.includes('<?xml')) {
            return {
                success: false,
                message: "Corrupted File."
            }
        }

        return {
            success: true,
            data: xmlBuffer.toString('utf-8')
        }

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    };
};

/**
 * Verify the hash / integrity of the aadhar string using the inbuild pem certificate.
 * @param {string} XMLString Complete aadhar xml
 * @returns success true and isVerified true if the aadhar's integrity is cerified else return success false with the error.
 */

export function verifyXML(XMLString) {
    try {
        if (!XMLString) throw new Error("XML string not found.");
        
        const doc = new DOMParser().parseFromString(XMLString, 'application/xml');

        const signNode = xpath.select("//*[local-name(.)='Signature']", doc)[0];

        if (!signNode) {
            return {
                status: false,
                message: "Signature not found in the XML."
            }
        }

        const certNode = xpath.select("//*[local-name(.)='X509Certificate']", doc)[0];

        if (!certNode) {
            return {
                status: false,
                message: "Cannot find X509Certificate in the XML"
            }
        }

        const b64 = certNode.textContent.replace(/\s+/g, '')
        const pem = `-----BEGIN CERTIFICATE-----\n${b64.match(/.{1,64}/g).join('\n')}\n-----END CERTIFICATE-----`

        const sig = new SignedXml({ publicCert: pem })

        sig.loadSignature(signNode)

        const valid = sig.checkSignature(XMLString)

        if (!valid) {
            return {
                status: false,
                message: `Signature invalid: ${sig.validationErrors.join(', ')}`
            }
        }

        return {
            status: true,
            message: "Signature valid."
        };
    } catch (error) {
        throw new Error('Cannot verify:', error);
    };
};

/**
 * Extracts POI, POA data from the xml string.
 * @param {string} xmlString Complete aadhar xml.
 * @returns Object containing all kyc fields.
 */

export function extractKycData(xmlString) {
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

// function main() {
//     try {
//         const XMLString = extractAadharXmlFromLocalFile(localAadharPath, 3648);

//         const result = verifyXML(XMLString);

//         const kyc = extractKycData(XMLString);

//         console.log(result);
//     } catch (error) {
//         console.log(error.message)
//     }
// };

// fs.writeFileSync('photo.jpg', Buffer.from(kyc.photoBase64, 'base64'));