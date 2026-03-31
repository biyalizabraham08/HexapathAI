import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { fetchResource } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [localId, setLocalId] = useState(null); // Local DB ID
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const setData = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        syncProfile(currentUser);
      }
      
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        syncProfile(currentUser);
      }
      
      setLoading(false);
    });

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const syncProfile = async (userData) => {
    try {
      const response = await fetchResource('/users/sync', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (response && response.user_id) {
        setLocalId(response.user_id);
        localStorage.setItem('skill_gap_local_id', response.user_id);
      }
    } catch (err) {
      console.error('Failed to sync user profile with backend:', err);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) await syncProfile(data.user);
    return data;
  };

  const register = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
    if (data.user) await syncProfile(data.user);
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    setLocalId(null);
    localStorage.removeItem('skill_gap_local_id');
  };

  return (
    <AuthContext.Provider value={{ user, session, localId, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
