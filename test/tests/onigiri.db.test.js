describe('onigiri.db', function() {
  var db;

  beforeEach(function() {
    db = new onigiri.db({name: 'my'});
  });

  afterEach(function() {
    db.clear();
  });

  it('length is 0 when db empty.', function() {
    var users = db.find('users');
    expect(users).to.be.empty();
  });

  it('after save one data length is 1', function() {
    db.save('users', [{
      name: "Bob",
      age: 22
    }]);
    var users = db.find('users');
    expect(users).to.have.length(1);
  });

  it('findById single result.', function() {
    db.save('settings', [{
      id: 'coordinates',
      x: 50,
      y: 120
    }]);

    var coordinates = db.findById('settings', 'coordinates');
    expect(coordinates).to.eql({
      id: 'coordinates',
      x: 50,
      y: 120
    });
  });

  it('find multiple results.', function() {
    db.save('users', [{
      name: 'John',
      age: 25
    }, {
      name: 'Jane',
      age: 45
    }, {
      name: 'Bob',
      age: 25
    }, {
      name: 'Marry',
      age: 25
    }]);

    var users = db.find('users', {
      age: 25
    });
    expect(users).to.be.an('array');
    expect(users).to.have.length(3);
    expect(users[0]).to.eql({
      name: 'John',
      age: 25,
      id: 0
    });
    expect(users[1]).to.eql({
      name: 'Bob',
      age: 25,
      id: 2
    });
    expect(users[2]).to.eql({
      name: 'Marry',
      age: 25,
      id: 3
    });
  });

  it('find multiple result and select first.', function() {
    db.save('users', [{
      name: 'John',
      age: 25
    }, {
      name: 'Jane',
      age: 45
    }, {
      name: 'Bob',
      age: 25
    }, {
      name: 'Marry',
      age: 25
    }]);

    var users = db.find('users', {
      age: 25
    }, "first");
    expect(users).to.eql({
      name: 'John',
      age: 25,
      id: 0
    });
  });

  it('find multiple result and select last.', function() {
    db.save('users', [{
      name: 'John',
      age: 25
    }, {
      name: 'Jane',
      age: 45
    }, {
      name: 'Bob',
      age: 25
    }, {
      name: 'Marry',
      age: 25
    }]);

    var users = db.find('users', {
      age: 25
    }, "last");
    expect(users).to.eql({
      name: 'Marry',
      age: 25,
      id: 3
    });
  });

  it('update john.age 29 to 30.', function() {
    db.save('users', [{
      id: 1234,
      name: 'John',
      age: 29,
      address: {
        city: 'Yokohama',
        country: 'Japan'
      }
    }]);

    var john = db.findById('users', 1234);
    john.age = 30;
    db.save('users', [john]);
    john = db.findById('users', 1234);
    expect(john.age).to.be(30);
  });

  it('remove a data.', function() {
    db.save('users', [{
      id: 1234,
      name: 'John',
      age: 29,
      address: {
        city: 'Yokohama',
        country: 'Japan'
      }
    }]);

    var users = db.find('users');
    expect(users).to.have.length(1);
    db.remove('users', 1234);
    var newUsers = db.find('users');
    expect(newUsers).to.be.empty();
  });

});