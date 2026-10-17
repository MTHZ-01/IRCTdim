const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    name: 'Power Calculation Suite',
    executableName: 'PowerCalculationSuite',
    extraResource: [
      path.join(__dirname, 'BackEnd', 'IRCT', 'dist', 'manage'), // Include manage.exe and its directory
      path.join(__dirname, 'src', 'Assets', 'RedSnake.ico'),
      path.join(__dirname, 'src', 'Assets', 'YellowSnake.ico'),
      path.join(__dirname, 'src', 'Assets', 'WhiteSnake.ico')
    ],
    win32metadata: {
      CompanyName: 'Power Engineering Solutions',
      FileDescription: 'Power Calculation Suite - CT, VT & Meter Analysis',
      ProductName: 'Power Calculation Suite',
    }
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'power-calculation-suite',
        authors: 'Power Engineering Solutions',
        description: 'Power Calculation Suite for CT, VT & Meter Analysis',
        setupExe: 'PowerCalculationSuite-Setup.exe',
        noMsi: true,
        fileAssociations: [
          {
            ext: 'irct',
            name: 'IRCT Project File',
            description: 'Current Transformer Calculation Project',
            role: 'Editor'
          },
          {
            ext: 'irm', 
            name: 'IRM Meter File',
            description: 'Meter/CT Configuration File',
            role: 'Editor'
          },
          {
            ext: 'irvt',
            name: 'IRVT Voltage Transformer File', 
            description: 'Voltage Transformer Configuration File',
            role: 'Editor'
          }
        ]
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    },
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.js',
              name: 'main_window',
              preload: {
                js: './src/preload.js'
              }
            }
          ]
        }
      }
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true
    })
  ]
};