import React, { useMemo, useState } from 'react';
import { Video, Mic, MicOff, VideoOff, Monitor, PhoneCall, PhoneOff, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useRoleView } from '../../context/RoleViewContext';

export const VideoCallPage: React.FC = () => {
  const { user } = useAuth();
  const { viewMode, setViewMode } = useRoleView();
  const [isCallActive, setIsCallActive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);

  const callStatus = useMemo(() => {
    if (!isCallActive) return 'Ready to start';
    if (screenShare) return 'Sharing screen';
    return 'In call';
  }, [isCallActive, screenShare]);

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-3 py-1 text-sm font-medium text-secondary-700">
            <Video size={18} /> Video Calling Suite
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">WebRTC Call Mock Interface</h1>
          <p className="text-gray-600">Launch video sessions, control audio/video, and keep collaboration live with a polished conference frame.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="secondary">View mode: {viewMode}</Badge>
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'investor' ? 'entrepreneur' : 'investor')}>
            Switch to {viewMode === 'investor' ? 'Entrepreneur' : 'Investor'} View
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Live session mockup</h2>
                <p className="text-sm text-gray-600">Use controls to manage the active call environment.</p>
              </div>
              <Badge variant={isCallActive ? 'success' : 'gray'}>{callStatus}</Badge>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl">
              <div className="mb-4 flex items-center justify-between rounded-3xl bg-slate-900/90 p-4">
                <div>
                  <p className="text-sm text-slate-400">Participant</p>
                  <p className="text-lg font-semibold">{user.name}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-200">
                  <ShieldCheck size={16} /> Secure link
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6">
                  <div className="h-72 rounded-3xl bg-slate-800 flex items-center justify-center text-center text-slate-300">
                    {isCallActive ? (
                      <div>
                        <p className="text-xl font-semibold">Live Video Feed</p>
                        <p className="mt-2 text-sm text-slate-400">{cameraOn ? 'Camera is on' : 'Video is paused'}</p>
                      </div>
                    ) : (
                      <p className="text-xl font-semibold">Call Idle</p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <h3 className="text-sm font-semibold text-gray-900">Screen share placeholder</h3>
                    <div className="mt-3 h-40 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-sm text-slate-500">
                      {screenShare ? 'You are sharing your screen with other participants.' : 'Activate screen share to preview your presentation window.'}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-gray-900">Session details</p>
                    <div className="mt-3 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Connection quality</span>
                        <span>{isCallActive ? 'Excellent' : 'Standby'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Audio</span>
                        <span>{micOn ? 'Unmuted' : 'Muted'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Video</span>
                        <span>{cameraOn ? 'On' : 'Off'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-gray-200 p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant={isCallActive ? 'error' : 'success'}
                  onClick={() => setIsCallActive(prev => !prev)}
                  leftIcon={isCallActive ? <PhoneOff size={18} /> : <PhoneCall size={18} />}
                >
                  {isCallActive ? 'End Call' : 'Start Call'}
                </Button>
                <Button
                  variant={micOn ? 'secondary' : 'outline'}
                  onClick={() => setMicOn(prev => !prev)}
                  leftIcon={micOn ? <Mic size={18} /> : <MicOff size={18} />}
                >
                  {micOn ? 'Mute' : 'Unmute'}
                </Button>
                <Button
                  variant={cameraOn ? 'secondary' : 'outline'}
                  onClick={() => setCameraOn(prev => !prev)}
                  leftIcon={cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
                >
                  {cameraOn ? 'Camera Off' : 'Camera On'}
                </Button>
                <Button
                  variant={screenShare ? 'success' : 'outline'}
                  onClick={() => setScreenShare(prev => !prev)}
                  leftIcon={<Monitor size={18} />}
                >
                  {screenShare ? 'Stop Share' : 'Share Screen'}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Call control dashboard</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="rounded-3xl bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Use the call panel to simulate a live investor pitch or founder discussion.</p>
            </div>
            <div className="space-y-3">
              <div className="rounded-3xl border border-gray-200 bg-white p-4">
                <p className="text-sm font-medium text-gray-900">Active user</p>
                <p className="mt-2 text-sm text-gray-500">{user.name}</p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-4">
                <p className="text-sm font-medium text-gray-900">Guest mode</p>
                <p className="mt-2 text-sm text-gray-500">{viewMode === 'investor' ? 'Investor controls and funding review' : 'Founder pitch and product walkthrough'}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
