Module.register("menu_houzeau", {
    // Override the start function to initialize the module
    start: function() {
        this.sendSocketNotification('START_MENU_HOUZEAU', {});
    },

    socketNotificationReceived: function(notification, payload) {

        // notification pour afficher le menu houzeau recupéré par le script Python dans le node_helper
        if (notification === 'PYTHON_DATA_MENU_HOUZEAU') {
            console.log("notification de menu_houzeau python");
            let wrapper = document.getElementById('menu_houzeau');
            if (wrapper) {
                console.log("notification de menu_houzeau", payload);
                data = JSON.parse(payload);
                let html = "";
                
                const imagePath = "./modules/menu_houzeau/menu.png";
                
                if (data.val === 1){
                    html = `<img src="${imagePath}" alt="Your Image" style="width: 60%; height: 60%;" />`;
                }else{
                    html = "Le menu de cette semaine n'est pas encore disponible.";
                }
                wrapper.innerHTML = html;
            }
        }
    },
    
    getDom: function() {
        let wrapper = document.createElement("div");
        wrapper.style.marginLeft = "4cm";
        wrapper.style.marginRight = "-4cm";
        wrapper.id = "menu_houzeau";
        wrapper.innerHTML = 'pas encore executé';
        return wrapper; 
    }
});