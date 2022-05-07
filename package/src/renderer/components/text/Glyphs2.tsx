import React, { useEffect, useRef } from "react";

import type { SkPoint } from "../../../skia";
import type { SkiaReadonlyValue } from "../../../values";
import { useValueEffect } from "../../../values";
import {
  isAnimated,
  isValue,
  materialize,
} from "../../processors/Animations/Animations";
import type {
  AnimatedProps,
  CustomPaintProps,
  FontDef,
} from "../../processors";
import { Node } from "../../nodes";
import type { DrawingContext } from "../../DrawingContext";
import type { DependencyManager } from "../../DependencyManager";
import type { SkFont } from "../../../../lib/typescript/src/skia/Font/Font";

interface Glyph {
  id: number;
  pos: SkPoint;
}

export type GlyphsProps = CustomPaintProps & {
  x: number;
  y: number;
  glyphs: Glyph[];
  font: SkFont;
};

interface ProcessedGlyphs {
  glyphs: number[];
  positions: SkPoint[];
}

const useSkiaValueEffect = <T,>(
  value: T | SkiaReadonlyValue<T>,
  cb: (v: T) => void
) => {
  useEffect(() => {
    if (!isValue(value)) {
      cb(value);
      return;
    } else {
      return value.addListener(cb);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
};

export class GlyphsNode extends Node<GlyphsProps> {
  x: number;
  y: number;
  font: SkFont;
  glyphs: number[];
  positions: SkPoint[];
  opacity = 1;
  color = 0xffffffff;

  constructor(depMgr: DependencyManager, props: GlyphsProps) {
    super(depMgr, props);
    const { glyphs, positions } = props.glyphs.reduce<ProcessedGlyphs>(
      (acc, glyph) => {
        const { id, pos } = glyph;
        acc.glyphs.push(id);
        acc.positions.push(pos);
        return acc;
      },
      { glyphs: [], positions: [] }
    );
    this.x = props.x;
    this.y = props.y;
    this.font = props.font;
    this.glyphs = glyphs;
    this.positions = positions;
  }

  draw({ canvas, paint }: DrawingContext) {
    const p = paint.copy();
    p.setColor(this.color);
    p.setAlphaf(this.opacity);
    canvas.drawGlyphs(
      this.glyphs,
      this.positions,
      this.x,
      this.y,
      this.font,
      p
    );
  }
}

export const Glyphs2 = (props: AnimatedProps<GlyphsProps>) => {
  const ref = useRef<GlyphsNode>(null);
  useSkiaValueEffect(props.opacity, (opacity) => {
    if (ref.current) {
      ref.current.opacity = opacity ?? 1;
    }
  });
  useSkiaValueEffect(props.color, (color) => {
    if (ref.current) {
      ref.current.color = color ?? 0xff000000;
    }
  });
  useSkiaValueEffect(props.glyphs, (rawGlyphs) => {
    const { glyphs, positions } = rawGlyphs.reduce<ProcessedGlyphs>(
      (acc, glyph) => {
        const { id, pos } = glyph;
        acc.glyphs.push(id);
        acc.positions.push(pos);
        return acc;
      },
      { glyphs: [], positions: [] }
    );
    if (ref.current) {
      ref.current.glyphs = glyphs;
      ref.current.positions = positions;
    }
  });
  return <skGlyphs ref={ref} {...materialize(props)} />;
};
