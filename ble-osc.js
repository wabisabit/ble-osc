/**
 * ble-osc
 * Scans for BLE devices and connects to the one specified in bleName.
 * Automatically tries to reconnect if disconnected
 */

let noble = require('noble');
let osc = require('osc');
let udpReady = false;
let buffer = '';

const bleName = 'HMSoft'; // Change to name of Bluetooth device
const oscPort = 57121;

noble.on('stateChange', state => {

	console.log( state );

	if ( state === 'poweredOn' ) {

		noble.startScanning( [], false, error => {
			console.log( 'Available devices:' );
			if ( error !== null )	console.error( error );
		});

	}

});

const udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: oscPort
});
// Open the socket.
udpPort.open()

noble.on( 'discover', peripheral => {

	if ( peripheral.connectable ) {
		console.log( peripheral.advertisement.localName );
	}

	if ( peripheral.advertisement.localName === bleName ) {

		peripheral.connect( error => {

			if ( error === undefined ) {

				console.log( '\x1b[36m%s\x1b[0m', 'Connected to ' + bleName );

				peripheral.once( 'disconnect', () => {
					console.log( '\x1b[31m%s\x1b[0m', 'Disconnected from ' + bleName )
					noble.startScanning();
				});

				peripheral.discoverAllServicesAndCharacteristics( ( error, services, characteristics ) => {

					if ( error === null ) {

						// console.log( characteristics );
						let characteristic = characteristics[ 0 ];

						characteristic.subscribe( error => {

							if ( error === null ) {

								console.log( '\x1b[36m%s\x1b[0m', 'Working' );

							} else {
								console.error( error );
							}

						});

						// TODO if doesn't start receiving data restart connection
						characteristic.on( 'data', ( data, isNotification ) => {

							buffer += data.toString();

							// console.log( '\x1b[36m%s\x1b[0m', buffer );
							let start = buffer.indexOf( '<' );
							let end = buffer.indexOf( '>' );

							if ( start !== -1 && end !== -1 ) {

								let motion = buffer.slice( start + 1, end );
								// console.log( '\x1b[36m%s\x1b[0m', motion );
								motion = motion.split( '_' );

								if ( motion.length === 4 ) {

									// TODO deal with NaNs
									udpPort.send({
										address: '/angle/alpha',
										args: motion[0]
									}, '127.0.0.1', 57110 );
									udpPort.send({
										address: '/angle/beta',
										args: motion[1]
									}, '127.0.0.1', 57110 );
									udpPort.send({
										address: '/angle/theta',
										args: motion[2]
									}, '127.0.0.1', 57110 );
									udpPort.send({
										address: '/accel',
										args: motion[3]
									}, '127.0.0.1', 57110 );
								}

								buffer = buffer.slice( end + 1 );
							}
						});

					} else {

						console.error( error );

					}
				});

			} else {

				console.error( error );

			}
		});
	}
});
