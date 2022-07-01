const { SignTypedDataVersion, recoverTypedSignature } = require('@metamask/eth-sig-util');
const Web3 = require("web3");
const web3 = new Web3("https://mainnet.infura.io/v3/e5f6b05589544b1bb8526dc3c034c63e");

const validate_address = (address) => {
    return web3.utils.isAddress(address);
}

const check_zero = (address) => {
    return web3.utils.toBN(address).isZero();
}

const checkReviewSign = (star, from, to, subdomain, comment, signature) => {
    try {
        const msgParams = JSON.stringify({
            domain: {
                chainId: 1,
                name: 'ENS Express for subdomain',
                verifyingContract: process.env.Registrar,
                version: '1'
            },
        
            message: {
                star,
                from,
                to,
                subdomain,
                comment
            },
            primaryType: 'Review',
            types: {
                EIP712Domain: [
                    { name: 'name', type: 'string' },
                    { name: 'version', type: 'string' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'verifyingContract', type: 'address' }
                ],
                Review: [
                    { name: 'star', type: 'uint256' },
                    { name: 'from', type: 'address' },
                    { name: 'to', type: 'address' },
                    { name: 'subdomain', type: 'string' },
                    { name: 'comment', type: 'string' },
                ],
            },
        });
    
        const recovered = recoverTypedSignature({
            data: JSON.parse(msgParams),
            signature,
            version: SignTypedDataVersion.V3
        });
        
        if (web3.utils.toChecksumAddress(recovered) === web3.utils.toChecksumAddress(from)) return web3.utils.toChecksumAddress(recovered);
        return false;
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    validate_address,
    check_zero,
    checkReviewSign
}