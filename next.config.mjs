/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ["@untitledui/icons"],
        globalNotFound: true,
    },
    async redirects() {
        return [
            // Chinese is the default language.
            { source: "/", destination: "/zh", permanent: false },
            { source: "/:locale(zh|fr|en)/student-work", destination: "/:locale/student-work/essays", permanent: false },
        ];
    },
};

export default nextConfig;
