import {
  extendTheme,
  withDefaultColorScheme,
  type ThemeConfig,
} from "@chakra-ui/react";

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const overrides = {
  components: {
    Button: {
      baseStyle: { _focus: { boxShadow: "none" } },
    },
    Switch: { baseStyle: { _focus: { boxShadow: "none" } } },
    Input: { baseStyle: { _focus: { boxShadow: "none" } } },
  },
};

const fonts = {
  fonts: { heading: "Inter, sans-serif", body: "Inter, sans-serif" },
};

// 3. extend the theme
const theme = extendTheme(
  config,
  overrides,
  fonts,
  withDefaultColorScheme({ colorScheme: "blue" })
);

export default theme;
