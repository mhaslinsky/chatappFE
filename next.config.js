/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    domains: [
      "i.imgur.com",
      "images.unsplash.com",
      "ibb.co",
      "monstar-lab.com",
      "localhost",
      "insta-sham.s3.us-east-2.amazonaws.com",
      "upload.wikimedia.org",
      "www.svgrepo.com",
      "via.placeholder.com",
      "clinicforspecialchildren.org",
      "i.pinimg.com",
      "lh3.googleusercontent.com",
      "*",
    ],
  },
  env: {
    SOCKETIO: process.env.SOCKETIO,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  reactStrictMode: true,
};
