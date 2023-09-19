const cryptoJs=require('crypto-js')
const dotenv=require('dotenv').config()

exports.encryptData=(data)=>{
    let cipherText=cryptoJs.AES.encrypt(data,process.env.CRYPTO_SECRET).toString()
    
    return cipherText

}

exports.decryptData=(cipherText)=>{
    let bytes=cryptoJs.AES.decrypt(cipherText,process.env.CRYPTO_SECRET)
    let data=bytes.toString(cryptoJs.enc.Utf8)

    return data
}