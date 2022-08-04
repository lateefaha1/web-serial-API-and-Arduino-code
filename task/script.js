    var port, textEncoder, writableStreamClosed, writer;
        async function connectSerial() {
            try {
                // Prompt user to select any serial port.
                port = await navigator.serial.requestPort();
                await port.open({ baudRate: 9600 });
                textEncoder = new TextEncoderStream();
                writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
                writer = textEncoder.writable.getWriter();
                listenToPort();
            } catch {
                alert("The Serial Connection has Failed");
            }
        }
        function record() {
            var recognition = new webkitSpeechRecognition();
            recognition.onresult = function (event) {
                var a = document.getElementById('textarea').value = event.results[0][0].transcript;
                if (a == "يمين" || a == "right") {
                    console.log(a)
                    sendSerialLine();
                }else if(a == "يسار" || a == "left") {
                    console.log(a)
                    sendSerialLineB();
                }
            }
            recognition.start();
        }


        document.querySelector('button').addEventListener('click', async () => {
          // Prompt user to select any serial port
            const port = await navigator.serial.requestPort();
            // Wait for the serial port to open.
            await port.open({ baudRate: 9600 });
        });

        async function listenToPort() {
            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            const reader = textDecoder.readable.getReader();
            // Listen to data coming from the serial device.
            while (true) {
                const {value, done} = await reader.read();
                if (done) {
                    // Allow the serial port to be closed later.
                    reader.releaseLock();
                    break;
                }
                appendToTerminal(value);
            }
        }
        async function sendSerialLine() {dataToSend = 'A'
            dataToSend = dataToSend + "\r\n";
            await writer.write(dataToSend);
        }
        async function sendSerialLineB() {
            dataToSend = 'B'
            dataToSend = dataToSend + "\r\n";
            await writer.write(dataToSend);
        }
