import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOMParser } from '@xmldom/xmldom';
import { SignedXml } from 'xml-crypto';
import AdmZip from 'adm-zip';
import xpath from 'xpath';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default class XMLHandler {
    constructor(path, password) {
        // 1. Robust Validations
        if (!path) throw new Error("Path not specified.");
        if (password === undefined || password === null) throw new Error("Password required.");

        // Ensure password is a string without excluding "0" or numbers
        this.password = String(password);

        try {
            // 2. Create admzip instance
            const zip = new AdmZip(path);
            const zipEntries = zip.getEntries();

            // 3. Find XML entry
            const xmlEntry = zipEntries.find(entry => entry.entryName.toLowerCase().endsWith('.xml'));
            if (!xmlEntry) throw new Error("No XML file found in the ZIP.");

            // 4. Extract and Decode
            // Note: readFile returns null if the password is wrong or extraction fails
            const xmlBuffer = zip.readFile(xmlEntry, this.password);

            if (!xmlBuffer) {
                throw new Error("Failed to decrypt or read the XML file. Check your password.");
            }

            const decodedString = xmlBuffer.toString('utf-8');

            // 5. Final Validation
            if (!decodedString.includes('<?xml')) {
                throw new Error("Decoded content is not a valid XML.");
            }

            this.XMLString = decodedString;

        } catch (err) {
            // Wrap internal errors to provide cleaner feedback
            throw new Error(error);
        }
    }

    verify() {
        try {
            // 1. Initialise DOMParser
            const doc = new DOMParser().parseFromString(this.XMLString, 'application/xml');

            // 2. Extract and validate signature node.
            const signNode = xpath.select("//*[local-name(.)='Signature']", doc)[0];
            if (!signNode) throw new Error("Signature not found in the XML.");

            // 3. Extract and validate signature node.
            const certNode = xpath.select("//*[local-name(.)='X509Certificate']", doc)[0];
            if (!certNode) throw new Error("Cannot find X509Certificate in the XML");

            // 4. Convert signature node into valid PEM.
            const b64 = certNode.textContent.replace(/\s+/g, '')
            const pem = `-----BEGIN CERTIFICATE-----\n${b64.match(/.{1,64}/g).join('\n')}\n-----END CERTIFICATE-----`

            // 5. Set signature.
            const sig = new SignedXml({ publicCert: pem })
            sig.loadSignature(signNode)

            const valid = sig.checkSignature(this.XMLString)

            if (!valid) { return false } else { return true }

        } catch (error) {
            throw new Error(error);
        }
    }

    extractData() {
        try {
            const doc = new DOMParser().parseFromString(this.XMLString, 'application/xml');

            const root = doc.getElementsByTagName('OfflinePaperlessKyc')[0];
            const poi = doc.getElementsByTagName('Poi')[0];
            const poa = doc.getElementsByTagName('Poa')[0];
            const pht = doc.getElementsByTagName('Pht')[0];

            return {
                referenceId: root?.getAttribute('referenceId'),
                timestamp: root?.getAttribute('ts'),
                identity: {
                    name: poi?.getAttribute('name'),
                    gender: poi?.getAttribute('gender'),
                    dob: poi?.getAttribute('dob'),
                    phone: poi?.getAttribute('phone'),
                    email: poi?.getAttribute('email'),
                },
                address: {
                    careOf: poa?.getAttribute('careof'),
                    house: poa?.getAttribute('house'),
                    street: poa?.getAttribute('street'),
                    landmark: poa?.getAttribute('landmark'),
                    locality: poa?.getAttribute('loc'),
                    vtc: poa?.getAttribute('vtc'),
                    district: poa?.getAttribute('dist'),
                    state: poa?.getAttribute('state'),
                    pincode: poa?.getAttribute('pc'),
                    country: poa?.getAttribute('country'),
                },
                photoBase64: pht?.textContent?.trim() ?? null
            };
        } catch (error) {
            throw new Error(error);
        }
    }
};