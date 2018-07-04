'use strict';

/* generateHTML function takes obj as parameter and generates HTML node from it;
obj has following syntax: {
    mainSelector (required),        // element selector in which you want to insert generated HTML
    parent (required) {             // element in which you can create child elements

        element (required), index (optional, starting index for counting parent element), content (optional),
        attributes (optional) { nameValuePair1, nameValuePair2, ... nameValuePairN }    // nameValuePair ==> attrName: attrValue
    },
    firstChild (optional) {         // use this when you want first child element to be different from others, otherwise you can skip it

        element (optional), content (optional),
        attributes (optional) { nameValuePair1, nameValuePair2, ... nameValuePairN }
    },
    otherChilds (optional) {

        element (optional), count (optional), content (optional),
        attributes (optional) { nameValuePair1, nameValuePair2, ... nameValuePairN }
    }
}
*/

function generateHTML(obj) {
    let mainNode = document.querySelector(obj.mainSelector);
    let parentNode = document.createElement(obj.parent.element);
    for (let key in obj.parent.attributes) {
        parentNode.setAttribute(key, obj.parent.attributes[key]);
    }
    if (obj.parent.index != undefined) parentNode.setAttribute('data-col-index', `${obj.parent.index}`);
    obj.parent.index++; // !!!review
    if (obj.parent.content) {
        parentNode.appendChild(document.createTextNode(obj.parent.content));
    }
    if (obj.firstChild.element) {
        let firstChildNode = document.createElement(obj.firstChild.element);
        for (let key in obj.parent.attributes) {
            firstChildNode.setAttribute(key, obj.firstChild.attributes[key]);
        }
        if (obj.firstChild.content)
            firstChildNode.appendChild(document.createTextNode(obj.firstChild.content));
        parentNode.appendChild(firstChildNode);
    }
    if (obj.otherChilds.element) {
        for (let i = 0; i < obj.otherChilds.count; i++) {
            let childNode = document.createElement(obj.otherChilds.element);
            for (let key in obj.parent.attributes) {
                childNode.setAttribute(key, obj.otherChilds.attributes[key]);
                childNode.setAttribute('data-id', `${i}`); // give each element unique id
                childNode.setAttribute('data-missed', 'true'); // to mark if lesson was missed or not by a student
            }
            if (obj.otherChilds.content)
                childNode.appendChild(document.createTextNode(obj.otherChilds.content));
            parentNode.appendChild(childNode);
        }
    }
    mainNode.appendChild(parentNode);
    return obj.parent.index;
}