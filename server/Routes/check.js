const Spell = require('spellchecker');

const check = (data) => {

    var flag = false;
    if (data.length > 45) {
        flag = false;
    } else {
        if (/\s/g.test(data)) {
            //contains space
            flag = false;
        } else {
            if (data.length > 16) {
                flag = false;
            } else {
                if (Spell.isMisspelled(data)) {
                    flag = false;
                } else {
                    flag = true;
                }
            }
        }
    }
    // console.log(flag);
    return flag;
}


module.exports = check;