//Component definitions in this .js
//- open.m.Card
//- open.m.CardContainer
//- open.m.CardAction
sap.ui.core.Control.extend("open.m.Card", {
    metadata : {
        properties : {
            "title" : "string",
            "subtitle" : "string",
            "bodyAddress": "string",
            "bodyImage": "string",
            "titleLink": "string",
            "showDividerAfterContent" : {type : "boolean", defaultValue : true},
            "showDividerBetweenActions" : {type : "boolean", defaultValue : true},
            "_renderedOnce": {type : "boolean", defaultValue : false},
        },
        aggregations: {
            actions: {type : "open.m.CardAction", multiple : true},
            menu: {type: "sap.m.ActionSheet", multiple:false},
            "_menuIcon" : {type : "sap.ui.core.Icon", multiple : false, visibility: "hidden"},
            "_actionsVBox" : {type : "sap.m.VBox", multiple : false, visibility: "hidden"},
            bodyGeneric: {type: "sap.ui.core.Control",multiple:false}
        },
    },

    init: function() {

    },

    _initSubComponents: function(oControl){
        //need to create the subcomponents only once normally
        //TODO: This method does not handle dynamical changes after initial rendering well
        var that=oControl;

        //Menu 
        if(oControl.getMenu()!=null && oControl.getAggregation("_menuIcon")==null){
            oControl.setAggregation("_menuIcon", new sap.ui.core.Icon({
                  src:"sap-icon://menu",
                  color:"#bababa",
                  size: "1.6em",
                  press: function(oEvent){
                    var menu = that.getMenu();
                    //weird... menu is deleted after usage. Let's clone it
                    var clonedMenu = menu.clone();
                    menu.openBy(oEvent.getSource());

                    that.setMenu(clonedMenu);
                  }
                }).addStyleClass("cardMenuIcon"));
        }

        if(oControl.getActions()!= null && oControl.getActions().length!=0){
            //Note that this moves the actions objects from the main Cards control to
            //the sub-control: This means that on subsequent request this code is not executed 
            //Not sure on the best way how to keep them in sync (and don't want the users to provide a VBox as input)
            

            if(oControl.getShowDividerBetweenActions()){
                //show divider after all but the last action
                var actions = oControl.getActions();
                for (var i = 0; i < actions.length-1; i++){
                    actions[i].setShowDividerAfterAction(true);
                }
            }
            

            oControl.setAggregation("_actionsVBox",vBoxActions = new sap.m.VBox({
                items:oControl.getActions()
            }).addStyleClass("cardActionBox"));
            
        }

    },
    

    renderer : function(oRm, oControl) {
        oControl._initSubComponents(oControl);

        oRm.write("<div"); 
        oRm.writeControlData(oControl);
        oRm.addClass("card"); 

        if(oControl.getProperty("_renderedOnce")==false){
            oRm.addClass("cardAnimation")  ;
            oControl.setProperty("_renderedOnce", true);
        }

        oRm.writeClasses();
        oRm.write(">");

        if(oControl.getAggregation("_menuIcon")!=null){
            oRm.renderControl(oControl.getAggregation("_menuIcon"));
        }
        
        oRm.write("<h1 class=\"cardTitle1\">");
        if(oControl.getTitleLink()){
          oRm.write("<a href=\""+oControl.getTitleLink() + "\">");
        }
        //writing unescaped in order to get emphasis included
        //TODO: Is there a more intuitive way to define emphasis?
        oRm.write(oControl.getTitle());
        if(oControl.getTitleLink()){
          oRm.write("</a>");
        }
        oRm.write("</h1>");

        if(oControl.getSubtitle()!=null){
            oRm.write("<h2 class=\"cardTitle2\">");
            oRm.writeEscaped(oControl.getSubtitle());
            oRm.write("</h2>");
        }

        var cardBodyClasses="";
        if(oControl.getShowDividerAfterContent()){
            cardBodyClasses="cardBodyDivider ";
        }
        if(oControl.getBodyAddress() != null){
            cardBodyClasses += "cardMap";
            oRm.write("<div class=\""+cardBodyClasses+"\" " +
                "style=\"background: url('http://maps.googleapis.com/maps/api/staticmap?center=" 
                + encodeURIComponent(oControl.getBodyAddress()) + "&zoom=13&size=448x192&sensor=false');"
                + "background-repeat:no-repeat;background-position:0 top;background-size:cover\">" + 
                "</div>");
        } else if (oControl.getBodyImage() != null && oControl.getBodyImage()!=""){
            cardBodyClasses += "cardImage";
            oRm.write("<div class=\""+cardBodyClasses+"\" " +
                "style=\"background: url('" 
                + oControl.getBodyImage()+ "');"
                + "background-repeat:no-repeat;background-position:0 15%;background-size:cover\">" + 
                "</div>");
        }else if (oControl.getAggregation("bodyGeneric")!=null){
            cardBodyClasses += "cardBodyGeneric";
            oRm.write("<div class=\""+cardBodyClasses+"\">");
            oRm.renderControl(oControl.getAggregation("bodyGeneric"));
            oRm.write("</div>");
        }
        
        if(oControl.getAggregation("_actionsVBox")!=null){
            oRm.renderControl(oControl.getAggregation("_actionsVBox"));
        }

        oRm.write("</div>");
    }
});

