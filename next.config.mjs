import { setupHoneybadger } from "@honeybadger-io/nextjs"

const nextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "gravatar.com",
      },
    ],
  },
}

const honeybadgerNextJsConfig = {
  // Disable source map upload (optional)
  disableSourceMapUpload: true,

  // Hide debug messages (optional)
  silent: true,

  // More information available at @honeybadger-io/webpack: https://github.com/honeybadger-io/honeybadger-js/tree/master/packages/webpack
  webpackPluginOptions: {
    // Required if you want to upload source maps to Honeybadger
    apiKey: process.env.NEXT_PUBLIC_HONEYBADGER_API_KEY,

    // Required if you want to upload source maps to Honeybadger
    assetsUrl: process.env.NEXT_PUBLIC_HONEYBADGER_ASSETS_URL,

    revision: process.env.NEXT_PUBLIC_HONEYBADGER_REVISION,
    endpoint: "https://api.honeybadger.io/v1/source_maps",
    ignoreErrors: false,
    retries: 3,
    workerCount: 5,
    deploy: {
      environment:
        process.env.NEXT_PUBLIC_VERCEL_ENV ||
        process.env.VERCEL_ENV ||
        process.env.NODE_ENV,
      repository: "https://github.com/wvmitchell/listo-app",
      localUsername: "wvmitchell",
    },
  },
}

export default setupHoneybadger(nextConfig, honeybadgerNextJsConfig)
