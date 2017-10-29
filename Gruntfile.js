module.exports = (grunt) => {
  grunt.initConfig({
    sass: {
      development: {
        options: {
        },
        files: {
          'public/css/application.css' : 'assets/css/application.css.sass'
        }
      },
      production: {
        options: {
        },
        files: {
          'public/css/application.css' : 'assets/css/application.css.sass'
        }
      }
    },
    watch: {
      files: ['<%= sass.files %>'],
      tasks: ['sass']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['sass']);
  grunt.registerTask('heroku:production', 'sass');
}