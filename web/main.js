var left_displayed_count = 0;
    var right_displayed_count = 0;
    var left_pulled =0;
    var right_pulled=0;
    var zoomed = 0;
    var curr_player="mid-video";
    var curr_aspectratio=1;
    var originalwidth = 300;
    var originalheight = 150;
    var top_hot_new = 0;
    var top_hot_new_right = 0;
    var curr_scale = 2;
    var transfer_from = 0;
    var unsave_after_transfer_flag = 1;
    var size = [1008,715];  //public variable
    var submode=0;
    var posting_as = 0;
    var selected_sub="";
    var latest_pull=0; //0 = likes, 1 = subreddit
    var stored_logins = [];
    var cred_index=0;
    var automation_kill_switch=0;
    var last_index = 0;
    var last_side = 0;
    $(window).resize(function(){
    window.resizeTo(size[0],size[1]);
    });

    $(document).ready(function(){
    $(document).bind("keydown", function(e){ 
        if (e.target.nodeName.toLowerCase()=='input'){
            return;
        }
        e = e || window.event;
        var charCode = e.which || e.keyCode;
        if(charCode == 68) eel.py_demo_mode_toggle();
    });
    });

    function mousewheelHandler(e){
       // console.log(e.deltaY);
        var temp = document.getElementById(curr_player);
        
        if(e.deltaY / 120 < 0 && allow_video){
        
            if (temp.getBoundingClientRect().height>480 || temp.getBoundingClientRect().width>700){
            return;
            }
            if(!zoomed){

                curr_aspectratio = temp.offsetHeight/temp.offsetWidth;
                originalheight = temp.offsetHeight;
                originalwidth=temp.offsetWidth;
                temp.className='player-zoomed';
                
                zoomed = 1;
                

            }
           // console.log('Zoom in');
            //temp.style.height=temp.offsetHeight+20+'px';
           // console.log((curr_scale+.5)*temp.getBoundingClientRect().width,(curr_scale+.5)*temp.getBoundingClientRect().height);
            
            
           // console.log("here..");
            //temp.style.width=temp.offsetWidth+80+'px';
            //temp.style.height=(temp.offsetWidth*curr_aspectratio)+'px';
            curr_scale+=.5;
           // console.log(curr_scale);
            temp.style.transform=`translate(-50%, -50%) scale(${curr_scale},${curr_scale})`;
            //console.log(temp.style.transform);
           // console.log(temp.offsetWidth);
           // console.log(temp.getBoundingClientRect().width);

            
                
            //if(temp.offsetHeight>310){
            //    document.getElementById('gridcontainer').style.filter='blur(1px)';
            //    document.getElementById('videoplayerdiv').style.filter='blur(0px)';
            //}
        
        
            //temp.style.maxWidth='none';
            //temp.style.maxHeight='580px';
            
        } else{
            if(1 || temp.offsetHeight <= originalheight+80){ //in case I want to add zoom out back
                temp.className=curr_player;
                curr_scale=1;
                //temp.style.height=originalheight+'px';
                //temp.style.width=originalwidth+'px';
                zoomed=0;
                //temp.style.height='none';
                //temp.style.width='none';
                temp.style.transform='scale(1,1)';
                
            }
            else{
                temp.style.height=temp.offsetHeight-80+'px';
                temp.style.width=temp.offsetWidth-80+'px';
                
            }
            


            //console.log('zoom out');
            //document.getElementById('mid-video').style.height=document.getElementById('mid-video').offsetHeight-20+'px';

        }
    }

    window.oncontextmenu = function (e) {
        
        if (e.target.parentNode.className=="post-thumbnail"){
            e.preventDefault(); //should apply this always in release version (move outside this if statement )
            e.target.parentNode.parentNode.remove();
        }
    }
    var allow_video = 1;
    var active_player=0;
    function toggle_posting_as(){
        if (posting_as){
            posting_as=0;
            document.getElementById('posting-as-button').innerText='Posting as: LEFT';
        }
        else{
            posting_as=1;
            document.getElementById('posting-as-button').innerText='Posting as: RIGHT';
        }
    }
    function toggle_submode(){
        

        if (submode==0){
        
        document.getElementById("unsave-button").style.display='none';
        document.getElementById("transfer-button").style.display='none';
        document.getElementById("save-button").style.display='none';
        
        document.getElementById("post-button").style.display='inline-block';
        document.getElementById("posting-as-button").style.display='inline-block';
        document.getElementById("submode-button").style.display='inline-block';

        document.getElementById('pull_button_two').innerText="Pull Subreddit";
        document.getElementById('pull_button_two').onclick=function(){request_sub(1);};

            if (transfer_from==0){
                document.getElementById('right_pullsub_button').style.display='none';
                document.getElementById('right_selectsub_button').style.display='inline-block';

            }
            else{
                document.getElementById('pullsub_button').style.display='none';
                document.getElementById('selectsub_button').style.display='inline-block';
            }
        submode=1;

        }
        else{
        document.getElementById("unsave-button").style.display='inline-block';
        document.getElementById("transfer-button").style.display='inline-block';
        document.getElementById("save-button").style.display='inline-block';
        
        document.getElementById("post-button").style.display='none';
        document.getElementById("posting-as-button").style.display='none';
        document.getElementById("submode-button").style.display='none';
        
        document.getElementById('right_pullsub_button').style.display='inline-block';
        document.getElementById('right_selectsub_button').style.display='none';

        document.getElementById('pullsub_button').style.display='inline-block';
        document.getElementById('selectsub_button').style.display='none';

        submode=0;

        document.getElementById('pull_button_two').innerText="Pull Saves";
        document.getElementById('pull_button_two').onclick=function(){request_saves(1);};
        
        }
        

    }
    function toggle_video(){
        if(allow_video==1){
            allow_video=0;
            $('#mid-video').hide();
            $('#mid-iframe').hide();
            $('#mid-image').hide();
        }
        else if(allow_video==0){
            allow_video=1;
            switch (active_player){
                case 0: //iframe = 0 , vid = 1, image =2
                    $('#mid-iframe').show();
                    break;
                case 1:
                    $('#mid-video').show();
                    break;
                case 2:
                    $('#mid-image').show();
                    break;

            }
        }
    }
    function toggle_transfer_direction(){
        if(1 || submode==1){ //direction change disabled for now during submode //Actually, just gonna disable it in general for now
            return;
        }
        
        if (transfer_from==0){
            
            transfer_from=1;
            document.getElementById('transfer_img').style.transform='scaleX(-1)';

            if(submode==1){
                
                document.getElementById('pullsub_button').style.display='none';
                document.getElementById('selectsub_button').style.display='inline-block';

                
                document.getElementById('right_pullsub_button').style.display='inline-block';
                document.getElementById('right_selectsub_button').style.display='none';

            }
        }
        else{
            transfer_from=0;
            document.getElementById('transfer_img').style.transform='scaleX(1)';

            if(submode==1){
                
                document.getElementById('pullsub_button').style.display='inline-block';
                document.getElementById('selectsub_button').style.display='none';

                
                document.getElementById('right_pullsub_button').style.display='none';
                document.getElementById('right_selectsub_button').style.display='inline-block';

            }


        }
    }
    function toggle_unsave_after_transfer(){
        if (unsave_after_transfer_flag){
            unsave_after_transfer_flag=0;
        }
        else{
            unsave_after_transfer_flag=1;
        }
    }

    //Filters//
    var nsfw_allowed = 0;
    var sfw_allowed = 1;
    var selection_side=0;
    var current_id="";

    function left_bar_handler(){
        if (document.getElementById('specificCheck').checked){
            if(document.getElementById('nsfwCheck').checked){
            filter_unhide(0,'nsfw');
            }
            filter_unhide(0,'sfw');
            
            filter_only_show(0,document.getElementById('left_sub_bar').value);
            console.log("Filtered");
        }
        else{
            console.log("Not checked");
        }
    }


    function filter_checkbox_handler(side,el,filter){
       // console.log("Filtering with",filter);
        if (el.id=="specificCheck" || el.id =="right_specificCheck"){
            filter_only_show(side,filter);
            return;
        }
        if (el.checked){
            filter_unhide(side,filter);
        }
        else{
            filter_hide(side,filter);
        }
    }
    function filter_unhide(side,filter){
        if (side == 0){
            var els = document.querySelectorAll(`[data-test*='${filter}']`);
            for (var i=0; i<els.length; i++) {
                if(els[i].parentNode.classList.contains('left-feed')){
                els[i].className='post-container';
                }
            }
            var curr_count = document.getElementById('leftfeed').querySelectorAll('.post-container:not(.hidden)').length;
            document.getElementById('post-count-label').innerHTML=' - ' + curr_count + " Posts Found";
        }
        else{
            var els = document.querySelectorAll(`[data-test*='${filter}']`);
            for (var i=0; i<els.length; i++) {
                if(els[i].parentNode.classList.contains('right-feed')){
                els[i].className='post-container';
                }
            }
            var curr_count = document.getElementById('rightfeed').querySelectorAll('.post-container:not(.hidden)').length;
            document.getElementById('right-post-count-label').innerHTML=' - ' + document.getElementById('rightfeed').childElementCount + " Posts Found";
        }

    }

    function filter_hide(side,filter){
        if (side == 0){
            els = document.querySelectorAll(`[data-test*=' ${filter}']`);
            for (var i=0; i<els.length; i++) {
                if(els[i].parentNode.classList.contains('left-feed')){
                    els[i].className='hidden';
                }
            }
            var curr_count = document.getElementById('leftfeed').querySelectorAll('.post-container:not(.hidden)').length;
            document.getElementById('post-count-label').innerHTML=' - ' + curr_count + " Posts Found";
        }
        else{
            els = document.querySelectorAll(`[data-test*=' ${filter}']`);
            for (var i=0; i<els.length; i++) {
                if(els[i].parentNode.classList.contains('right-feed')){
                    els[i].className='hidden';
                }
            }
            var curr_count = document.getElementById('rightfeed').querySelectorAll('.post-container:not(.hidden)').length;
            document.getElementById('right-post-count-label').innerHTML=' - ' + curr_count + " Posts Found";
        }
    }

    function filter_only_show(side,filter){
        if (side == 0){
            els = document.querySelectorAll(`[data-test]`);
            for (var i=0; i<els.length; i++) {
                if(els[i].parentNode.classList.contains('left-feed') && !els[i].getAttribute('data-test').includes(filter)){
                    els[i].className='hidden';
                }
            }
        }
        else{
            els = document.querySelectorAll(`[data-test*=' ${filter}']`);
            for (var i=0; i<els.length; i++) {
                if(els[i].parentNode.classList.contains('right-feed')){
                    els[i].className='hidden';
                }
            }
        }
    }

    function reverseList(side){
        if (side == 0){
            var currlist = $('#leftfeed');
            var listItems = currlist.children('div');
            currlist.append(listItems.get().reverse());
        }
        else{
            var currlist = $('#rightfeed');
            var listItems = currlist.children('div');
            currlist.append(listItems.get().reverse());
        }
    }

    //End Filters

    function make_selection(side,index){
       // console.log("MAKIGN SLEECTION ON IDNEX: "+index);
       console.log("MAKE_SELECTION - SIDE: ",side);
       console.log("SELECTIO NSIDE BEFORE: ",selection_side);
        selection_side=side;
        eel.py_make_selection(selection_side,index);

    }
    eel.expose(js_play_video);
    function js_play_video(current_link){
        var current_player_element=document.getElementById(curr_player);
        zoomed=0;
        curr_scale=1;
        current_player_element.className=curr_player;
        current_player_element.style.transform='scale(1,1)';
        if (curr_player=="mid-image"){
            current_player_element.style.maxHeight='150px';
            current_player_element.style.maxWidth='300px';
            current_player_element.style.height='none';
            current_player_element.style.width='none';
        }
        else{
            current_player_element.style.height='none';
            current_player_element.style.width='none';
        }
        
                
       // console.log(current_link);
        if (current_link[1] == 0){ //1 == video , 0 == iframe
            active_player=0;
            if (allow_video){
            $('#mid-iframe').show();
            curr_player='mid-iframe';
            }
            $('#mid-video').hide();
            $('#mid-image').hide();

            $('#mid-iframe').attr('src',current_link[0]);
            $('#mid-video').attr('src','');
            $('#mid-image').attr('src','');
        }else if(current_link[1]==1){
            active_player=1;
            $('#mid-iframe').hide();
            if (allow_video){
            $('#mid-video').show();
            curr_player='mid-video';
            
            }
            $('#mid-image').hide();

            $('#mid-video').attr('src',current_link[0]);
            $('#mid-iframe').attr('src','');
            $('#mid-image').attr('src','');
        }else{
            active_player=2;
            $('#mid-iframe').hide();
            $('#mid-video').hide();
            if(allow_video){
            $('#mid-image').show();
            curr_player='mid-image';
            }
            $('#mid-image').attr('src',current_link[0]);
            $('#mid-video').attr('src','');
            $('#mid-iframe').attr('src','');
        }
        originalheight=document.getElementById(curr_player).offsetHeight;
        originalwidth=document.getElementById(curr_player).offsetWidth;

        
    }

    function save_current(){
        console.log("SAVE CURRENT with SELECTIO NSIDE ",selection_side);

        eel.py_save_current(selection_side,current_id);
    }
    function unsave_current(){
        console.log("UNSAVE CURRENT with SELECTIO NSIDE ",selection_side);
        eel.py_unsave_current(selection_side,current_id);
    }

    function download_current(){

        eel.py_download_current();
    }
    function transfer_current(){
        eel.py_transfer_current(last_side,current_id,unsave_after_transfer_flag);
        //console.log("transfer: "+ current_id + "Side: " + transfer_from);
        if (last_side==0){
            dupe = document.querySelector('#leftfeed > #post_'+last_index);
            console.log(last_index + ","+ last_side);
            dupe.onclick='';
            dupe.className='post-container transferred';
            document.getElementById('rightfeed').prepend(dupe);
            var els = document.querySelectorAll('#leftfeed > .post-container:not(.hidden)')
            els[0].click();

            

            setTimeout(function(){
                clear_transfer_cards();
            },2000)
        }
        else{

            dupe = document.querySelector('#rightfeed > #post_'+last_index);
            console.log(last_index + ","+ last_side);
            dupe.onclick='';
            dupe.className='post-container transferred';
            document.getElementById('leftfeed').prepend(dupe);
            var els = document.querySelectorAll('#rightfeed > .post-container:not(.hidden)')
            els[0].click();

            

            setTimeout(function(){
                clear_transfer_cards();
            },2000)
        }
        //var dupe = document.querySelectorAll('#left[i].cloneNode(true);
        //dupe.onclick='';
        //dupe.className='post-container transferred';
        //document.getElementById('rightfeed').prepend(dupe);

    }
    function lock_left_changes(){
        return;
    }
    function lock_mid_buttons(){
        return;
    }
    function lock_right_changes(){
        return;
    }
    function clear_transfer_cards(){
        console.log("Clearing transfers");
        document.querySelectorAll('.transferred').forEach(e=>e.remove());
        }
    
    async function automation(side){
        console.log("AUTOMATIO NFUNCTIOn");
        if(submode && selected_sub==''){
            document.getElementById('automation-button').innerText="Start";
            document.getElementById('automation-button').onclick=function(){automation_kill_switch=0;this.innerText='Stop';automation(0);};
                
            return;
        }
        automation_kill_switch=0;
        
        if (side == 0){ 

            //var els = document.getElementById('leftfeed').children;
            var els = document.querySelectorAll('#leftfeed > .post-container:not(.hidden)');

        }
        else{
            //var els = document.getElementById('rightfeed').children;
            var els = document.querySelectorAll('#rightfeed > .post-container:not(.hidden)');

        }
        console.log(els);
        document.getElementById('automation-button').onclick=function(){automation_kill_switch=1; this.innerText='Start';};
        document.getElementById('automation-button').innerText="Stop";
        for (var i = 0; i < 10;i++){
            
            if (automation_kill_switch){
                automation_kill_switch=0;
                document.getElementById('automation-button').innerText="Start";
                document.getElementById('automation-button').onclick=function(){automation_kill_switch=0;this.innerText='Stop';automation(0);};
                return;
            }
            if(els[i].classList.contains('hidden')){
                continue;
            }
            if(els[i].classList.contains('post-container')){
                console.log("cloning");
                var dupe = els[i].cloneNode(true);
                dupe.onclick='';
                dupe.className='post-container transferred';
                els[i].click();
                if (submode==0){ //Save Transfer
                await eel.py_transfer_current(transfer_from,current_id,unsave_after_transfer_flag)().then((msg)=>{console.log(msg);
                    
                    if(side == 0){
                        if (i>0){
                            document.getElementById('rightfeed').firstChild.remove();
                        }
                    document.getElementById('rightfeed').prepend(dupe);
                    }
                    else{
                        if(i>0){
                            document.getELementById('leftfeed').firstChild.remove();
                        }
                        document.getElementById('leftfeed').prepend(dupe);
                        }

                });
                }
                else{
                    if (selected_sub==''){
                        return;
                    }
                    await eel.py_post_current(posting_as,transfer_from,selected_sub,current_id)().then((msg)=>{console.log(msg);
                    
                    if(side == 0){
                    document.getElementById('rightfeed').prepend(dupe);
                    }
                    else{
                        document.getElementById('leftfeed').prepend(dupe);
                        }

                });

                }

                if (unsave_after_transfer_flag){
                    els[i].remove();
                }

            }
        }
        document.getElementById('automation-button').innerText="Start";
        document.getElementById('automation-button').onclick=function(){automation_kill_switch=0;this.innerText='Stop';automation(0);};

        if (side==0){
            document.getElementById('rightfeed').firstChild.remove();
            }
        else{
            document.getElementById('leftfeed').firstChild.remove();
        }
            
    
    
    clear_transfer_cards();

    }
    function post_current(){
        if (selected_sub==""){
           // console.log("select a sub");
        }
        else{
        eel.py_post_current(posting_as,transfer_from,selected_sub,current_id);
        }
    }

    eel.expose(js_display_selection);
    function js_display_selection(card,index,side){
        last_index=index;
        last_side=side;
        console.log("CLICK SIDE: ",side);
        let details = JSON.parse(card.dataset.full);
        console.log(details);
        //eel.py_make_selection(side,index);
        make_selection(side,index);
        document.getElementById('middle-thumbnail').src=details[0];
        //console.log(details[0]);
        document.getElementById('middle-title').innerText=details[1];
        document.getElementById('middle-subreddit').innerText=details[2];
        document.getElementById('middle-hotlink').href='https://www.reddit.com'+details[5];
        current_id = details[4];

    }

    eel.expose(js_loggedin);
    function js_loggedin(side,info){
        if (side==0){
            var test=document.getElementById('login_user');
            //test.innerText="Logged in: " + info[0];
            test.innerText="Logged in: " + "Placeholder1"
            //UNBLUR
            $('#left-login-page').hide();
           // console.log("Unblurring");
            var els = document.querySelectorAll(`[class*='left-grid-item'],[class*='mid-grid-item']`);
           // console.log(els);
            for (var i=0; i<els.length; i++) {
                els[i].style.filter='blur(0px)';
            }
            
            $('#pull_button').click();
            
            //request_saves(0);

        } else{
            var test=document.getElementById('login_user_two');
            //test.innerText="Logged in: " + info[0];
            test.innerText="Logged in: " + "Placeholder2";
            //request_saves(1);
            $('#right-login-page').hide();
            var els = document.querySelectorAll(`[class*='right-grid-item'],[class*='mid-grid-item']`);
            for (var i=0; i<els.length; i++) {
                els[i].style.filter='blur(0px)';
            }
            $('#pull_button_two').click();
        }
    }

    function sub_check_handler(side,check_select){
        
        if (side == 0){
            top_hot_new = check_select; 
            var top_check = document.getElementById('topCheck');
            var hot_check = document.getElementById('hotCheck');
            var new_check = document.getElementById('newCheck');

            if (check_select==0){
                new_check.checked=false;
                hot_check.checked=false;
            }
            else if (check_select==1){
                new_check.checked=false;
                top_check.checked=false;
            }
            else{
                top_check.checked=false;
                hot_check.checked=false;
            }
        }
        else{
            top_hot_new_right = check_select; 

            var top_check = document.getElementById('right_topCheck');
            var hot_check = document.getElementById('right_hotCheck');
            var new_check = document.getElementById('right_newCheck');

            if (check_select==0){
                new_check.checked=false;
                hot_check.checked=false;
            }
            else if (check_select==1){
                new_check.checked=false;
                top_check.checked=false;
            }
            else{
                top_check.checked=false;
                hot_check.checked=false;
            }
        }

    }

    function select_sub(side){
        if (side==0){
            selected_sub=document.getElementById('left_sub_bar').value;
            console.log("SELECTED SUB: "+selected_sub);
        }
        else{
            selected_sub=document.getElementById('right_sub_bar').value;
            console.log("SELECTED SUB: "+selected_sub);
        }
    }
    function request_sub(side){
        select_sub(side);
        if (selected_sub==''){
            console.log("SELECT A SUBREDDIT");
            return;
        }
        latest_pull=1;
        if(side == 0 ){
            left_displayed_count=0;
            clear_feed(0);
            //document.getElementById('feed-label').innerText=selected_sub;
            //document.getElementById('pull_subs_button').innerText="Loading...";
           // console.log("JAVASCRIPT sending request to PYTHON to pullsubs for user ONE");
            document.getElementById('feed-label').innerHTML=`Subreddit r/${document.getElementById('left_sub_bar').value}`;

            eel.py_pullsub(0,document.getElementById('left_sub_bar').value,top_hot_new);
        } else{
            right_displayed_count=0;
            clear_feed(1);
            //document.getElementById('feed-label-right').innerText=selected_sub;

            
            //document.getElementById('pull_subs_button_two').innerText="Loading...";
           // console.log("JAVASCRIPT sending request to PYTHON to pullsubs for user TWO");
            document.getElementById('right-feed-label').innerHTML=`Subreddit r/${document.getElementById('right_sub_bar').value}`;

            eel.py_pullsub(1,document.getElementById('right_sub_bar').value,top_hot_new_right);
        }

        if (transfer_from==0){
            selected_sub = document.getElementById('right_sub_bar').value; //if I dont want to pull a sub everytime I select, I'll have to change this. for now it's fine though
        }
        else{
            selected_sub = document.getElementById('left_sub_bar').value;
        }
    }

    function request_saves(side){ 
        latest_pull=0;
        if(side == 0 ){
            left_displayed_count=0;
            clear_feed(0);
            document.getElementById('pull_button').innerText="Loading...";
           // console.log("JAVASCRIPT sending request to PYTHON to pullsaves for user ONE");
            document.getElementById('feed-label').innerHTML="Placeholder's Saved List ";

            eel.py_pullsaves(0);
        } else{
            right_displayed_count=0;
            clear_feed(1);
            
            document.getElementById('pull_button_two').innerText="Loading...";
           // console.log("JAVASCRIPT sending request to PYTHON to pullsaves for user TWO");
            document.getElementById('right-feed-label').innerHTML="Placeholder's Saved List ";

            eel.py_pullsaves(1);
        }
    }

    function clear_feed(side){
        if (side == 0){
            document.getElementById('feed-label').innerText= "";
            document.getElementById('post-count-label').innerText= "";
            var feed = document.getElementById('leftfeed');
            while(feed.firstChild){
                feed.removeChild(feed.firstChild);
            }
        }
        else{
            document.getElementById('right-feed-label').innerText= "";
            document.getElementById('right-post-count-label').innerText= "";
            
            var feed = document.getElementById('rightfeed');
            while(feed.firstChild){
                feed.removeChild(feed.firstChild);
            }

        }
    }
    function delete_card(el){
        var element = el;
        element.remove();
    }

    function apply_prechecked_filters(side){
        if (side == 0){
            if (document.getElementById('nsfwCheck').checked){
                filter_unhide(0,'nsfw');
            }
            if (document.getElementById('sfwCheck').checked){
                filter_unhide(0,'safefw');
            }
            if (document.getElementById('textCheck').checked){
                filter_unhide(0,'textpost');
            }
        }
        if (side == 1){
            if (document.getElementById('right_nsfwCheck').checked){
                filter_unhide(1,'nsfw');
            }

            if (document.getElementById('right_sfwCheck').checked){
                filter_unhide(1,'safefw');
            }
            if (document.getElementById('right_textCheck').checked){
                filter_unhide(1,'textpost');
            }
        }
       // console.log("Finished applying filters");
    }

    eel.expose(js_saves_recieved);
    function js_saves_recieved(side){
        if (side == 0){
           // console.log("Recieved list");
            document.getElementById('pull_button').innerText="Pull Saves";
            left_pulled=1;
            apply_prechecked_filters(0);
           // console.log("Applied Filters");
            
        }
        else{
           // console.log("Recieved right side list");
            document.getElementById('pull_button_two').innerText="Pull Saves";
            right_pulled=1;
            apply_prechecked_filters(1);
        }
    }

    eel.expose(js_create_card);
    function js_create_card(side,data,index){
        console.log(data);

        if (!data[0].includes('.com')){
            data[0]='thumbs/text_post.jpg';
        }

        if (side ==0){
            left_displayed_count+=1;
            $('<div/>',{
                class: 'post-container hidden',
                id: 'post_' + index,
                onclick:`js_display_selection(this,${index},${side})`,
                'data-test': data[4],
                'data-full': `["${data[0]}", "${data[1]}","${data[2]}","${data[3]}","${data[5]}","${data[6]}"]`
                }).append($('<div/>',{
                    class: 'post-thumbnail',
                    style: 'float:left'
                        }).append($('<img/>',{
                            class:'post-image',
                            src:data[0]
                            //src:data[0]
                        }))
                ).append($('<div/>',{
                    class:'post-details',
                    }).append($('<p/>',{
                        text:data[1] //Title
                    })).append($('<p/>',{
                        text:data[2] //Subreddit
                    })).append($('<p/>',{
                        text:data[3]})) //aUTHOR
                ).appendTo('#leftfeed');
            
        }
        else{
            right_displayed_count+=1;
            $('<div/>',{
                class: 'post-container hidden',
                id: 'post_' + index,
                onclick:`js_display_selection(this,${index},${side})`,
                'data-test':data[4],
                'data-full': `["${data[0]}", "${data[1]}","${data[2]}","${data[3]}","${data[5]}","${data[6]}"]`
                }).append($('<div/>',{
                    class: 'post-thumbnail',
                    style: 'float:left'
                        }).append($('<img/>',{
                            class:'post-image',
                            src:data[0]
                        }))
                ).append($('<div/>',{
                    class:'post-details',
                    }).append($('<p/>',{
                        text:data[1] //Title
                    })).append($('<p/>',{
                        text:data[2] //Subreddit
                    })).append($('<p/>',{
                        text:data[3]})) //Permalink
                ).appendTo('#rightfeed');

            }
        
    }
    eel.expose(js_import_login_file);
    function js_import_login_file(data){
        stored_logins=data.split('\n\n');
        //fetch('login.txt').then(response=>response.text()).then(text=>stored_logins=text.split('\n\r\n'));
        
    }
    function refresh_login_file(){
        eel.import_logins();
    }
    function cycle_logins(side){

        if (side == 0){
            //console.log(stored_logins.split('\n\n'));
            var current_credentials = stored_logins[cred_index].split('\n');
            document.getElementById('username_label').value=current_credentials[0].replace('username=','');
            document.getElementById('password_label').value=current_credentials[1].replace('password=','');
            document.getElementById('client_id_label').value=current_credentials[2].replace('client_id=','');
            document.getElementById('client_secret_label').value=current_credentials[3].replace('client_secret=','');
            document.getElementById('user_agent_label').value=current_credentials[4].replace('\r','').replace('user_agent=','');;
            cred_index +=1;
            if (cred_index == stored_logins.length){
                cred_index=0;
            }
        } else{

            var current_credentials = stored_logins[cred_index].split('\n');
            document.getElementById('right_username_label').value=current_credentials[0].replace('username=','');
            document.getElementById('right_password_label').value=current_credentials[1].replace('password=','');
            document.getElementById('right_client_id_label').value=current_credentials[2].replace('client_id=','');
            document.getElementById('right_client_secret_label').value=current_credentials[3].replace('client_secret=','');
            document.getElementById('right_user_agent_label').value=current_credentials[4].replace('\r','').replace('user_agent=','');;
            cred_index +=1;
            if (cred_index == stored_logins.length){
                cred_index=0;
            }

        }
    }

    function login(side){
        if (side==0){
            eel.py_login(0,[document.getElementById('username_label').value,
            document.getElementById('password_label').value,
            document.getElementById('client_id_label').value,
            document.getElementById('client_secret_label').value,
            document.getElementById('user_agent_label').value]);
        }
        else{
            eel.py_login(1,[document.getElementById('right_username_label').value,
            document.getElementById('right_password_label').value,
            document.getElementById('right_client_id_label').value,
            document.getElementById('right_client_secret_label').value,
            document.getElementById('right_user_agent_label').value]);
        }
    }

    function import_login_file(){
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = _ => {
            fetch_logins(input.files[0].name);
        }
        input.click();
    }