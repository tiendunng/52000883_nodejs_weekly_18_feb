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

    // Nếu req có đuôi url là /submit-form và gửi bởi method POST
    } else if (req.url === "/submit-form" && req.method === "POST") {
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

            // Ghi các tham số cần thiêt vào url và chuyển hướng trang
            res.writeHead(302, {
                Location: `result?num1=${formData.num1}&num2=${formData.num2}&cal=${formData.cal}`,
            });

            // Kết thúc res
            res.end();
        });

    // Nếu req có đuôi url là /success
    } else if (req.url.startsWith("/result")) {
        // Set content-type cho bên Client
        res.writeHead(200, { "Content-Type": "text/html" });

        // Đọc file success.html
        fs.readFile(path.join(__dirname, 'views/success.html'), (err, data) => {
            // Xảy ra lỗi thì throw ra
            if (err) throw err;

            // Cắt chuỗi bởi dấu ? và lấy chuỗi có các tham số
            const query = req.url.split("?")[1];
            
            // Chuyển thành object data tương ứng
            const formData = querystring.parse(query);
            let modifiedData = ''

            // Số không chọn số hạng
            if(formData.num1 && formData.num2) {
                // Trường không chọn phép tính
                if(formData.cal != "default") {
                    // Trường hợp mẫu bằng 0
                    if(parseFloat(formData.num2) == 0 && formData.cal === "chia") {
                        modifiedData = data
                        .toString()
                        .replace('<span id="result"></span>', 'Vui lòng chọn mẫu khác 0!');
                    } else {
                        // Thực hiện phép toán
                        let makeCal = formData.cal === "cong" ? parseFloat(formData.num1) + parseFloat(formData.num2) :
                                    formData.cal === "tru" ? parseFloat(formData.num1) - parseFloat(formData.num2) :
                                    formData.cal === "nhan" ? parseFloat(formData.num1) * parseFloat(formData.num2) :
                                    formData.cal === "chia" ? parseFloat(formData.num1) / parseFloat(formData.num2) : 0
        
                        // Tái sử dụng object để thực hiện đoạn nối chuỗi in ra file HTML
                        formData.cal = formData.cal === "cong" ? '+' :
                                    formData.cal === "tru" ? '-' :
                                    formData.cal === "nhan" ? '*' :
                                    formData.cal === "chia" ? '/' : 0
        
                        // Nối chuỗi
                        let stringResult = formData.num1 + ' ' + formData.cal + ' ' + formData.num2 + ' = ' + makeCal;
                        
                        // Thay thế cặp thẻ span bởi chuỗi mới nối
                        modifiedData = data
                        .toString()
                        .replace('<span id="result"></span>', stringResult);
                    }
                } else {
                    modifiedData = data
                    .toString()
                    .replace('<span id="result"></span>', 'Bạn chưa chọn phép toán!');
                }
            } else {
                modifiedData = data
                .toString()
                .replace('<span id="result"></span>', 'Vui lòng nhập đủ các số hạng!');
            }

            // Gửi res cho client và kết thúc
            res.write(modifiedData);
            res.end();
        });
        
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
