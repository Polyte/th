import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  MonitorUp,
  Users,
  Maximize2,
} from "lucide-react";
import { getSupabase } from "../services/supabaseClient";

interface VideoCallProps {
  roomId: string;
  displayName: string;
  role: "client" | "lawyer";
  audioOnly?: boolean;
  meta?: { counterpartyName?: string; subject?: string };
  onLeave: () => void;
}

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export function VideoCall({ roomId, displayName, role, audioOnly, meta, onLeave }: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const isPolite = role === "client"; // perfect negotiation: client is polite
  const makingOfferRef = useRef(false);
  const ignoreOfferRef = useRef(false);

  const [status, setStatus] = useState<"connecting" | "waiting" | "connected" | "ended" | "error">("connecting");
  const [errMsg, setErrMsg] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(!audioOnly);
  const [sharing, setSharing] = useState(false);
  const [remoteJoined, setRemoteJoined] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: audioOnly ? false : { width: 1280, height: 720 },
        });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        await setupPeer();
      } catch (e: any) {
        setStatus("error");
        setErrMsg(e?.message || "Could not access camera/microphone.");
      }
    })();

    return () => {
      mounted = false;
      teardown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status !== "connected") return;
    startedAtRef.current = Date.now();
    const i = setInterval(() => {
      if (startedAtRef.current) setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => clearInterval(i);
  }, [status]);

  async function setupPeer() {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;

    localStreamRef.current?.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current!));

    pc.ontrack = (e) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
      setRemoteJoined(true);
      setStatus("connected");
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        setStatus("ended");
      }
    };

    const sb = getSupabase();
    const channel = sb.channel(`call:${roomId}`, { config: { broadcast: { self: false, ack: false } } });
    channelRef.current = channel;

    pc.onicecandidate = (e) => {
      if (e.candidate) channel.send({ type: "broadcast", event: "signal", payload: { kind: "ice", candidate: e.candidate, from: role } });
    };

    pc.onnegotiationneeded = async () => {
      try {
        makingOfferRef.current = true;
        await pc.setLocalDescription();
        channel.send({ type: "broadcast", event: "signal", payload: { kind: "sdp", description: pc.localDescription, from: role } });
      } catch (e) {
        console.log("negotiation error", e);
      } finally {
        makingOfferRef.current = false;
      }
    };

    channel.on("broadcast", { event: "signal" }, async ({ payload }: any) => {
      if (!payload || payload.from === role) return;
      try {
        if (payload.kind === "sdp" && payload.description) {
          const desc = payload.description;
          const offerCollision = desc.type === "offer" && (makingOfferRef.current || pc.signalingState !== "stable");
          ignoreOfferRef.current = !isPolite && offerCollision;
          if (ignoreOfferRef.current) return;
          await pc.setRemoteDescription(desc);
          if (desc.type === "offer") {
            await pc.setLocalDescription();
            channel.send({ type: "broadcast", event: "signal", payload: { kind: "sdp", description: pc.localDescription, from: role } });
          }
        } else if (payload.kind === "ice" && payload.candidate) {
          try {
            await pc.addIceCandidate(payload.candidate);
          } catch (e) {
            if (!ignoreOfferRef.current) console.log("ice error", e);
          }
        } else if (payload.kind === "bye") {
          setStatus("ended");
        }
      } catch (e) {
        console.log("signal handling error", e);
      }
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const count = Object.keys(state).length;
      if (count >= 2) setStatus((s) => (s === "waiting" ? "connecting" : s));
    });

    await channel.subscribe(async (s: string) => {
      if (s === "SUBSCRIBED") {
        await channel.track({ role, name: displayName, at: Date.now() });
        setStatus("waiting");
      }
    });
  }

  function teardown() {
    try {
      channelRef.current?.send({ type: "broadcast", event: "signal", payload: { kind: "bye", from: role } });
    } catch {}
    channelRef.current?.unsubscribe();
    pcRef.current?.getSenders().forEach((s) => s.track?.stop());
    pcRef.current?.close();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current = null;
  }

  function toggleMic() {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  }

  function toggleCam() {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
    }
  }

  async function toggleShare() {
    const pc = pcRef.current;
    if (!pc) return;
    const sender = pc.getSenders().find((s) => s.track?.kind === "video");
    if (!sharing) {
      try {
        const screen = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
        screenStreamRef.current = screen;
        const screenTrack = screen.getVideoTracks()[0];
        await sender?.replaceTrack(screenTrack);
        screenTrack.onended = () => toggleShare();
        setSharing(true);
      } catch (e) {
        console.log("share error", e);
      }
    } else {
      const camTrack = localStreamRef.current?.getVideoTracks()[0];
      if (camTrack) await sender?.replaceTrack(camTrack);
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      setSharing(false);
    }
  }

  function hangup() {
    teardown();
    setStatus("ended");
    setTimeout(onLeave, 400);
  }

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/40 backdrop-blur border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
            {audioOnly ? <Phone className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          </div>
          <div>
            <p className="text-sm font-medium">{meta?.counterpartyName || "Live Session"}</p>
            <p className="text-xs text-white/50">{meta?.subject || `Room ${roomId.slice(-8)}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${status === "connected" ? "bg-emerald-500" : status === "waiting" ? "bg-amber-500" : status === "error" ? "bg-red-500" : "bg-slate-500"} border-0`}>
            {status === "connected" ? `Live · ${mm}:${ss}` : status}
          </Badge>
          <span className="text-xs text-white/50 flex items-center gap-1"><Users className="w-3 h-3" /> {remoteJoined ? 2 : 1}</span>
        </div>
      </div>

      {/* Stage */}
      <div className="flex-1 relative bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
        {/* Remote */}
        {audioOnly ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 mx-auto flex items-center justify-center mb-4 animate-pulse">
                <Phone className="w-12 h-12" />
              </div>
              <p className="text-xl font-medium">{meta?.counterpartyName || "Connected"}</p>
              <p className="text-sm text-white/60 mt-1">{status === "connected" ? `Voice call · ${mm}:${ss}` : status}</p>
            </div>
          </div>
        ) : (
          <video ref={remoteVideoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
        )}

        {!remoteJoined && status !== "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto mb-4" />
              <p className="text-lg">Waiting for {role === "lawyer" ? "client" : "attorney"} to join…</p>
              <p className="text-sm text-white/50 mt-1">Share room: {roomId.slice(-8)}</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="text-center max-w-md p-6">
              <p className="text-lg text-red-300 mb-2">Call could not start</p>
              <p className="text-sm text-white/70 mb-4">{errMsg}</p>
              <Button onClick={onLeave} variant="outline" className="border-white/20 text-white">Close</Button>
            </div>
          </div>
        )}

        {/* Self preview */}
        {!audioOnly && (
          <div className="absolute bottom-6 right-6 w-48 h-36 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            <div className="absolute bottom-1 left-2 text-xs bg-black/60 px-2 py-0.5 rounded">You</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black/60 backdrop-blur border-t border-white/10 px-6 py-4 flex items-center justify-center gap-3">
        <CtrlBtn active={micOn} onClick={toggleMic} icon={micOn ? <Mic /> : <MicOff />} label={micOn ? "Mute" : "Unmute"} />
        {!audioOnly && (
          <CtrlBtn active={camOn} onClick={toggleCam} icon={camOn ? <Video /> : <VideoOff />} label={camOn ? "Stop Video" : "Start Video"} />
        )}
        {!audioOnly && (
          <CtrlBtn active={!sharing} onClick={toggleShare} icon={<MonitorUp />} label={sharing ? "Stop Sharing" : "Share Screen"} />
        )}
        <CtrlBtn active onClick={() => document.documentElement.requestFullscreen?.()} icon={<Maximize2 />} label="Fullscreen" />
        <Button onClick={hangup} className="bg-red-600 hover:bg-red-700 text-white gap-2 rounded-full px-6 h-12">
          <PhoneOff className="w-5 h-5" /> End Call
        </Button>
      </div>
    </div>
  );
}

function CtrlBtn({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
        active ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-600 hover:bg-red-700 text-white"
      }`}
    >
      {icon}
    </button>
  );
}
