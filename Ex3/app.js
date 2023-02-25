// Import các thư viện cần thiết
const http = require('http');
const url = require('url');

// PORT
const PORT = 3000;

// Data Object
let students = [
    { id: 1, name: 'Hoàng Danh', age: 20 },
    { id: 2, name: 'Vĩnh Hoà', age: 17 },
    { id: 3, name: 'Hoài An', age: 14 }
];

const server = http.createServer((req, res) => {
    // Lấy method và URL gửi đến
    const { method, url: reqUrl } = req;

    // Phân tách URl ra thành Giá trị Path
    const { pathname } = url.parse(reqUrl);

    // Lấy id từ pathname
    const id = pathname.split("/")[2];

    // Định nghĩa dữ liệu trả về từ server sẽ là dạng JSON
    res.setHeader('Content-Type', 'application/json');

    // Xét case cho từng Path tương ứng
    switch (pathname) {
        // Path là /students
        case '/students':
            // Xét các Method tương ứng
            switch (method) {
                case 'GET':
                    // Trả về chuỗi JSON về kết thúc res
                    res.end(JSON.stringify(students));
                    break;
                case 'POST':
                    let body = '';

                    // Lắng nghe sự kiện data
                    req.on('data', (chunk) => {
                        // Thu nhập các chunk của yêu cầu và gộp lại thành một chuỗi
                        body += chunk.toString();
                    });
                    
                    // Lắng nghe sự kiện end
                    req.on('end', () => {
                        // Lấy object JSON
                        let objData = JSON.parse(body);

                        // Trường hợp có phần tử
                        if(students.length != 0) {
                            // Set id bằng last id + 1
                            objData.id = students[students.length - 1].id + 1;

                        // Trường hợp object rỗng
                        } else objData.id = 1;

                        // Thêm vào mảng
                        students.push(objData);

                        // Gửi thông báo và kết thúc res
                        res.end(JSON.stringify({ message: 'Student added' }));
                    });
                    break;

                // Không có method phù hợp
                default:
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Bad Request' }));
                    break;
            }
            break;

        // Path là /students/{id}
        case '/students/' + id:
            // Xét các Method tương ứng
            switch (method) {
                case 'GET':
                    // Tìm kiếm object giống với yêu cầu
                    const student = students.find((s) => s.id == id);

                    // Nếu tìm thấy
                    if (student) {
                        // Trả về phần tử đó và kết thúc res
                        res.end(JSON.stringify(student));
                    } else {
                        // Không tìm thấy sẽ đưa ra lỗi
                        res.statusCode = 404;
                        res.end(JSON.stringify({ error: 'Not Found' }));
                    }
                    break;
                case 'PUT':
                    let body = '';

                    // Lắng nghe sự kiện data
                    req.on('data', (chunk) => {
                        // Thu nhập các chunk của yêu cầu và gộp lại thành một chuỗi
                        body += chunk.toString();
                    });

                    // Lắng nghe sự kiện end
                    req.on('end', () => {
                        // Tìm kiếm id giống với yêu cầu
                        const studentIndex = students.findIndex((s) => s.id == id);

                        // Nếu tìm thấy
                        if (studentIndex >= 0) {
                            // Lấy object từ phía client
                            let objData = JSON.parse(body);

                            // Chuyển kiểu string sang int
                            objData.id = parseInt(id);

                            // Cập nhật lại phần tử
                            students[studentIndex] = objData;

                            // Thông báo và kết thúc res
                            res.end(JSON.stringify({ message: 'Student updated' }));
                        } else {
                            // Không tìm thấy id
                            res.statusCode = 404;
                            res.end(JSON.stringify({ error: 'Not Found' }));
                        }
                    });
                    break;
                case 'DELETE':
                        // Tìm kiếm id giống với yêu cầu
                    const studentIndex = students.findIndex((s) => s.id == id);

                    // Nếu tìm thấy
                    if (studentIndex >= 0) {
                        // Xoá phần tử tại index tìm được
                        students.splice(studentIndex, 1);

                        // Thông báo và kết thúc res
                        res.end(JSON.stringify({ message: 'Student deleted' }));
                    } else {
                        // Không tìm thấy
                        res.statusCode = 404;
                        res.end(JSON.stringify({ error: 'Not Found' }));
                    }
                    break;

                // Không có method phù hợp
                default:
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Bad Request' }));
                    break;
            }
            break;

        // Không có path name phù hợp
        default:
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Bad Request' }));
    }
});

// Lắng nghe PORT
server.listen(PORT, () => {
    console.log("Máy chủ đang lắng nghe trên cổng " + PORT);
});