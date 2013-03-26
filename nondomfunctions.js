/* (N)PTM(E): (Non-)Palindrome Terminal Mark (End) */
var PTM = "{";
var PTME = "}";
var NPTM = "[";
var NPTME = "]";
var palCounter = 0
function colorize(string, isPal, counter, type, offset) {
    var ana = (type === "front") ? "back" : "front";
    if (isPal) {
        string = "<span id='pair-" + counter + "-" + type + "' class='palindrome p" + palCounter +"' offset='" + offset + "' side='" + type + "' pair='" + counter + "' analog='pair-" + counter + "-" + ana + "' >" + string + "</span>";
        // console.log(string)
    } else {
        string = "<span id='pair-" + counter + "-" + type + "' class='non-palindrome' offset='" + offset + "' side='" + type + "' pair='" + counter + "' analog='pair-" + counter + "-" + ana + "' >" + string + "</span>";
    }
    return string;
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
    // console.log(finalPos)
    for (var i = 0; i <= finalPos; i++) {
        if (i < finalPos) {
            placeInString = string.toLowerCase().indexOf(scrubbedString[i], lastPlaceInString) + 1;
        } else {
            placeInString =  string.length;
        }
        mapped.push(string.substring(lastPlaceInString,placeInString));
        lastPlaceInString = placeInString;
    }
    return mapped;
}

function map_to_string(map) {

    /*
    Unpacks mapped string to string
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
        // console.log("palArray right after while:");
        // console.log(palArray);
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

            if (palArray[i][0].slice(0,1) === "{") {
                isPal = true;
                palCounter++;
                if (palCounter > 5) {palCounter = 1;}
            } else {
                isPal = false;
            }
                // console.log(map_to_string(mappedStringL.slice(frontPos, frontPos + frontScrubbedStringLength)))

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


function is_terminal(string, strict) {
    /*
    In:  A string
    Out: Normal Mode: True if string starts with a terminal mark or is empty; False otherwise
         Strict Mode: True if string starts with a terminal mark; False otherwise
    */

    if (typeof string === "undefined") {return false}
    if (string.slice(0,1) === PTM || string.slice(0,1) === NPTM) {
        return true;
    } else {
        return false;
    }
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