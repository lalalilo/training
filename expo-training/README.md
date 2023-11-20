# Lalilo Expo Training
Step by step training about [Expo](https://expo.dev/), the recommended metaframework for [React Native](https://reactnative.dev/).

This app is supposed to be used as a teacher support companion, allowing the teacher to take photo, editing it, and send it directly to the support.

## Prerequesites
- install [Expo Go](https://expo.dev/client) on your phone
- install [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall)
- use Node 18
- install VS code [plugin](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)

## Installation
- `git checkout expo-training-0`
- `yarn install`
- `yarn start`
- Scan the QR code from **Expo Go** app to launch the preview

## Steps
### Step 1: take a photo 📷
*shortcut*: `git checkout expo-training-1`

- ask camera permission to the user
- display current camera view
- when a picture is taken, display it in place of the camera view
- add a button to delete taken picture and go back to camera view

### Step 2: Edit photo: resize 🔍
*shortcut*: `git checkout expo-training-2`

- use `react-native-gesture-handler` and `react-native-animated` to detect & animate this gesture: https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pinch-gesture#example
- create one hook to handle **Pinch** gesture
- the hook will update its state `onUpdate` based on the event parameter and save the final value `onEnd`
- each gesture will influence a [transform](https://reactnative.dev/docs/transforms) property of the image
- **Pinch** is used to zoom, so it should change the `scale` property

### Step 3: Edit photo: position ↔️
*shortcut*: `git checkout expo-training-3`

- use `react-native-gesture-handler` to detect this gesture and to compose the two gestures
- create one hook to handle **Pan** gesture
- **Pan** is used to move, so it should change the `translateX` and `translateY` properties

### Step 4: Edit photo: rotate 😵‍💫
*shortcut*: `git checkout expo-training-4`

- use `react-native-gesture-handler` to detect this gesture and to compose with others
- create one hook to handle **Rotation** gesture
- **Rotation** is used to rotate, so it should change the `rotate` property

### Step 5: Save edited image 💾
*shortcut*: `git checkout expo-training-5`

- add a button to take a screenshot of the modified picture thanks to `react-native-viewshot`
- display the saved picture on main screen with a success message
- add a button to create a new issue from scratch

## Useful packages
- [camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation)
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started)
- [react-native-view-shot](https://github.com/gre/react-native-view-shot)
- to install a package, use `yarn expo install <package-name>` to install the correct version of the package for your react native app.

## Useful links
- [Expo tutorial](https://docs.expo.dev/tutorial/introduction/)
- [curated list of React Native packages](https://reactnative.directory/)
