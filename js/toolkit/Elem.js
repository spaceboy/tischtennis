class Elem {

    element;

    constructor (context, el) {
        if (Elem.isDomObject(context)) {
            if (!el) {
                this.element = context;
                return;
            }
            let element = context.querySelector(el);
            if (!element) {
                return;
            }
            this.element = element;
            return;
        }
        let element = (
            el
            ? (context instanceof Elem ? context.get() : context).querySelector(el)
            : document.querySelector(context)
        );
        if (!element) {
            return;
        }
        this.element = element;
    }

    static create (name) {
        return new Elem(document.createElement(name));
    }

    static from (context, el) {
        var element = new Elem(context, el);
        return (element.get() ? element : false);
    }

    get () {
        return this.element;
    }

    // Set attribute(s);
    // when called with one string parameter, return attribute value.
    // ELEMENT.attr("attribute", "value")
    // ELEMENT.attr({
    //   "attribute1": "value1",
    //   ..
    //   "attributeN": "valueN",
    // })
    attr (name, value) {
        if (name && value !== undefined) {
            this.element.setAttribute(name, value);
            return this;
        }
        if (name) {
            if (typeof name === "string" || name instanceof String) {
                return this.element.getAttribute(name);
            }
            for (var i in name) {
                this.element.setAttribute(i, name[i]);
            }
        }
        return this;
    }

    // Set style element(s);
    // when called with one string parameter, return style value.
    // ELEMENT.style("attribute", "value")
    // ELEMENT.style({
    //   "attribute1": "value1",
    //   ..
    //   "attributeN": "valueN",
    // })
    style (name, value) {
        if (name && value !== undefined) {
            this.element.style[name] = value;
            return this;
        }
        if (name) {
            if (typeof name === "string" || name instanceof String) {
                return this.element.style[name];
            }
            for (var i in name) {
                this.element.style[i] = name[i];
            }
        }
        return this;
    }

    // Alias to style:
    css (name, value) {
        return this.style(name, value);
    }

    // Remove attribute on active element.
    attrRemove (name) {
        this.element.removeAttribute(name);
        return this;
    }

    // Set/get active element's innerHTML.
    html (value) {
        if (value === undefined) {
            return this.element.innerHTML;
        }
        this.element.innerHTML = value;
        return this;
    }

    // Set/get active element's innerText.
    text (value) {
        if (value === undefined) {
            return this.element.innerText;
        }
        this.element.innerText = value;
        return this;
    }

    // Create and return active element's clone.
    clone (deep) {
        this.element = this.element.cloneNode(deep);
        return this;
    }

    // Find closest element.
    closest (query) {
        return this.element.closest(query);
    }

    // Place active element AFTER given element.
    after (el) {
        if (el instanceof Elem) {
            el = el.get();
        }
        el.parentNode.insertBefore(this.element, el.nextSibling);
        return this;
    }

    // Place active element BEFORE given element.
    before (el) {
        if (el instanceof Elem) {
            el = el.get();
        }
        el.parentNode.insertBefore(this.element, el);
        return this;
    }

    // Append active element to given element.
    appendTo (el) {
        if (Elem.isDomObject(el)) {
            el.appendChild(this.element);
            return this;
        }
        if (el instanceof Elem) {
            el.get().appendChild(this.element);
            return this;
        }
        document.querySelector(el).appendChild(this.element);
        return this;
    }

    // Append given element to active element.
    append (el) {
        this.element.appendChild(el instanceof Elem ? el.get() : el);
        return this;
    }

    // Get previous sibling of active element.
    prev () {
        return this.element.previousSibling;
    }

    // Get Elem object based on previous sibling of active element.
    elemPrev () {
        return new Elem(this.element.previousSibling);
    }

    // Get previous sibling of active element.
    prevElement () {
        return this.element.previousElementSibling;
    }

    // Get Elem object based on previous sibling of active element.
    elemPrevElement () {
        return new Elem(this.element.previousElementSibling);
    }

    // Get next sibling of active element.
    next () {
        return this.element.nextSibling;
    }

    // Get Elem object based on next sibling of active element.
    elemNext () {
        return new Elem(this.element.nextSibling);
    }

    // Get next element sibling of active element.
    nextElement () {
        return this.element.nextElementSibling;
    }

    // Get Elem object based on next element sibling of active element.
    elemNextElement () {
        return new Elem(this.element.nextElementSibling);
    }

    // Get parent of active element.
    parent () {
        return this.element.parentNode;
    }

    // Get Elem object based on parent of active element.
    elemParent () {
        return new Elem(this.element.parentNode);
    }

    // Remove active element from DOM.
    remove () {
        return Elem.removeElement(this.element);
    }

    // Wrap given element by active element.
    wrap (el) {
        if (el instanceof Elem) {
            el = el.get();
        }
        el.parentNode.insertBefore(this.element, el).appendChild(el.cloneNode(true));
        el.remove();
        return this;
    }

    // Set HTML class on active element.
    class (className) {
        this.element.setAttribute("class", className);
        return this;
    }

    // Add HTML class to active element.
    addClass (className) {
        this.element.classList.add(className);
        return this;
    }

    // Remove CSS class from active element.
    removeClass (className) {
        this.element.classList.remove(className);
        return this;
    }

    // Add or remove given CSS class to/from active element.
    switchClass (className, set) {
        if (set) {
            return this.addClass(className);
        }
        return this.removeClass(className);
    }

    // Toggle CSS class on active element.
    toggleClass (className, classList) {
        if (!classList || !classList.length) {
            this.element.classList.toggle(className);
            return this;
        }
        for (var i = 0, l = classList.length; i < l; ++i) {
            this.element.classList.remove(classList[i]);
        }
        if (className) {
            this.element.classList.add(className);
        }
        return this;
    }

    // Clear attribute "class" on active element.
    clearClass () {
        if (this.element.hasAttribute("class") && !this.element.getAttribute("class")) {
            this.element.removeAttribute("class");
        }
        return this;
    }

    // Detect whether active element has given CSS class or not.
    hasClass (className) {
        return (this.#inArray(className, this.element.classList) !== false);
    }

    // Return count of child nodes.
    // When query is set, return count of matching querySelectorAll nodes.
    childCount (query) {
        if (query) {
            return this.element.querySelectorAll(query).length;
        }
        return this.element.childNodes.length;
    }

    // Return bool whether active element is checked or not;
    // when parameter is set, set "checked" attribute to ective element and return this.
    checked (value) {
        if (value === undefined) {
            return this.element.checked;
        }
        this.element.checked = value;
        return this;
    }

    // Return value of active element;
    // when value is set, set value to ective element and return this.
    val (value) {
        if (value === undefined) {
            if (this.element.type === "checkbox") {
                return this.element.checked;
            }
            return Elem.getValue(this.element);
        }
        if (this.element.type === "checkbox") {
            this.element.checked = (
                value === true
                || ((typeof value === "number" || value instanceof Number) && (value !== 0))
                || ((typeof value === "string" || value instanceof String) && value.match(/^(1|true|yes|on)$/i))
            );
            return this;
        }
        this.element.value = Elem.clearValue(this.element, value);
        return this;
    }

    // Shortcut for Elem.val.
    value (value) {
        return this.val(value);
    }

    // Swap with given node
    swapWithNode (node) {
        if (node instanceof Elem) {
        }
        Elem.swapNodes(this.element, node);
        return this;
    }

    // Return node matching query on active element.
    qs (query) {
        return this.element.querySelector(query);
    }

    // Return node list matching query on active element.
    qsAll (query) {
        return this.element.querySelectorAll(query);
    }

    // Return Elem object based on node matching query on active element.
    qsElem (query) {
        return new Elem(this.element.querySelector(query));
    }

    // Triggers event on active element.
    // When event is instance of Event, triggers event,
    // otherwise creates new Event on event name (event) and parameters (params).
    trigger (event, params) {
        this.element.dispatchEvent(
            event instanceof Event
            ? event
            : new Event(event, params)
        );
    }

    // Posts event on active element.
    // When event is instance of Event, posts event,
    // otherwise creates new Event on event name (event) and parameters (params).
    post (event, params) {
        let that = this;
        window.setTimeout(that.trigger(event, params), 1);
    }

    // When current element IS NOT an SELECT element, returns null.
    // Otherwise returns NodeList of child OPTION elements;
    // when NUMBER is given, returns OPTION with given index (null when option[number] doesn't exist).
    options (number) {
        if (this.element.tagName !== "SELECT") {
            return null;
        }
        var o = this.element.querySelectorAll("option");
        if (number === undefined) {
            return o;
        }
        if (o.length <= number) {
            return null;
        }
        return o[number];
    }

    // Opens current element in fullscreen mode.
    requestFullscreen () {
        if (this.element.requestFullscreen) {
            this.element.requestFullscreen();
        } else if (this.element.webkitRequestFullscreen) {
            this.element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            this.element.msRequestFullscreen();
        } else if (element.mozRequestFullscreen) {
            this.element.mozRequestFullscreen();
        }
    }

    // Exiting fullscreen mode.
    static exitFullscreen () {
        if (!document.fullscreenElement) {
            return;
        }

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozExitFullscreen) {
            document.mozExitFullscreen();
        }
    }

    // Returns fullscreen element.
    static getFullscreenElement () {
        if (document.fullscreenElement) {
            return document.fullscreenElement;
        }
        if (document.webkitFullscreenElement) {
            return document.webkitFullscreenElement;
        }
        if (document.msFullscreenElement) {
            return document.msFullscreenElement;
        }
        if (document.mozFullscreenElement) {
            return document.mozFullscreenElement;
        }
    }

    // Checks whether fullscreen mode is enabled.
    static isFullscreenEnabled () {
        if (document.fullscreenEnabled) {
            return document.fullscreenEnabled;
        }
        if (document.webkitFullscreenEnabled) {
            return document.webkitFullscreenEnabled;
        }
        if (document.msFullscreenEnabled) {
            return document.msFullscreenEnabled;
        }
        if (document.mozFullscreenEnabled) {
            return document.mozFullscreenEnabled;
        }
    }

    // Checks whether fullscreen mode is active.
    static isFullscreenActive () {
        return !!Elem.getFullscreenElement();
    }

    // TOOL: Returs element, document or false.
    static findElement (sel) {
        if (sel instanceof Elem) {
            return sel.get();
        }
        if (Elem.isDomObject(sel)) {
            return sel;
        }
        if (!sel) {
            return document;
        }
        return (document.querySelector(sel) ?? false);
    }

    // TOOL: Detect whether given object is a DOM object.
    static isDomObject (obj) {
        if (obj instanceof HTMLElement) {
            return true;
        }
        return typeof obj === "object"
            && obj.nodeType === 1
            && typeof obj.style === "object"
            && typeof obj.ownerDocument === "object";
    }

    // TOOL: Remove given element from DOM.
    // Return bool:
    // TRUE element removed
    // FALSE element not removed
    static removeElement (el) {
        let e;

        if (Elem.isDomObject(el)) {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
            return true;
        }
        if (el instanceof Elem) {
            e = el.get();
            if (e.parentNode) {
                e.parentNode.removeChild(e);
            }
            return true;
        }
        e = document.querySelector(el);
        if (e.parentNode) {
            e.parentNode.removeChild(e);
            return true;
        }
        return false;
    }

    // TOOL: Remove last child of given element.
    static removeLastChild (context, el) {
        var parent = Elem.getElement(context, el);
        parent.removeChild(parent.lastElementChild);
    }

    // TOOL: Swap given nodes (DOM elements) positions in DOM.
    static swapNodes (n1, n2) {
        // Find parents:
        var p1 = n1.parentNode;
        var p2 = n2.parentNode;
        if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) {
            return;
        }
        // Create placeholders:
        var ph1 = document.createElement("span");
        p1.insertBefore(ph1, n1);
        var ph2 = document.createElement("span");
        p2.insertBefore(ph2, n2);
        // Move nodes:
        p1.insertBefore(n2, ph1);
        p2.insertBefore(n1, ph2);
        // Remove placeholders:
        p1.removeChild(ph1);
        p2.removeChild(ph2);
    }

    // TOOL: Return HTML element (not instance of Elem!) by context (when given) and id.
    // When not given explicit context, document is used as default context.
    static byId (context, id) {
        return (
            id
            ? context.getElementById(id)
            : document.getElementById(context)
        );
    }

    // TOOL: Return HTML element (not instance of Elem!) by context (when given) and query selector.
    // When not given explicit context, document is used as default context.
    static sel (context, query) {
        return (
            query
            ? context.querySelector(query)
            : document.querySelector(context)
        );
    }

    // TOOL: Return HTML element's (selected by context (when given) and id) value.
    // When not given explicit context, document is used as default context.
    static valueById (context, id) {
        return Elem.getValue(Elem.byId(context, id));
    }

    // TOOL: Return DOM element.
    // When first parameter is DOM object, return this DOM object.
    // When first parameter is instance of Elem, return DOM object of this Elem.
    // Otherwise return querySelector - when not given context (method called with one parameter only), querySelector is called on document.
    static getElement (context, el) {
        if (Elem.isDomObject(context)) {
            return context;
        }
        if (context instanceof Elem) {
            return context.get();
        }
        return (
            el
            ? context.querySelector(el)
            : document.querySelector(context)
        );
    }

    // Returns value of given element w/ prefix and postfix from elements "data-prefix", "data-postfix" resp.
    static getValue (el) {
        return (
            (el.hasAttribute("data-prefix") ? el.getAttribute("data-prefix") : "")
            + el.value
            + (el.hasAttribute("data-postfix") ? el.getAttribute("data-postfix") : "")
        );
    }

    // Returns reconstructed "original" value of given INPUT element (w/o possible prefix and postfix).
    // Type of value must be string and element must be INPUT; otherwise returns original value.
    // Examples:
    // On el = INPUT element with data-postfix="px" & value = "10px" returns "10"
    // On el = INPUT element with data-prefix="deg" & value = "deg30" returns "30"
    static clearValue (el, value) {
        if (el.tagName !== "INPUT") {
            return value;
        }
        if (typeof value !== "string") {
            return value;
        }
        let attr;
        if (el.hasAttribute("data-prefix")) {
            attr = el.getAttribute("data-prefix");
            value = value.replace((new RegExp(`${attr}$`)), "")
        }
        if (el.hasAttribute("data-postfix")) {
            attr = el.getAttribute("data-postfix");
            value = value.replace((new RegExp(`^${attr}`)), "")
        }
        if (!el.hasAttribute("type")) {
            return value;
        }
        switch (el.type) {
            case "number":
            case "range":
                return parseFloat(value);
            default:
                return value;
        }
    }

    #inArray (needle, haystack) {
        for (var i = 0, l = haystack.length; i < l; ++i) {
            if (haystack[i] === needle) {
                return i;
            }
        }
        return false;
    }
}