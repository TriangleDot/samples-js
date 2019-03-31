function NoVarError(message) {
    this.name = "NoVarError";
    this.message = (message || "");
}
NoVarError.prototype = Error.prototype;

function SampleError(message) {
    this.name = "SampleError";
    this.message = (message || "");
}
SampleError.prototype = Error.prototype;




class Sample extends HTMLElement{
    constructor (html) {
        super();
        
        this._baseHtml = html;
        this.isSample = true;
        this._queue = [];
        this._started = false;
        
        


        
        
        

    }
    connectedCallback() {
        
        this._slotHtml = {};
        var remlist = [];
        for (let i of this.getElementsByTagName("insert")) {
            
            if (i.hasAttribute("place")) {
                this._slotHtml[i.getAttribute("place")] = i.innerHTML;
                remlist.push(i);
            }
            else {
                throw new SampleError("insert tag must have a <place> attribute!");
            }
        }
        for (let d of remlist) {
            d.remove();
        }
        this._slotHtml["_slot"] = this.innerHTML;
        this.innerHTML = this._baseHtml;
        //console.log(this);
        
        this._data = {};
        this.loadData(this);
        this._started = true;

        this.init();
        for (let i of this._queue) {
            this.setVar(i[0],i[1]);
        }
    }
    init() {

    }
    
    
    
    setVar(name,value) {
        if (this._started == false) {
            this._queue.push([name,value]);
            return
        }
        if (!(name in this._data)) {
            throw new NoVarError("Variable <"+name+"> does not exist within the Sample");
        }
        for (let i of this._data[name]) {
            
            if (i.type == "element") {
                i.object.setValue(value);
            }
            else if (i.type == "attribute") {
                i.object.setAttribute(i.name,value);
                
            }
            else if (i.type == "class") {
                var tcl = JSON.parse(JSON.stringify(i.current));
                for (let tc of value) {
                    tcl.push(tc);
                }
                
                for (let ec of i.object.classList) {
                    i.object.classList.remove(ec);
                }
                for (let gc of tcl) {
                    i.object.classList.add(gc);
                }
                
            }
            else if (i.type == "style") {
                
                for (let v of i.actives) {
                    
                    i.object.style.removeProperty(v);
                }
                i.actives = [];
                for (let s in value) {
                    
                    i.object.style[s] = value[s];
                    i.actives.push(s);
                }
            }

        }
    }

    loadData(element) {
        if (element.localName == "slot") {
            if (element.hasAttribute("place")) {
                var v = this._slotHtml[element.getAttribute("place")];
                if (v == undefined) {throw new SampleError("No code for slot <"+element.getAttribute("place")+">");}
                element.innerHTML = v;
            }
            else {
                element.innerHTML = this._slotHtml._slot;
            }
            
            
            
        }
        else {
            var regex = /{{(.*?)}}/g;
            
            var matched = element.textContent.match(regex);
            
            if (matched) {
                for (let m of matched) {
                    
                    
                    m = m.replace(/}/g,"").replace(/{/g,"");
                    element.innerHTML = element.innerHTML.replace("{{"+m+"}}","<sam-var var='"+m+"'></sam-var>");
                    if (!this._data[m]) {
                        this._data[m] = [];
                    }

                    
                    

                
                    
                }
            }

            
            for (let th of element.getElementsByTagName("sam-var")) {
                
                this._data[th.getAttribute("var")].push({type:"element",object:th});
                    
                
            }
        }
        for (let i of element.attributes) {
            
            if (i.value.startsWith("{{")) {
                var v = i.value.replace(/}/g,"").replace(/{/g,"");
                if (i.name == "class" || i.name == "style") {
                    if (i.name == "style") {
                        if (!this._data[v]) {
                            this._data[v] = [];
                        }
                        this._data[v].push({type:"style",object:element,actives:[]});
                        continue;
                    }
                }    
                
                if (!this._data[v]) {
                    this._data[v] = [];
                }
                this._data[v].push({type:"attribute",name:i.name,object:element});
            }
            
        }
        for (let cl of element.classList) {
            if (cl.startsWith("{{")) {
                var v = cl.replace(/}/g,"").replace(/{/g,"");
                element.classList.remove(cl);
                if (!this._data[v]) {
                    this._data[v] = [];
                }
                var l = [];
                for (let tht of element.classList) {
                    l.push(tht);
                }
                this._data[v].push({type:"class",object:element,current:l});
                
            }
        }
        
        

        for (let i of element.children) {
            this.loadData(i);
        }
            
        
    }
}

class SamVar extends HTMLElement {
    constructor () {
        super();
    }
    setValue(value) {
        this.innerText = value;
    }
}

function register(name,classs) {
    if (!(name.includes('-'))) {
        throw ReferenceError("Name <"+name+"> must include a - !");
    }
    customElements.define(name,classs);
}

register("sam-var",SamVar);
