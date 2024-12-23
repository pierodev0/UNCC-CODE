const fs = require("fs/promises");

(async () => {
  const CREATE_FILE = "create a file"
  const DELETE_FILE = "delete a file"
  const RENAME_FILE = "rename the file"
  const ADD_TO_THE_FILE = "add to the file"

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

  const deleteFile = async (path) => {
    try {
      await fs.unlink(path)
      console.log("File was deleted succesfully")
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("No file at this path to remove")
      } else {
        console.log("An error ocurred while removing the file")
        console.log(error)
      }
    }
  }

  const renameFile = async (oldPath, newPath) => {
    try {
      const existingFileHandle = await fs.open(oldPath, "r")
      await fs.rename(oldPath, newPath)
      console.log(`Rename ${oldPath} to ${newPath}`)

      existingFileHandle.close();
    } catch (error) {
      console.log("The file doesn't exist")
    }
  }

  let addedContent;

  const addToFile = async (path, content) => {
    if (addedContent === content) return
    try {
      const fileHandle = await fs.open(path, "a")
      fileHandle.write(content)
      addedContent = content;
      console.log("the content was added succesfully")
    
    } catch (error) {
      console.log("An error ocurred while adding content to the file")
    }
  }

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

    // Create a file
    // create the file <path>
    if (command.includes(CREATE_FILE)) {
      const path = command.substring(CREATE_FILE.length + 1)
      createFile(path)
    }

    //Delete a file
    //Delete the file <path>
    if (command.includes(DELETE_FILE)) {
      const path = command.substring(DELETE_FILE.length + 1)
      deleteFile(path)

    }

    //Rename a file
    //rename the file <path> to <new-path>
    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldPath = command.substring(RENAME_FILE.length + 1, _idx)
      const newPath = command.substring(_idx + 4)
      renameFile(oldPath, newPath)

    }

    //Add to file: 
    //Add to the file <path> this content: <content>
    if (command.includes(ADD_TO_THE_FILE)) {
      const _idx = command.indexOf(" this content ");
      const filePath = command.substring(ADD_TO_THE_FILE.length + 1, _idx)
      const content = command.substring(_idx + 15)
      addToFile(filePath, content)
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