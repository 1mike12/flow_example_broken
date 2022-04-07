# setup
## prepare React native stuff
1. following instructions here, including installing node, watchman, java SDK etc... https://reactnative.dev/docs/environment-setup 
**BUT install node v14 for now since 16 seems to fuck things up**
2. run `yarn install`

## prepare android
1. install android studio
2. (optional) setup emulator via AVD manager

## prepare iOS

**if not installing xcode IDE**
```shell
xcode-select --install # Install Command Line Tools if you haven't already.
sudo xcode-select --switch /Library/Developer/CommandLineTools # Enable command line tools
```

**if xcode installed**
make sure xcode >= 12 for RN 0.64
https://xcodereleases.com/

```shell
# Change the path if you installed Xcode somewhere else.
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

may need to make a simlink if can't find node cus xcode sucks `ln -s $(which node) /usr/local/bin/node`

### install cocoapods
`brew install cocoapods`

### setting up intellij
Syntax highlighting wont work for java files until the gradle dependencies are installed. 

1. mark android directory as sources root
2. Right click gradle file `mobile/android/build.gradle` and click `Link Gradle Project`

# running
### android
1. turn on developer options
2. turn on usb debugging in options
3. make sure you trust the computer 

By default, android will run on 1 physical device. If there is no physical device, it will launch the emulator
```shell
npx react-native run-android
```

run on a specific device
```shell
ANDROID_HOME/tools/emulator -list-avds
npx react-native run-android --deviceId=DEVICE_ID 
```
### iOS
```shell
npx react-native run-ios # you need to use macOS to build the iOS project
npx run-ios # for launching with menu to choose between physical and emulator devices
```
### webpack server
By default running `react-native run-PLATFORM` will launch the expo server, but when you install modules the server will commit suicide. To restart it run
```shell
yarn start
```

For physical devices, if the USB connection is broken it will lose connection with the webpack server. To reconnect:
```shell
adb -s <device name> reverse tcp:8081 tcp:8081
```

Forward port to access local server:
```shell
adb reverse tcp:8080 tcp:8080
```

### Debugging
reactotron is a desktop app that allows easy debugging of mobx states while the app is running.
https://infinite.red/reactotron

# Other bullshit
### updating out of date type definitions
find folder for module under `node_modules/@types/<project name>` and delete it. Then re-install via `yarn add @types/<project name>`

# Architecture

## API
We setup the api in api.ts, which uses infinitered's apisauce library, which is a wrapper around axios 
```ts
class Api {
   public apisauce = create({baseURL, timeout})
}
```

the api library is attached to environment.ts 
```ts
class Environment {
   public api = new Api()
}
```

the environment is injected into the root component 
```ts
import { Environment } from './environment'
rootStore = RootStoreModel.create(data, new Environment())
```

we use the api on each of the models
```ts
import { types, getEnv } from "mobx-state-tree"

types.model("UserModel")
.actions((self)=>{
   loadAllUsers: async ()=> {
      getEnv(self).api.get("/user/all")
   }
})
```

### Accessing stores on pages
we mark Component classes with `@observer`, which then makes it observable to changes in any things used in the render function

We also define the context which allows us to access the different stores

```ts
@observer
export class MyComponent extends React.Component {
   static contextType = RootStoreContext
   
   render() {
      const rootstore = this.context
      const {store1, store2} = this.context
         ...
   }
}
   
```








## The latest and greatest boilerplate for Infinite Red opinions

This is the boilerplate that [Infinite Red](https://infinite.red) uses as a way to test bleeding-edge changes to our React Native stack.

Currently includes:

- React Native
- React Navigation
- MobX State Tree
- TypeScript
- And more!

## Quick Start

The Ignite boilerplate project's structure will look similar to this:

```
ignite-project
├── app
│   ├── components
│   ├── i18n
│   ├── utils
│   ├── models
│   ├── navigators
│   ├── screens
│   ├── services
│   ├── theme
│   ├── app.tsx
├── storybook
│   ├── views
│   ├── index.ts
│   ├── storybook-registry.ts
│   ├── storybook.ts
│   ├── toggle-storybook.tsx
├── test
│   ├── __snapshots__
│   ├── storyshots.test.ts.snap
│   ├── mock-i18n.ts
│   ├── mock-reactotron.ts
│   ├── setup.ts
│   ├── storyshots.test.ts
├── README.md
├── android
│   ├── app
│   ├── build.gradle
│   ├── gradle
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   ├── keystores
│   └── settings.gradle
├── ignite
│   ├── ignite.json
│   └── plugins
├── index.js
├── ios
│   ├── IgniteProject
│   ├── IgniteProject-tvOS
│   ├── IgniteProject-tvOSTests
│   ├── IgniteProject.xcodeproj
│   └── IgniteProjectTests
├── .env
└── package.json

```

### ./app directory

Included in an Ignite boilerplate project is the `app` directory. This is a directory you would normally have to create when using vanilla React Native.

The inside of the src directory looks similar to the following:

```
app
│── components
│── i18n
├── models
├── navigators
├── screens
├── services
├── theme
├── utils
└── app.tsx
```

**components**
This is where your React components will live. Each component will have a directory containing the `.tsx` file, along with a story file, and optionally `.presets`, and `.props` files for larger components. The app will come with some commonly used components like Button.

**i18n**
This is where your translations will live if you are using `react-native-i18n`.

**models**
This is where your app's models will live. Each model has a directory which will contain the `mobx-state-tree` model file, test file, and any other supporting files like actions, types, etc.

**navigators**
This is where your `react-navigation` navigators will live.

**screens**
This is where your screen components will live. A screen is a React component which will take up the entire screen and be part of the navigation hierarchy. Each screen will have a directory containing the `.tsx` file, along with any assets or other helper files.

**services**
Any services that interface with the outside world will live here (think REST APIs, Push Notifications, etc.).

**theme**
Here lives the theme for your application, including spacing, colors, and typography.

**utils**
This is a great place to put miscellaneous helpers and utilities. Things like date helpers, formatters, etc. are often found here. However, it should only be used for things that are truely shared across your application. If a helper or utility is only used by a specific component or model, consider co-locating your helper with that component or model.

**app.tsx** This is the entry point to your app. This is where you will find the main App component which renders the rest of the application.

### ./ignite directory

The `ignite` directory stores all things Ignite, including CLI and boilerplate items. Here you will find generators, plugins and examples to help you get started with React Native.

### ./storybook directory

This is where your stories will be registered and where the Storybook configs will live.

### ./test directory

This directory will hold your Jest configs and mocks, as well as your [storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) test file. This is a file that contains the snapshots of all your component storybooks.

## Running Storybook

From the command line in your generated app's root directory, enter `yarn run storybook`
This starts up the storybook server and opens a story navigator in your browser. With your app
running, choose Toggle Storybook from the developer menu to switch to Storybook; you can then
use the story navigator in your browser to change stories.

For Visual Studio Code users, there is a handy extension that makes it easy to load Storybook use cases into a running emulator via tapping on items in the editor sidebar. Install the `React Native Storybook` extension by `Orta`, hit `cmd + shift + P` and select "Reconnect Storybook to VSCode". Expand the STORYBOOK section in the sidebar to see all use cases for components that have `.story.tsx` files in their directories.

## Running e2e tests

Read [e2e setup instructions](./e2e/README.md).

## Previous Boilerplates

- [2018 aka Bowser](https://github.com/infinitered/ignite-bowser)
- [2017 aka Andross](https://github.com/infinitered/ignite-andross)
- [2016 aka Ignite 1.0](https://github.com/infinitered/ignite-ir-boilerplate-2016)
