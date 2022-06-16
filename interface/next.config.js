/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    mongodburl: "mongodb://localhost:27017/ens-domains",
    ENSDomain: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
    Registrar: "0xA84bd888B2fe9b9edA835f59EeC31dBD4677F7DA"
  }
}

module.exports = nextConfig