import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Canvas, Fill } from "@shopify/react-native-skia";

import { graphs, SIZE } from "./Model";
import { Header } from "./Header";

const { width } = Dimensions.get("window");

const SELECTION_WIDTH = width - 32;
const BUTTON_WIDTH = (width - 32) / graphs.length;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backgroundSelection: {
    backgroundColor: "#f3f3f3",
    ...StyleSheet.absoluteFillObject,
    width: BUTTON_WIDTH,
    borderRadius: 8,
  },
  selection: {
    flexDirection: "row",
    width: SELECTION_WIDTH,
    alignSelf: "center",
  },
  labelContainer: {
    padding: 16,
    width: BUTTON_WIDTH,
  },
  label: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export const Graph = () => {
  return (
    <View style={styles.container}>
      <Header />
      <View>
        <Canvas style={{ width: SIZE, height: SIZE }}>
          <Fill color="lightblue" />
        </Canvas>
      </View>
      <View style={styles.selection}>
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.backgroundSelection} />
        </View>
        {graphs.map((graph) => {
          return (
            <TouchableWithoutFeedback key={graph.label} onPress={() => {}}>
              <View style={[styles.labelContainer]}>
                <Text style={styles.label}>{graph.label}</Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
};
