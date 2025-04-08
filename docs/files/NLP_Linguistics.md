# NLP Linguistics

## Text Normalization Recommendations
When using Rime's models, most text will be correctly pronounced out-of-the box just by writing naturally. Rime's models understand pronunciation based on context.

However, we do recommend normalizing your text to get consistent and accurate results.

Text normalization is a crucial step in text-to-speech (TTS) systems, where written text is converted into a form that can be accurately and naturally spoken. Normalization ensures the text is clear, comprehensible, and contextually accurate for speech synthesis. Rime also allows you to adjust the pronunciation of questions, pauses, and more by altering the punctuation.

At Rime we have a unique set of guidelines to help you get the best output. To see common use cases, such as numbers, dates, and abbreviations, check the pages in the Formatting Text folder in the menu.

# Punctuation

Punctuation serves many purposes in normal writing, it indicates sentence structural things like sentence breaks and questions, but it also serves to indicate pronunciation cues, such as commas for pauses and exclamation points for excitement.

For Rime text-to-speech, these various uses are even more flexible. Not only can users employ punctuation for traditional structural purposes, users can modulate the prosody by using differing punctuation. Below we show some basic ways our powerful engine can alter the prosody using punctuation. These are just a few examples, feel free to play around and see what you can create!

## Questions
| Sentance | Notes |
|----------|-------|
| what do you mean. | a simple period at the end of the sentence renders it a non-question |
| what do you mean? | a simple question mark indicates an unmarked question |
| what do you mean?! | adding an exclamation point makes the question more excited |
| what do you mean!? | changing the order of the exclamation point and question mark makes a different sort of question |
| what do you mean?? | multiple question marks can also change the type of question prosody |

## False Starts
| Sentance | Notes |
|----------|-------|
| i i think it's pretty cool | putting a word twice in a row can create more realistic, flawed human speech |
| i- i think it's pretty cool | adding a dash immediately after some words can give a cut-off, false start sort of realism |

## Pauses
| Sentance | Notes |
|----------|-------|
| so it's kind of funny. | without any comma, there will be no pause |
| so, it's kind of funny. | adding a comma creates a slight pause |
| so. it's kind of funny. | adding a period creates a longer pause |


# Numbers, Currency, and Measurements
We recommend the following inputs to get your desired output.

* Numbers
* Currency
* Units of Measurement
​
## Numbers
### Ordinal Numbers
| Desired Output | Input |
|----------------|-------|
| One hundred and twenty-three | 123 |
| Two thousand and twenty-two | 2,022 |
| Four zero | 4 0 |
| Forty | 40 |
​
### Years
| Desired Output | Input |
|----------------|-------|
| Twenty twenty two | 2022 |
​
### Cardinal Numbers
| Desired Output | Input |
|----------------|-------|
| Fifth | 5th |
​
### Phone Numbers
| Desired Output | Input |
|----------------|-------|
| Five five five, seven seven two, nine one four zero | (555)-265-9076 |
| Five five five, seven seven two, nine one four zero | 555-772-9140 |
| Five five five, seven seven two, nine one four zero | 5 5 5, 7 7 2, 9 1 4 0 |
​
### Decimals
| Desired Output | Input |
|----------------|-------|
| Zero point seven five | 0.75 |
| Zero point seven five | 0 point 7 5 |
​
## Currency
| Desired Output | Input |
|----------------|-------|
| Seven dollars, ninety five cents | $7.95 |
| One thousand and forty-five dollars, ninety six cents | $1,045.96 |
| One thousand and forty-five dollars, ninety six cents |  $ 1045.96 |
​
## Units of Measurement
| Desired Output | Input |
|----------------|-------|
| Five kilograms | 5kg |
| Seventy degrees Fahrenheit | 70°F |


# Dates and Times
We recommend the following inputs to get your desired output.
* Dates
* Times
​
## Dates
Rime supports inputting dates in a variety of formats, such as standard date format, full dates, or abbreviated dates.

| Desired Output | Input |
|----------------|-------|
| October twelfth, twenty twenty-four | 10/12/2024 |
| March fifteenth, twenty twenty-three | March 15, 2023 |
| January first | January 1st |
| January first | Jan. 1 |
​
## Times
| Desired Output | Input |
|----------------|-------|
| Ten thirty A M | 10:30 am |
| Ten thirty A M | 10:30am |
| Ten thirty A M | 10:30 AM |
| Two o'clock P M | 2 o'clock p. m. |

# Abbreviations, Acronyms, and Initialisms
We recommend the following inputs to get your desired output.
* Abbreviations
* Acronyms and Initialisms
​
## Abbreviations
Rime will correctly pronounce most common abbreviations automatically.

| Desired Output | Input |
|----------------|-------|
| Doctor Smith | Dr. Smith |
| For example | e.g. |
| Road | rd. |
| Saint John | St. John |
​
## Acronyms and Initialisms
Acronyms are pronounced as a single word, for example, NASA is pronounced as "Nasa". Initialisms are pronounced as a series of letters, for example DNA is pronounced as "D N A".

By default Rime will pronounce a series of capital letters as acronyms, i.e. as a single word. However, for many common initialisms, e.g. DNA, ID, USA, FBI, CIA, etc., Rime will automatically pronounce them correctly as a series of letters.

That being said, to ensure that initialisms are pronounced correctly as a series of letters, the best practice is to use lower case and put a period and space after each letter.

| Desired Output | Input |
|----------------|-------|
| Nasa | NASA |
| D N A | DNA |
| D N A | d. n. a. |
| UPS | u. p. s. |
| GPA | g. p. a. |


# Symbols and Percentages
We recommend the following inputs to get your desired output.

| Desired Output | Input |
|----------------|-------|
| And | & |
| Dollar |  $  |
| Percent | % |
| One hundred percent | 100% |
| Hash | # |

# Addresses, URLs, and Emails
We recommend the following inputs to get your desired output.
* Addresses
* URLs
* Emails
​
## Addresses
While Rime will typically pronounce state name abbreviations correctly in the context of an address, best practice is to write out the full state name, e.g. "Massachusetts" instead of "MA", to get consistent results. Common street abbreviations, e.g. "Rd." or "St.", will automatically be pronounced correctly.

| Desired Output | Input |
|----------------|-------|
| Five twenty-nine main street, boston, massachusetts, zero two one two nine | 529 Main St., Boston, Massachusetts 02129 |
| Five twenty-nine main street, boston, massachusetts, zero two one two nine | 529 Main St., Boston, MA 02129 |
| Five twenty-nine main street, boston, massachusetts, zero two one two nine | 529 Main Street, Boston, MA 02129 |
| Five twenty-nine main street, boston, massachusetts, zero two one two nine | 529 Main St, Boston, MA 02129 |
​
## URLs
| Desired Output | Input |
|----------------|-------|
| Double-u double-u double-u dot example dot com | www.example.com |
| H t t p s colon slash slash double-u double-u double-u dot rime dot ai slash dashboard | https://rime.ai/dashboard |
