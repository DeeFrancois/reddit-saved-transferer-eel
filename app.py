#Base functionality complete, ready for upload (as version 0.5)
# Todo for version 1:
# Fix filter overlap, Transition animations (login page --> feed),
# crash proofing, feature disable during operation (crash proofing contd.), disabled thumbnails mode, multithreaded save pulls, 
# clear "transferred" posts on new operation, finish transfer direction toggling, options for pull amount/transfer batch amount, 
# Log out button 
# TODO 11_9_22: Specific sub filter disabling
# Fix Zoom (or not? new resizing seems to be enough)
import eel
import sys
import praw
import os
import json
import youtube_dl
import time
import subprocess

eel.init('web')
# eel.start('main.html',block=False,size=(1310,864))
eel.start('main.html',block=False,size=(1252,864))

def close(event):
    sys.exit(0)
    
def clear_canvas(side): #Clear post feed, recreates container, resets scrollbar
   # print("Telling javascript to clear", side)
    return


def flip_arrow(event):
   # print("Flipping trasnfer_from flag")
    #sub mode toggle?
    return
    

    
def start_loop():
   # print("Starting automated script")
    return

def build_feed():
    return

@eel.expose
def video_link(index):
    return(left_list[index].html)

def extract_save_file():
        with open('deletedsaves.txt','w',encoding='utf-8') as f:
           # print(deleted_list)
            for item in deleted_list:
                f.write("%s\n" % (item))

def get_sublist(side):
    if side == 0:
        left_sub_list=[]
        for item in left_list:
            left_sub_list.append(item.subreddit.display_name)
    else:
        right_sub_list=[]
        for item in left_list:
            right_sub_list.append(item.subreddit.display_name)

@eel.expose
def py_demo_mode_toggle():
    global demo_mode_flag
    
    if demo_mode_flag == 0:
        demo_mode_flag=1
        print("Turned on demo mode")
    else:
        demo_mode_flag=0
        print("Turned off demo mode")
    
    print("Demo flag is currently: ",demo_mode_flag)

def list_filterer(the_list):
    global deleted_list
    filtered_list = []
    deleted_list = []
    comment_count = 0
    for i in the_list:
        # print(i)
        current_filter = i.subreddit.display_name
        
        if isinstance(i,praw.models.Comment):
            comment_count+=1
            continue
        #print(i.thumbnail)
        #if text_post_flag.get()==0:
        if i.is_self:
            current_filter+=" textpost"
        #if text_post_flag.get()==1:
        #    if not i.is_self:
        #        continue
        #if nsfw_flag.get()== 0:
        if i.over_18:
            current_filter+=" nsfw"
        else:
            current_filter+=" safefw"
        #if sfw_flag.get()==0:
        #    if not i.over_18:
        #        continue
        
        if i.thumbnail == 'default':
           # print("Discovered a save that was deleted. The link is: https://www.reddit.com{}".format(i.permalink))
            #deleted_list.append('https://www.reddit.com'+i.permalink)
            deleted_list.append('https://www.reddit.com'+i.permalink)
            continue

        #if i.thumbnail == 'image' or i.thumbnail=='self':
            #print("Posts from this sub don't have thumbnails.. idk what to do here bruh")
        #    continue
        
        

        #if sub_flag.get()==1 and i.subreddit.display_name != entry_pull_sub.get():
        #    continue

        #if 'gfycat' in i.url:
            #print("gfycat link..")
        #    continue
        i.filters=current_filter
        filtered_list.append(i)
    print(comment_count)
    extract_save_file()
    return filtered_list

def display_loop(side):
    if side == 1:#right side
        for i in range(0,500):
            try:
                data = [right_list[i].thumbnail,right_list[i].title[:33].replace('"',"'"),'/r/'+right_list[i].subreddit.display_name,'/u/'+right_list[i].author.name,right_list[i].filters,right_list[i].id,right_list[i].permalink]
                eel.js_create_card(1,data,i)
            except:
               # print("end of list")
               continue
            
    else:
        for i in range(1000):
            # print("HEREEE")
            try:
                data = [left_list[i].thumbnail,left_list[i].title[:33].replace('"',"'"),'/r/'+left_list[i].subreddit.display_name,'/u/'+left_list[i].author.name,left_list[i].filters,left_list[i].id,left_list[i].permalink]
                eel.js_create_card(0,data,i)
            except:
               # print("end of list")
               continue

