const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');
const fs = require('fs');

const manageBinaryPath = path.join(__dirname, 'BackEnd', 'IRCT', 'dist', 'manage');
const manageExePath = path.join(__dirname, 'BackEnd', 'IRCT', 'dist', 'manage.exe');

const extraResources = [];

if (fs.existsSync(manageBinaryPath)) {
  extraResources.push(manageBinaryPath);
}
if (fs.existsSync(manageExePath)) {
  extraResources.push(manageExePath);
}

const iconIco = path.join(__dirname, 'src', 'Assets', 'RedSnake.ico');
const iconPng = path.join(__dirname, 'src', 'Assets', 'RedSnake.png');
const yellowIco = path.join(__dirname, 'src', 'Assets', 'YellowSnake.ico');
const whiteIco = path.join(__dirname, 'src', 'Assets', 'WhiteSnake.ico');

[iconIco, iconPng, yellowIco, whiteIco].forEach((p) => {
  if (fs.existsSync(p)) extraResources.push(p);
});

module.exports = {
  packagerConfig: {
    asar: true,
    // Must stay aligned with package.json "name" so makers find the binary
    name: 'knoladgebased_initiative',
    executableName: 'knoladgebased_initiative',
    extraResource: extraResources,
    win32metadata: {
      CompanyName: 'Power Engineering Solutions',
      FileDescription: 'Power Calculation Suite - CT, VT & Meter Analysis',
      ProductName: 'Power Calculation Suite',
    },
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
            role: 'Editor',
          },
          {
            ext: 'irm',
            name: 'IRM Meter File',
            description: 'Meter/CT Configuration File',
            role: 'Editor',
          },
          {
            ext: 'irvt',
            name: 'IRVT Voltage Transformer File',
            description: 'Voltage Transformer Configuration File',
            role: 'Editor',
          },
        ],
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: {
        options: {
          name: 'power-calculation-suite',
          productName: 'Power Calculation Suite',
          genericName: 'Power Calculation Suite',
          description: 'CT, VT & Meter Analysis for electrical engineering',
          productDescription:
            'Professional desktop application for Current Transformer, Voltage Transformer and Meter calculations.',
          categories: ['Science', 'Education'],
          maintainer: 'mthzi <mthzi@example.com>',
          homepage: 'https://github.com/mthzi/KnoladgeBased_initiative',
          section: 'science',
          priority: 'optional',
          icon: fs.existsSync(iconPng) ? iconPng : undefined,
        },
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
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
                js: './src/preload.js',
              },
            },
          ],
        },
      },
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};