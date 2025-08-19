
/*-----------
Church Mode 
-------------*/

/* ---------- Church helpers ---------- */

/* Remove a single layer of superfluous outer brackets */
function trimOuterParens(s) {
  s = s.trim();
  while (s[0] === "(") {
    let depth = 0, i = 0;
    for (; i < s.length && !(depth === 0 && i); i++) {
      if (s[i] === "(") depth++;
      else if (s[i] === ")") depth--;
    }
    if (depth === 0 && i === s.length) s = s.slice(1, -1).trim();
    else break;
  }
  return s;
}

/* ============  BRACKETS ➜ DOTS  (Church compression)  ============ */
function churchCompress(bracketed) {
  bracketed = trimOuterParens(bracketed);
  const stack = [];
  const pair  = new Map();            // open-idx  → close-idx

  /* 1. map every '(' to its matching ')' */
  for (let i = 0; i < bracketed.length; i++) {
    if (bracketed[i] === "(") stack.push(i);
    else if (bracketed[i] === ")") pair.set(stack.pop(), i);
  }

  /* 2. recursive helper that applies Church’s rule *inside* every pair */
  function rec(lo, hi) {             // [lo, hi] indexes inclusive
    let out = "", i = lo;
    while (i <= hi) {
      if (bracketed[i] === "(") {
        const j = pair.get(i);       // its mate
        if (j === hi) {              // mate is the *last char* here
          out += ". " + rec(i + 1, j - 1);   // replace '(' with dot
          return out.trimEnd();               // nothing left after j
        }
        out += "(" + rec(i + 1, j - 1) + ")";
        i = j + 1;
      } else {
        out += bracketed[i++];
      }
    }
    return out;
  }
  return rec(0, bracketed.length - 1).replace(/\s+\./g, " ."); // tidy spaces
}

/* ============  DOTS ➜ BRACKETS  (Church expansion)  ============ */
function churchExpand(dotted) {
  let out = "", stack = [];
  for (let i = 0; i < dotted.length; i++) {
    const ch = dotted[i];
    /* treat _any_ solitary dot as the heavy-dot marker,
       unless it is doubled (“..”) – that protects against
       ellipses or an accidental typo like “..a”.          */
    if (ch === "." && dotted[i + 1] !== ".") {             // heavy dot
      out += "(";
      stack.push("dot");
    } else if (ch === "(") {
      out += "(";
      stack.push("(");
    } else if (ch === ")") {
      /* first close any outstanding “dot-brackets” */
      while (stack.length && stack.at(-1) === "dot") {
        out += ")"; stack.pop();
      }
      out += ")";
      if (stack.at(-1) === "(") stack.pop();
    } else {
      out += ch;
    }
  }
  /* close any remaining dot-brackets at end */
  while (stack.length && stack.pop() === "dot") out += ")";
  return out;
}
