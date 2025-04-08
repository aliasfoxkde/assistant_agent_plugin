# Custom Pronunciation

For uncommon words, such as unique brand names or product names, Rime's speech synthesis model may not always pronounce them correctly out of the box.

While the Rime team can add new words to the dictionary within around 24 hours, if you want to specify the pronunciation yourself, you can input a custom pronunciation string within curly brackets.

Tools exist both to check the dictionary coverage and to generate a custom pronunciation string.

Custom pronunciations use Rime's phonetic alphabet (detailed below), which is inspired by the International Phonetic Alphabet (IPA). For example the word custom would be represented as {k1Ast0xm}. This even works for made-up words, like gorbulets, which would be {g1orby0ul2Ets}.

| Audio Clip | Sentence |
|------------|----------|
| | actually, {g1orby0ul2Ets} is a word i just made up. |

Note: When making an API request, you must set phonemizeBetweenBrackets to true. The request would look like this:

```
   {
    "text": "actually, {g1orby0ul2Ets} is a word i just made up.",
    "speaker": "peak",
    "modelId": "mistv2",
    "phonemizeBetweenBrackets": true
   }
```

## Rime's Phonetic Alphabet

Below is a guide to Rime's phonetic alphabet and how to input syllabic stress.

### Vowels

| symbol | use in an english word |
|--------|------------------------|
| @ | bat |
| a | hot |
| A | butt |
| W | about |
| x | comma |
| Y | bite |
| E | bet |
| R | bird, foreword |
| e | bait |
| I | bit |
| i | beat |
| o | boat |
| O | boy |
| U | book |
| u | boot |
| N | button |

### Consonants

| symbol | use in an english word |
|--------|------------------------|
| b | buy |
| C | China |
| d | die |
| D | thy |
| f | fight |
| g | guy |
| h | high |
| J | jive |
| k | kite |
| l | lie |
| m | my |
| n | nigh |
| G | sing |
| p | pie |
| r | rye |
| s | sigh |
| S | shy |
| t | tie |
| T | thigh |
| v | vie |
| w | wise |
| y | yacht |
| z | zoo |
| Z | pleasure |

### Stress

For primary stress, put 1 before the relevant vowel. For example, comma would be {k1am0x}

For seconadary stress, put 2 in front of the relevant vowel. For example, auctioneer would be {2akS0In1ir}

All other vowels shoud have a 0 in front of them.
