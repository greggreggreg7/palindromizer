/* (N)PTM(E): (Non-)Palindrome Terminal Mark (End) */
var PTM = "{";
var PTME = "}";
var NPTM = "[";
var NPTME = "]";
var palCounter = 0

function colorize(string, isPal, counter, type, offset) {
    var ana = (type === "front") ? "back" : "front";
    var result = "<span id='pair-" + counter + "-" + type + "' ";
    if (isPal) {
        result += "class='palindrome p" + palCounter + "'";
    } else {
        result += "class='non-palindrome'";
    }
    result += " offset='" + offset + "' side='" + type + "' pair='" + counter + "' analog='pair-" + counter + "-" + ana + "' >" + string + "</span>";
    return result;
}

function just_letters(string) {
    /*
    In:  string
    Out: same string but with only letters and all lowercase    
    */
    return string.replace(/[^A-Za-z]/g, "").toLowerCase();
}

function map_string_to_scrubbed_string(string, scrubbedString) {    
    /*
    In: A string and the same string lowercase and scrubbed of all non-letters

    Out: A list in which each index position contains the same letter indexed
         to the scrubbed string but also with all trailing non-letters (with the 
         last item containing any leading non-letters)

    i.e.,
    string: "Hello, I'm Greg!"
    scrubbed string: "helloimgreg

    mapped list: ["H", "e", "l", "l", "o", ", I", "'m", " G", "r", "e", "g!"]

    index 5 of scrubbed: i
    index 5 of mapped: ", I"

    This solves the problem of comparing scrubbed strings for palindromes, but
    returning to the user their string intact.
    */
    var placeInString;
    var lastPlaceInString = 0;
    var mapped = [];
    var finalPos = scrubbedString.length - 1;
    var lowercase = string.toLowerCase();
    // console.log(finalPos)
    for (var i = 0; i <= finalPos; i++) {
        if (i < finalPos) {
            placeInString = lowercase.indexOf(scrubbedString[i], lastPlaceInString) + 1;
        } else {
            placeInString = string.length;
        }
        mapped.push(string.substring(lastPlaceInString, placeInString));
        lastPlaceInString = placeInString;
    }
    return mapped;
}

function map_to_string(map) {

    /*
    Unpacks mapped string array to string
    */
    return map.join("");
}

function palindromize(left, right, listReturn, oldString) {
    listReturn = (typeof listReturn === "undefined") ? false : listReturn;
    oldString = (typeof oldString === "undefined") ? false : oldString;
    // '''
    // In:  Any string

    // Out: The same string, analyzed for all palindromes within, with red text 
    //      showing parts of the string that are not mirrored by text on the 
    //      flipside of the string.
    // '''

    var scrubbedStringL = just_letters(left);
    var mappedStringL = map_string_to_scrubbed_string(left, scrubbedStringL);
    var scrubbedStringR = just_letters(right);
    var mappedStringR = map_string_to_scrubbed_string(right, scrubbedStringR);
    var palArray = [[scrubbedStringL, scrubbedStringR]];

    var frontTextLength = 0;
    var backTextLength = right.length;
    var frontString = "";
    var backString = "";
    var frontPos = 0;
    var backPos = mappedStringR.length;

    go = true;
    while (go) {
        // # Copying palArray allows us to iterate through the array without 
        // # upsetting the underlining array structure
        arrayCopy = palArray.slice(0);

        // # go will be flipped back to True as long as there are any pieces
        // # of the string that are not in a terminal state.
        go = false;

        for (var i = 0; i < arrayCopy.length; i++) {
            // # two-length lists are populated with analog pieces of the original string.
            // # these need to be processed by find_longest_pal_in_pieces
            if (!is_terminal(arrayCopy[i][0]) && !is_terminal(arrayCopy[i][1])) {
                // # replace the piece in question in the original array
                // # with results of find_longest...
                found = find_longest_pal_in_pieces(arrayCopy[i][0], arrayCopy[i][1]);

                replace = palArray.indexOf(arrayCopy[i]);
                for (var o = 0; o < found.length; o++) {
                    destruct = o ? 0 : 1;
                    palArray.splice(replace + o, destruct, found[o]);
                };

                go = true;
            }
        };
    }
    counter = 1;

    if (listReturn) {return palArray;}

    var isPal;
    palCounter = 0;
    for (var i = 0; i < palArray.length; i++) {
        if (palArray[i].length === 2 && (palArray[i][0].length > 2 || palArray[i][1].length > 2)) {
            var frontScrubbedStringLength = palArray[i][0].length - 2;
            if (palArray[i][0].slice(0,1) === PTM) {
                isPal = true;
                palCounter++;
                if (palCounter > 5) {palCounter = 1;}
            } else {
                isPal = false;
            }
            frontString = frontString + colorize(map_to_string(mappedStringL.slice(frontPos, frontPos + frontScrubbedStringLength)), isPal, counter, "front", frontTextLength);
            frontTextLength += map_to_string(mappedStringL.slice(frontPos, frontPos + frontScrubbedStringLength)).length;
            frontPos = frontPos + frontScrubbedStringLength;
            var backScrubbedStringLength =  palArray[i][1].length - 2;
            backTextLength -= map_to_string(mappedStringR.slice(backPos - backScrubbedStringLength, backPos)).length;
            backString = colorize(map_to_string(mappedStringR.slice(backPos - backScrubbedStringLength, backPos)), isPal, counter, "back", backTextLength) + backString;
            backPos = backPos - backScrubbedStringLength;
            counter++;
        } 
    };
    return [frontString, backString];
}


