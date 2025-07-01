# The Dots–Brackets Converter

**The Dots–Brackets Converter**, live [here](https://thiagovscoelho.github.io/dots_brackets_converter/), is a lightweight, framework‑agnostic tool for converting between Russell-inspired dot notation (e.g. `.→.`, `:→:`, `.`‑weighted operators) and standard bracketed notation (`(… → …)`). It handles a wide array of logical constructs, offers configurable parsing and serialization strategies, and requires no external dependencies.

To test the program, try converting the tautology `((¬c ⊃ b) ⊃ ((b ⊃ a) ⊃ ((c ⊃ a) ⊃ a))) ⊃ ((d ⊃ (¬c ⊃ b)) ⊃ ((b ⊃ a) ⊃ ((c ⊃ a) ⊃ (d ⊃ a))))` from bracket form to dot form, which should give you `¬c :⊃: b .:⊃:. b .⊃. a :⊃: c ⊃ a .⊃. a ::⊃:: d :⊃: ¬c .⊃. b .:⊃:. b .⊃. a :⊃: c ⊃ a .⊃. d ⊃ a`. Converting the dot form to bracket form will also work.

## Conversion

The program supports conversion between dot and bracket punctuation of logical formulas with these symbols:

+ **Binary connectives:** `→`, `⇒`, `⊃`, `∧`, `•`, `⋅`, `&`, `&&`, `∨`, `+`, `|`, `||`, `⊕`, `⊙`, `↑`, `↓`, `≡`, `≢`, `⇔`, `⇋`, `↔`, `↮`, `⇏`, `↛`, `⊅`, `⇍`, `⊄`, `↚`, `=`, `=Df`, `=Df.`, `=df`, `=df.`

+ **Negation:** `¬`, `−`, `∼`, `~`

+ **Quantifiers:** Formulas can be preceded with `∀x`, `∃x`, `(∀x)`, `(x)`, etc. Quantifiers may be set off from their formula by brackets, even in dot notation, as Landini ([2012](https://link.springer.com/book/10.1057/9780230360150), [2021](https://link.springer.com/book/10.1007/978-3-030-66356-8)) and [Quine](https://www.hup.harvard.edu/books/9780674554511) did it, but we also support setting them off with dots, as [Carnap](https://richardzach.org/2006/07/dots-as-brackets-in-formulas/) and [Russell and Whitehead](https://plato.stanford.edu/entries/pm-notation/dots.html) did it. Following their practice, dots that set off quantifiers are considered *weaker* than other dot-groups of *equal* size when doing dots-to-brackets conversion, but in brackets-to-dots conversion, you may choose to generate them with different sizes, so as not to rely on this assumption.
    + Currently, a single letter in parentheses is only interpreted as a quantifier if it is lowercase, so as to allow `(x)(x=x)` but still prevent `(∀x)(A)` from being interpreted as a pair of quantifiers on `null`, which gives an error. (This is kind of a hack. I welcome pull requests to improve this.)
    + Later, I would also like to add support for the way [Church](https://archive.org/details/introductiontoma0000chur) did it, which (according to his page 42) seems to be that he *always* considered a dot to be stronger than all other dots to its right. Or as he says more thoroughly in his page 75: “*Where, however, in omitting a pair of brackets we insert a heavy dot, `.`, the convention in restoring brackets is (instead of association to the left) that the left bracket, `[`, shall go in in place of the heavy dot, and the right bracket, `]`, shall go in immediately before the next right bracket which is already present to the right of the heavy dot and has no mate to the right of the heavy dot; or, failing that, at the end of the expression.*” I think this might also be how [Robbin](https://archive.org/details/mathematicallogi0000robb) and [Chwistek](https://quod.lib.umich.edu/u/umhistmath/AAS7985.0001.001/?view=toc) did it, although they were less explicit about how they used dots.
+ **Definite description (iota):** Can be used as a quantifier, as in `((ιx)(ϕx))ψ`, or as an atom, as in `(ιx)(ϕx) & B`. Support for this is part of a plan for a future “PM Mode” which will parse dot notation according to [the rules for dot-parsing in *Principia Mathematica*](https://plato.stanford.edu/entries/pm-notation/dots.html).

### Bracketing

Square brackets, `[]`, are interpreted as synonyms of round brackets, `()`.

If you haven’t specified a bracketing, conversion will assume a right-associative bracketing, so `a → b → c → d` is interpreted as `a → (b → (c → d))` in brackets, or `a :→: b .→. c → d` in dots. **Note that this does not always capture user intent!** For instance, when reading `a|b` as “a divides b”, you might write `(a|b ∧ b|c) → a|c`, or alternatively, `a|b ∧ b|c .→. a|c`, which [is a mathematical truth](https://thiago-gpt.blogspot.com/2025/06/proof-that-ab-bc-ac.html). But `|` is a binary connective that can mean conjunction, or anything else, and no particular interpretation is assumed in parsing, so the program will parse this as `(a | (b ∧ (b | c))) → (a | c)`, which is not your intent. I welcome suggestions on how to make this more intuitive, but for now, simply make sure your formula is *fully* bracketed/dotted rather than relying on precedence orders from a specific context. (In this case, the formula is `((a|b) ∧ (b|c)) → (a|c)` with brackets, or `a|b .∧. b|c :→: a|c` with dots.)

## Types of conversion

**Dots → Brackets conversion:** Conversion is done with tolerance for asymmetry or stronger-than-needed dots. You can write `p .→. p → q`, or `p →. p → q`, or `p .→ p → q`, or `p ::→ p → q`, and either way, it will parse as `p → (p → q)`.

**Brackets → Dots conversion:** Dots are always written symmetrically, as Gregory Landini did, so `p → (p → q)` is written `p .→. p → q`. If you prefer the dots on only one side of the connective, as many authors did, then simply erase them from the unwanted side yourself. I have not bothered making a customized, automated way to omit dots from one side, since I do not think there was any rhyme or reason to how authors chose to do so, and I do not think there are any clear “most logical” ways to do it.

+ **Molecular negation and stricter hierarchy:** Authors like Church and Robbin and Chwistek sometimes wrote formulas like `~. A → B`, which intends to mean `~(A → B)`. That is, the dot makes the negation operator negate an entire molecular formula, rather than an atom as in `~A` or `~B`. Influenced by those authors, I added the option for the user to **dot molecular negation** if he wants: if **dot molecular negation** is turned on, then `~(p & (p → q))` is written with dots as `~: p .&. p → q`, but if it is turned off, then it is written as `~(p .&. p → q)`. It seems many authors, such as [Russell and Whitehead](https://en.wikipedia.org/wiki/Principia_Mathematica) and Landini and Quine, ***never*** used dot notation for molecular negation: they always used brackets for molecular negation, even though they otherwise used dot notation. And it seems Church and Robbin and Chwistek only allowed this in the first place because they were using a much simpler algorithm for dots-to-brackets, which never used groups of multiple dots at all, and was only ever suited as a complement rather than as a substitute for brackets (at least if you don’t like rearranging your formulas a lot to fit an arbitrary left-to-right bracket order). However, I had not realized this when I was first making the program, which is why I was left with a meta-ambiguity: is the formula `~. A → B .→. ~. A → B` well-written, or is it ambiguous? It is unambiguous in that its intent is clearly `~(A → B) → ~(A → B)`, which is how I have made the program read it when converting from dots to brackets. But it allows a group of dots to be stronger than a group of dots of *equal size* (in this case, 1 dot) in a way which was never explicitly laid out as a grammar rule, since the authors who used dotted molecular negation never used groups of multiple dots. So I gave the user both options: when converting `~(A → B) → ~(A → B)` from brackets to dots, you will get `~. A → B .→. ~. A → B` if the option to **use stricter hierarchy** is turned off, and `~. A → B :→: ~. A → B` if it is turned on. This may have been something of a waste of time, but it is a step towards a “pure” dot notation, without any brackets.

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
Output:   S .→. P → Q :→: S → P .→. S → Q

# Dot Molecular Negation (Brackets → Dots)
Bracketed input:          ~(A → B) → (A → B)
• DMN off:               ~(A → B) .→. A → B
• DMN on (less strict):  ~. A → B .→. A → B
• DMN on (stricter):     ~. A → B :→: A → B

# Iota Expressions
Brackets:  ((ιx)(ϕx))((x & (ιy)(ϕy)) → (z = w))
Dots:       ((ιx)(ϕx))(x & (ιy)(ϕy) .→. z = w)

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