# Split secrets

## Share format

Field | Size | Comment
---|---|---
VERSION | 2 bits | Current value: '00'. Used to keep compatibility when changing the format in the future
SECRET_FORMAT | 2 bits | How the secret was originally encoded. Values: Raw bytes('00'), Hex string('01'), Base64 string('10')
CONSTANT_SIZE_SHARES | 1 bit | Indicates that constant size shares were used. The reconstruction of the secret will require additional encrypted data.
RESERVED | 3 bits | Default value: '000'. Reserved for future use
THRESHOLD | 8 bits | The number of shares needed to reveal the secret again
SECRET_JS_SHARE | 4 * `n` bits, with `n` being any natural number | The share I got from the reveal.js library. Flexible length, but is a multiple of 4 bits.
CHECKSUM | 16 bits | Calculated by turning all data before this field into a hex string, and then getting the CRC16 of that value.

### Formating
The shares will be output as a hex string.

The characters can be visually grouped into chunks using whitespaces (or dashes, underscores, etc).
That should make it easier to input a potentially long code by hand.
Example (4 chars per block, double space after every 4 blocks):
`abcdefghijklmnopqrstuvwxyz` => `abcd efgh ijkl mnop  qrst uvwx yz`

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
