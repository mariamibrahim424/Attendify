// babel.config.js
module.exports = {
    presets: [
      'module:metro-react-native-babel-preset',  // Essential preset for React Native
      '@babel/preset-react',                     // Optional, for React code
    ],
    plugins: [
      // Ensure these plugins have the same `loose` setting
      [
        '@babel/plugin-transform-class-properties',
        {
          loose: true, // Set loose mode consistently
        },
      ],
      [
        '@babel/plugin-transform-private-methods',
        {
          loose: true, // Set loose mode consistently
        },
      ],
      [
        '@babel/plugin-transform-private-property-in-object',
        {
          loose: true, // Set loose mode consistently
        },
      ],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',  // Custom module for loading .env variables
          path: '.env',         // Path to your .env file
        },
      ],
    ],
  };
  