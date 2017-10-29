module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      development: {
        dist: {
          files: {
            'public/css/application.css' : 'assets/css/application.css.sass'
          }
        }
      },
      production: {
        dist: {
          files: {
            'public/css/application.css' : 'assets/css/application.css.sass'
          }
        }
      }
    },
    watch: {
      files: ['**/*.scss'],
      tasks: ['sass']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['sass']);
  grunt.registerTask('heroku:production', 'sass');
}