sap.ui.core.Control.extend("open.m.CardAction", {
    metadata : {
        properties : {
            "icon" : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : null},
            "actionText" : "string",
            "displayIcon": {type : "boolean", defaultValue : false},
            "showDividerAfterAction" : {type : "boolean", defaultValue : false},
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

    _initSubComponents: function(oControl){
        var that=this;
        oControl.setAggregation("_actionIcon", new sap.ui.core.Icon({
          src:oControl.getIcon(),
          color:"#4580f4",
          size: "1.6em",
          press: function(oEvent){
            that.firePress({});
          }
        }).addStyleClass("cardActionIcon"));

        oControl.setAggregation("_actionLink", new sap.m.Link({
          text: oControl.getActionText(),
          press: function(oEvent){
            that.firePress({});
          }
        }).addStyleClass("cardActionLink"));

    },
    
    renderer : function(oRm, oControl) {
        oControl._initSubComponents(oControl);

        var hBoxAction = new sap.m.HBox({
            fitContainer:true,
            height:"6rem",
            items:[oControl.getAggregation("_actionIcon"),
                   oControl.getAggregation("_actionLink")]
        })
        if(oControl.getShowDividerAfterAction()){
            hBoxAction.addStyleClass("cardActionDivider"); 
        }

        oRm.renderControl(hBoxAction);
    },
});


sap.ui.core.Control.extend("open.m.CardContainer", {
    metadata : {
        properties : {
            "showSearchField" : {type : "boolean", defaultValue : true},
            "searchFieldPlaceHolderText":{type:"string",defaultValue:"Search"},
            "minHeight" : "string",
            "headerImageUrl": {type:"string",defaultValue:"openui5-cards-header-day.png"},
        },events: {
            "searchLiveChange": {}
        },
        aggregations: {
            cards: {type : "open.m.Card", multiple : true},
            headerCard: {type : "open.m.Card", multiple : false},
            "_searchField" : {type : "sap.m.Input", multiple : false, visibility: "hidden"}
        }
    },

    init: function() {
        jQuery.sap.require("sap.ui.core.IconPool");
    },

    triggerCardExitAnimation: function(){
        $(".card").removeAttr("style"); 
        $(".card").attr("style", "-webkit-animation:card-out-animation 800ms; animation:card-out-animation 800ms"); 
    },

    _initSubComponents: function(oControl){
        var that=oControl;

        if(oControl.getAggregation("_searchField")==null){
            oControl.setAggregation("_searchField",new sap.m.Input({
                        type: sap.m.InputType.Text,
                        placeholder: oControl.getSearchFieldPlaceHolderText(),
                        liveChange: function(oEvent){
                            that.fireSearchLiveChange(oEvent);
                         }
                    }).addStyleClass("cardSearch").setWidth("20em")
            );
        }

    },

    
    renderer : function(oRm, oControl) {
        oControl._initSubComponents(oControl);
        oRm.write("<main class=\"cardContainer\"");
        oRm.writeControlData(oControl);
        if(oControl.getMinHeight()!=null){
            oRm.write(" style=\"min-height:" + oControl.getMinHeight()+"\" ");
        }
        oRm.write(">");

        oRm.write("<header class=\"cardHeader\" style=\"background:url("+oControl.getHeaderImageUrl()+") center center;background-size:cover;\"></header>");

        if(oControl.getShowSearchField()){
            oRm.renderControl(oControl.getAggregation("_searchField"));
            //oRm.write("<input class=\"cardSearch\" placeholder=\"Search\" x-webkit-speech autocomplete=\"off\" />");
        }else {
           oRm.write("<div class=\"cardSearchDisabled\"/>"); 
        }

        if(oControl.getHeaderCard()!=null){
            oRm.renderControl(oControl.getHeaderCard());
        }
        var aCards = oControl.getCards();
        for (var i = 0; i < aCards.length; i++){
            oRm.renderControl(aCards[i]);
        }
        
        oRm.write("</main>");

    }
});