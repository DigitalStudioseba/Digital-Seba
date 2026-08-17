const fs = require('fs');
let c = fs.readFileSync('C:/Users/Monir/Downloads/Compressed/main project/digiseba.shop/resources/index.html', 'utf8');
const searchStr = '<script src="../assets/js/main.js"></script>';
const replaceStr = '<script src="../assets/js/main.js"></script>\n<script src="../assets/js/resources-render.js"></script>';
if(c.includes('<script src="../assets/js/resources-render.js"></script>')) {
    console.log("Already injected");
} else {
    c = c.split(searchStr).join(replaceStr);
    fs.writeFileSync('C:/Users/Monir/Downloads/Compressed/main project/digiseba.shop/resources/index.html', c);
    console.log("Injected");
}
