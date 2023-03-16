const { totp } = require('otplib');
const crypto = require('crypto');
module.exports = () =>
{
    const secret = crypto.randomBytes(128).toString('hex'); //creating the secret key for the otp
    const token = totp.generate(secret); //generating token for the otp using the secret key
    console.log(typeof(token));
    const isValid = totp.check(token, secret); //checking in the server if the otp can be verified
    console.log(isValid);
    
    
    
    return {token, secret}
}
