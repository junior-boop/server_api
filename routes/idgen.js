module.exports = function generated_ID(){
    const A = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_'
    let id = ''
    for (let i = 0; i < 6; i++) {
        const random = Math.floor((Math.random() * 100) * 0.63)
        id += A[random]
    }

    return id
}