function is_terminal(string) {
    /*
    In:  An optional string
    Out: True if string starts with a terminal mark or is empty; False otherwise
    */
    if (typeof string === "undefined") {return false}
    return string.slice(0, 1) === PTM || string.slice(0, 1) === NPTM;
}

function reverse(s) {
    return s.split("").reverse().join("");
}

function find_longest_pal_in_pieces(left, right) {
    if (typeof right === "undefined") {
        var single = true;
        right = left.slice(left.length/2);
        left = left.slice(0, left.length/2);
    }

    if (!left.length || !right.length) {
        return single ? [[NPTM + left + right + NPTME]] : [[NPTM + left + NPTME, NPTM + right + NPTME]];
    }
    /*
    In: Analog "mirror" pieces of the original string given to palindromize, left and right
    Out: If a palindrome is found in the analog pieces:
            [
                ["outside" left, "outside" right,],
                [palindrome left half marked terminal, palindrome right half marked terminal],
                ["inside" left, "inside" right]
            ]
        which map to:
        "outside left" "palindrome left" "inside left" HERE BE DRAGONS "inside right" "palindrome right" "outside right"
         If not:
            [
                [left marked terminal,
                right marked terminal]
            ]
    */

    var scrubbedLeft = just_letters(left);
    var scrubbedRight = just_letters(right);
    var mappedLeft = map_string_to_scrubbed_string(left, scrubbedLeft);
    var mappedRight = map_string_to_scrubbed_string(right, scrubbedRight);
    /*
    # boolDict OF WONDER:
    # the precise way to inspect the two sides for the largest palindrome
    # is to take substrings from the larger side to compare (the reverse) to
    # the smaller side. But we don't know which side is the bigger. So, we 
    # map booleans False (arbitrarily) to the left side and True to the right.
    # Then we test for which side is indeed larger. The truth value of 
    # rightIsLarger will reflect the truth value of that statement 
    # contained in its variable name. Then we use that truth value to get
    # which ever side is indeed larger.
    */

    var boolDict = [[scrubbedLeft, mappedLeft], [scrubbedRight, mappedRight]];
    var rightIsLarger = scrubbedLeft.length > scrubbedRight.length ? false : true;
    var largerScrubbed = boolDict[Number(rightIsLarger)][0];
    var smallerScrubbed = boolDict[Number(!rightIsLarger)][0];

    counter = 1;
    for (var i = largerScrubbed.length; i > 0; i--) {
        for (var o = 0; o < counter; o++) {

            // # startHalf being the substring being checked for its reverse
            var startHalf = largerScrubbed.slice(o,i+o);
            reverseHalf = reverse(startHalf);

            // # make that search in the analog (smaller piece)
            var reversePos = smallerScrubbed.indexOf(reverseHalf);

            if (reversePos !== -1) {

                // # Move index positions from scrubbed to map
                var largerMapped = boolDict[Number(rightIsLarger)][1];
                var smallerMapped = boolDict[Number(!rightIsLarger)][1];

                var startHalf = map_to_string(largerMapped.slice(o,i+o));
                var reverseHalf = map_to_string(smallerMapped.slice(reversePos,reversePos + i));
                var aString = map_to_string(largerMapped.slice(0,o));
                var bString = map_to_string(largerMapped.slice(i+o));
                var aStringAna = map_to_string(smallerMapped.slice(reversePos + i));
                var bStringAna = map_to_string(smallerMapped.slice(0,reversePos));

                // # return list always goes: [["outside" left, "outside" right,], [found Palindrome left, found Palindrome right], ["inside" left, "inside" right]] 

                if (rightIsLarger) {
                    return (single) ? [[bStringAna, bString], [PTM + reverseHalf + PTME, PTM + startHalf + PTME], [aStringAna + aString]] : [[bStringAna, bString], [PTM + reverseHalf + PTME, PTM + startHalf + PTME], [aStringAna, aString]];
                } else {
                    return [[aString, aStringAna], [PTM + startHalf + PTME, PTM + reverseHalf + PTME], [bString, bStringAna]];
                }
            }
        };
        counter++        
    };
    /* if you got down here, there's no palindrome in the pieces. Mark them as terminal. */
    return single ? [[NPTM + left + right + NPTME]] : [[NPTM + left + NPTME, NPTM + right + NPTME]];
}

