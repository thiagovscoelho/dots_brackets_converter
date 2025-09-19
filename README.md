# The Dots–Brackets Converter

**The Dots–Brackets Converter** (hereafter *the program*, seen live [here](https://thiagovscoelho.github.io/dots_brackets_converter/)) is a lightweight, framework‑agnostic tool for converting between Russell-inspired dot notation (e.g. `.→.`, `:→:`, `.`‑weighted operators) and standard bracketed notation (`(… → …)`). It also supports the Church style of dotting. It handles a wide array of logical constructs, offers configurable parsing and serialization strategies, and requires no external dependencies.

In the default “PM-style” mode, dots are read and written according to [the rules in](https://plato.stanford.edu/entries/pm-notation/dots.html) Russell and Whitehead’s [*Principia Mathematica*](https://en.wikipedia.org/wiki/Principia_Mathematica) (hereafter “PM”), which were also used by other authors such as [Quine](https://www.hup.harvard.edu/books/9780674554511), Landini ([2012](https://link.springer.com/book/10.1057/9780230360150), [2021](https://link.springer.com/book/10.1007/978-3-030-66356-8)), and [Carnap](https://richardzach.org/2006/07/dots-as-brackets-in-formulas/). Roughly, these rules use larger groups of dots to indicate larger operator scopes, so for instance, `a :→: b .→. c → d` means `a → (b → (c → d))`. Dots-to-brackets conversion is tolerant of the style variants used by all these mentioned authors, but brackets-to-dots outputs a style closest to Landini’s. (See below for details.)

In the “Church-style” mode, dots are read and written according to the much simpler rule used by [Church](https://archive.org/details/introductiontoma0000chur), [Robbin](https://archive.org/details/mathematicallogi0000robb), and [Chwistek](https://quod.lib.umich.edu/u/umhistmath/AAS7985.0001.001/?view=toc), where only a single dot is ever used rather than larger groups of dots, and *not all* brackets can be replaced with dots, but only those brackets that end at the end of the formula, or at the end of a bracket group within it. For instance, `(a → b) → (c → (d → e))` is written as `(a → b) → . c → . d → e`.

To test the program, try converting the tautology `((¬c ⊃ b) ⊃ ((b ⊃ a) ⊃ ((c ⊃ a) ⊃ a))) ⊃ ((d ⊃ (¬c ⊃ b)) ⊃ ((b ⊃ a) ⊃ ((c ⊃ a) ⊃ (d ⊃ a))))` (which is part of the proof of Proposition 48 from Frege’s *Begriffsschrift*) from bracket form to dot form, which should give you `¬c :⊃: b .:⊃:. b .⊃. a :⊃: c ⊃ a .⊃. a ::⊃:: d :⊃: ¬c .⊃. b .:⊃:. b .⊃. a :⊃: c ⊃ a .⊃. d ⊃ a` in PM mode, or `((¬c ⊃ b) ⊃ . (b ⊃ a) ⊃ . (c ⊃ a) ⊃ a) ⊃ . (d ⊃ . ¬c ⊃ b) ⊃ . (b ⊃ a) ⊃ . (c ⊃ a) ⊃ . d ⊃ a` in Church mode. Converting the dot form to bracket form will also work.

Incidentally, formulas from the first 51 propositions of Frege’s *Begriffsschrift* in more modern notations provide interesting test cases of dots–brackets conversion, since they are historically significant propositional tautologies that require a lot of bracketing, and they have been rendered in both bracket notation and dot notation in the following published sources, although the proofs have only been rendered in bracket notation. I.M. Bocheński translated the first 57 of Frege’s propositions into Russellian dot notation in his *History of Formal Logic* (University of Notre Dame Press, 1961), §43.22, pp. 338-340; and Richard L. Mendelsohn translated the first 68 propositions as well as their proofs into fully bracketed notation in the Appendix A (props. 1–51, pp. 185–197) and Appendix B (props. 52–68, pp. 198–201) of his *The Philosophy of Gottlob Frege*, Cambridge University Press, 2005. (I focused on the first 51 propositions because from proposition 52 onwards of the *Begriffsschrift*, Frege begins to use functional expressions, which makes his formulas much less bracket-heavy, and no longer adequately handled by the program in the form in which they were written by Bocheński and Mendelsohn, although they can be easily correctly bracketed/dotted by the program if you simply change every “f(x)” into “fx”, etc.)

## Supported expressions

The program supports conversion between dot and bracket punctuation of logical formulas with these symbols:

+ **Binary operators:** `→`, `⇒`, `⊃`, `∧`, `•`, `⋅`, `&`, `&&`, `∨`, `+`, `|`, `||`, `⊕`, `⊙`, `↑`, `↓`, `≡`, `≢`, `⇔`, `⇋`, `↔`, `↮`, `⇏`, `↛`, `⊅`, `⇍`, `⊄`, `↚`, `=`, `=Df`, `=Df.`, `=df`, `=df.`, `>`, `<`, `≤`, `≥`, `⊆`, `⊇`, `⊏`, `⊑`, `⊐`, `⊒`

+ **Negation:** `¬`, `−`, `∼`, `~`

+ **Quantifiers:** Formulas can be preceded with `∀x`, `∃x`, `(∀x)`, `(x)`, etc. Currently, a single letter in parentheses is only interpreted as a quantifier if it is lowercase, so as to allow `(x)(x=x)` but still prevent `(∀x)(A)` from being interpreted as a pair of quantifiers on `null`, which gives an error. (This is kind of a hack. I welcome pull requests to improve this.)

+ **Definite description (iota):** Can be used as a quantifier, as in `((ιx)(ϕx))ψ`, or as an atom, as in `(ιx)(ϕx) + B`.

+ **Brackets:** Square brackets, `[]`, are interpreted as synonyms of round brackets, `()`.

    + If you haven’t fully specified a bracketing, conversion will assume a left-associative bracketing, so `a → b → c → d` is interpreted as `((a → b) → c) → d` in brackets, or `a → b .→. c :→: d` in PM-style dots. **Note that this does not always capture user intent!** For instance, when reading `a|b` as “a divides b”, you might write `(a|b ∧ b|c) → a|c`, or alternatively, `a|b ∧ b|c .→. a|c`, which [is a mathematical truth](https://thiago-gpt.blogspot.com/2025/06/proof-that-ab-bc-ac.html). But `|` is a binary operator that can mean disjunction, or anything else, and no particular interpretation is assumed in parsing, so the program will parse this as `(((a | b) ∧ b) | c) → (a | c)`, which is not your intent. I welcome suggestions on how to make this more intuitive, but for now, simply make sure your formula is *fully* bracketed/dotted rather than relying on precedence orders from a specific context. (In this case, the formula is `((a|b) ∧ (b|c)) → (a|c)` with brackets, or `a|b .∧. b|c :→: a|c` with PM-style dots.)

## Church-style conversion

Conversion of formulas in **Church-style dotting** was added as an afterthought, as it is much simpler than PM-style dot notation conversion. Instead of using the size of a group of dots to determine how strongly it binds, Church and Robbin and Chwistek used a much simpler rule, which never uses a group of multiple dots for punctuation, and instead only ever uses one dot. This rule cannot always convert all brackets to dots, and was never intended to.

According to Church’s page 42, this rule is to always consider a dot to be stronger than all other dots to its right. Or as he says more thoroughly in his page 75: “*Where, however, in omitting a pair of brackets we insert a heavy dot, `.`, the convention in restoring brackets is (instead of association to the left) that the left bracket, `[`, shall go in in place of the heavy dot, and the right bracket, `]`, shall go in immediately before the next right bracket which is already present to the right of the heavy dot and has no mate to the right of the heavy dot; or, failing that, at the end of the expression.*” Robbin and Chwistek were less explicit than Church about how they used dots, but I think they did the same.

So, for instance, the formula `(∀x)(a + (b + (c+ d)) + (e + f))` is written in the Church dotting as `(∀x) . a + (b + . c + d) + . e + f`. Only the brackets that ended at the end of the formula, or at the end of a different preexisting bracket group, could be converted to dots; the remaining brackets must be left unchanged. The way to convert the dots back to the original formula in brackets is clearly indicated by the quoted passage from Church.

## Supported expressions (PM-style)

***Dotting and quantifiers.*** Take for example the formula `(∀x)(a ∨ (b ∨ c))`. In both inputs and outputs, the program supports combining dot notation with setting off quantifiers from their formula with brackets, as in `(∀x)(a .∨. b ∨ c)`, which is how Quine and Landini did it. In both inputs and outputs, the program also supports setting quantifiers off from their formulas with dots, as in `(∀x) : a .∨. b ∨ c`, which is how Carnap and PM did it. The forms `∀x(a .∨. b ∨ c)` and `∀x : a .∨. b ∨ c` are supported in inputs, but not in outputs.

***Quantifier dot strength.*** Following the Carnap/PM practice, dot-groups that set off quantifiers are considered *weaker* than other dot-groups of *equal or smaller* size when doing dots-to-brackets conversion, but in brackets-to-dots conversion, you may choose to generate them with different sizes, so as not to rely on this assumption.

***Conjunction dots.*** Dots `.` used for conjunction, as in PM style (e.g. `a .∨. b . c`, meaning `a ∨ (b ∧ c)`), are supported in inputs, but not in outputs. Not only are such dots confusing to read anyway (and the similar-looking `⋅` is already supported besides), but supporting conjunction dots in outputs would also make it easier to make a mistake by accidentally running a formula through the wrong mode of the program, and possibly leave the user confused by how a dot was left unaffected. If you want to convert a formula into a formula that uses dots for conjunction, simply use a supported binary connective for your conjunctions and then find-and-replace that sign with a dot in your output.

## Dots → Brackets (PM-style)

**Dots → Brackets conversion** is done with tolerance for asymmetry or stronger-than-needed dots: you can write `a .→. b → c`, or `a →. b → c`, or `a .→ b → c`, or `a ::→ b → c`, and either way, it will parse as `a → (b → c)`.

If a dot-group sets off a quantifier, then it is considered _weaker_ than other dot-groups of _equal or smaller_ size, following PM rules. That is, `(∀x) . a .→. b` unambiguously means the same as `(∀x)(a) → b`, and never means `(∀x)(a → b)`.

If a dot is not in a position that sets off an operator or quantifier, then it is interpreted as a conjunction, and changed into the user-selected conjunction sign. This is then parsed just as if you had written your selected conjunction sign in those positions in the first place. By doing this, the program fully implements [the rules for dot-parsing in *Principia Mathematica*](https://plato.stanford.edu/entries/pm-notation/dots.html).

The program also allows a group of more than one dot to function as a stronger conjunction, which Russell and Whitehead did not allow, but Quine did allow. For instance, in pp. 38–39 of *Mathematical Logic*, Quine intends the formula `φ . ψ .⊃ χ : ψ ∨ φ :≡ χ` to be read as `(((φ ∧ ψ) ⊃ χ) ∧ (ψ ∨ φ)) ≡ χ`. Notice that the second `∧` was converted from a group of two dots (`:`), where the second dot was added to broaden the conjunction’s scope – in Landini style, to turn the `∧` into a `:∧:`.

## Brackets → Dots (PM-style)

In **Brackets → Dots conversion**, dots are always written symmetrically, as Gregory Landini did, so `p → (p → q)` is written `p .→. p → q`. If you prefer the dots on only one side of the connective, as many authors did, then simply erase them from the unwanted side yourself. I have not bothered making a customized, automated way to omit dots from one side, since I do not think there was any rhyme or reason to how authors chose to do so, and I do not think there are any clear “most logical” ways to do it. When converting back to brackets, the formula will still work with the dot removed from either side, as covered just above.

### Molecular negation

The program allows allows entire large formulas to be written, without any rearrangement, using only dots and no brackets. This shows how powerful dot notation *can* be. But dot notation was never historically used like this, i.e., as a “pure” dot notation using only dots and no brackets. Russell and Whitehead and Landini and Quine combined dots with brackets whenever they wanted, and they *never* used dots to express what I’m calling *molecular negation*, which is when a whole formula is negated as in `~(A → B)`, rather than an atom as in `~A` or `~B`. These authors always used brackets for this, never replacing them with dots. (Quine actually made this explicit in page 39 of *Mathematical Logic*: “Dots may or may not be used to reinforce a binary connective, but they will never be used to reinforce ‘~’.”)

Church and Robbin and Chwistek did write formulas like `~. A → B`, which intends to mean `~(A → B)`. That is, they used dotting for molecular negation. However, these authors never used the PM/Carnap/Quine/Landini rules for dotting, which rely on the size of a group of dots to determine its scope. The Church/Robbin/Chwistek dotting rules, though much simpler, cannot always convert *all* of your brackets into dots, at least not without severe rewriting of your formulas to fit certain restrictions, and indeed they were never meant to.

Partly out of confusion about the rules, and partly in pursuit of a “pure” dotting notation, I wanted to allow dotting for molecular negation in the program, even while keeping the PM/Carnap/Quine/Landini rules. I made it optional: to use it, check the **dot molecular negation** checkbox. With that checkbox off, `~((a → b) → c)` becomes `~(a → b .→. c)`, but with it on, it becomes `~: a → b .→. c`.

### Stricter hierarchy

Adding the option to **dot molecular negation** left me with an issue that never came up historically: how should dotting for molecular negation work, if it is used together with the PM/Carnap/Quine/Landini rules? More concretely, is the formula `~. A → B .→. ~. A → B` well-written, or is it ambiguous? It is unambiguous in that its intent is clearly `~(A → B) → ~(A → B)`, which is how I have made the program read it when converting from dots to brackets. But it allows a group of dots to be stronger than a group of dots of *equal size* (in this case, 1 dot) in a way which was never explicitly laid out anywhere as a grammar rule, so it is unclear whether writing this formula as `~. A → B :→: ~. A → B` should be grammatically required. (Of course it was never laid out anywhere, since the authors who used dotted molecular negation never used groups of multiple dots, and the authors who used groups of multiple dots never used dotting for molecular negation.) So I gave the user both options: when converting `~(A → B) → ~(A → B)` from brackets to dots, if you choose to **dot molecular negation**, you will get `~. A → B .→. ~. A → B` if the option to **use stricter hierarchy** is turned off, and `~. A → B :→: ~. A → B` if it is turned on.

I also added an analogous option to **use stricter hierarchy** with dotted quantifiers, so that for a formula like `(∀x)(A) → (b → c)`, you can get `(∀x) . A :→: b → c` instead of the PM-like `(∀x) . A .→. b → c`. This was never done historically, but it is easiest for a newbie to read: instead of having to remember the rule that quantifier dots are weaker, you can just remember that bigger groups of dots are stronger than smaller groups of dots.

All brackets-to-dots outputs of the program, even the ones in styles that were never done historically, are correctly interpreted by the dots-to-brackets parser. As ChatGPT often said during development, they “round-trip correctly”.

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
Output:  (S → (P → Q)) → ((S → P) → (S → Q))

# Brackets → Dots (Landini style)
Input:   (S → (P → Q)) → ((S → P) → (S → Q))
Output:   S .→. P → Q :→: S → P .→. S → Q

# Dot Molecular Negation (Brackets → Dots)
Bracketed input:          ~(A → B) → (A → B)
• DMN off:               ~(A → B) .→. A → B
• DMN on (less strict):  ~. A → B .→. A → B
• DMN on (stricter):     ~. A → B :→: A → B

# Iota Expressions
Dots:       ((ιx)(ϕx))(x & (ιy)(ϕy) .→. z = w)
Brackets:  ((ιx)(ϕx))((x & (ιy)(ϕy)) → (z = w))

# Quantifiers + Predicates
Dots:       (∀ψ)(Mzψz ↔ Ωzψz) .→. DDD(Mzϕz) ↔ (z)(DDD(Ωzϕz))
Brackets:  ((∀ψ)(Mzψz ↔ Ωzψz)) → (DDD(Mzϕz) ↔ (z)(DDD(Ωzϕz)))
```

## Installation

1. Clone or download this repository.
2. Open `index.html` in any modern browser.

No dependencies or server required—everything runs in the browser.

## Contributing

Pull requests welcome for bug fixes, new syntax, or UI improvements.

## License

This project is **public domain** (CC0). 
