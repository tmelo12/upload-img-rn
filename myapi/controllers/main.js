function index(req, res, next) {
    res.status(200).json({ data: 'Hello World' })
}
function upload(req, res, next) {
    console.log('upload photo')
    const uriImg = req.body[1].uri;
    console.log(uriImg);
    /*
    let raw = Buffer.from(uriImg).toString('base64');

    console.log('Raw => ', raw)

    let imgBase64 = `data:${req.body[1].type};base64,`+raw; // data:image/jpeg,base64

    console.log('ImgBase64 Completed => ', imgBase64)

    require("fs").writeFile(`img.jpeg`, imgBase64, 'base64', function(err) {
        console.log(err);
    });)*/
}
module.exports = { index, upload }