// Code below by Darius Bacon www.wry.make //

// Try to extend input into a palindrome.

//// load('segment.js');
// Word segmentation following norvig.com/ngrams

//// load('utils.js');  
function itemgetter(property) {
    return function (object) { return object[property]; };
}

// N.B. The table is a built-in Javascript object, so key lookup 
// only really works for primitives as arguments.
function memoize(f) {
    var memos = {}; // XXX make this a Dictionary for safety
    return function (x) {
        if (!(x in memos))
            memos[x] = f(x);
        return memos[x];
    };
}

function maximum(xs, key) {
    var best = null;
    for (var i = 0; i < xs.length; ++i)
        if (!best || key(best) < key(xs[i]))
            best = xs[i];
    return best;
}

function reverseString(string) {
    var a = arrayFromString(string);
    a.reverse();
    return a.join('');
}

function arrayFromString(string) {
    var result = [];
    for (var i = 0; i < string.length; ++i)
        result.push(string.charAt(i));
    return result;
}

function multidictGet(dict, keys) {
    for (var i = 0; i < keys.length; ++i)
        if (keys[i] in dict)
            dict = dict[keys[i]];
        else
            return undefined;
    return dict;
}

function multidictSet(dict, keys, val) {
    for (var i = 0; i < keys.length-1; ++i)
        if (keys[i] in dict)
            dict = dict[keys[i]];
        else
            dict = dict[keys[i]] = {};
    dict[keys[keys.length-1]] = val;
}

// From http://javascript.crockford.com/remedial.html
function typeOf(value) {
    var t = typeof value;
    if (t === 'object')
        if (value) {
            if (value instanceof Array)
                return 'array';
        } else
            return 'null';
    return t;
}

function map(f, array) {
    var result = [];
    for (var i = 0; i < array.length; ++i)
        result.push(f(array[i]));
    return result;
}
//// End load('utils.js');  
// load('count_big.js'); //* skip
/// vocab['the'] / NT
//. 0.07237071748562623
/// maxWordLength
//. 18

function Pw(word) {
    if (word in vocab)
        return vocab[word] / NT;
    else
        return 10 / (NT * Math.pow(1000, word.length));
}
/// [Pw('the'), Pw('xzz')]
//. 0.07237071748562623,9.042948579985784e-15

/// vocab['dub']
//. 1
/// Pw('dub')
//. 9.042948579985784e-7
/// [Pw('dub') * Pw('bud'), Pw('dubbud')]
//. 2.4532475706080075e-12,9.042948579985784e-24

