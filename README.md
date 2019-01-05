# Ganymede

![Icon][0]

Ganymede is a node module for working with the 2019 Schedule of the Overwatch League.

## Schedule Data

The schedule data can come from one of two places, using the locally stored [JSON][1] file
available in the assets folder, or by connecting to the MongoDB instance HassleFree Solutions has
setup. The key difference between the two is the MongoDB method ensures you'll be receiving the
latest data, as things *do* change and times may not be 100% correct in the [JSON][1] file.

The decision for which source to use is based on whether or not you install the optional dependency
of [Mongoose][2]. If it's installed, a connection is made to the MongoDB server, otherwise the
[JSON][1] is used.

[0]: ./assets/img/icon.png
[1]: ./assets/2019-01_Schedule.json
[2]: https://mongoosejs.com/
