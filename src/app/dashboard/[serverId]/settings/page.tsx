'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface SettingsPageProps {
  params: { serverId: string };
}

export default function SettingsPage({ params: _params }: SettingsPageProps) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    prefix: '!',
    welcomeMessage: 'Welcome to our server, {user}! Please read the rules.',
    autoRole: true,
    autoMod: true,
    spamFilter: true,
    linkFilter: false,
    joinNotifications: true,
    leaveNotifications: false,
    logChannel: '#bot-logs',
  });

  const handleSaveSettings = async () => {
    if (isLoading) return;

    setIsLoading(true);
    toast.loading('Saving settings...', 'Your changes are being applied');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically make an API call to save settings
      // await fetch(`/api/servers/${params.serverId}/settings`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings),
      // });

      toast.dismiss();
      toast.success(
        'Settings saved successfully!',
        'Your bot configuration has been updated'
      );
    } catch (_error) {
      toast.dismiss();
      toast.error(
        'Failed to save settings',
        'Please try again or contact support'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Settings</h1>
        <p className='text-muted-foreground'>
          Configure your bot settings for this server
        </p>
      </div>

      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='prefix'>Command Prefix</Label>
              <Input id='prefix' placeholder='!' defaultValue='!' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='welcome'>Welcome Message</Label>
              <Textarea
                id='welcome'
                placeholder='Welcome to our server!'
                defaultValue='Welcome to our server, {user}! Please read the rules.'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Switch id='auto-role' defaultChecked />
              <Label htmlFor='auto-role'>
                Auto-assign roles to new members
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation Settings</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <Switch id='auto-mod' defaultChecked />
              <Label htmlFor='auto-mod'>Enable auto-moderation</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch id='spam-filter' defaultChecked />
              <Label htmlFor='spam-filter'>Spam filter</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch id='link-filter' />
              <Label htmlFor='link-filter'>Block external links</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <Switch id='join-notifications' defaultChecked />
              <Label htmlFor='join-notifications'>
                Member join notifications
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch id='leave-notifications' />
              <Label htmlFor='leave-notifications'>
                Member leave notifications
              </Label>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='log-channel'>Log Channel</Label>
              <Input
                id='log-channel'
                placeholder='#bot-logs'
                defaultValue='#bot-logs'
              />
            </div>
          </CardContent>
        </Card>

        <div className='flex justify-end'>
          <Button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className='min-w-[120px]'
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
