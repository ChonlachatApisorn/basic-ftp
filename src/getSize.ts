const internal = require("stream");
const ftp = require("basic-ftp");
const fs = require("fs");
const { Writable } = require("stream");

async function getSize() {
  const path = "/ftp/one/test_FTP.xlsx";
  const client = new ftp.Client();

  client.ftp.verbose = true;

  try {
    await client.access({
      host: "192.168.1.92",
      user: "one",
      password: "1234",
      secure: false,
    });
    // console.log(await client.list());
    // await client.remove("test_FTP.xlsx");
    // await client.uploadFrom("test.xlsx", "test_FTP.xlsx");

    const size = await client.size(path);
    const halfSize = size / 2;
    let fileBuffer = Buffer.from([]);
    const writeable = new Writable();

    writeable._write = (chunk, encoding, callback) => {
      callback();
      console.log(chunk);

      fileBuffer = Buffer.concat([fileBuffer, chunk]);
    };
    console.time("download");

    await client.downloadTo(writeable, path);

    console.timeEnd("download");
    console.log({ fileSize: size / 1000 / 1000 });
    console.log({ fileHalfSize: size / 1000 / 1000 / 2 });
    console.log(fileBuffer);
    console.log(fileBuffer.length);
  } catch (err) {
    console.log(err);
  }
  client.close();
}

getSize();
