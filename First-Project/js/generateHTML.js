/* generateHTML function takes object as parameter and generates HTML node from it;
object has following syntax: {
    mainSelector (required),        // element selector in which you want to insert generated HTML
    parent (required) {             // element in which you can create child elements
        element (required), index (optional, it's a value from where we start counting parent elements),
        content (optional),
        attributes (optional) { nameValuePair1, nameValuePair2, ... nameValuePairN }    // nameValuePair ==> attrName: attrValue
    },
    firstChild (optional) {         // use this when you want first child element to be different from others, otherwise you can skip it
        element (optional), content (optional),
        attributes (optional) { nameValuePair1, nameValuePair2, ... nameValuePairN }
    },
    otherChilds (optional) {
        element (optional), count (optional), IDs (optional), content (optional),
        attributes (optional) { nameValuePair1, nameValuePair2, ... nameValuePairN }
    }
}
*/

function generateHTML({ mainSelector, parent, firstChild, otherChilds }) {
    let mainNode = document.querySelector(mainSelector);
    let parentNode = document.createElement(parent.element);
    for (let key in parent.attributes) {
        // set parent attributes
        parentNode.setAttribute(key, parent.attributes[key]);
    }
    // give index to a parent element
    if (parent.index != undefined) parentNode.setAttribute('data-col-index', `${parent.index}`);
    // if parent has content
    if (parent.content) {
        parentNode.appendChild(document.createTextNode(parent.content));
    }
    // if first child element is different from other children
    if (firstChild.element) {
        let firstChildNode = document.createElement(firstChild.element);
        for (let key in firstChild.attributes) {
            firstChildNode.setAttribute(key, firstChild.attributes[key]);
        }
        if (firstChild.content)
            firstChildNode.appendChild(document.createTextNode(firstChild.content));
        parentNode.appendChild(firstChildNode);
    }
    // if we need children elements create them
    if (otherChilds.element) {
        for (let i = 0; i < otherChilds.count; i++) {
            let childNode = document.createElement(otherChilds.element);
            for (let key in otherChilds.attributes) {
                childNode.setAttribute(key, otherChilds.attributes[key]);
                if (otherChilds.IDs)
                // give each element unique id, for accessing them in the future
                    childNode.setAttribute('data-id', `${i}`);
            }
            if (otherChilds.content)
                childNode.appendChild(document.createTextNode(otherChilds.content));
            parentNode.appendChild(childNode);
        }
    }
    // add created elements to main node
    mainNode.appendChild(parentNode);
}