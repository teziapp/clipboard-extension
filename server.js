

(async function () {
    const val = await new Promise((res, rej) => {
        console.log('hi')
        res(1)
    }).then((res) => {
        return 5;
    })
    console.log(val)
})()