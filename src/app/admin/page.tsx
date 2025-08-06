'use client';
import { useMutation, useQuery } from 'convex/react';
import { Activity, GitPullRequest, Server, Shield, Users } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

import { api } from '../../../convex/_generated/api';

const AdminDashboard = () => {
  const activeSessions = useQuery(api.commandSessions.getAllSessions);
  const forceReleaseSession = useMutation(
    api.commandSessions.forceReleaseSession
  );
  const banServer = useMutation(api.serverManagement.banServer);
  const unbanServer = useMutation(api.serverManagement.unbanServer);

  const servers = useQuery(api.discord.getServers);
  const toast = useToast();
  const [selectedServer, setSelectedServer] = React.useState<{
    serverId: string;
    name: string;
    banned?: boolean;
  } | null>(null);
  const [banReason, setBanReason] = React.useState('');

  return (
    <div className='min-h-screen bg-discord-darker'>
      <div className='container mx-auto py-8'>
        <h1 className='text-4xl font-bold text-white mb-8'>Admin Dashboard</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {/* Active Sessions Card */}
          <div className='bg-discord-dark rounded-lg p-6 shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold text-white'>
                Active Sessions
              </h2>
              <Activity className='text-discord-blurple h-6 w-6' />
            </div>
            <div className='space-y-4'>
              {activeSessions?.map(session => (
                <div
                  key={session._id}
                  className='bg-discord-darker rounded p-3'
                >
                  <p className='text-discord-text'>
                    Command: {session.commandId}
                  </p>
                  <p className='text-discord-text'>User: {session.userId}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Servers Card */}
          <div className='bg-discord-dark rounded-lg p-6 shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold text-white'>
                Connected Servers
              </h2>
              <Server className='text-discord-green h-6 w-6' />
            </div>
            <p className='text-2xl font-bold text-white'>
              {servers?.length || 0}
            </p>
            <p className='text-discord-text'>Total servers connected</p>
          </div>

          {/* Active Users Card */}
          <div className='bg-discord-dark rounded-lg p-6 shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold text-white'>Active Users</h2>
              <Users className='text-discord-yellow h-6 w-6' />
            </div>
            <p className='text-2xl font-bold text-white'>Coming Soon</p>
            <p className='text-discord-text'>Track active users</p>
          </div>

          {/* Reports Card */}
          <div className='bg-discord-dark rounded-lg p-6 shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold text-white'>Reports</h2>
              <Shield className='text-discord-red h-6 w-6' />
            </div>
            <p className='text-2xl font-bold text-white'>Coming Soon</p>
            <p className='text-discord-text'>User reports and issues</p>
          </div>
        </div>

        {/* Detailed Lists Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
          {/* Active Sessions List */}
          <div className='bg-discord-dark rounded-lg p-6 shadow-lg'>
            <h2 className='text-2xl font-semibold text-white mb-4'>
              Active Command Sessions
            </h2>
            <div className='space-y-4'>
              {activeSessions?.map(session => (
                <div
                  key={session._id}
                  className='bg-discord-darker rounded-lg p-4 flex items-center justify-between'
                >
                  <div>
                    <p className='text-white font-semibold'>
                      Server: {session.serverId}
                    </p>
                    <p className='text-discord-text text-sm'>
                      Command: {session.commandId}
                    </p>
                    <p className='text-discord-text text-sm'>
                      Active since:{' '}
                      {new Date(session.lastActive).toLocaleString()}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='destructive'
                      className='text-sm'
                      onClick={() => {
                        const sessionId = session._id;
                        if (!sessionId) return;
                        forceReleaseSession({ sessionId }).then(() => {
                          toast.success(
                            'Session Released',
                            'The command session has been forcefully released.'
                          );
                        });
                      }}
                    >
                      Force Release
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Server Details List */}
          <div className='bg-discord-dark rounded-lg p-6 shadow-lg'>
            <h2 className='text-2xl font-semibold text-white mb-4'>
              Connected Servers
            </h2>
            <div className='space-y-4'>
              {servers?.map(server => (
                <div
                  key={server._id}
                  className='bg-discord-darker rounded-lg p-4 flex items-center justify-between'
                >
                  <div className='flex items-center gap-4'>
                    {server.icon && (
                      <img
                        src={`https://cdn.discordapp.com/icons/${server.serverId}/${server.icon}.png`}
                        alt={server.name}
                        className='w-10 h-10 rounded-full'
                      />
                    )}
                    <div>
                      <div className='flex items-center gap-2'>
                        <p className='text-white font-semibold'>
                          {server.name}
                        </p>
                        {server.banned && (
                          <span className='text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded'>
                            BANNED
                          </span>
                        )}
                      </div>
                      <p className='text-discord-text text-sm'>
                        ID: {server.serverId}
                      </p>
                      <p className='text-discord-text text-sm'>
                        Owner: {server.ownerId}
                      </p>
                      {server.banned && server.banReason && (
                        <p className='text-red-400 text-sm mt-1'>
                          Ban reason: {server.banReason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant={server.banned ? 'default' : 'destructive'}
                      className='text-sm'
                      onClick={() => {
                        if (server.banned) {
                          unbanServer({ serverId: server.serverId }).then(
                            () => {
                              toast.success(
                                'Server Unbanned',
                                `${server.name} has been unbanned.`
                              );
                            }
                          );
                        } else {
                          setSelectedServer({
                            serverId: server.serverId,
                            name: server.name,
                            banned: server.banned,
                          });
                        }
                      }}
                    >
                      {server.banned ? 'Unban Server' : 'Ban Server'}
                    </Button>
                    <Server
                      className={
                        server.banned
                          ? 'text-discord-red h-6 w-6'
                          : 'text-discord-green h-6 w-6'
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={selectedServer !== null}
        onOpenChange={open => !open && setSelectedServer(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban Server</DialogTitle>
            <DialogDescription>
              Are you sure you want to ban {selectedServer?.name}? This will
              prevent the server from using any bot commands.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='reason'>Reason</Label>
              <Input
                id='reason'
                value={banReason}
                onChange={e => setBanReason(e.target.value)}
                placeholder='Enter reason for ban...'
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setSelectedServer(null)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                if (!selectedServer || !banReason) return;
                banServer({
                  serverId: selectedServer.serverId,
                  reason: banReason,
                }).then(() => {
                  toast.success(
                    'Server Banned',
                    `${selectedServer.name} has been banned.`
                  );
                  setSelectedServer(null);
                  setBanReason('');
                });
              }}
              disabled={!banReason}
            >
              Ban Server
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
