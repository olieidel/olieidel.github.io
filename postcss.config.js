module.exports = {
  plugins: [
    require("postcss-import"),
    require("tailwindcss")("./_includes/tailwind.config.js"),
    require('postcss-nested'),
    require("autoprefixer")
  ]
};
