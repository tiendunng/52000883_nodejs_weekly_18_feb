// Import các thư viện cần thiết
const http = require("http");
const querystring = require("querystring");
const fs = require("fs");
const path = require('path');

// PORT
const PORT = 3000

// Create server
const server = http.createServer((req, res) => {
    // Nếu request có đuôi url là /
    if (req.url === "/") {
        // Set content-type cho bên Client
        res.writeHead(200, { "Content-Type": "text/html" });

        // Đọc file form.html
        fs.readFile(path.join(__dirname, 'views/form.html'), (err, data) => {
            // Nếu xảy ra lỗi
            if (err) throw err;

            // Gửi response cho bên client
            res.write(data);

            // Kết thúc res
            res.end();
        });

    // Nếu req có đuôi url là /login và gửi bởi method POST
    } else if (req.url === "/login" && req.method === "POST") {
        let body = "";

        // Lắng nghe sự kiện data
        req.on("data", (chunk) => {
            // Thu nhập các chunk của yêu cầu và gộp lại thành một chuỗi
            body += chunk.toString();
        });

        // Lắng nghe sự kiện end
        req.on("end", () => {
            // Phân tích chuỗi thành một đối tượng dữ liệu
            const formData = querystring.parse(body);

            // Set content-type cho bên Client
            res.writeHead(200, { "Content-Type": "text/html" });

            // Đọc file success.html
            fs.readFile(path.join(__dirname, 'views/login.html'), (err, data) => {
                // Xảy ra lỗi thì throw ra
                if (err) throw err;
                
                // Chuyển thành object data tương ứng
                const formData = querystring.parse(body);

                let modifiedData = ''

                // Trường hợp thiếu email hoặc password
                if(formData.email && formData.pass) {
                        // Thay thế cặp thẻ span bởi chuỗi mới nối
                        modifiedData = data
                        .toString()
                        .replace('<span id="result"></span>', "Đăng nhập thành công!");
                } else {
                    modifiedData = data
                    .toString()
                    .replace('<span id="result"></span>', 'Email hoặc mật khẩu không hợp lệ!');
                }

                // Gửi res cho client và kết thúc
                res.write(modifiedData);
                res.end();
            });
        });

    // Nếu req có đuôi url là /success
    } else if (req.url.startsWith("/login")) {
        // Trường hợp nhập email và password thông qua URL
        res.writeHead(404, {"Content-Type": "text/html; charset=utf-8"});
        res.write("Phương thức GET không được hỗ trợ!");
        res.end();
        
    } else {
        // Trường hợp nếu đường dẫn không hợp lệ
        res.writeHead(404, {"Content-Type": "text/html; charset=utf-8"});
        res.write("Đường dẫn không hợp lệ!");
        res.end();
    }
});

// Lắng nghe PORT
server.listen(PORT, () => {
    console.log("Máy chủ đang lắng nghe trên cổng " + PORT);
});
