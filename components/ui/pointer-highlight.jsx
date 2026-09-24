import "./pointer-highlight.css";

export function PointerHighlight({ children, className = "" }) {
  return (
    <div className={`pointer-highlight ${className}`.trim()}>
      {children}
      <span className="pointer-highlight-outline" aria-hidden="true">
        <i className="pointer-highlight-line pointer-highlight-top" />
        <i className="pointer-highlight-line pointer-highlight-right" />
        <i className="pointer-highlight-line pointer-highlight-bottom" />
        <i className="pointer-highlight-line pointer-highlight-left" />
        <b>✦</b>
      </span>
    </div>
  );
}
