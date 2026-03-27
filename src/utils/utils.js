import { customAlphabet } from 'nanoid';

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