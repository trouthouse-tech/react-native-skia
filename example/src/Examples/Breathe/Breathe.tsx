import type { RefObject } from "react";
import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import type {
  SkiaReadonlyValue,
  SkiaView,
  Vector,
} from "@shopify/react-native-skia";
import {
  useCanvasSize,
  useDerivedValue,
  useLoop,
  BlurMask,
  vec,
  Canvas,
  Circle,
  Fill,
  Group,
  polar2Canvas,
  Easing,
  mix,
  useCanvasRef,
} from "@shopify/react-native-skia";

const c1 = "#61bea2";
const c2 = "#529ca0";

interface RingProps {
  index: number;
  progress: SkiaReadonlyValue<number>;
  r: number;
  center: Vector;
}

const Ring = ({ index, progress, r, center }: RingProps) => {
  const theta = (index * (2 * Math.PI)) / 6;
  const transform = useDerivedValue(() => {
    const { x, y } = polar2Canvas(
      { theta, radius: progress.current * r },
      { x: 0, y: 0 }
    );
    const scale = mix(progress.current, 0.3, 1);
    return [{ translateX: x }, { translateY: y }, { scale }];
  }, [progress]);

  return (
    <Group origin={center} transform={transform}>
      <Circle c={center} r={r} color={index % 2 ? c1 : c2} />
    </Group>
  );
};

interface CompositionProps {
  skiaRef: RefObject<SkiaView>;
}

const Composition = ({ skiaRef }: CompositionProps) => {
  const { width, height } = useCanvasSize(skiaRef);
  const r = width / 4;
  const center = vec(width / 2, height / 2);
  const progress = useLoop({
    duration: 3000,
    easing: Easing.inOut(Easing.ease),
  });

  const transform = useDerivedValue(
    () => [{ rotate: mix(progress.current, -Math.PI, 0) }],
    [progress]
  );

  return (
    <Group origin={center} transform={transform} blendMode="screen">
      {/* <BlurMask style="solid" blur={40} /> */}
      {new Array(6).fill(0).map((_, index) => {
        return (
          <Ring
            key={index}
            index={index}
            progress={progress}
            r={r}
            center={center}
          />
        );
      })}
    </Group>
  );
};

export const Breathe = () => {
  const ref = useCanvasRef();
  return (
    <Canvas style={styles.container} ref={ref} debug>
      <Fill color="rgb(36,43,56)" />
      <Composition skiaRef={ref} />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
