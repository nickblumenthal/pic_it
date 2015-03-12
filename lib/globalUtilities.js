function binaryIndexOf(searchElement) {
    'use strict';

    var minIndex = 0;
    var maxIndex = this.length - 1;
    var currentIndex;
    var currentElement;

    while (minIndex <= maxIndex) {
            currentIndex = Math.floor((minIndex + maxIndex) / 2);
            currentElement = this[currentIndex];

            if (currentElement < searchElement) {
                    minIndex = currentIndex + 1;
            }
            else if (currentElement > searchElement) {
                    maxIndex = currentIndex - 1;
            }
            else {
                    return currentIndex;
            }
    }

    return -1;
}
    
Array.prototype.binaryIndexOf = binaryIndexOf;