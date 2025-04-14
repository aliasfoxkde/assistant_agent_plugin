# Spell Function - Rime Docs
When to Use `spell()`
---------------------

Sometimes you want a letter or number sequence to be spelled out, one unit at a time. At Rime, we make this easy with our `spell()` function.

Using `spell()` natively introduces naturalistic pauses within the sequence. In particular, it groups numbers and letters into groups of three where possible, and two where necessary. For instance, a standard 10-digit telephone number is broken up as follows:

> 4 2 5 `<pause>` 2 5 2 `<pause>` 8 9 `<pause>` 2 9

The same holds for spelling sequences, like long words, being broken up as follows:

> P E N `<pause>` E L O `<pause>` P E

We also introduce helpful pauses when transitioning between numbers and letters in mixed alphanumeric sequences, as follows:

> P R M `<pause>` 4 2 3 `<pause>` G D D `<pause>` M L `<pause>` 2 3 `<pause>` 5 4

This holds for any number, letter, or alphanumeric string. They will be spelled out in full if included in the parentheses of `spell()`. Spell also works with common symbols like @ (at) or - (dash).

Let’s see how this works:

`spell()` Applied to Words
--------------------------

If I want the sentence to read:

> “The name is spelled J O N, A T H, A N.”

**Input:**  
`the name is spelled spell(jonathan).`

```
{
   "speaker": "tibur",
   "modelId": "mistv2",
   "text": "the name is spelled spell(jonathan)."
}
```

`spell()` Applied to Numbers
----------------------------

For number sequences, if I want the sentence to read:

> “The number is 4 2 5, 2 5 2, 8 9, 2 9.”

**Input:**  
`the number is spell(4252528929).`

```
{
   "speaker": "tibur",
   "modelId": "mistv2",
   "text": "the number is spell(4252528929)."
}
```

`spell()` Applied to Alphanumeric Sequences
-------------------------------------------

The same goes for mixed alphanumerics. If I want the sentence to be read:

> the account is r f, 5 4 3, d c, 2

**Input:**  
`the account is spell(rf543dc2).`

```
{
   "speaker": "tibur",
   "modelId": "mistv2",
   "text": "the account is spell(rf543dc2)."
}
```

`spell()` Applied to Typographical Symbols
------------------------------------------


|Symbol|Pronunciation|
|------|-------------|
|@     |at           |
|_     |underscore   |
|-     |dash         |
|.     |dot          |


Spell also works with common symbols. For example:

> the email address is h e l p, at, r i m e, dot, a i

**Input:** `the email address is spell(help@rime.ai).`

```
{
   "speaker": "tibur",
   "modelId": "mistv2",
   "text": "the email address is spell(help@rime.ai)."
}
```