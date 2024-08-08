const fs = require("fs/promises");

(
    async () => {
        try {
            await fs.copyFile("text.txt","text-promise.txt")
        } catch (error){
            console.log(error)
        }
    }
)();


// const fs = require("fs");

// fs.copyFile("text.txt","text-callback.txt",(error)=> {
//     if(error) console.log(error)
// })

// const fs = require("fs");

// fs.copyFileSync("text.txt","text-sync.txt")