/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GITHUB_TOKEN: process.env.NEXT_PRIVATE_GITHUB_TOKEN,
        EMAIL: process.env.NEXT_PRIVATE_EMAIL,
    }
}
export default nextConfig;
