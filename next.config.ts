import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "s3-alpha-sig.figma.com" },
      { hostname: "web-api.s3.amazonaws.com" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "web-api.s3.us-east-1.amazonaws.com" },
      { hostname: "placehold.co" },
    ],
  },
  reactStrictMode: true,
  i18n: {
    locales: ["es"],
    defaultLocale: "es",
  },
  transpilePackages: [
    "apollo-upload-client",
    // antd & deps
    "@ant-design",
    "@rc-component",
    "antd",
    "rc-cascader",
    "rc-checkbox",
    "rc-collapse",
    "rc-dialog",
    "rc-drawer",
    "rc-dropdown",
    "rc-field-form",
    "rc-image",
    "rc-input",
    "rc-input-number",
    "rc-mentions",
    "rc-menu",
    "rc-motion",
    "rc-notification",
    "rc-pagination",
    "rc-picker",
    "rc-progress",
    "rc-rate",
    "rc-resize-observer",
    "rc-segmented",
    "rc-select",
    "rc-slider",
    "rc-steps",
    "rc-switch",
    "rc-table",
    "rc-tabs",
    "rc-textarea",
    "rc-tooltip",
    "rc-tree",
    "rc-tree-select",
    "rc-upload",
    "rc-util",
  ],
};

export default nextConfig;
