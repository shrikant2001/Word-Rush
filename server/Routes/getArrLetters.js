const getArrLetters = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzaeiourtpsdhlbnm';
    const limit = chars.length;
    var arr = [];
    const lenArr = Math.floor((Math.random() * 2) + 3);

    for (let i = 0; i < lenArr; i++) {
        const idx = Math.random() * limit;
        arr.push(chars.charAt(idx));
    }
    return arr;
}
module.exports = getArrLetters;