import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProvider, setIsProvider] = useState(false);

  // Function to check user roles safely
  const checkUserRoles = async (userId: string) => {
    try {
      const [adminCheck, providerCheck] = await Promise.all([
        supabase.rpc('has_role', {
          _user_id: userId,
          _role: 'admin'
        }),
        supabase.rpc('has_role', {
          _user_id: userId,
          _role: 'provider'
        })
      ]);

      if (adminCheck.error) {
        console.error('Error checking admin role:', adminCheck.error);
        setIsAdmin(false);
      } else {
        setIsAdmin(adminCheck.data === true);
      }

      if (providerCheck.error) {
        console.error('Error checking provider role:', providerCheck.error);
        setIsProvider(false);
      } else {
        setIsProvider(providerCheck.data === true);
      }

    } catch (error) {
      console.error('Error checking user roles:', error);
      setIsAdmin(false);
      setIsProvider(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer user role checking to prevent deadlocks
        if (session?.user) {
          setTimeout(() => {
            checkUserRoles(session.user!.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsProvider(false);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await checkUserRoles(session.user.id);
      } else {
        setIsAdmin(false);
        setIsProvider(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, session, loading, isAdmin, isProvider };
};