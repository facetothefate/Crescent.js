module.exports = function(grunt) {

  var sourceFiles=[
    'Header.js',
    'Controller.js',
    'Model.js',
    'View.js',
    'C.js',
    'Footer.js',
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat:{
      options:{
        banner:'/*! <%= pkg.name %> - v<%= pkg.version %> - Released: <%= grunt.template.today("yyyy-mm-dd") %> */\n',

      },
      dist:{
        src:sourceFiles,
        dest:'/release/<%= pkg.name %>-<%= pkg.version %>.js',
      }
    },
    jshint:{
      beforeconcat:sourceFiles,
      //afterconcat:'js/<%= pkg.name %>-<%= pkg.version %>.js',
    },
    uglify:{
      options:{
        banner:'/release/*! <%= pkg.name %> - v<%= pkg.version %> - Realesed: <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      build:{
        src:'<%= pkg.name %>-<%= pkg.version %>.js',
        dest:'<%= pkg.name %>-<%= pkg.version %>.min.js'
      },
    },
    watch:{
      files:sourceFiles,
      tasks:['default']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  //task configuration
  grunt.registerTask('default',['concat','jshint','uglify']);
  //grunt.registerTask('compress', ['uglify']);

};