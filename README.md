# Dots–Brackets Converter

**The Dots–Brackets Converter**, live [here](https://thiagovscoelho.github.io/dots_brackets_converter/), is a lightweight, framework‑agnostic tool for converting between Church-style dot notation (e.g. `.→.`, `:→:`, `.`‑weighted operators) and standard bracketed notation (`(… → …)`). It handles a wide array of logical constructs, offers configurable parsing and serialization strategies, and requires no external dependencies.

## Features

**Dots → Brackets conversion:** Conversion is done with tolerance for asymmetry or stronger-than-needed dots. You can write `p .→. p → q`, or `p →. p → q`, or `p .→ p → q`, or `p ::→ p → q`, and either way, it will parse as `p → (p → q)`.

**Brackets → Dots conversion:** Conversion assumes a bracketing if you haven’t given one, so `a → b → c → d` is interpreted as `a → (b → (c → d))` and converted to `a :→: b .→. c → d`. Dots are always written symmetrically, as Gregory Landini did, so `p → (p → q)` is written `p .→. p → q`. If you prefer the dots on only one side of the connective, as many authors did, then simply erase them from the unwanted side yourself. I have not bothered making a customized, automated way to omit dots from one side, since I do not think there was any rhyme or reason to how authors chose to do so, and I do not think there are any clear “most logical” ways to do it. However, I have given the user conversion options regarding one issue that I did look into in depth:

+ **Molecular negation:** One issue that came up when developing this project was the issue of what I’m calling *molecular negation*, i.e., of negating an entire formula, as in `~(A → B)`, rather than an atom, as in `~A` or `~B`. It seems many authors, such as [Russell and Whitehead](https://en.wikipedia.org/wiki/Principia_Mathematica) and Landini ([2012](https://link.springer.com/book/10.1057/9780230360150), [2021](https://link.springer.com/book/10.1007/978-3-030-66356-8)) and [Quine](https://www.hup.harvard.edu/books/9780674554511), ***never*** used dot notation for this: they always used brackets for molecular negation, even though they otherwise used dot notation. So I have given the user the option to either **dot molecular negation** or leave it undotted. For instance, if **dot molecular negation** is turned on, then `~(p & (p → q))` is written as `~: p .&. p → q`, but if it is turned off, then it is written as `~(p .&. p → q)`.

+ **Stricter hierarchy:** Among the authors who *did* use dots for molecular negation, such as [Church](https://archive.org/details/introductiontoma0000chur) and [Robbin](https://archive.org/details/mathematicallogi0000robb) and [Chwistek](https://quod.lib.umich.edu/u/umhistmath/AAS7985.0001.001/?view=toc), none used dots *exclusively*. Whenever they felt like it, they used brackets instead. This allowed them to evade a question about how dots for molecular negation should even work: is the formula `~. A → B .→. ~. A → B` well-written, or is it ambiguous? It is unambiguous in that its intent is clearly `~(A → B) → ~(A → B)`, which is how I have made the program read it when converting from dots to brackets. But it allows a group of dots to be stronger than a group of dots of *equal size* (in this case, 1 dot) in a way which was never explicitly laid out as a grammar rule, so it is unclear whether writing this formula as `~. A → B :→: ~. A → B` should be grammatically required. Even authors who wrote articles specifically on the dot notation, namely [Curry](https://www.jstor.org/stable/2268797) and [Turing](https://www.jstor.org/stable/2268111), did not address this. When converting from brackets to dots, my solution was to give the user both options: when converting `~(A → B) → (~A → B)` from brackets to dots, you will get `~. A → B .→. ~. A → B` if the option to **use stricter hierarchy** is turned off, and `~. A → B :→: ~A → B` if it is turned on.

## Supported Expressions

+ **Binary Connectives:** `→`, `⇒`, `⊃`, `∧`, `•`, `⋅`, `&`, `&&`, `∨`, `+`, `|`, `||`, `⊕`, `⊙`, `↑`, `↓`, `≡`, `≢`, `⇔`, `⇋`, `↔`, `↮`, `⇏`, `↛`, `⊅`, `⇍`, `⊄`, `↚`, `=`, `=Df`, `=Df.`, `=df`, `=df.`

+ **Negation:** `¬`, `−`, `∼`, `~` (atomic & molecular)

+ **Quantifiers:** Formulas can be preceded with `∀x`, `∃x`, `(∀x)`, `(x)`, etc. Currently, a single letter in parentheses is only interpreted as a quantifier if it is lowercase, so as to allow `(x)(x=x)` but still prevent `(∀x)(A)` from being interpreted as a pair of quantifiers on `null`, which gives an error. (I welcome pull requests to improve this.)

+ **Definite Description (Iota):** Can be used as a quantifier, as in `((ιx)(ϕx))ψ`, or as an atom, as in `(ιx)(ϕx) & B`. Support for this is part of a plan for a future “PM Mode” which will parse dot notation according to [the rules for dot-parsing in *Principia Mathematica*](https://plato.stanford.edu/entries/pm-notation/dots.html).

## Usage

1. **Open** the `index.html` in any modern browser.
2. **Enter** your formula in the textarea.
3. **Select** conversion mode:

   * **Dots → Brackets**
   * **Brackets → Dots**
4. When in **Brackets → Dots** mode:

   * Toggle **Dot molecular negation** to dot full‑formula negations.
   * (If enabled) Toggle **Use stricter hierarchy** to adjust dot strength.
5. **Click** **Convert** and view the result.

## Examples

```
# Dots → Brackets (tolerant)
Input:   S→.P→Q:→:S→P.→.S→Q
Output:  S → (P → Q) → ((S → P) → (S → Q))

# Brackets → Dots (Landini style)
Input:   (S → (P → Q)) → ((S → P) → (S → Q))
Output:  S .→. P → Q :→: S → P .→. S → Q

# Molecular Negation
Input:   ~(A → B)
• No dots:   ~(A → B)
• With dots: ~. A → B
• Strict hier: ~. A :→: B

# Iota Expressions
Brackets:  ((ιx)(ϕx))((x & (ιy)(ϕy)) → (z = w))
Dots:  ((ιx)(ϕx))(x & (ιy)(ϕy) .→. z = w)

# Quantifiers + Predicates
Input:   (∀ψ)(Mzψz ↔ Ωzψz) .→. DDD(Mzϕz) ↔ (z)(DDD(Ωzϕz))
Output:  ((∀ψ)(Mzψz ↔ Ωzψz)) → (DDD(Mzϕz) ↔ (z)(DDD(Ωzϕz)))
```

## Installation

1. Clone or download this repository.
2. Open `index.html` in any modern browser.

No dependencies or server required—everything runs in the browser.

## Contributing

Pull requests welcome for bug fixes, new connectives, or UI improvements.

## License

This project is **public domain** (CC0). 