
# react-native-vector-db

## Getting started

`$ npm install react-native-vector-db --save`

### Mostly automatic installation

`$ react-native link react-native-vector-db`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-vector-db` and add `RNVectorDb.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNVectorDb.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNVectorDbPackage;` to the imports at the top of the file
  - Add `new RNVectorDbPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-vector-db'
  	project(':react-native-vector-db').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-vector-db/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-vector-db')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNVectorDb.sln` in `node_modules/react-native-vector-db/windows/RNVectorDb.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Vector.Db.RNVectorDb;` to the usings at the top of the file
  - Add `new RNVectorDbPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNVectorDb from 'react-native-vector-db';

// TODO: What to do with the module?
RNVectorDb;
```
  