import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          background: "#FFFFFF",
          surface: "#FFFFFF",
          primary: "#1976D2",
        },
      },
      dark: {
        dark: true,
        colors: {
          background: "#121212",
          surface: "#363636ff",
          // primary: "#90CAF9",
        },
      },
    },
  },
})
