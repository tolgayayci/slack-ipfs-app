const { Web3Storage, getFilesFromPath } = require('web3.storage');
const { App } = require('@slack/bolt');
const { WebClient } = require('@slack/web-api');
const axios = require('axios').default;
var fs = require('fs');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

function getAccessToken () {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhhMTc4QjJjQjE5OTQ3ZDgyNTZGRGUyYWY2ODhBM2ZiRTk4QjZCRkEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjE1MjEwNjI4MzIsIm5hbWUiOiJzbGFjay1ib3QtdG9rZW4ifQ.yutqRUxMmzO8L6QT6TnDr-n_2XGI998Y1Pmpgnj0juk'
}

function makeStorageClient () {
    return new Web3Storage({ token: getAccessToken() })
}

async function retrieve (cid) {
    const client = makeStorageClient()
    const res = await client.get(cid)
    console.log(`Got a response! [${res.status}] ${res.statusText}`)
    if (!res.ok) {
      throw new Error(`failed to get ${cid}`)
    }
    
    // unpack File objects from the response
    const files = await res.files()
    for (const file of files) {
        console.log(`${file.cid} -- ${file.path} -- ${file.size}`)
        return ("https://" +file.cid + ".ipfs.w3s.link")
    }

}

async function storeFiles (path) {
    const client = makeStorageClient()
    
    const files = await getFilesFromPath(path);
    const rootCid = await client.put(files);

    return rootCid;
}

// The echo command simply echoes on command
app.command('/display', async ({ command, ack, say }) => {
    // Acknowledge command request
    await ack();

    const cid = command.text;

    // TODO: check if cid is entried
    // TODO: make error handling
    // TODO: send file as message, look files upload
  
    await say("Result for the CID: " + cid);

    files = await retrieve(cid);

    await say(files);
    
});

// The echo command simply echoes on command
app.command('/help', async ({ command, ack, say }) => {
    // Acknowledge command request
    await ack();
  
    await say(
        {
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Hey there. 👋 I'm here to help you upload your files to IPFS or display that in Slack.\nThere are two ways to use:"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*1️⃣ Use the `/display` command*. Type `/display` followed by a ipfs hash of your file and I'll get you a link of your file. Try it out by using the `/display` command in this channel."
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "2️⃣ Upload a file in a chat and I'll ask you do you want to upload it to IPFS. If you prefer to upload, when upload was successful, I'll send you IPFS Hash and link."
                    }
                },
                {
                    "type": "divider"
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": "❓Get help at any time with `/help`"
                        }
                    ]
                }
            ]
        }
    );
});  

// Listen for users opening your App Home
app.event('app_home_opened', async ({ event, client, logger }) => {
    try {
      // Call views.publish with the built-in client
      const result = await client.views.publish({
        // Use the user ID associated with the event
        user_id: event.user,
        view: {
          // Home tabs must be enabled in your app configuration page under "App Home"
          "type": "home",
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "*Welcome home, <@" + event.user + ">"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Learn how home tabs can be more useful and interactive <https://api.slack.com/surfaces/tabs/using|*in the documentation*>."
              }
            }
          ]
        }
      });
  
      logger.info(result);
    }
    catch (error) {
      logger.error(error);
    }
});

// File Share
app.event('file_shared', async ({ event, client, logger, say }) => {
    try {
       
       const file_info = await client.files.info({ file: event.file_id }).then(res => {
        
        console.log(res)

        say(
            {
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Do you want to store that file on IPFS?"
                        }
                    },
                    {
                        "type": "section",
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": "*Name:*\n ```" + res["file"]["name"] + "```"
                            },
                            {
                                "type": "mrkdwn",
                                "text": "*Type:*\n ```" + res["file"]["mimetype"] + "```"
                            },
                            {
                                "type": "mrkdwn",
                                "text": "*Size:*\n ```" + (res["file"]["size"]/1000) + " KB```"
                            },
                            {
                                "type": "mrkdwn",
                                "text": "*Uploaded User:*\n ```<@" + res["file"]["user"] + ">```"
                            }
                        ],
                        "accessory": {
                            "type": "image",
                            "image_url": res["file"]["thumb_360"],
                            "alt_text": res["file"]["title"]
                        }
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "emoji": true,
                                    "text": "Upload"
                                },
                                "style": "primary",
                                "value": res["file"]["url_private_download"],
                                "action_id": "upload_button"
                            },
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "emoji": true,
                                    "text": "Deny"
                                },
                                "style": "danger",
                                "value": "click_me_123"
                            }
                        ]
                    }
                ]
            }
        );
           
       }); 
        
      //logger.info(file_info["file"]);
    }
    catch (error) {
      logger.error(error);
    }
});



// Listen for a button invocation with action_id `button_abc` (assume it's inside of a modal)
app.action('upload_button', async ({ ack, body, client, logger, say }) => {
    // Acknowledge the button request
    await ack();
  
    try {
      
        axios({
            method: 'get',
            url: body["actions"][0]["value"],
            responseType: 'stream'
        })
        .then(function (response) {
            //storeFiles(response.data)
            const data = response.data.pipe(fs.createWriteStream('ada_lovelace.png'))
            cid = storeFiles(data.path)

            // TODO: Show progress bar or something 
            
            return cid

        })
        .then(function (cid) {
            say(
                {
                    "blocks": [
                        {
                            "type": "divider"
                        },
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": ":tada: File uploaded successfully!\n\n" + "https://" + cid + ".ipfs.w3s.link",
                            }
                        },
                    ]
                }
            );
        })
      
    }
    catch (error) {
      logger.error(error);
    }
});
  
(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

