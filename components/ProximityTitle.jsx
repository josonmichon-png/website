"use client";

import { useRef } from "react";
import VariableProximity from "./VariableProximity";

export default function ProximityTitle({ label, annotation }) {
  const containerRef = useRef(null);

  return (
    <span ref={containerRef} className="editorial-en-row">
      <span className="editorial-display">
        <VariableProximity
          label={label}
          containerRef={containerRef}
          fromFontVariationSettings="'wght' 400, 'opsz' 9"
          toFontVariationSettings="'wght' 950, 'opsz' 40"
          radius={190}
          falloff="gaussian"
        />
      </span>
      <span className="editorial-script" aria-hidden="true">{annotation}</span>
    </span>
  );
}
