This project contains the basic functionality of an accelerometer (MPU-6050) sending data to Max via Bluetooth LE. It consists of 3 elements:

## Arduino code
The Arduino sketch has been tested on a Uno and a Pro Mini 3.3v with the MPU-6050 and a HM-10 BLE device attached. With the Pro Mini the whole device can be powered with 2 x CR2032 coin cells.

## Node.js code
The program that connects to the device from the computer runs on Node.js (tested with v7.6.0), so it will need to be installed. 
Then, the packages have to be installed by running `npm install` in this folder from the terminal. Then simply run `node ble-osc.js` and you'll see it display the discovered devices. 
You'll probably have to modify the file `ble-osc.js` to match your device name.

## Max 7 patch
Receives the OSC messages and routes the different addresses.

Many things can be improved, and there are some issues that need to be fixed, so pull requests are welcome.
