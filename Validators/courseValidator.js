const Joi = require('joi');

module.exports = (checks, data) => {

    let check = { };
    let checkList = {
        courseName: Joi.string().min(4).required(),
        courseBoard : Joi.string().required(),
        verified: Joi.boolean(),
        
    }

    checks.split(' ').forEach(key => {
        let trimmedKey = key.trim();

        if(trimmedKey && checkList[trimmedKey]) {
            check[`${trimmedKey}`] = checkList[`${trimmedKey}`];
        }
    });

    const schema = Joi.object(check);

    const { error } = schema.validate(data);

    if (error) {
        return false;
}
    return true;
}
