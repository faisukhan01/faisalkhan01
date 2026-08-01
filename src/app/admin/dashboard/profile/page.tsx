'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save, Loader2, Eye, EyeOff, Shield, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileData {
  id: number;
  username: string;
  created_at: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/profile');
      const json = await res.json();
      if (json.ok) {
        setProfile(json.data);
        setNewUsername(json.data.username);
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleSave = async () => {
    // Validation
    if (!currentPassword) {
      toast.error('Current password is required', {
        description: 'Please enter your current password to make changes.',
      });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Passwords do not match', {
        description: 'New password and confirm password must match.',
      });
      return;
    }

    if (newPassword && newPassword.length < 4) {
      toast.error('Password too short', {
        description: 'New password must be at least 4 characters.',
      });
      return;
    }

    const hasUsernameChange = newUsername.trim() !== profile?.username;
    const hasPasswordChange = newPassword && newPassword.trim().length > 0;

    if (!hasUsernameChange && !hasPasswordChange) {
      toast.info('No changes to save');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newUsername: hasUsernameChange ? newUsername.trim() : undefined,
          newPassword: hasPasswordChange ? newPassword.trim() : undefined,
        }),
      });

      const json = await res.json();

      if (!json.ok) {
        toast.error('Update failed', { description: json.error });
        return;
      }

      // Update local state
      if (json.data?.username) {
        setProfile(prev => prev ? { ...prev, username: json.data.username } : prev);
        setNewUsername(json.data.username);
      }

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Update localStorage if username changed
      if (hasUsernameChange && json.data?.username) {
        const authData = localStorage.getItem('admin_auth');
        if (authData) {
          try {
            const parsed = JSON.parse(authData);
            parsed.username = json.data.username;
            localStorage.setItem('admin_auth', JSON.stringify(parsed));
          } catch {
            // Ignore
          }
        }
      }

      toast.success('Profile updated', {
        description: hasPasswordChange
          ? 'Your username and/or password have been changed.'
          : 'Your username has been updated.',
      });
    } catch (err) {
      console.error('Save profile error:', err);
      toast.error('Failed to update profile', {
        description: 'Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
        className="rounded-2xl border border-white/[0.12] bg-gradient-to-br from-emerald-500/10 via-white/[0.03] to-white/[0.02] p-6"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/25">
            <span className="text-2xl font-bold">{profile?.username?.charAt(0).toUpperCase() || 'A'}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{profile?.username}</h2>
            <div className="mt-1 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                <Shield className="h-3 w-3" />
                Administrator
              </span>
              {profile?.created_at && (
                <span className="inline-flex items-center gap-1 text-xs text-white/30">
                  <Calendar className="h-3 w-3" />
                  Created {new Date(profile.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/[0.12] bg-white/[0.03] p-6"
      >
        <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-400/80">
          <User className="h-4 w-4" />
          Change Username
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-white/80">Current Username</Label>
            <div className="flex h-10 items-center rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 text-sm text-white/30">
              {profile?.username}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-white/80">New Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <Input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter new username"
                className="rounded-xl border-white/[0.08] bg-white/[0.04] pl-10 text-sm text-white placeholder:text-white/25 focus:border-emerald-500/50 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Change Password Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/[0.12] bg-white/[0.03] p-6"
      >
        <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-400/80">
          <Lock className="h-4 w-4" />
          Change Password
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-white/80">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="rounded-xl border-white/[0.08] bg-white/[0.04] pl-10 pr-10 text-sm text-white placeholder:text-white/25 focus:border-emerald-500/50 focus:ring-emerald-500/20"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-white/80">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <Input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="rounded-xl border-white/[0.08] bg-white/[0.04] pl-10 pr-10 text-sm text-white placeholder:text-white/25 focus:border-emerald-500/50 focus:ring-emerald-500/20"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-white/80">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="rounded-xl border-white/[0.08] bg-white/[0.04] pl-10 text-sm text-white placeholder:text-white/25 focus:border-emerald-500/50 focus:ring-emerald-500/20"
              />
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-400">Passwords do not match</p>
            )}
            {newPassword && confirmPassword && newPassword === confirmPassword && (
              <p className="flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                Passwords match
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-end gap-3"
      >
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
        </Button>
      </motion.div>
    </div>
  );
}
