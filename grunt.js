module.exports = function(grunt){
  grunt.initConfig({
    min: {
      dist: {
        src : ['lib/onigiri.db.js'],
        dest : 'lib/onigiri.db.min.js'
      }
    },
    watch : {
      scripts : {
        files : ['lib/*.js'],
        tasks : 'min'
      }
    }
  });
  grunt.registerTask('default', 'min');
};