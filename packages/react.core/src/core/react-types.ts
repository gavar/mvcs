const hasSymbol = typeof Symbol === "function" && Symbol.for;
export const REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for("react.forward_ref") : 0xead0;
