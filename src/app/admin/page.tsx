'use client';
import { useUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { useMutation, useQuery } from 'convex/react';
import { Activity, GitPullRequest, Server, Shield, Users } from 'lucide-react';
import React from 'react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
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
import { useDiscordCache } from '@/store/discordCache';

import { api } from '../../../convex/_generated/api';

const AdminDashboard = () => {
  const { user } = useUser();
  const activeSessions = useQuery(api.commandSessions.getAllSessions);
  const releaseSession = useMutation(api.commandSessions.releaseSession);
  const banServer = useMutation(api.serverManagement.banServer);
  const unbanServer = useMutation(api.serverManagement.unbanServer);

  const servers = useQuery(api.discord.getServers);
  const toast = useToast();
  const [selectedServer, setSelectedServer] = React.useState<{
    serverId: string;
    name: string;
    banned?: boolean;
  } | null>(null);
  const [selectedOwner, setSelectedOwner] = React.useState<{
    ownerId: string;
    serverName: string;
  } | null>(null);
  const [banReason, setBanReason] = React.useState('');
  const [ownerClerkInfo, setOwnerClerkInfo] = React.useState<User | null>(null);

  const { profileCache } = useDiscordCache();
  const cacheKey = selectedOwner ? `${selectedOwner.ownerId}` : '';
  const discordProfile = selectedOwner ? profileCache[cacheKey] : null;

  // Fetch Clerk information when owner is selected
  React.useEffect(() => {
    const fetchClerkInfo = async () => {
      if (selectedOwner?.ownerId) {
        try {
          const response = await fetch(
            `/api/user/clerk?discordId=${selectedOwner.ownerId}`
          );
          if (response.ok) {
            const data = await response.json();
            setOwnerClerkInfo(data);
          } else {
            setOwnerClerkInfo(null);
          }
        } catch (error) {
          console.error('Failed to fetch clerk info:', error);
          setOwnerClerkInfo(null);
        }
      } else {
        setOwnerClerkInfo(null);
      }
    };
    fetchClerkInfo();
  }, [selectedOwner?.ownerId]);

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
        <div className='space-y-6 mt-8'>
          {/* Active Sessions List */}
          <div className='bg-discord-dark rounded-lg overflow-hidden shadow-lg'>
            <div className='p-6 border-b border-discord-border/30'>
              <h2 className='text-2xl font-semibold text-white mb-2'>
                Active Command Sessions
              </h2>
              <p className='text-discord-text'>
                Monitor and manage active bot sessions
              </p>
            </div>

            {activeSessions && activeSessions.length > 0 ? (
              <div className='bg-discord-dark/60'>
                {/* Table header */}
                <div className='flex items-center px-6 py-3 bg-discord-darker/80 border-b border-discord-border/30 text-discord-text text-xs font-semibold uppercase tracking-wide'>
                  <div className='min-w-[150px]'>Server</div>
                  <div className='flex-1 mx-4'>Command</div>
                  <div className='w-32'>User</div>
                  <div className='w-40'>Active Since</div>
                  <div className='w-32'>Actions</div>
                </div>

                {/* Session rows */}
                <div className='divide-y divide-discord-border/20'>
                  {activeSessions.map(session => (
                    <div
                      key={session._id}
                      className='group flex items-center px-6 py-4 transition-colors duration-200 hover:bg-discord-darker/40'
                    >
                      {/* Server */}
                      <div className='min-w-[150px]'>
                        <span className='text-white text-sm font-medium'>
                          {session.serverId}
                        </span>
                      </div>

                      {/* Command */}
                      <div className='flex-1 min-w-0 mx-4'>
                        <span className='text-discord-text text-sm font-mono'>
                          {session.commandId}
                        </span>
                      </div>

                      {/* User */}
                      <div className='w-32'>
                        <span className='text-discord-text text-sm'>
                          {session.userId}
                        </span>
                      </div>

                      {/* Active Since */}
                      <div className='w-40'>
                        <span className='text-discord-text text-xs'>
                          {new Date(session.lastActive).toLocaleString()}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className='w-32'>
                        <Button
                          variant='destructive'
                          size='sm'
                          className='text-xs bg-red-600 hover:bg-red-700'
                          onClick={() => {
                            if (!user) {
                              toast.error(
                                'Not logged in',
                                'You must be logged in to perform this action.'
                              );
                              return;
                            }

                            const discordAccount = user.externalAccounts.find(
                              acc => acc.provider === 'discord'
                            );

                            if (!discordAccount?.providerUserId) {
                              toast.error(
                                'No Discord Account',
                                'You must link your Discord account to perform this action.'
                              );
                              return;
                            }

                            releaseSession({
                              commandId: session.commandId,
                              userId: session.userId,
                              isForceRelease: true,
                              adminId: discordAccount.providerUserId,
                            }).then(() => {
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
            ) : (
              <div className='text-center py-12 px-6'>
                <Activity className='w-12 h-12 text-discord-text mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-white mb-2'>
                  No active sessions
                </h3>
                <p className='text-discord-text'>
                  Command sessions will appear here when users are actively
                  using the bot
                </p>
              </div>
            )}
          </div>

          {/* Server Details List - Now full width */}
          <div className='bg-discord-dark rounded-lg overflow-hidden shadow-lg'>
            <div className='p-6 border-b border-discord-border/30'>
              <h2 className='text-2xl font-semibold text-white mb-2'>
                Connected Servers
              </h2>
              <p className='text-discord-text'>
                Manage server connections and permissions
              </p>
            </div>

            {servers && servers.length > 0 ? (
              <div className='bg-discord-dark/60'>
                {/* Table header with better spacing */}
                <div className='flex items-center px-6 py-3 bg-discord-darker/80 border-b border-discord-border/30 text-discord-text text-xs font-semibold uppercase tracking-wide'>
                  <div className='min-w-[250px]'>Server</div>
                  <div className='w-48 mx-4'>Server ID</div>
                  <div className='w-48'>Owner ID</div>
                  <div className='w-32'>Status</div>
                  <div className='w-40'>Ban Reason</div>
                  <div className='w-32'>Actions</div>
                </div>

                {/* Server rows with improved spacing */}
                <div className='divide-y divide-discord-border/20'>
                  {servers.map(server => (
                    <div
                      key={server._id}
                      className={`group flex items-center px-6 py-4 transition-colors duration-200 hover:bg-discord-darker/40 ${
                        server.banned
                          ? 'bg-red-500/10 border-l-4 border-red-400'
                          : ''
                      }`}
                    >
                      {/* Server info - increased width */}
                      <div className='flex items-center gap-3 min-w-[250px]'>
                        <Avatar className='h-10 w-10 rounded-full'>
                          {server.icon ? (
                            <AvatarImage
                              src={`https://cdn.discordapp.com/icons/${server.serverId}/${server.icon}.png`}
                              alt={server.name}
                            />
                          ) : (
                            <AvatarFallback className=' h-10 w-10  text-center bg-gradient-to-r from-discord-blurple to-purple-600 text-white font-bold'>
                              {server.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className='min-w-0 flex-1'>
                          <div className='font-semibold text-white text-sm flex items-center gap-2'>
                            <span className='truncate'>{server.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Server ID - fixed width */}
                      <div className='w-48 mx-4'>
                        <span className='text-discord-text text-sm font-mono'>
                          {server.serverId}
                        </span>
                      </div>

                      {/* Owner - fixed width */}
                      <div className='w-48'>
                        <Button
                          variant='link'
                          className='text-discord-text text-sm font-mono hover:text-discord-blurple p-0'
                          onClick={() =>
                            setSelectedOwner({
                              ownerId: server.ownerId,
                              serverName: server.name,
                            })
                          }
                        >
                          {server.ownerId}
                        </Button>
                      </div>

                      {/* Status - fixed width */}
                      <div className='w-32'>
                        <div
                          className={`flex items-center gap-2 ${server.banned ? 'text-red-400' : 'text-green-400'}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${server.banned ? 'bg-red-500' : 'bg-green-500'}`}
                          />
                          <span className='text-xs font-medium'>
                            {server.banned ? 'Banned' : 'Active'}
                          </span>
                        </div>
                      </div>

                      {/* Ban Reason - new column */}
                      <div className='w-40'>
                        {server.banned && server.banReason ? (
                          <span
                            className='text-red-400 text-xs truncate block'
                            title={server.banReason}
                          >
                            {server.banReason}
                          </span>
                        ) : (
                          <span className='text-discord-text text-xs'>-</span>
                        )}
                      </div>

                      {/* Actions - fixed width */}
                      <div className='w-32'>
                        <Button
                          variant={server.banned ? 'default' : 'destructive'}
                          size='sm'
                          className={`text-xs ${
                            server.banned
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
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
                          {server.banned ? 'Unban' : 'Ban'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='text-center py-12 px-6'>
                <Server className='w-12 h-12 text-discord-text mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-white mb-2'>
                  No servers connected
                </h3>
                <p className='text-discord-text'>
                  Servers will appear here once they connect to the bot
                </p>
              </div>
            )}
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

      {/* Owner Profile Modal */}
      <Dialog
        open={selectedOwner !== null}
        onOpenChange={open => !open && setSelectedOwner(null)}
      >
        <DialogContent className='bg-discord-dark border-discord-border'>
          <DialogHeader>
            <DialogTitle className='text-white'>
              Server Owner Profile
            </DialogTitle>
            <DialogDescription className='text-discord-text'>
              Owner information for {selectedOwner?.serverName}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-6 py-4'>
            {selectedOwner && (
              <>
                <div className='space-y-4'>
                  <div className='bg-discord-darker rounded-lg p-4 space-y-2'>
                    <h3 className='text-discord-blurple font-semibold'>
                      Discord Info
                    </h3>
                    <div className='grid grid-cols-2 gap-2 text-sm'>
                      <span className='text-discord-text'>User ID:</span>
                      <span className='text-white font-mono'>
                        {selectedOwner.ownerId}
                      </span>
                      {discordProfile && (
                        <>
                          <span className='text-discord-text'>Username:</span>
                          <span className='text-white'>
                            {discordProfile.username}
                          </span>

                          <span className='text-discord-text'>Username:</span>
                          <span className='text-white'>
                            {discordProfile.username}
                          </span>

                          {discordProfile.avatar && (
                            <div className='col-span-2 mt-2'>
                              <Avatar className='h-16 w-16'>
                                <AvatarImage
                                  src={`https://cdn.discordapp.com/avatars/${selectedOwner.ownerId}/${discordProfile.avatar}.png`}
                                  alt={discordProfile.username}
                                />
                                <AvatarFallback className='bg-discord-blurple text-white'>
                                  {discordProfile.username[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {ownerClerkInfo ? (
                    <div className='bg-discord-darker rounded-lg p-4 space-y-2'>
                      <h3 className='text-discord-blurple font-semibold'>
                        Clerk Account
                      </h3>
                      <div className='space-y-2'>
                        <div className='grid grid-cols-2 gap-2 text-sm'>
                          <span className='text-discord-text'>Username:</span>
                          <span className='text-white'>
                            {ownerClerkInfo.username}
                          </span>

                          <span className='text-discord-text'>Email:</span>
                          <span className='text-white'>
                            {ownerClerkInfo.primaryEmailAddress?.emailAddress ||
                              'Not provided'}
                          </span>

                          <span className='text-discord-text'>Clerk ID:</span>
                          <span className='text-white font-mono'>
                            {ownerClerkInfo.id}
                          </span>
                        </div>
                        {ownerClerkInfo.imageUrl && (
                          <div className='mt-4'>
                            <Avatar className='h-16 w-16'>
                              <AvatarImage src={ownerClerkInfo.imageUrl} />
                              <AvatarFallback className='bg-discord-blurple text-white'>
                                {ownerClerkInfo.username?.[0]?.toUpperCase() ??
                                  'U'}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className='bg-discord-darker rounded-lg p-4'>
                      <p className='text-discord-text'>
                        No Clerk account associated with this Discord user.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setSelectedOwner(null)}
              className='bg-discord-darker text-white border-discord-border hover:bg-discord-dark'
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
