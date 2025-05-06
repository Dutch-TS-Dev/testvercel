// vercel.config.js
module.exports = {
  // Allow all file types
  allowOverrides: true,

  // Disable all checks
  checks: {
    // Turn off all build checks
    build: false,
    // Disable security scanning
    securityScan: false,
  },

  // Disable all build optimization
  buildOptimizer: false,

  // Disable minification
  minify: false,

  // Disable source maps
  sourceMaps: false,

  // Disable TypeScript strict mode
  typescript: {
    strict: false,
    noUnusedLocals: false,
    noUnusedParameters: false,
    noImplicitAny: false,
    noImplicitThis: false,
    noImplicitReturns: false,
    strictNullChecks: false,
    strictFunctionTypes: false,
    strictBindCallApply: false,
    strictPropertyInitialization: false,
    alwaysStrict: false,
  },

  // Disable eslint
  eslint: {
    ignoreDuringBuilds: true,
    dirs: [],
  },

  // Disable linting
  lint: false,

  // Maximum deployment size (set to very high)
  maximumDeploymentSize: 1000000000,

  // Ignore build errors
  ignoreBuildErrors: true,

  // Ignore development command errors
  ignoreDevCommand: true,

  // Allow unsafe eval
  unsafe: {
    eval: true,
  },

  // No content security policy
  headers: {
    "content-security-policy": false,
  },
};
