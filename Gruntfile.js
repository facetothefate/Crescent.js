module.exports = function(grunt) {

  var contactFiles=[
    './src/Header.js',
    './src/Controller.js',
    './src/Model.js',
    './src/View.js',
    './src/Router.js',
    './src/C.js',
    './src/Footer.js',
  ];
  var sourceFiles=[
    './src/Controller.js',
    './src/Model.js',
    './src/View.js',
    './src/Router.js',
    './src/C.js',
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat:{
      options:{
        banner:'/*! <%= pkg.name %> - v<%= pkg.version %> - Released: <%= grunt.template.today("yyyy-mm-dd") %> */\n',

      },
      dist:{
        src:contactFiles,
        dest:'./release/<%= pkg.name %>-<%= pkg.version %>.js',
      }
    },
    jshint:{
      beforeconcat:sourceFiles,
      //afterconcat:'js/<%= pkg.name %>-<%= pkg.version %>.js',
    },
    uglify:{
      options:{
        banner:'./release/*! <%= pkg.name %> - v<%= pkg.version %> - Realesed: <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      build:{
        src:'./release/<%= pkg.name %>-<%= pkg.version %>.js',
        dest:'./release/<%= pkg.name %>-<%= pkg.version %>.min.js'
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