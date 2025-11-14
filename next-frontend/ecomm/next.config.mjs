/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ['images.unsplash.com', 'plus.unsplash.com', 'kmart.com.au', 'assets.kmart.com.au', 'kmartau.mo.cloudinary.net'],
  },
};

export default nextConfig;
