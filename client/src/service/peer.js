class PeerService {
  constructor() {
    // Check if the PeerService instance doesn't already exist.
    if (!this.peer) {
      // Create a new RTCPeerConnection instance with ICE (Interactive Connectivity Establishment) servers.
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  // Method to generate an answer to a received offer.
  async getAnswer(offer) {
    if (this.peer) {
      // Set the received offer as the remote description.
      await this.peer.setRemoteDescription(offer);

      // Create an answer for the offer and set it as the local description.
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));

      return ans; // Return the answer.
    }
  }

  // Method to set a local description.
  async setLocalDescription(ans) {
    if (this.peer) {
      // Set the provided answer as the remote description.
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }

  // Method to generate an offer.
  async getOffer() {
    if (this.peer) {
      // Create an offer and set it as the local description.
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));

      return offer; // Return the generated offer.
    }
  }
}

// Export a singleton instance of the PeerService.
export default new PeerService();
