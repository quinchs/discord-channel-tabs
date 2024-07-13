## Discord Channel Tabs

This is a BetterDiscord plugin that adds channel tabs to Discord, allowing quick navigation between channels of your chosing from anywhere in the app!

### Building

Simply clone the repository and run the following commands:
```bash
# pnpm
pnpm install
pnpm run build

# npm
npm install
npm run build

# yarn
yarn install
yarn run build
```

this will build the plugin and move it to your plugins directory on Better Discord


### Known bugs
- navigating to a non chat area on discord (Friends, Nitro, etc) and navigating away will cause tabs to be hidden
- keybinds for right-side controls (right alt, right control, etc) will simply just not work
