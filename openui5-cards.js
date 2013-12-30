//Component definitions in this .js
//- open.m.Card
//- open.m.CardContainer
//- open.m.CardAction
sap.ui.core.Control.extend("open.m.Card", {
    metadata : {
        properties : {
            "title" : "string",
            "subtitle" : "string",
            "address": "string",
            "image": "string",
        },
        aggregations: {
            actions: {type : "open.m.CardAction", multiple : true},
        },
    },

    init: function() {

    },

    
    renderer : function(oRm, oControl) {
        oRm.write("<div"); 
        oRm.writeControlData(oControl);
        oRm.addClass("card"); 
        oRm.writeClasses();
        oRm.write(">");
        
        oRm.write("<h1 class=\"cardTitle1\">");
        //writing unescaped in order to get emphasis included
        //TODO: Is there a more intuitive way to define emphasis?
        oRm.write(oControl.getTitle());
        oRm.write("</h1>");

        oRm.write("<h2 class=\"cardTitle2\">");
        oRm.writeEscaped(oControl.getSubtitle());
        oRm.write("</h2>");

        if(oControl.getAddress() != null){
            oRm.write("<div class=\"cardMap\" " +
                "style=\"background: url('http://maps.googleapis.com/maps/api/staticmap?center=" 
                + encodeURIComponent(oControl.getAddress()) + "&zoom=13&size=448x192&sensor=false')  \">" + 
                "</div>");
        } else if (oControl.getImage() != null){
            oRm.write("<div class=\"cardImage\" " +
                "style=\"background: url('" 
                + oControl.getImage()+ "');background-repeat:no-repeat;background-position:center top;\">" + 
                "</div>");
        }

        var vBoxActions = new sap.m.VBox({
            items:oControl.getActions()
        })
        
        oRm.renderControl(vBoxActions);

        oRm.write("</div>");
    }
});

sap.ui.core.Control.extend("open.m.CardAction", {
    metadata : {
        properties : {
            "icon" : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : null},
            "actionText" : "string",
            "displayIcon": {type : "boolean", defaultValue : false},
        },events: {
            "press": {}
        },
        aggregations: {
            "_actionIcon" : {type : "sap.ui.core.Icon", multiple : false, visibility: "hidden"},
            "_actionLink" : {type : "sap.m.Link", multiple : false, visibility: "hidden"}
        },
    },

    init: function() {

    },

    _initSubComponents: function(){
        var that=this;
        this.setAggregation("_actionIcon", new sap.ui.core.Icon({
          src:this.getIcon(),
          color:"#4580f4",
          size: "1.6em",
          press: function(oEvent){
            that.firePress({});
          }
        }).addStyleClass("cardActionIcon"));

        this.setAggregation("_actionLink", new sap.m.Link({
          text: this.getActionText(),
          press: function(oEvent){
            that.firePress({});
          }
        }).addStyleClass("cardActionLink"));

    },
    
    renderer : function(oRm, oControl) {
        oControl._initSubComponents()

        var hBoxAction = new sap.m.HBox({
            fitContainer:true,
            items:[oControl.getAggregation("_actionIcon"),
                   oControl.getAggregation("_actionLink")]
        })   

        oRm.renderControl(hBoxAction);
    },
});


sap.ui.core.Control.extend("open.m.CardContainer", {
    metadata : {
        properties : {
            "value" : "string"
        },
        aggregations: {
            content: {type : "open.m.Card", multiple : true},
        },
    },

    init: function() {
        jQuery.sap.require("sap.ui.core.IconPool");
    },
    
    renderer : function(oRm, oControl) {
        oRm.write("<main class=\"cardContainer\"");
        oRm.writeControlData(oControl);
        oRm.write(">");

        oRm.write("<header class=\"cardHeader\"></header>");

        oRm.write("<input class=\"cardSearch\" placeholder=\"Search\" x-webkit-speech autocomplete=\"off\" />")

        var aCards = oControl.getContent();
        for (var i = 0; i < aCards.length; i++){
            oRm.renderControl(aCards[i]);
        }
        
        oRm.write("</main>");
    }
});