import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Polyline, Stop } from "react-native-svg";
import { palette } from "../theme/theme";

export function LineChart({ points, color = palette.green, fill }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const normalized = points.map((point, index) => ({
    x: (index / Math.max(points.length - 1, 1)) * 100,
    y: 100 - ((point - min) / (max - min || 1)) * 74 - 12
  }));

  const polyline = normalized.map((point) => `${point.x * 3.5},${point.y * 1.65}`).join(" ");
  const areaPath = `M ${normalized[0].x * 3.5},165 ${normalized
    .map((point) => `L ${point.x * 3.5},${point.y * 1.65}`)
    .join(" ")} L ${normalized[normalized.length - 1].x * 3.5},165 Z`;

  return (
    <View style={styles.chart}>
      <Svg width="100%" height="100%" viewBox="0 0 350 190">
        <Defs>
          <LinearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.22" />
            <Stop offset="1" stopColor={color} stopOpacity="0.02" />
          </LinearGradient>
        </Defs>
        {fill ? <Path d={areaPath} fill="url(#chartFill)" /> : null}
        <Polyline points={polyline} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M 12 166 L 338 166" stroke="#E7ECE8" strokeWidth="1" />
      </Svg>
    </View>
  );
}

export function ArenaChart({ arena }) {
  return (
    <View style={styles.arenaChart}>
      <LineChart points={arena.rawPath} color={palette.red} />
      <View style={styles.overlay}>
        <LineChart points={arena.managedPath} color={palette.green} />
      </View>
      <Text style={styles.note}>raw agent climbed fast, then collapsed</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    height: 190,
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: "#FAFCFA",
    overflow: "hidden",
    position: "relative"
  },
  arenaChart: {
    position: "relative",
    marginTop: 10
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  note: {
    position: "absolute",
    right: 8,
    top: 18,
    color: palette.red,
    fontSize: 10,
    fontWeight: "900",
    width: 110,
    textAlign: "right"
  }
});
