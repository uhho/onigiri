(function (){
    var global = (function(){return this;}).call();

    // global onigiri class
    global.onigiri = function(params) {};

    // db class
    onigiri.db = function(params) {

        /**
         * check if database exist
         */
        this.set = function(database) {
            this.name = database;
            return this;
        };

        /**
         * check if database exist
         */
        this.save = function(table, objects) {
            if (!this.name) {
                console.error('Please set name of database');
                return false;
            }
            index = this.storage.length;
            for (i in objects) {
                if (!('id' in objects[i]))
                    objects[i].id = index;

                this.storage.setItem(
                    this.__encodeKey(table, objects[i].id),
                    this.__encodeObject(objects[i])
                );
                index++;
            }
            return true;
        };

        /**
         * delete item from table
         */
        this.remove = function(table, id) {
            key = this.__encodeKey(table, id);
            this.storage.removeItem(key);
        };

        /**
         * find objects by conditions
         */
        this.find = function(table, conditions) {
            result = [];
            for (i = 0; i < this.storage.length; i++) {
                key = this.storage.key(i);
                if (key.indexOf(this.__encodeTableKey(table)) >= 0) {
                    obj = this.findById(table, key.split(".")[2]);
                    totalConditions = foundConditions = 0;
                    for (c in conditions) {
                        totalConditions++;
                        if (conditions[c] == obj[c]) foundConditions++;
                    }

                    if (foundConditions == totalConditions || totalConditions == 0)
                        result.push(obj);
                }
            }
            return result.reverse();
        };

        /**
         * find object by id
         */
        this.findById = function(table, id) {
            key = this.__encodeKey(table, id);
            return this.__decodeObject(id, this.storage.getItem(key));
        };

        /**
         * get object key
         * <- table, id
         * -> db.users.1
         */
        this.__encodeKey = function(table, id) {
            return this.name + '.' + table + '.' + id;
        };

        /**
         * get object key
         * <- db.users.1
         * -> {db: db, table: users, id: 1}
         */
        this.__decodeKey = function(key) {
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
        this.__encodeObject = function(object) {
            return JSON.stringify(object);
        };

        /**
         * decode object from string
         */
        this.__decodeObject = function(id, string) {
            eval('var obj = ' + string);
            return obj;
        }

        /**
         * encode table into string used in path of objects saved in database
         */
        this.__encodeTableKey = function(table) {
            return this.name + '.' + table + '.';
        }

        /**
         * check if database exist
         */
        this.clear = function() {
            length = this.storage.length;
            pointer = 0;
            for (i = 0; i < length; i++) {
                key = this.storage.key(pointer);
                if (key.indexOf(this.name) >= 0) {
                    this.storage.removeItem(key);
                } else {
                    pointer++;
                }
            }
            return this;
        };

        /**
         * class constructor
         */
        this.__construct = function(obj, params) {
            obj.storage = window['localStorage'];
            if (params) {
                obj.name = (params.name) ? params.name : null;
                obj.onUpdate = (params.onUpdate) ? params.onUpdate : function(storageEvent) {};
            }
            // bind storage event
            window.addEventListener('storage', obj.onUpdate, false);
        }(this, params);
    };
})();