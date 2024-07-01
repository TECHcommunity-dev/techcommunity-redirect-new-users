import { withPluginApi } from "discourse/lib/plugin-api";
import DiscourseURL from "discourse/lib/url";

export default {
  name: "techcommunity-redirect-new-users",
  initialize() {
    withPluginApi("0.8", (api) => {      
        api.onPageChange((url) => {
          const firstNotificationTippy = document.querySelector(".d-header .d-header-icons + div[data-tippy-root]");
          const firstNotificationTippyArrow = document.querySelector(".d-header .d-header-icons + div[data-tippy-root] .tippy-svg-arrow");
          if(firstNotificationTippy) {
            if(/^\/g$/.test(url) || /^\/groups$/.test(url)){
            firstNotificationTippy.style.transform = "translate(-6px, 47px)";
            } else {
            firstNotificationTippy.style.transform = "translate(-119px, 47px)";
            }   
            firstNotificationTippyArrow.style.transform = "translate(326px, 0px)";
          } 
		  
	        const path = window.location.pathname;
          const currentUser = api.getCurrentUser();
            
          if (!currentUser ) {
            return "";
          }
          if(/^\/g$/.test(path) || /^\/groups$/.test(path)) {
            return "";
          }

          let shouldRedirectToGroupPage = false;

      	  if (!currentUser.read_first_notification && !currentUser.enforcedSecondFactor) {
      	  	shouldRedirectToGroupPage = true;
      	  } 
      	  else {
      	    return;
      	  }
           
          if(localStorage.getItem("redirectToGroupPage" + currentUser.id)) {
            return;
          }
            
          //Fetching Group names from current_user object [Added By: Saurabh, Date: 12/05/2021]
          var currentuserGroups = [];
          (currentUser.groups).forEach(function (groupObj, index) {
              currentuserGroups.push(String(groupObj.name).toLowerCase());
          });
          //If currentUser not belongs to alfabet-users group and are first-time visitor then redirect currentUser to Groups page [Modified By: Saurabh, Date: 12/05/2021]
          if(currentuserGroups.indexOf(("alfabet-users").toLowerCase()) == -1){
            //If the currentUser login First-time visitor then he will be redirect to Groups page.
            if(shouldRedirectToGroupPage) {
              localStorage.setItem("redirectToGroupPage" + currentUser.id, "true");
              DiscourseURL.routeTo("/g");
              return "";
            }
          }
        });
    });
  },
};
