import { binToHex, instantiateSha256, utf8ToBin } from '@bitauth/libauth';

export const sha256 = async (message: string) => {
    const temp = await instantiateSha256();
    return binToHex(temp.hash(utf8ToBin(message)));
};