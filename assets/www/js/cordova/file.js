(function (Cordova, undefined) {
  "use strict";

  // wrapper around cordova file api
  // TEMPORARY works in Ripple
  // PERSISTENT is bugged in Ripple
  //
  // api:
  // 
  //  Cordova.File.Read("test.txt", function (err, text) {
  //    if (err)
  //      return console.log("error !");
  //    console.log(text);
  //  });
  //
  //  Cordova.File.Write("test.txt", "some text", function (err) {
  //    if (err)
  //      return console.log("error !");
  //  });
  //

  // FileError is the only parameter of any of the File API's error callbacks.
  // @see http://docs.phonegap.com/en/2.4.0/cordova_file_file.md.html#FileError
  var getErrorMessage = function (evt) {
    try {
      for (var errorCodeName in FileError) {
        if (typeof FileError[errorCodeName] !== "function" &&
            FileError[errorCodeName] === evt.target.error.code) {
          return "error " + msg + " " + i;
        }
      }
    } catch (e) { return "exception in error handler " + msg + " " + e; }
    return "unknown error " + msg;
  };

  var requestFileSystem = function (callback) {
    if (!window.requestFileSystem)
      return callback("Can't access Cordova requestFileSystem");
    window.requestFileSystem(
      LocalFileSystem.PERSISTENT,
      0,
      function success(result) { callback(null, result) },
      function error(evt) { callback(getErrorMessage(evt)) }
    );
  };

  var getFileEntryFromDirectory = function (directory, filename, options, callback) {
    directory.getFile(
      filename,
      options,
      function success(result) { callback(null, result); },
      function error(evt) { callback(getErrorMessage(evt)) }
    );
  };

  var getFileEntryFromRootDirectory = function (filename, options, callback) {
    requestFileSystem(function (err, filesystem) {
      if (err)
        return callback(err);
      getFileEntryFromDirectory(
        filesystem.root,
        filename,
        options,
        callback);
    });
  };

  var File = {
    read: function (filename, callback) {
      getFileEntryFromRootDirectory(filename, null, function (err, fileEntry) {
        if (err)
          return callback(err);
        // reading file.
        fileEntry.file(
          function success(file) {
            var reader = new FileReader();
            reader.onloadend = function (evt) { callback(null, evt.target.result) };
            reader.onerror = function (evt) { callback("file reader error") };
            reader.readAsDataURL(file);
          },
          function error(evt) { callback(getErrorMessage(evt)) }
        );
      });
    },

    write: function (filename, data, callback) {
      getFileEntryFromRootDirectory(String(filename), { create: true, exclusive: false }, function (err, fileEntry) {
        if (err)
          return callback(err);
        // write file.
        fileEntry.createWriter(
          function success(writer) {
            writer.onwrite = function success(evt) { callback() };
            writer.onerror = function error(evt) { callback("file writer error") };
            writer.write(String(data));
          },
          function error(evt) { callback(getErrorMessage(evt)) }
        );
      });
    }
  };

  // registering file only when cordova is ready.
  Cordova.ready(function () {
    Cordova.File = File;

    // #BEGIN_DEV
    // test de l'ecriture
    var now = new Date().getTime();
    console.log("DEV: test writing " + now + " in temp.text");
    File.write('temp.txt', now, function (err) {
      if (err)
        return console.log("error: " + err);
      // test de la lecture
      console.log('ecriture dans temp.txt OK');
      File.read('temp.txt', function (err, data) {
        if (err)
          return console.log("erreor: " + err);
        console.log('lecture dans temp.txt de ' + data);
        //
        assert(data === String(now));
      });
    });
    // #END_DEV
  });
})(Cordova);