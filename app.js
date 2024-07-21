const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log(req);

    const url = req.url;
    const httpMethod = req.method;

    if (url === '/') {
        res.write(`
            <html><body>Send your message!<form action="/message" method="POST">
            <input type="text" name="message"/><input type="text" name="message2"/><button type="submit">Send</button></form></body></html>
        `);
    }

    if (url === '/message' && httpMethod === 'POST') {
        const body = [];

        req.on('data', chunk => {
            body.push(chunk);
        });

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody)
            fs.writeFileSync('message.txt', parsedBody);
        })

        res.statusCode = 302;
        res.setHeader('Location', '/');
        const a = res.end();
        return;
    }
});

server.listen(3000);
