(function(global) {

    // global onigiri class
    global.onigiri = function(params) {};

    // db class
    onigiri.db = function(params) {
        var __proto = onigiri.db.prototype;

        /**
         * set database
         */
        __proto.set = function(database) {
            this.name = database;
            return this;
        };

        /**
         * check if database exist
         */
        __proto.save = function(table, objects) {
            var storageSize, i;
            if (!this.name) {
                console.error('Please set name of database');
                return false;
            }
            storageSize = this.storage.length;
            for (i in objects) {
                if (!('id' in objects[i])) {
                    objects[i].id = storageSize;
                }
                this.storage.setItem(
                    this.__encodeKey(table, objects[i].id),
                    this.__encodeObject(objects[i])
                );
                storageSize++;
            }
            return true;
        };

        /**
         * delete item from table
         */
        __proto.remove = function(table, id) {
            var key = this.__encodeKey(table, id);
            this.storage.removeItem(key);
        };

        /**
         * find objects by conditions
         */
        __proto.find = function(table, conditions, option) {
            var result = [],
            length = this.storage.length,
            i = 0, key, obj, totalConditions, foundConditions, c;

            for (; i < length; i++) {
                key = this.storage.key(i);
                if (key.indexOf(this.__encodeTableKey(table)) >= 0) {
                    obj = this.findById(table, key.split(".")[2]);
                    totalConditions = foundConditions = 0;
                    for (c in conditions) {
                        totalConditions++;
                        if (conditions[c] == obj[c]) {
                            foundConditions++;
                        }
                    }

                    if (foundConditions === totalConditions || totalConditions === 0) {
                        result.push(obj);
                    }
                }
            }
            if (option === "first") {
                return result.pop();
            } else if (option === "last") {
                return result.shift();
            }
            return result.reverse();
        };

        /**
         * find object by id
         */
        __proto.findById = function(table, id) {
            var key = this.__encodeKey(table, id);
            return this.__decodeObject(id, this.storage.getItem(key));
        };

        /**
         * get object key
         * <- table, id
         * -> db.users.1
         */
        __proto.__encodeKey = function(table, id) {
            return this.name + '.' + table + '.' + id;
        };

        /**
         * get object key
         * <- db.users.1
         * -> {db: db, table: users, id: 1}
         */
        __proto.__decodeKey = function(key) {
            var data = key.split('.');
            return {
                db: data[0],
                table: data[1],
                id: data[2]
            };
        };

        /**
         * encode object to JSON
         */
        __proto.__encodeObject = function(object) {
            return JSON.stringify(object);
        };

        /**
         * decode object from string
         */
        __proto.__decodeObject = function(id, string) {
            eval('var obj = ' + string);
            return obj;
        };

        /**
         * encode table into string used in path of objects saved in database
         */
        __proto.__encodeTableKey = function(table) {
            return this.name + '.' + table + '.';
        };

        /**
         * check if database exist
         */
        __proto.clear = function() {
            var length = this.storage.length,
            pointer = 0, i = 0, key;
            for (;i < length; i++) {
                key = this.storage.key(pointer);
                if (key.indexOf(this.name) >= 0) {
                    this.storage.removeItem(key);
                } else {
                    pointer++;
                }
            }
            this.storage.length = 0;
            return this;
        };

        /**
         * class constructor
         */
        __proto.__construct = (function(obj, params) {
            obj.storage = window.localStorage;
            if (params) {
                obj.name = (params.name) ? params.name : null;
                obj.onUpdate = (params.onUpdate) ? params.onUpdate : function(storageEvent) {};
            }
            // bind storage event
            window.addEventListener('storage', obj.onUpdate, false);
        })(this, params);
    };
})(this);