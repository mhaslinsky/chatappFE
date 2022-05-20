import {
  extendTheme,
  withDefaultColorScheme,
  type ThemeConfig,
} from "@chakra-ui/react";

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const overrides = {
  components: { Button: { baseStyle: { _focus: { boxShadow: "none" } } } },
};

// 3. extend the theme
const theme = extendTheme(withDefaultColorScheme({ colorScheme: "red" }));

export default theme;
