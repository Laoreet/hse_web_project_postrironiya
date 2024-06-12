import {sha1} from 'crypto-hash';

export function hashed_format(s : string) {
    //s = "f415df421177820c3a69db701f424efbf48b177e";
    let formattedString = "";
    for (let i = 0; i < s.length; i += 2) {
        formattedString += s.substring(i, i + 2).toUpperCase() + " ";
    }
    s = formattedString.trim()+" ";
    return s;
}