# Slack IPFS App

This application allows you to simply upload or view files to IPFS via web3.storage on slack.

**P.S:** The application is under development, at the moment it has just simply uploading and viewing files functionalities.

## Upload a File

When any file is uploaded to Slack, the application automatically detects it in the channels it is attached to. After showing the user some data about the file, it asks if they want to upload the file to IPFS. If the user approves, the upload to IPFS is started.

<img width="1081" alt="Screen Shot 2022-08-28 at 21 55 56" src="https://user-images.githubusercontent.com/40897846/187090955-8c387fb4-bf0d-42b1-bc1c-a58b7420e400.png">

If the upload is successful, a link response containing the IPFS Hash is returned.

<img width="1081" alt="Screen Shot 2022-08-28 at 21 56 35" src="https://user-images.githubusercontent.com/40897846/187091076-10b8617a-35b0-43ea-b2bd-ae1911862252.png">

## Display a File

To view the IPFS content, a message should be sent to a channel with the bot like ``` /display {ipfs_hash}```.

<img width="627" alt="Screen Shot 2022-08-28 at 21 59 01" src="https://user-images.githubusercontent.com/40897846/187091137-7e07b0ac-6632-481a-b4dd-91c8609c2477.png">

## Help 

Detailed information on how to use the application can be obtained by typing the ``` /help ``` command.

<img width="1082" alt="Screen Shot 2022-08-28 at 22 00 06" src="https://user-images.githubusercontent.com/40897846/187091195-720ae9e4-23cc-4892-9f1c-910e74193fcf.png">

## Notes

- [ ] Custom API Key for WEB3STORAGE when install the bot
- [ ] App home page statistics about files that user uploaded or displayed lastly.
- [ ] AWS Lambda Serverless Deploy Manual
- [ ] Attach a license to repository
- [ ] Apply for Slack App Directory
- [ ] Detailed Tests and Deploying




