module.exports = {
  mode: 'jit',
  purge: ['./*.html'],
  darkMode: 'class',
  corePlugins: {
    container: true
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({

        '.container': {
          maxWidth: '100%',
          '@screen sm': {
            maxWidth: '640px',
          },
          '@screen md': {
            maxWidth: '768px',
          },
          '@screen lg': {
            maxWidth: '1024px',
          },
          '@screen xl': {
            maxWidth: '1150px',
          },
          '@screen 2xl': {
            maxWidth: '1440px',
          },


        }

      })
    }
  ],
  theme: {
    extend: {
      screens: {
        'custom': '932px',
        'xd': '540px'
      },
      container: {
        center: true,
        padding: '1rem',
      },

      colors: {
        primary: {
          100: '#262626',
          200: '#DC2626',
        },
        white: '#FFFFFF',
        footer: '#9CA3AF',
      },

      boxShadow: {
        'xl': ' 2px 2px 1px 0px #FFFFFF59 inset',
        '2xl': '  0px 4px 34px 0px #00000008',
      },

      backgroundImage: {
        "curved-blue-gradient": "url(/imagenes/precios/curved-blue-gradient-bg.svg)",
        "bg-gradient": "linear-gradient(96.41deg, rgba(0, 0, 0, 0.85) 18.08%, rgba(0, 0, 0, 0) 96.87%)",
      },

      placeholderColor: theme => theme('colors'),
      placeholderColor: {
        "coolGray-600": "#4B5563",
      },
      borderColor: theme => ({
        ...theme('colors'),
        DEFAULT: theme('colors.gray.300', 'currentColor'),

      }),
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        '2': '2px',
        '3': '3px',

      },

     
      fontFamily: {
        body_fonts: [
          "Karbon App",
        ],
        heading_fonts: [
          "Karbon App"
        ],
      },

      
 
    },
  },
  // Other stuff
};