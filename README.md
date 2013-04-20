Overview
========

Palindromizer is a web app built to make the arduous task of writing Palindromes easier. Works in Chrome only at the moment.

How it works
------------
Simply begin typing into either the left or right hand side of the text. Mirror-mode is on by default and any letters you type into one box will be generated, in reverse, in the opposite textbox. Palindromizer will attempt to parse this reverse text into words, using code borrowed from here: https://github.com/darius/js-playground

To edit your Palindrome in a more freestyle mode, click the "Mirror" button to de-activate Mirror-mode. Now text will not be auto-generated into the opposite text-box. Now, Palindromizer's palindrome detection functions will come into play. Any text inputted into one box which does not have a reverse analog in the other box will be tagged red, and different palindromic chunks of text will be tagged in different non-red colors.

TO-DO LIST
==========

* At the moment, special handling must be done to achieve a palindrome with an odd number of letters. Fix that.
* Add functionality for saving and retrieving palindromes.
* Word-suggestion

Background info
===============

What's a palindrome?
--------------------

For our purposes it's a phrase wherein the letters going from left to right are exactly the same as the letters going from right to left. For instance, famously, "A man, a plan, a canal: Panama." Or with more fun punctuation: "No! Sir! Away! A papaya war is on!" 

Motivation:
-----------

Writing palindromes is hard, particularly ones that make at least a little sense in English. My strategy has been to start with a word that has some word or word piece in its reverse, put that in the center and work from there.

For example: *Cesspool* 's reverse is *loopssec* and that has the word *loops* in it.

So now we have "loops sec cesspool". Well, these are all words (sec is kind of a stretch, but it could be short for second, or it could be the Security Exchange Commission... work with me here.), but they don't make sense. Let's make "sec" into "secret":

loops sec*ret* cesspool

This makes maybe a modicum of sense grammatically, but it's not a palindrome... for that we gotta add "ter" between secret and cesspool.

So now we have:

loops secret *ter* cesspool.

Uhoh... "ter" is not a word. But "center" is!

loops secret *cen*ter cesspool.

Great but its not a palindrome anymore until we add:

loops secret *nec* center cesspool.

Let's make it:

loops secret nec*tar* center cesspool.

Once again non-palindromic, but we can add:

loops secret nectar *rat* center cesspool.

Well, this is a palindrome, and everything is a true word... but it doesn't make sense... We can lop off one of the middle "r"s, though and get:

loops secret nectar **at center cesspool.

It's almost a complete English sentence, but who loops secret nectar at center cesspool? Well, Bob does. because Bob's a palindrome.

*Bob* loops secret nectar at center cesspool. *Bob!*

Now it's complete, just waiting for a talented illustrator to figure what image this could be a caption for. Perhaps a detective hot on the trail of some abnormal sewage behavior realizes finally that Bob is looping into the septic system some odd juice at the central facility. And realizing, he repeats Bob's name like, A-Ha!

Anyway, Palindromizer will help you get from Cesspool to that palindrome faster. Type on either side and a stream of letters will be mirrored on the other side. Make changes to punctuation and spacing as needed without disturbing the other side. Need to erase that middle character, like the "r" in our example palindrome? Turn off Mirror Mode by pressing the "Mirror" button and erase away!
