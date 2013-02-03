# onigiri #
Web Storage JS library  - simple & delicious

With Onigiri you can:

- create and manage database directly on user browser
- create, update, delete and search records in database
- keep data for a looong time (WebStorage is not cleaned after user closes browser)
- exchange information between browser tabs
- and many, many more...

Onigiri is a lightweight library : 1,2KB.

Onigiri is extending basic API of WebStorage giving you more natural approach to managing database on user side.
Learn more about WebStorage at <http://en.wikipedia.org/wiki/Web_storage/>.

## Instalation ##
```html
<script src="onigiri.db.min.js"></script>
```

## Examples ##

Saving data
```js
// first you have to set name for you database
var db = onigiri.db.set('my-db');

// now you can save some settings
db.save('settings', [
    {
        id: 'coordinates',
        x: 50,
        y : 120
    }
]);

// and user list
db.save('users', [
    {
        name: 'John',
        age : 29,
    },
    {
        name: 'Jane',
        age : 30
    }
]);

```

Reading data
```js
// set name for you database
var db = onigiri.db.set('my-db');

// save data and read by id
db.save('settings', [
    {
        id: 'coordinates',
        x: 50,
        y : 120
    }
]);

coordinates = db.findById('settings', 'coordinates');

// save data and find by condition
db.save('users', [
    { name: 'John', age : 25 },
    { name: 'Jane', age : 45 },
    { name: 'Marry', age : 25 },
]);

// find all users who are 25 years old
users = db.find('users', {
    age: 25
});

// users will contain John and Marry
console.log(users);
```

Updating data
```js
// set name for you database
var db = onigiri.db.set('my-db');

db.save('users', [
    {
        id : 1234,
        name: 'John',
        age : 29,
        address : {
            city : 'Yokohama',
            country : 'Japan'
        }
    }
]);

// find user by id
john = db.findById('users', 1234);

// John is getting older
john.age = 30;

db.save('users', [ john ]);
```

Removing data
```js
// set name for you database
var db = onigiri.db.set('my-db');

// remove user
db.remove('users', 1234);

```

Using onUpdate event
```js
// set name for you database
var db = onigiri.db({
    name: 'my-db',
    onUpdate: function(data) {
        console.log(data);
    }
});

// from now, after any kind of operation on database,
// update event will be broadcasted to all application instances (tabs, windows, etc.)

```

## Future releases ##

- more complex find conditions
- IndexedDB support

## Browser compatibility ##

- Firefox 3.5
- IE 8.0
- Chrome 4.0
- Opera 10.5
- Safari 4.0
- Android 2.1
- iOS 3.2

## License ##

Software is licensed under MIT license.
For more information check LICENSE file.