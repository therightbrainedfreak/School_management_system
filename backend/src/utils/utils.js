import { customAlphabet } from 'nanoid';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const generateUniqueId = (role) => {
    const rolemap = {
        student: "STU",
        teacher: "TCH",
        admin: "ADM",
        parent: "PNT",
        superuser: "SPU",
        backoffice: "BCO"
    };
    const rl = rolemap[role];
    if (!rl) {
        return null;
    };
    const int = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
    const rInt = customAlphabet(int, 7);
    const generateId = `${rl}${rInt()}`;
    return generateId
};

export const generateAppRef = () => {
    const int = "23456789";
    const alpha = "ABCDEFGHJKMNPQRSTUVWXYZ";
    const randInt = customAlphabet(int, 4);
    const randAplha = customAlphabet(alpha, 6);
    const appRef = `${randInt()}${randAplha()}`;
    return appRef;
};

export const generateCalenderId = () => {
    const int = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
    const rInt = customAlphabet(int, 6);
    const generateId = `${"MCAL"}${rInt()}`;
    return generateId
};

export const generateMailRef = () => {
    const int = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
    const rInt = customAlphabet(int, 12);
    const generateId = rInt();
    return generateId;
};

export const passwordGenerator = () => {
    const int = "23456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz@#/%";
    const rInt = customAlphabet(int, 12);
    const generateId = rInt();
    return generateId;
};

export const generateKycId = () => {
    const int = "23456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
    const rInt = customAlphabet(int, 32);
    const generateId = rInt();
    return generateId;
}

export const sanitizeHTML = (dirty) => {
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's',
      'h1', 'h2', 'h3', 'h4',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a',
    ],
    ALLOWED_ATTR: [
      'href', 'title',
      'class', 'target'
    ],
  });
};