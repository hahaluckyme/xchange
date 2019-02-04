# X-Change Caption Editor

Click this link to make captions!

https://hahaluckyme.github.io/xchange/

# How to make a caption
## 0. Download `ffmpeg`. This is how you combine the text into the gif.

https://www.ffmpeg.org/

## 1. Find a gif.

You can use Pornhub's gif generator to turn videos into gifs.

https://www.pornhub.com/gifgenerator

Every gif/webm will be resized to 800px width, so make sure the resolution is high enough.

## 2. Write a caption

Use the editor to write a saucy caption. Open the advanced settings if you want to edit the tagline / title / reposition the height.

## 3. Download the frame + run the `ffmpeg` command

Clicking the download link will download the frame image with the text. It will also copy the `ffmpeg` command into your clipboard. You will have to run the `ffmpeg` command to combine it with the gif/webm that you originally had.

example:
```
ffmpeg -i "https://giant.gfycat.com/BabyishPleasingFantail.webm" -i "Lucky.png" -filter_complex "[0]scale=800:-1[a]; [1][a]overlay[b]; [b][1]overlay" "Lucky.webm"
```

Go to the same folder that contains the downloaded image. Right click the folder and go to "Command Prompts" -> "Command Prompt". Run the command there. The command will download the image and attach that frame to it.

## 4. Upload and post in the subreddit
Upload to Gfycat:

https://gfycat.com/

Post into Reddit:

https://www.reddit.com/r/XChangePill/

