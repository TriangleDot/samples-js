


class NameView extends Sample {
    constructor (name) {
        super("Name: {{name}}<br /><b>Yes, {{name}} </b><slot></slot>");
        //super("");
        
        
        

    }
    init () {
        console.log("Setup");
        this.setVar("name","Finn");
        this.setVar("chicken","Bird");
        this.setVar("classes",["tust"]);
        this.setVar("styles",{color:"red"});
        
        
        
        
    }
}
register('name-view',NameView);

class Button extends Sample {
    constructor (name) {
        super("<slot place='before'></slot><button onclick='{{click}}'><slot></slot><slot place='afte'></slot></button><slot place='after'></slot>");
        //super("");
        
        
        

    }
    init () {
        console.log("Setup");
        this.setVar("click",this.getAttribute("click"));
        
        
        
        
        
    }
}
register('tri-button',Button);

function test() {
    console.log("Tested!");
}