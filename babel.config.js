module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "transform-import-to-read-file-sync",
      {
        "test": "\\.glsl$",
        "options": "utf8"
      }
      ]
    ]
  };
};
