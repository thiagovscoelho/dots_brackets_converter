# The Dots–Brackets Converter

A lightweight, client‑side web application for converting logical formulas between **dot‑notation** and **fully parenthesized bracket** notation. Built with plain HTML, CSS, and JavaScript—no build tools or server required.

## Features

* **Bidirectional conversion**:

  * **Dots → Brackets**: Grouping by dot‑counts (., :, ::, etc.) yields a fully bracketed lambda‑calculus style formula.
  * **Brackets → Dots**: Infers dot‑group weights from nesting depth.
* **Connective support**:

  * IMPLIES: `→`, `⇒`, `⊃`
  * AND: `∧`, `•`, `⋅`, `&`, `&&`
  * OR: `∨`, `+`, `|`, `||`
  * XOR / XNOR: `⊕`, `⊙`
  * NAND / NOR: `↑`, `↓`
  * EQUIV / NEQUIV: `≡`, `≢`, `⇔`, `⇋`, `↔`, `↮`
  * NIMPLIES / NIF: `⇏`, `↛`, `⊅`, `⇍`, `⊄`, `↚`
* **Negation operators**: `NOT`, `¬`, `−`, `∼`, `~` on atoms and full formulas.
* **Quantifier & binder support**:

  * First‑order: `∀x`, `∃x`, `(∀x)`, `(x)`.
  * Second‑order: `∀ψ`, `∃ψ`, etc.
* **Predicate & function symbols**: Handles atomic applications like `P(x)`, `DDD(Mzϕz)` as single tokens.
* **Unicode identifiers**: Greek letters (ψ, Ω, ϕ) allowed in variable and predicate names.

## Installation

1. Clone or download this repository.
2. Open `index.html` in any modern browser.

No dependencies or server required—everything runs in the browser.

## Usage

1. Select **"Dots → Brackets"** or **"Brackets → Dots"** mode using the radio buttons.
2. Enter your formula in the textarea (supports whitespace).
3. Click **Convert**.
4. The result appears in the read‑only output box.

### Examples

```text
Dots → Brackets
p .→. q → r
→ p → (q → r)

Brackets → Dots
(p → (q → r))
→ p .→. q → r

Quantifiers + predicates:
(∀ψ)(Mzψz ↔ Ωzψz) .→. DDD(Mzϕz) ↔ (z)(DDD(Ωzϕz))
→ ((∀ψ)(Mzψz ↔ Ωzψz)) → (DDD(Mzϕz) ↔ (z)(DDD(Ωzϕz)))
```

## How It Works

1. **Tokenization**: Regex‑based scanner groups atoms, predicate applications, quantifiers, negations, and operators (with dot‑counts).
2. **AST Parsing**:

   * **Dots**: Precedence levels derived from dot counts, bigger groups bind more weakly.
   * **Brackets**: Standard recursive‑descent on parentheses.
3. **Serialization**:

   * **toBrackets()**: Fully parenthesizes binary expressions.
   * **toDots()**: Replaces parentheses with dot annotations, preserving necessary grouping for predicates and quantifiers.

## Contributing

Improvements, bug reports, and feature requests are welcome! Feel free to open issues or pull requests.

## License

I release this code into the public domain.