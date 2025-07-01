"use client"

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { CSSProperties } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';

interface BlockType {
  type: string;
  label: string;
}
interface Block extends BlockType {
  id: number;
  config?: Record<string, any>;
}

// Placeholder block types
const BLOCK_TYPES: BlockType[] = [
  { type: 'condition', label: 'Condition' },
  { type: 'message', label: 'Message' },
  { type: 'embed', label: 'Embed' },
  { type: 'role', label: 'Role Assignment' },
  { type: 'flag', label: 'Message Flag' },
  { type: 'event', label: 'Event' },
];

function Block({ block, onRemove, onClick }: { block: Block; onRemove: () => void; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded shadow p-3 mb-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-700'
      onClick={onClick}
    >
      <span>{block.label}</span>
      <button onClick={e => { e.stopPropagation(); onRemove(); }} className='text-red-500 ml-2'>Remove</button>
    </div>
  );
}

function BlockConfigModal({ block, open, onClose, onSave }: { block: Block | null; open: boolean; onClose: () => void; onSave: (config: Record<string, any>) => void }) {
  const [config, setConfig] = useState<Record<string, any>>(block?.config || {});
  const [roles, setRoles] = useState<{ id: string; name: string; permissions: string }[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);

  useEffect(() => {
    setConfig(block?.config || {});
  }, [block]);

  // Fetch roles when Role block config is opened
  useEffect(() => {
    if (open && block?.type === 'role') {
      setRolesLoading(true);
      setRolesError(null);
      // TODO: Replace with actual userId from auth context or props
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';
      fetch(`/api/discord/roles?serverId=${block.config?.serverId || ''}&userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setRoles(data);
          else setRolesError(data.error || 'Failed to fetch roles');
        })
        .catch(err => setRolesError(err.message))
        .finally(() => setRolesLoading(false));
    }
  }, [open, block]);

  if (!open || !block) return null;

  let content = null;
  switch (block.type) {
    case 'message':
      content = (
        <div className='space-y-4'>
          <label className='block'>
            <span className='font-medium'>Message Content</span>
            <textarea
              className='w-full mt-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
              rows={3}
              value={config.content || ''}
              onChange={e => setConfig({ ...config, content: e.target.value })}
              placeholder='Enter the message to send...'
            />
          </label>
          <label className='block'>
            <span className='font-medium'>Use TTS</span>
            <input
              type='checkbox'
              checked={!!config.tts}
              onChange={e => setConfig({ ...config, tts: e.target.checked })}
              className='ml-2'
            />
          </label>
          <div className='space-y-2'>
            <span className='font-medium'>Message Flags</span>
            <input
              className='w-full mt-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
              value={config.flags || ''}
              onChange={e => setConfig({ ...config, flags: e.target.value })}
              placeholder='e.g. SUPPRESS_EMBEDS, EPHEMERAL'
            />
            <span className='text-xs text-gray-500 dark:text-zinc-400'>Comma-separated Discord message flags.</span>
          </div>
          <div className='space-y-2'>
            <span className='font-medium'>Components</span>
            {(config.components || []).map((comp: any, idx: number) => (
              <div key={idx} className='border rounded p-2 mb-2 dark:border-zinc-700'>
                <div className='flex items-center gap-2 mb-2'>
                  <select
                    className='p-1 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
                    value={comp.type}
                    onChange={e => {
                      const components = [...(config.components || [])];
                      components[idx].type = e.target.value;
                      setConfig({ ...config, components });
                    }}
                  >
                    <option value='button'>Button</option>
                    <option value='select'>Select Menu</option>
                  </select>
                  <button
                    className='text-red-500 px-2'
                    onClick={() => {
                      const components = [...(config.components || [])];
                      components.splice(idx, 1);
                      setConfig({ ...config, components });
                    }}
                  >
                    Remove
                  </button>
                </div>
                {comp.type === 'button' && (
                  <div className='space-y-2'>
                    <input
                      className='w-full p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
                      placeholder='Button label'
                      value={comp.label || ''}
                      onChange={e => {
                        const components = [...(config.components || [])];
                        components[idx].label = e.target.value;
                        setConfig({ ...config, components });
                      }}
                    />
                    <select
                      className='w-full p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
                      value={comp.style || 'primary'}
                      onChange={e => {
                        const components = [...(config.components || [])];
                        components[idx].style = e.target.value;
                        setConfig({ ...config, components });
                      }}
                    >
                      <option value='primary'>Primary</option>
                      <option value='secondary'>Secondary</option>
                      <option value='success'>Success</option>
                      <option value='danger'>Danger</option>
                      <option value='link'>Link</option>
                    </select>
                    <input
                      className='w-full p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
                      placeholder='Custom ID (for interaction)'
                      value={comp.custom_id || ''}
                      onChange={e => {
                        const components = [...(config.components || [])];
                        components[idx].custom_id = e.target.value;
                        setConfig({ ...config, components });
                      }}
                    />
                  </div>
                )}
                {comp.type === 'select' && (
                  <div className='space-y-2'>
                    <input
                      className='w-full p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
                      placeholder='Placeholder text'
                      value={comp.placeholder || ''}
                      onChange={e => {
                        const components = [...(config.components || [])];
                        components[idx].placeholder = e.target.value;
                        setConfig({ ...config, components });
                      }}
                    />
                    <input
                      className='w-full p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
                      placeholder='Custom ID (for interaction)'
                      value={comp.custom_id || ''}
                      onChange={e => {
                        const components = [...(config.components || [])];
                        components[idx].custom_id = e.target.value;
                        setConfig({ ...config, components });
                      }}
                    />
                    <div className='space-y-1'>
                      <span className='text-xs text-gray-500 dark:text-zinc-400'>Options</span>
                      {(comp.options || []).map((opt: any, oidx: number) => (
                        <div key={oidx} className='flex gap-2 mb-1'>
                          <input
                            className='flex-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
                            placeholder='Label'
                            value={opt.label}
                            onChange={e => {
                              const components = [...(config.components || [])];
                              components[idx].options[oidx].label = e.target.value;
                              setConfig({ ...config, components });
                            }}
                          />
                          <input
                            className='flex-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
                            placeholder='Value'
                            value={opt.value}
                            onChange={e => {
                              const components = [...(config.components || [])];
                              components[idx].options[oidx].value = e.target.value;
                              setConfig({ ...config, components });
                            }}
                          />
                          <button
                            className='text-red-500 px-2'
                            onClick={() => {
                              const components = [...(config.components || [])];
                              components[idx].options.splice(oidx, 1);
                              setConfig({ ...config, components });
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        className='bg-blue-600 text-white px-3 py-1 rounded mt-1'
                        onClick={() => {
                          const components = [...(config.components || [])];
                          if (!components[idx].options) components[idx].options = [];
                          components[idx].options.push({ label: '', value: '' });
                          setConfig({ ...config, components });
                        }}
                      >
                        Add Option
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              className='bg-blue-600 text-white px-3 py-1 rounded mt-1'
              onClick={() => setConfig({ ...config, components: [...(config.components || []), { type: 'button', label: '', style: 'primary', custom_id: '' }] })}
            >
              Add Button
            </button>
            <button
              className='bg-blue-600 text-white px-3 py-1 rounded mt-1 ml-2'
              onClick={() => setConfig({ ...config, components: [...(config.components || []), { type: 'select', placeholder: '', custom_id: '', options: [] }] })}
            >
              Add Select Menu
            </button>
          </div>
        </div>
      );
      break;
    case 'embed':
      content = (
        <div className='space-y-4'>
          <label className='block'>
            <span className='font-medium'>Embed Title</span>
            <input
              className='w-full mt-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
              value={config.title || ''}
              onChange={e => setConfig({ ...config, title: e.target.value })}
              placeholder='Embed title...'
            />
          </label>
          <label className='block'>
            <span className='font-medium'>Embed Description</span>
            <textarea
              className='w-full mt-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
              rows={3}
              value={config.description || ''}
              onChange={e => setConfig({ ...config, description: e.target.value })}
              placeholder='Embed description...'
            />
          </label>
          <label className='block'>
            <span className='font-medium'>Embed Color</span>
            <input
              type='color'
              className='w-12 h-8 p-0 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
              value={config.color || '#5865F2'}
              onChange={e => setConfig({ ...config, color: e.target.value })}
            />
          </label>
          <div className='space-y-2'>
            <span className='font-medium'>Fields</span>
            {(config.fields || []).map((field: any, idx: number) => (
              <div key={idx} className='flex gap-2 mb-1'>
                <input
                  className='flex-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
                  placeholder='Field name'
                  value={field.name}
                  onChange={e => {
                    const fields = [...(config.fields || [])];
                    fields[idx].name = e.target.value;
                    setConfig({ ...config, fields });
                  }}
                />
                <input
                  className='flex-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
                  placeholder='Field value'
                  value={field.value}
                  onChange={e => {
                    const fields = [...(config.fields || [])];
                    fields[idx].value = e.target.value;
                    setConfig({ ...config, fields });
                  }}
                />
                <button
                  className='text-red-500 px-2'
                  onClick={() => {
                    const fields = [...(config.fields || [])];
                    fields.splice(idx, 1);
                    setConfig({ ...config, fields });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className='bg-blue-600 text-white px-3 py-1 rounded mt-1'
              onClick={() => setConfig({ ...config, fields: [...(config.fields || []), { name: '', value: '' }] })}
            >
              Add Field
            </button>
          </div>
          <label className='block'>
            <span className='font-medium'>Footer Text</span>
            <input
              className='w-full mt-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
              value={config.footer || ''}
              onChange={e => setConfig({ ...config, footer: e.target.value })}
              placeholder='Footer text...'
            />
          </label>
          <label className='block'>
            <span className='font-medium'>Author Name</span>
            <input
              className='w-full mt-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
              value={config.author || ''}
              onChange={e => setConfig({ ...config, author: e.target.value })}
              placeholder='Author name...'
            />
          </label>
          <label className='block'>
            <span className='font-medium'>Image URL</span>
            <input
              className='w-full mt-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
              value={config.image || ''}
              onChange={e => setConfig({ ...config, image: e.target.value })}
              placeholder='Image URL...'
            />
          </label>
          <label className='block'>
            <span className='font-medium'>Thumbnail URL</span>
            <input
              className='w-full mt-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
              value={config.thumbnail || ''}
              onChange={e => setConfig({ ...config, thumbnail: e.target.value })}
              placeholder='Thumbnail URL...'
            />
          </label>
          <label className='block'>
            <span className='font-medium'>Embed URL</span>
            <input
              className='w-full mt-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
              value={config.url || ''}
              onChange={e => setConfig({ ...config, url: e.target.value })}
              placeholder='Embed URL...'
            />
          </label>
        </div>
      );
      break;
    case 'role':
      content = (
        <div className='space-y-4'>
          <label className='block'>
            <span className='font-medium'>Role to Assign</span>
            {rolesLoading ? (
              <div className='text-sm text-gray-500 dark:text-zinc-400'>Loading roles...</div>
            ) : rolesError ? (
              <div className='text-sm text-red-500'>{rolesError}</div>
            ) : (
              <select
                className='w-full mt-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
                value={config.roleId || ''}
                onChange={e => setConfig({ ...config, roleId: e.target.value })}
              >
                <option value=''>Select a role</option>
                {roles.map(role => {
                  const risky = /admin|administrator|moderate|manage|ban|kick|mod/i.test(role.name) || (BigInt(role.permissions) & (BigInt(0x8) | BigInt(0x20) | BigInt(0x10) | BigInt(0x4))) !== BigInt(0);
                  return (
                    <option key={role.id} value={role.id}>
                      {role.name} {risky ? '⚠️' : ''}
                    </option>
                  );
                })}
              </select>
            )}
            <span className='text-xs text-gray-500 dark:text-zinc-400'>
              (Roles are fetched live from the server. Risky roles are marked.)
            </span>
          </label>
          {roles.find(role => role.id === config.roleId) &&
            (/admin|administrator|moderate|manage|ban|kick|mod/i.test(roles.find(role => role.id === config.roleId)?.name || '') ||
              (BigInt(roles.find(role => role.id === config.roleId)?.permissions || '0') & (BigInt(0x8) | BigInt(0x20) | BigInt(0x10) | BigInt(0x4))) !== BigInt(0)) && (
              <div className='bg-yellow-100 text-yellow-800 p-2 rounded'>
                <strong>Risky Role:</strong> This role has administrative or moderation permissions. Assigning it automatically can be risky!
              </div>
            )}
        </div>
      );
      break;
    case 'condition':
      content = (
        <div className='space-y-4'>
          <label className='block'>
            <span className='font-medium'>Condition Type</span>
            <select
              className='w-full mt-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
              value={config.conditionType || ''}
              onChange={e => setConfig({ ...config, conditionType: e.target.value })}
            >
              <option value=''>Select a condition</option>
              <option value='user_is_admin'>User is Admin</option>
              <option value='user_has_role'>User has Role</option>
              <option value='user_is_owner'>User is Server Owner</option>
              <option value='user_is_bot'>User is a Bot</option>
              <option value='channel_is'>Channel is...</option>
              <option value='channel_type'>Channel Type is...</option>
              <option value='message_contains'>Message Contains...</option>
              <option value='message_starts_with'>Message Starts With...</option>
              <option value='message_has_attachment'>Message Has Attachment</option>
            </select>
          </label>
          {/* Show extra input for some conditions */}
          {['user_has_role', 'channel_is', 'channel_type', 'message_contains', 'message_starts_with'].includes(config.conditionType) && (
            <input
              className='w-full mt-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
              value={config.conditionValue || ''}
              onChange={e => setConfig({ ...config, conditionValue: e.target.value })}
              placeholder={
                config.conditionType === 'user_has_role' ? 'Role ID or name' :
                  config.conditionType === 'channel_is' ? 'Channel ID or name' :
                    config.conditionType === 'channel_type' ? 'text, voice, etc.' :
                      'Value...'
              }
            />
          )}
        </div>
      );
      break;
    case 'flag':
      content = (
        <div className='space-y-4'>
          <label className='block'>
            <span className='font-medium'>Message Flags</span>
            <input
              className='w-full mt-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
              value={config.flags || ''}
              onChange={e => setConfig({ ...config, flags: e.target.value })}
              placeholder='e.g. SUPPRESS_EMBEDS, EPHEMERAL'
            />
          </label>
        </div>
      );
      break;
    case 'event':
      content = (
        <div className='space-y-4'>
          <label className='block'>
            <span className='font-medium'>Event Type</span>
            <select
              className='w-full mt-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
              value={config.eventType || ''}
              onChange={e => setConfig({ ...config, eventType: e.target.value })}
            >
              <option value=''>Select an event</option>
              <option value='on_message'>On Message</option>
              <option value='on_message_edit'>On Message Edit</option>
              <option value='on_message_delete'>On Message Delete</option>
              <option value='on_join'>On Member Join</option>
              <option value='on_leave'>On Member Leave</option>
              <option value='on_react'>On Reaction Add</option>
              <option value='on_react_remove'>On Reaction Remove</option>
              <option value='on_voice_join'>On Voice Channel Join</option>
              <option value='on_voice_leave'>On Voice Channel Leave</option>
              <option value='on_channel_create'>On Channel Create</option>
              <option value='on_channel_delete'>On Channel Delete</option>
              <option value='on_role_create'>On Role Create</option>
              <option value='on_role_delete'>On Role Delete</option>
              <option value='on_invite_create'>On Invite Create</option>
              <option value='on_invite_delete'>On Invite Delete</option>
              <option value='on_ban'>On Member Ban</option>
              <option value='on_unban'>On Member Unban</option>
            </select>
          </label>
        </div>
      );
      break;
    default:
      content = <div className='text-gray-500'>No config available for this block.</div>;
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-zinc-900 dark:text-zinc-100 rounded shadow-lg p-6 min-w-[350px]'>
        <h2 className='font-bold mb-4'>Configure {block.label} Block</h2>
        <div className='mb-4'>{content}</div>
        <div className='flex justify-end gap-2'>
          <button className='px-4 py-2 rounded bg-gray-200 dark:bg-zinc-800' onClick={onClose}>Cancel</button>
          <button className='px-4 py-2 rounded bg-blue-600 text-white' onClick={() => { onSave(config); onClose(); }}>Save</button>
        </div>
      </div>
    </div>
  );
}

function isPromise<T>(value: any): value is Promise<T> {
  return value && typeof value.then === 'function';
}

export default function CommandBuilderPage({ params }: any) {

  const unwrappedParams = isPromise<{ serverId: string }>(params) ? React.use(params) : params;
  const serverId = unwrappedParams?.serverId || '';
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [configBlock, setConfigBlock] = useState<Block | null>(null);
  const [commandName, setCommandName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);

  const commands = useQuery(api.discord.getCommands, serverId ? { serverId } : 'skip');
  const saveCommandMutation = useMutation(api.discord.saveCommand);

  useEffect(() => {
    if (selectedCommand && commands) {
      const cmd = commands.find((c: any) => c.name === selectedCommand);
      if (cmd) {
        setBlocks(JSON.parse(cmd.blocks));
        setCommandName(cmd.name);
        setDescription(cmd.description || '');
      }
    }
  }, [selectedCommand, commands]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const addBlock = (type: string) => {
    const blockType = BLOCK_TYPES.find(b => b.type === type);
    if (blockType) {
      setBlocks([...blocks, { ...blockType, id: Date.now() + Math.random() }]);
    }
  };

  const removeBlock = (id: number) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id);
      const newIndex = blocks.findIndex(b => b.id === over.id);
      setBlocks(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const handleSaveConfig = (config: Record<string, any>) => {
    if (!configBlock) return;
    setBlocks(blocks.map(b => (b.id === configBlock.id ? { ...b, config } : b)));
  };

  const saveCommand = async () => {
    if (!commandName) {
      alert('Please enter a command name.');
      return;
    }
    await saveCommandMutation({
      serverId,
      name: commandName,
      description,
      blocks: JSON.stringify(blocks),
    });
    alert('Command saved!');
  };

  return (
    <div className='flex min-h-screen bg-zinc-900'>
      {/* Sidebar */}
      <aside className='w-64 bg-white dark:bg-zinc-900 dark:border-zinc-700 border-r p-4'>
        <h2 className='font-bold mb-4'>Blocks</h2>
        {BLOCK_TYPES.map(block => (
          <button
            key={block.type}
            className='block w-full text-left mb-2 px-3 py-2 bg-gray-100 dark:bg-zinc-800 rounded hover:bg-gray-200 dark:hover:bg-zinc-700'
            onClick={() => addBlock(block.type)}
          >
            {block.label}
          </button>
        ))}
        <div className='mt-8'>
          <h3 className='font-semibold mb-2'>Saved Commands</h3>
          {commands && commands.length > 0 ? (
            <ul className='space-y-1'>
              {commands.map((cmd: any) => (
                <li key={cmd._id}>
                  <button
                    className={`w-full text-left px-2 py-1 rounded ${selectedCommand === cmd.name ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700'}`}
                    onClick={() => setSelectedCommand(cmd.name)}
                  >
                    {cmd.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className='text-xs text-gray-500 dark:text-zinc-400'>No commands yet.</div>
          )}
        </div>
      </aside>
      {/* Canvas */}
      <main className='flex-1 p-8'>
        <h1 className='text-2xl font-bold mb-6'>Command Builder</h1>
        <div className='flex items-center gap-4 mb-4'>
          <input
            className='p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
            placeholder='Command name...'
            value={commandName}
            onChange={e => setCommandName(e.target.value)}
          />
          <input
            className='p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100'
            placeholder='Description...'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button
            className='bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700'
            onClick={saveCommand}
          >
            Save Command
          </button>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div className='bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded p-6 min-h-[300px] mb-4'>
              {blocks.length === 0 && <div className='text-gray-400 dark:text-zinc-400'>Drag blocks here to build your command.</div>}
              {blocks.map(block => (
                <Block
                  key={block.id}
                  block={block}
                  onRemove={() => removeBlock(block.id)}
                  onClick={() => setConfigBlock(block)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <BlockConfigModal
          block={configBlock}
          open={!!configBlock}
          onClose={() => setConfigBlock(null)}
          onSave={handleSaveConfig}
        />
      </main>
    </div>
  );
} 