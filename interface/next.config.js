/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    mongodburl: "mongodb://localhost:27017/ens-domains",
    ENSDomain: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
    Registrar: "0xE29d79b1ab2D34d982B080E361F33804bc65b9af",
    ENSRegistry: "0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e"
  }
}
// EthRegistrarSubdomainRegistrar
// 100000000000000000
// 0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e
// ["10000000000000000","20000000000000000","30000000000000000","50000000000000000"]
// [10000000000000000,20000000000000000,30000000000000000,50000000000000000]
module.exports = nextConfig