const qs = (q) => document.querySelector(q);
const $in  = qs("#inputFormula");
const $out = qs("#outputFormula");
const $dotNegChk   = qs("#dotNegChk");
const $strictChk   = qs("#strictHierChk");
const $modeRadios  = document.querySelectorAll("input[name=mode]");
const $dotNegBlock = qs("#dotNegOption");
const $dotQuantChk = qs("#dotQuantChk");
const $strictQuantChk = qs("#strictQuantChk");
const $andSignSel   = qs("#andSignSel");
const $andSignBlock = qs("#andSignOption");
const $dotStyleSel = qs("#dotStyleSel");

function refreshUI(){
  const mode     = document.querySelector("input[name=mode]:checked").value;
  const isChurch = $dotStyleSel.value === "church";
  /* show PM-specific options only in PM style */
  $dotNegBlock.style.display  = mode === "bracketsToDots" && !isChurch ? "" : "none";
  $andSignBlock.style.display = mode === "dotsToBrackets"  && !isChurch ? "" : "none";
  $strictChk.parentElement.style.display =
    $dotNegChk.checked ? "" : "none";
  $strictQuantChk.parentElement.style.display =
    $dotQuantChk.checked ? "" : "none";
  
}
$modeRadios.forEach(r=>r.addEventListener("change",refreshUI));
$dotNegChk.addEventListener("change",refreshUI);
$dotQuantChk.addEventListener("change",refreshUI);
refreshUI();
$dotStyleSel.addEventListener("change", refreshUI);

let currentNotation = "dots"; // global used by parser for nested iota desc

qs("#convertBtn").addEventListener("click", () => {
  const mode   = document.querySelector("input[name=mode]:checked").value;
  const txt    = $in.value.trim();
  const andOp  = $andSignSel.value;
  const church = $dotStyleSel.value === "church";   // <-- NEW

  try {
    let tokens, ast, res;

    /* =======  CHURCH mode  ======= */
    if (church) {
      if (mode === "bracketsToDots") {
        /* 1. normal parse ➜ AST ➜ fully bracketed string */
        currentNotation = "brackets";
        tokens = lexer(txt, "brackets", andOp);
        attachBP(tokens, "brackets");
        ast   = parse(tokens);
        const bracketed = toBrackets(ast);
        /* 2. compress with Church’s one-dot rule */
        res = churchCompress(bracketed);
      } else { /* dotsToBrackets */
        /* 1. expand the heavy dots into ordinary parentheses */
        const expanded = churchExpand(txt);
        /* 2. parse *as brackets* and serialise back */
        currentNotation = "brackets";
        tokens = lexer(expanded, "brackets", andOp);
        attachBP(tokens, "brackets");
        ast   = parse(tokens);
        res   = toBrackets(ast);
      }
      $out.textContent = res;
      return;                       // <- we’re done
    }

    /* =======  ORIGINAL PM / Landini paths (unchanged)  ======= */
    if (mode === "dotsToBrackets") {
      currentNotation = "dots";
      tokens = lexer(txt, "dots", andOp);
      attachBP(tokens, "dots");
      ast   = parse(tokens);
      res   = toBrackets(ast);
    } else { /* bracketsToDots */
      currentNotation = "brackets";
      tokens = lexer(txt, "brackets", andOp);
      attachBP(tokens, "brackets");
      ast   = parse(tokens);
      annotateDepth(ast);
      assignWeights(ast);
      const dotNeg      = $dotNegChk.checked;
      const strict      = dotNeg && $strictChk.checked;
      const dotQuant    = $dotQuantChk.checked;
      const strictQuant = dotQuant && $strictQuantChk.checked;
      res = toDots(ast, dotNeg, strict, dotQuant, strictQuant);
    }
    $out.textContent = res;
  } catch (err) {
    $out.textContent = "Error: " + err.message;
  }
});