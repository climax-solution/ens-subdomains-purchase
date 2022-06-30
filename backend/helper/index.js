const Web3 = require("web3");
const web3 = new Web3("https://mainnet.infura.io/v3/e5f6b05589544b1bb8526dc3c034c63e");

const validate_address = (address) => {
    return web3.utils.isAddress(address);
}

const check_zero = (address) => {
    return web3.utils.toBN(address).isZero();
}

module.exports = {
    validate_address,
    check_zero
}