@eel.expose
def py_pullsaves(side):
    print("In Pull Saves")
    global left_list
    global right_list
    if side == 1: #right side
        print("Initiated saved list retrieval for: ",username_b)
        user_object_b = r2.user.me()
        right_list=list(user_object_b.saved(limit=400))
        right_list=list_filterer(right_list)
       # print("Finished Pull")
        display_loop(1)
        eel.js_saves_recieved(1)
    else:
        print("Initiated saved list retrieval for: ",username)
        user_object = r.user.me()
        left_list=list(user_object.saved(limit=400))
        left_list=list_filterer(left_list)
        print("Finished Pull")
        display_loop(0)
        eel.js_saves_recieved(0)
   # print("Out Pull saves")

# def pull_manual_list():
#     thumbs=[]
#     with open('manual_list.txt',encoding='utf-8') as file:
#         for line in file:
#             # print(line)  # The comma to suppress the extra new line char
#             if ',F,' in line:
#                 for j in line.split(','):
#                     if '.jpg' in j or 'imgur' in j:
#                         print(j)
#                         thumbs.append(j)
#     return thumbs



@eel.expose
def py_pullsub(side,sub,top_hot_new):
    global left_list
    global right_list
    if side == 1: #right side
        print("Initiated subreddit retrieval for: r/",sub)

        if (top_hot_new==0):
            right_list=list(r2.subreddit(sub).top(limit=100))
        elif (top_hot_new==1):
            right_list=list(r2.subreddit(sub).hot(limit=100))
        elif (top_hot_new==2):
            right_list=list(r2.subreddit(sub).new(limit=100))

        right_list=list_filterer(right_list)
       # print("Finished Pull")
        display_loop(1)
        eel.js_saves_recieved(1)
    else:
        print("Initiated subreddit retrieval for: r/",sub)
        if (top_hot_new==0):
            left_list=list(r.subreddit(sub).top(limit=100))
        elif (top_hot_new==1):
            left_list=list(r.subreddit(sub).hot(limit=100))
        elif (top_hot_new==2):
            left_list=list(r.subreddit(sub).new(limit=100))

        left_list=list_filterer(left_list)
       # print("Finished Pull")
        display_loop(0)
        eel.js_saves_recieved(0)


def pull_link(data):
    global last_link
    player_select = 2
    output_link=data.url
    last_link=[output_link,data.author.name,data.id]
    if '.png' in data.url or '.jpg' in data.url or '.jpeg' in data.url:
        player_select=2
    elif 'gfycat.com' in data.url:
        output_link = 'https://gfycat.com/ifr/search/' + data.url.split('.com/')[1] + '?hd=1'
        player_select=0 #iframe
    elif 'redgifs.com' in data.url:
        output_link = data.url.replace('watch','ifr')
        player_select=0
    elif 'i.imgur.com' in data.url:
        output_link = data.url.replace('.gifv','.mp4')
        player_select=1 #mp4
    elif 'v.redd.it' in data.url:
        output_link = data.media['reddit_video']['fallback_url']
        player_select=1
    
    return [output_link,player_select]

@eel.expose
def py_make_selection(side,index):
    print("MAKE SELECTION: ",side)
    if side == 0:
       # print(left_list[index].id)
        #data = [left_list[index].thumbnail,left_list[index].title[:35],left_list[index].subreddit.display_name,left_list[index].permalink,left_list[index].id]
        #eel.js_display_selection(data)
        temp = pull_link(left_list[index])
        eel.js_play_video(temp)
        
    else:
       # print(right_list[index].id)
        #data = [right_list[index].thumbnail,right_list[index].title[:35],right_list[index].subreddit.display_name,right_list[index].permalink,right_list[index].id]
        #eel.js_display_selection(data)
        temp = pull_link(right_list[index])
        eel.js_play_video(temp)

@eel.expose
def py_unsave_current(side,curr_id): #side for profile
    if side == 0:
        print("Unsaving post from LEFT side")
        if demo_mode_flag == 0:
            #print("Hm")
            r.submission(curr_id).unsave()
        else:
            print("Simulating Unsave")
    else:
        print("Unsaving post from RIGHT side")
        if demo_mode_flag == 0:
            #print("Hm")
            r2.submission(curr_id).unsave()
        else:
            print("Simulating Unsave")
    
