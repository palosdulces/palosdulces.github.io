let options = 
{
    // Pass your App ID here.
    appId: 'a041f9bba2124bb88d28d6c084fa9b0f',
    // Set the channel name.
    channel: 'prueba',
    // Pass your temp token here.
    token: '007eJxTYLj4iMfzcOGxu4u/rGVkzFvhYKHy7uZSvXbH2Bf2V4UDRZIVGBINTAzTLJOSEo0MjUySkiwsUowsUsySDSxM0hItkwzStnSZpDQEMjJcrH7CysgAgSA+G0NBUWlqUiIDAwCzUSD8',
    // Set the user ID.
    uid: 0,
};

let channelParameters =
{
  // A variable to hold a local audio track.
  localAudioTrack: null,
  // A variable to hold a remote audio track.
  remoteAudioTrack: null,
    // A variable to hold the remote user id.
  remoteUid: null,
};
async function startBasicCall()
{
  // Create an instance of the Agora Engine
  const agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  
  // Listen for the "user-published" event to retrieve an AgoraRTCRemoteUser object.
  agoraEngine.on("user-published", async (user, mediaType) =>
  {
    // Subscribe to the remote user when the SDK triggers the "user-published" event.
    await agoraEngine.subscribe(user, mediaType);
    console.log("subscribe success");

    // Subscribe and play the remote audio track.
    if (mediaType == "audio")
    {
      channelParameters.remoteUid=user.uid;
      // Get the RemoteAudioTrack object from the AgoraRTCRemoteUser object.
      channelParameters.remoteAudioTrack = user.audioTrack;
      // Play the remote audio track. 
      channelParameters.remoteAudioTrack.play();
      showMessage("Remote user connected: " + user.uid);
    }

    // Listen for the "user-unpublished" event.
    agoraEngine.on("user-unpublished", user =>
    {
      console.log(user.uid + "has left the channel");
      showMessage("Remote user has left the channel");
    });
  });

  window.onload = function ()
  {
    // Listen to the Join button click event.
    document.getElementById("join").onclick = async function ()
    {
      // Join a channel.
      await agoraEngine.join(options.appId, options.channel, options.token, options.uid);
      showMessage("Joined channel: " + options.channel);
      // Create a local audio track from the microphone audio.
      channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // Publish the local audio track in the channel.
      await agoraEngine.publish(channelParameters.localAudioTrack);
      console.log("Publish success!");
    }
    
    // Listen to the Leave button click event.
    document.getElementById('leave').onclick = async function ()
    {
      // Destroy the local audio track.
      channelParameters.localAudioTrack.close();
      // Leave the channel
      await agoraEngine.leave();
      console.log("You left the channel");
      // Refresh the page for reuse
      window.location.reload();
    }
  }
}

function showMessage(text){
  document.getElementById("message").textContent = text;
}

startBasicCall();