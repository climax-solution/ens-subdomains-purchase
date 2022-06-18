/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    mongodburl: "mongodb://localhost:27017/ens-domains",
    ENSDomain: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
    Registrar: "0x0068283EBbd24D17433670feEE92dAe7Ca24920e",
    ENSRegistry: "0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e"
  }
}

module.exports = nextConfig