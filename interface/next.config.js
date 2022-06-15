/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    mongodburl: "mongodb://localhost:27017/ens-domains",
    ENSDomain: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
    Registrar: "0xD1747454fC11AB9B7D537bF8B3aD0ee46Bca7A0F"
  }
}

module.exports = nextConfig