/// segment('buddub')
//. bud,dub
/// Math.exp(segment('buddub').logP)
//. 2.453247570608014e-12

/// Math.exp(segment('ylenolbud').logP)
//. 3.0243218199303276e-29
/// segment('ylenolbud')
//. y,le,no,l,bud

/// Pw('ylenolbud')
//. 9.042948579985785e-33
/// Pw('ylenol')
//. 9.042948579985784e-24
/// Pw('bud')
//. 0.0000027128845739957352
/// Pw('xzz')
//. 9.042948579985784e-15
/// Pw('ylenol')*Pw('bud')
//. 2.4532475706080071e-29

// So how should we set the parameters in Pw()?
// Pw(?^n) = A b^n
//  First cut: A = 10/NT, b = 1/10

// Nonsense words coalesce if A < 1:
// A b^m A b^n = A^2 b^(m+n) < A b^(m+n)

// How about a real word (of length m) plus nonsense:
// Separate if C A b^n > A b^(m+n)
//             C > b^m
// A rare word has C = 1/NT, so 1/NT > b^m
// If we want rare 3-letter words to separate, then 1/NT > b^3
// b < NT^-(1/3)
/// 1/Math.pow(NT, -1/3)
//. 103.41018447647471
/// 1/Math.pow(NT, -1/2)   // For rare 2-letter words, too
//. 1051.5864206046026

// Return a list of words such that words.join('') === string, along
// with its log-probability. We pick the most-probable such list.
function segment(string) {
    function pair(words, logP) { words.logP = logP; return words; }
    var memoSeg = memoize(function (string) {
        if (!string) return pair([], 0);
        var best = pair([], -Infinity);
        var limit = Math.min(string.length, maxWordLength);
        for (var i = 1; i <= limit; ++i) {
            var word = string.slice(0, i);
            var result = memoSeg(string.slice(i));
            var logP = Math.log(Pw(word)) + result.logP;
            if (best.logP < logP)
                best = pair([word].concat(result), logP);
        }
        return best;
    });
    return memoSeg(string);
}
/// segment('iwin').logP
//. -15.247999350135384
/// segment('iwintheinternetsyayme')
//. i,win,the,internet,s,y,ay,me
//// End load('segment.js');

/// complete('a tylenol bud')
//. a tylenol bud dub lonely ta
/// complete('Satan, oscillate my')
//. Satan, oscillate my metallic sonatas
/// complete('star')
//. star rats
/// complete('Zeus spots ti')
//. Zeus spots tit stops suez
/// complete('Hello there')
//. Hello there er eh toll eh
/// complete('A man, a plan, a c')
//. A man, a plan, a canal panama
/// complete('A man, a plan, a')
//. A man, a plan, anal panama

// Return a palindrome having :string as its left half. Try to pick
// the 'best' one.
function complete(string) {
    var candidates = map(segment, listCandidates(string));
    function score(words) {
        // A better result has lower entropy per letter.
        return words.logP / (extractLetters(words.join('')).length || 1);
    }
    var palindrome = maximum(candidates, score);
    return merge(string, palindrome.join(' '));
}

function extractLetters(string) {
    return string.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function listCandidates(string) {
    var letters = extractLetters(string);   
    var result = [];
    for (var i = 0; i <= letters.length; ++i) {
        var tail = letters.slice(i);
        if (isPalindrome(tail)) {
            var head = letters.slice(0, i);
            result.push(letters + reverseString(head));
        }
    }
    return result;
}

function isPalindrome(string) {
    return string == reverseString(string);
}

/// merge('A man,', 'aman a plan')
//. A man, a plan

// Return a string that's like :base on the left and :extended on the
// right.
// Pre: extractLetters(extended) starts with extractLetters(base),
//   and :extended contains only letters and spaces.
function merge(base, extended) {
    for (var b = 0, e = 0; b < base.length; ++b)
        if (/[a-z0-9]/i.test(base.charAt(b))) {
            while (extended.charAt(e) === ' ')
                ++e;
            ++e;
        }
    return base + extended.slice(e);
}
