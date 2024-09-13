interface ThemeColors {
  [key: number]: string;
  hover: string;
  stateBorder: string;
}

interface MapColors {
  light: ThemeColors;
  dark: ThemeColors;
}
const mapColors: MapColors = {
  light: {
    100: "#30A342",
    75: "#88ac13",
    50: "#D09900",
    25: "rgb(211,94,15)",
    0: "#D34452",
    hover: "#1D8C40",
    stateBorder: "#FFFFFF",
  },
  dark: {
    100: "#30A342",
    75: "#88ac13",
    50: "#D09900",
    0: "#D34452",
    hover: "#1D8C40",
    stateBorder: "#FFFFFF",
  },
};

export default mapColors;
