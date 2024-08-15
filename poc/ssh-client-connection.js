

const { Client } = require("ssh2")

const client = new Client();

client.connect({
    host: "192.168.0.70",
    port: 22,
    username: "root",
    password: "pazehlindo"
})

client.on("ready", () => {
    console.log("Client ready")

    client.exec("uptime", {}, (err, stream) => {
        stream.on("data", (content) => {
            console.log(Buffer.from(content).toString("utf-8"))

        });
    })
});