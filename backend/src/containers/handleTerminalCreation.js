export const handleTerminalCreation = (container, ws) => {
    container.exec({
        Cmd: ["/bin/bash"],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        User: "sandbox",
    }, (err, exec) => {
        if(err) {
            console.log("Error while creating exec", err);
            return;
        }

        exec.start({
            hijack: true,
        }, (err, stream) => {
            if(err) {
                console.log("Error while starting exec", err);
                return;
            } 

            processStreamOutput(stream, ws);

            ws.on("message", (data) => {
                if(data.toString() === "getPort") {
                    container.inspect((err, inspectData) => {
                        const port = inspectData.NetworkSettings;
                        console.log(port);
                    })
                    return;
                }
                stream.write(data);
            })
        })
    })
}

function processStreamOutput(stream, ws) {
    let nextDataType = null; 
    let nextDataLength = null; 
    let buffer = Buffer.from("");

    function processStreamData(data) {
        if(data) {
            buffer = Buffer.concat([buffer, data]); 
        }

        let processing = true;
        while (processing) {
            processing = false;
            
            if(!nextDataType) {
                if(buffer.length >= 8) {
                    const header = bufferSlicer(8);
                    nextDataType = header.readUInt32BE(0); 
                    nextDataLength = header.readUInt32BE(4); 
                    processing = true; 
                }
            } else {
                if(buffer.length >= nextDataLength) {
                    const content = bufferSlicer(nextDataLength); 
                    ws.send(content); 
                    nextDataType = null; 
                    nextDataLength = null;
                    processing = true; 
                }

                
            }
        }
    }

    function bufferSlicer(end) {
        const output = buffer.slice(0, end); 
        buffer = Buffer.from(buffer.slice(end, buffer.length)); 

        return output;

    }

    stream.on("data", processStreamData);

}
