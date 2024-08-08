const fs = require("fs/promises");

(async () => {

  const commandFileHandler = await fs.open("./command.txt", "r");

  const createFile = async (path) => {
    try {
      const existingFileHandle = await fs.open(path, "r")
      existingFileHandle.close();

      //We already have that file...
      return console.log(`The file ${path} already.exist`)
    } catch (error) {
      //Whe dont have the file, now we should create it
      const newFileHandle = await fs.open(path, "w");
      console.log("A new file was succesfully created")
      newFileHandle.close();
    }

  }
  const CREATE_FILE = "create a file"
  commandFileHandler.on("change", async () => {
    // get the size of our file
    const size = (await commandFileHandler.stat()).size;
    // allocate our buffer with the size of the file
    const buff = Buffer.alloc(size);
    // the location at which we want to start filling our buffer
    const offset = 0;
    // how many bytes we want to read
    const length = buff.byteLength;
    // the position that we want to start reading the file from
    const position = 0;

    // we always want to read the whole content (from beginning all the way to the end)
    await commandFileHandler.read(
      buff,
      offset,
      length,
      position
    );
    const command = buff.toString("utf8");
    if (command.includes(CREATE_FILE)) {
      const path = command.substring(CREATE_FILE.length + 1)
      createFile(path)
    }

  });

  // watcher...
  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();