@eel.expose
def py_save_current(side,curr_id): #side for profile
    if side == 0:
        print("Saving post on LEFT side")
        if demo_mode_flag == 0:
            #print("Hm")
            r.submission(curr_id).save()
        else:
            print("Simulating Save")

    else:
        print("Saving post on RIGHT side")
        if demo_mode_flag == 0:
            #print("Hm")
            r2.submission(curr_id).save()
        else:
            print("Simulating Unsave")

@eel.expose
def py_download_current():
    print("Downloading: ",last_link)
    subprocess.run(["yt-dlp"," {}".format(last_link[0]),"--no-mtime","-o","downloads/{}_{}.%(ext)s".format(last_link[1],last_link[2])])
    return
@eel.expose
def py_transfer_current(from_side,curr_id,unsave_flag):
        if from_side == 0: #Left
            transfer_from = r
            transfer_to = r2

            placeholder_from = "User A"
            placeholder_to = "User B"
            
        else:
            transfer_from = r2
            transfer_to = r

            placeholder_from = "User B"
            placeholder_to = "User A"

        to_save=transfer_to.submission(curr_id)
        to_unsave = transfer_from.submission(curr_id)
        
        if (demo_mode_flag):
            user_from = placeholder_from
            user_to = placeholder_to
        else:
            user_from= transfer_from.user.me().name
            user_to = transfer_to.user.me().name

        print(f"Transferred Post: {to_save.title} To {user_to}'s Saved List")
        print(f"Removed Post: {to_save.title} from {user_from}'s Saved List")
        #to_save.save()
        if demo_mode_flag==0:
            #print("Hm")
            to_save.save()
        else:
            print("Simulating Save")

        if unsave_flag:

            if demo_mode_flag==0:
                to_unsave.unsave()
                #print("Hm")
                #print("unsaved")
            else:
                print("Simulating Unsave")
            #to_unsave.unsave()
        #time.sleep(2)
        return
        #self.build_card(side)
@eel.expose
def py_automation():
    time.sleep(1)
    return "TESTETSTESTESTES"

@eel.expose
def py_post_current(posting_as,unsave_from,target_sub,curr_id):
    if posting_as == 0: #Left
        poster = r
    else:
        poster = r2
    
    if unsave_from == 0:
        unsaver = r
    else:
        unsaver = r2
    
    to_post = poster.submission(curr_id)
    to_unsave = unsaver.submission(curr_id)
    print("Crossposting: [", to_post.title, "] To: ", target_sub, " As : ", poster.user.me().name)
    print("Unsaving from user: ", unsaver.user.me().name)

    if demo_mode_flag == 0:
        #to_post.crosspost(subreddit=target_sub)
        print("Hm")
    else:
        print("Simulated Crosspost")
    #to_post.crosspost(subreddit=target_sub)

    return

@eel.expose        
def import_logins():
    global demo_mode_flag
    demo_mode_flag=1
    if(os.path.exists('login.txt')):  #If login already exists
            with open('login.txt') as file:
                eel.js_import_login_file(file.read())
@eel.expose
def py_login(left_right,data):
    global username
    global username_b
    global client_id
    global client_id_b
    global r
    global r2
    global last_link
    last_link=''
    if left_right == 0:

        username=data[0]
        password=data[1]
        client_id=data[2]
        client_secret=data[3]
        user_agent=data[4]


        r = praw.Reddit(client_id=client_id,
                        client_secret=client_secret,
                        password=password,
                        user_agent=user_agent,
                        username=username)

       # print("Sending request from PYTHON to JAVASCRIPT to display logged in state LEFT SIDE")
        eel.js_loggedin(0,[username,client_id])
    else:
        username_b=data[0]
        password_b=data[1]
        client_id_b=data[2]
        client_secret_b=data[3]
        user_agent_b=data[4]

        r2 = praw.Reddit(client_id=client_id_b,
                        client_secret=client_secret_b,
                        password=password_b,
                        user_agent=user_agent_b,
                        username=username_b)

       # print("Sending request from PYTHON to JAVASCRIPT to display logged in state RIGHT SIDE")
        eel.js_loggedin(1,[username_b,client_id_b])

import_logins()
while True:
    eel.sleep(1)